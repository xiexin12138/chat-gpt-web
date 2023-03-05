import "whatwg-fetch";
import env from "/env.js";

const BASE_URL = env.BASE_URL; // 因为众所周知的原因，现在需要转发服务器，否则请求会被拦截

/**
 * 请求答案的
 * @param {Object} parameter 入参
 * @param {string} parameter.prompt 获取代码补全的提示文本
 * @param {Function} parameter.resolve 获取代码补全流式返回的函数，会持续返回数据
 * @param {Function} parameter.reject 获取代码补全流式返回结束或异常的函数，当数据接收完毕或发生异常时会触发该函数
 * @param {Object} parameter.param 其他需要放到请求体重的入参
 * @returns {Function} 停止函数，当需要手动终止请求时调用
 */
function getCodeTextStream({
  messages,
  resolve = () => {},
  reject = () => {},
  param = {},
} = {}) {
  let today = new Date();
  let yesterday = new Date(new Date() - 24 * 60 * 60 * 1000);
  return completionFromOpenAI({
    apiName: "chat/completions",
    body: {
      model: "gpt-3.5-turbo",
      ...param,
      // 以下部分不可修改
      messages: [
        {
          role: "system",
          content: `你是一个善于处理代码问题的AI人工智能助手，你知识截止日期是${yesterday.getFullYear()}年${
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
  });
}

function getTurboStream({
  messages,
  resolve = () => {},
  reject = () => {},
  param = {},
}) {
  let today = new Date();
  let yesterday = new Date(new Date() - 24 * 60 * 60 * 1000);
  return completionFromOpenAI({
    apiName: "chat/completions",
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
  });
}

/**
 * 从 OpenAI 官方接口进行请求，并强制启用流式返回以提高响应速度
 * @param {String} apiName 要请求的方法名
 * @param {Object} options 使用的配置项
 * @param {Object} headers 请求头配置
 * @returns
 */
function completionFromOpenAI({
  apiName,
  body,
  resolve = () => {},
  reject = () => {},
  headers = {},
  maxCycleTimes = 5000, // 设置上限防止死循环
}) {
  let loading = true;
  let controller, signal;
  if (AbortController) {
    controller = new AbortController();
    signal = controller.signal;
  }
  fetch(`${BASE_URL}/v1/${apiName}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.KEY}`,
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
      reject(err);
    });
  return function () {
    loading = false;
    if (AbortController) {
      controller.abort();
    }
  };
}

function parse(str) {
  try {
    return JSON.parse(str);
  } catch (err) {
    return {};
  }
}

export default {
  getCodeTextStream,
  getTurboStream,
};
