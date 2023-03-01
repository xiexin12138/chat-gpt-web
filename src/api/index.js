import axios from "axios";
import "whatwg-fetch";
import env from "/env.js";

const BASE_URL = env.NODE_ENV === "production" ? env.BASE_URL : "";
// const OPEN_AI_API_BASE_URL =
//   env.NODE_ENV === "production" ? global.OPEN_AI_API_BASE_URL : "";

function getChatTextStream({
  prompt,
  resolve = () => {},
  reject = () => {},
  param = {},
}) {
  return completionFromOpenAI({
    apiName: "completions",
    body: {
      model: "text-davinci-003",
      ...param,
      // 以下部分不可修改
      prompt,
      stream: true,
    },
    resolve,
    reject,
  });
}

function getCodeTextStream({
  prompt,
  resolve = () => {},
  reject = () => {},
  param = {},
}) {
  return completionFromOpenAI({
    apiName: "completions",
    body: {
      model: "code-davinci-002",
      ...param,
      // 以下部分不可修改
      prompt,
      stream: true,
    },
    resolve,
    reject,
  });
}

/**
 * 从 OpenAI 官方接口进行请求
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
          let obj = JSON.parse(dataStringList[1]);
          resolve(obj.choices[0].text);
        } else if (dataStringList.length > 2) {
          for (let i = 1; i < dataStringList.length; i++) {
            if (dataStringList?.[i]?.includes("[DONE]\n\n")) {
              loading = false;
              reject();
              break;
            } else {
              let obj = JSON.parse(dataStringList[i]);
              resolve(obj.choices[0].text);
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

/**
 * 获取指定模型的补全函数
 * @param {String} apiName 使用的 API 名称，会拼接到URL中
 * @param {String} model 使用的模型名称
 * @returns {Function}
 */
function completion(apiName, model) {
  return function (question) {
    return axios.post(
      `${BASE_URL}/user/${apiName}`,
      { question, model },
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        timeout: 60 * 1000,
      }
    );
  };
}

/**
 * 获取指定配置的图像生成函数
 * @param {String} apiName 请求后端的API名
 * @param {{n:Number, size:String, response_format:String}} config 相关的调整参数
 * @returns {Function(prompt:String)}
 */
function images(
  apiName,
  config = {
    n: 2, // 生成图像的数量，必须介于 1 到 10
    size: "1024x1024", // 生成图片规格，三选一 256x256， 512x512， 或 1024x1024
    response_format: "url", // 返回生成图像的格式，必须是这其中的一个 url 或 b64_json
  }
) {
  /**
   * @param {String} prompt 想要的图像的文本描述，最大的长度是 1000 个字符
   */
  return function (prompt) {
    return axios.post(
      `${BASE_URL}/user/${apiName}`,
      { ...config, prompt },
      {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        timeout: 60 * 1000,
      }
    );
  };
}

export default {
  getChatText: completion("getChatText", "text-davinci-003"),
  getChatCode: completion("getChatCode", "code-davinci-002"),
  getChatImage: images("getChatImage"),
  completionFromOpenAI,
  getChatTextStream,
  getCodeTextStream,
};
