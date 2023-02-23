import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "production" ? process.env.BASE_URL : "";
console.log("🚀 ~ file: index.js:4 ~ BASE_URL", BASE_URL);
// const OPEN_AI_API_BASE_URL =
//   process.env.NODE_ENV === "production" ? global.OPEN_AI_API_BASE_URL : "";

function getChatTextStream(prompt, options = {}) {
  return completionFromOpenAI("completions", {
    model: "text-davinci-003",
    max_tokens: 1000,
    // stop: "\\n",
    ...options, // 以下部分不可修改
    prompt,
    stream: true,
  });
}

/**
 * 从 OpenAI 官方接口进行请求
 * @param {String} apiName 要请求的方法名
 * @param {Object} options 使用的配置项
 * @param {Object} headers 请求头配置
 * @returns
 */
function completionFromOpenAI(apiName, options, headers) {
  console.log(
    "🚀 ~ file: index.js:32 ~ completionFromOpenAI ~ process.env.KEY",
    process.env.KEY
  );
  return axios.post(`${BASE_URL}/v1/${apiName}`, options, {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.KEY}`,
    },
    timeout: 60 * 1000,
    ...headers,
  });
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
};
