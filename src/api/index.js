import "whatwg-fetch";
import axios from "axios";
import env from "/env.js";

const BASE_URL = env.BASE_URL; // 因为众所周知的原因，现在需要转发服务器，否则请求会被拦截

function getAnswerText(messages) {
  let signal, controller;
  if (AbortController) {
    controller = new AbortController();
    signal = controller.signal;
  }
  function innerFetch() {
    return fetch(`${env.BASE_URL}/mygpt3/qtext`, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      method: "POST",
      body: JSON.stringify({
        messages,
      }),
      signal,
    });
  }
  return {
    abort: function () {
      controller.abort();
    },
    fetch: innerFetch,
  };
}

function getTurboStream({
  messages,
  resolve = () => {},
  reject = () => {},
  abort = () => {},
  param = {},
}) {
  let today = new Date();
  let yesterday = new Date(new Date() - 24 * 60 * 60 * 1000);
  return completionFromOpenAI({
    apiName: "/v1/chat/completions",
    body: {
      model: "gpt-3.5-turbo",
      ...param,
      // 以下部分不可修改
      messages: [
        {
          role: "system",
          content: `你是一个全方位能力都很强大的AI人工智能助手，你知识库的截止日期是${yesterday.getFullYear()}年${
            yesterday.getMonth() + 1
          }月${yesterday.getDate()}日，现在的日期是${today.getFullYear()}年${
            today.getMonth() + 1
          }月${today.getDate()}日`,
        },
        ...messages,
      ],
      stream: true,
    },
    resolve,
    reject,
    abort,
  });
}

/**
 * 从接口进行请求，并强制启用流式返回以提高响应速度
 * @param {Object} param 入参对象
 * @param {String} param.apiName 请求的域名，如 /v1/chat/completion
 * @param {Object} param.body 请求体
 * @param {Object} param.headers 请求头对象
 * @param {Function} param.resolve 接收流式返回的数据，通过 resolve 中的 data 接收，如 resolve(data) => { let result = result + data }
 * @param {Function} param.reject 异常或正常结束时调用，异常时会抛出 error
 * @param {Function} param.abort 手动终止时触发的方法
 * @param {number} param.maxCycleTimes 流式请求最大读取次数，防止死循环，建议默认值即可
 * @returns
 */
function completionFromOpenAI({
  apiName,
  body,
  resolve = () => {},
  reject = () => {},
  abort = () => {},
  headers = {},
  maxCycleTimes = 5000, // 设置上限防止死循环
}) {
  let loading = true;
  let controller, signal;
  if (AbortController) {
    controller = new AbortController();
    signal = controller.signal;
  }
  fetch(`${BASE_URL}${apiName}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    method: "POST",
    body: JSON.stringify({
      max_tokens: 2000, // 默认限制 max_tokens 为 2000
      ...body,
    }),
    timeout: 60 * 1000,
    signal,
  })
    .then(async (es) => {
      let decoder = new TextDecoder("utf-8");
      let count = 0;
      let reader = es.body.getReader();
      while (loading && count <= (maxCycleTimes || 5000)) {
        let res = await reader?.read();
        let dataStringList = decoder.decode(res.value).split("data: ");
        if (res?.done || dataStringList?.[1]?.includes("[DONE]\n\n")) {
          loading = false;
          reject();
          break;
        }
        if (dataStringList.length === 2) {
          let obj = parse(dataStringList[1]);
          resolve(
            obj?.choices?.[0]?.text || obj?.choices?.[0]?.delta?.content || ""
          );
        } else if (dataStringList.length > 2) {
          for (let i = 1; i < dataStringList.length; i++) {
            if (dataStringList?.[i]?.includes("[DONE]\n\n")) {
              loading = false;
              reject();
              break;
            } else {
              let obj = parse(dataStringList[i]);
              resolve(
                obj?.choices?.[0]?.text ||
                  obj?.choices?.[0]?.delta?.content ||
                  ""
              );
            }
          }
        }
        count++;
      }
    })
    .catch((err) => {
      if (err?.name === "AbortError") {
        abort();
      } else {
        reject(err);
      }
    });
  return function () {
    loading = false;
    if (AbortController) {
      controller.abort();
    }
  };
}

async function generateImage(prompt) {
  return axios.post(
    `${env.IMAGE_URL}/user/getChatImage`,
    encodeURI(`prompt=${prompt}&n=1&size=512x512&response_format=url`),
    {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    }
  );
}

function translate(content) {
  return axios.post(
    `${env.BASE_URL}/mygpt3/qtext`,
    {
      messages: [
        {
          role: "system",
          content:
            "你是一个专业的翻译助手，只会把任何传发送你的中文直接翻译成英文并返回英文结果回来。禁止返回和翻译结果无关或其他提示性的内容",
        },
        {
          role: "user",
          content,
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        accept: "json",
      },
    }
  );
}

async function addWatermark(data) {
  return axios({
    url: `${env.BASE_URL}/watermark/addWatermark`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
async function extractWatermark(data) {
  return axios({
    url: `${env.BASE_URL}/watermark/extractWatermark`,
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function parse(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    console.log("🚀 ~ file: index.js:161 ~ parse ~ err:", str);
    return {};
  }
}

export default {
  getTurboStream,
  getAnswerText,
  generateImage,
  translate,
  addWatermark,
  extractWatermark,
};
