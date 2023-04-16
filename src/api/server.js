import axios from "./axios";
import "whatwg-fetch";
import util from "./util";
import config from "./config";

const url =
  process.env.NODE_ENV === "development" ? "" : process.env.VUE_APP_BASE_URL;

function login({ email, code }) {
  return axios.post(`${url}/user/login`, {
    email,
    code,
  });
}

function sign({ email, password, code }) {
  return axios.post(`${url}/user/sign`, {
    email,
    password,
    code,
  });
}

function sendCode({ email }) {
  return axios.post(`${url}/user/sign/sendCode`, {
    email,
  });
}

function findUser({ accessToken }) {
  return axios.post(`${url}/user/findUser`, { accessToken });
}

function getPayQRCode({ totalAmount }) {
  return axios.post(`${url}/user/userAlipayQrCode`, { totalAmount });
}

function getTurboStream({
  messages,
  systemContent,
  resolve = () => {},
  reject = () => {},
  abort = () => {},
  maxCycleTimes = 5000, // 设置上限防止死循环
}) {
  let today = new Date();
  let yesterday = new Date(new Date() - 24 * 60 * 60 * 1000);
  let loading = true;
  let controller, signal;
  if (AbortController) {
    controller = new AbortController();
    signal = controller.signal;
  }
  fetch(`${url}/chat/stream`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: `accessToken=${
      localStorage.getItem(config.AccessTokenName) || ""
    }&messages=${JSON.stringify([
      {
        role: "system",
        content: systemContent
          ? systemContent
          : `你的名字是智能助手，你知识库的截止日期是${yesterday.getFullYear()}年${
              yesterday.getMonth() + 1
            }月${yesterday.getDate()}日，现在的日期是${today.getFullYear()}年${
              today.getMonth() + 1
            }月${today.getDate()}日`,
      },
      ...messages,
    ])}`,
    timeout: 60 * 1000,
    signal,
  })
    .then(async (es) => {
      console.log("🚀 ~ file: server.js:77 ~ .then ~ es:", es);
      let decoder = new TextDecoder("utf-8");
      let count = 0;
      let reader = es.body.getReader();
      let objStringBuffer = "";
      while (loading && count <= (maxCycleTimes || 5000)) {
        let resStringList, res;
        res = await reader?.read();
        console.log("🚀 ~ file: server.js:85 ~ .then ~ res:", res);
        let dataStringList = [];
        resStringList = decoder
          .decode(res.value)
          .replace("\n\n", "\n")
          .split(/\n/);
        console.log(
          "🚀 ~ file: server.js:91 ~ .then ~ resStringList:",
          resStringList
        );
        for (let i = 0; i < resStringList.length; i++) {
          let objStr = resStringList[i];
          if (objStr.includes("data:")) {
            dataStringList.push(objStr.split("data:")[1]);
          } else if (objStr === "[DONE]") {
            dataStringList.push(objStr.split("data:")[0]);
          }
        }
        if (res?.done || dataStringList?.[1]?.includes("[DONE]\n\n")) {
          loading = false;
          reject();
          break;
        }
        for (let i = 0; i < dataStringList.length; i++) {
          let dataString = dataStringList[i];
          if (dataString?.includes("[DONE]")) {
            loading = false;
            reject();
            break;
          }
          let isJson = util.isJSONTest(dataString);
          if (isJson) {
            let obj = JSON.parse(dataString);
            resolve(obj?.content || "");
            objStringBuffer = "";
          } else if (objStringBuffer) {
            let obj = JSON.parse(
              util.isJSONTest(objStringBuffer)
                ? objStringBuffer
                : objStringBuffer + dataString
            );
            resolve(obj?.content || "");
            objStringBuffer = "";
          } else {
            objStringBuffer = objStringBuffer + dataString;
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
// function completionFromOpenAI({
//   apiName,
//   messages,
//   resolve = () => {},
//   reject = () => {},
//   abort = () => {},
//   headers = {},
//   maxCycleTimes = 5000, // 设置上限防止死循环
// }) {

// }

export default {
  login,
  sendCode,
  sign,
  findUser,
  getPayQRCode,
  getTurboStream,
};
