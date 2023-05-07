import axios from "axios";
import config from "./config";
// import router from "../router/index";
import URLParse from "url-parse";
// import config from "/src/api/config";
const noAccessTokenAPIList = config.noAccessTokenAPIList;

axios.interceptors.request.use(
  (config) => {
    let url = new URLParse(config.url);
    let pathname = url.pathname;
    let auth = getAuth();
    if (!auth && !noAccessTokenAPIList.includes(pathname)) {
      //   router.push("/login");
      //   return Promise.reject("need login");
      // config.data.accessToken = auth;
      // config.headers.accessToken = auth;
    }
    config.headers.accessToken = auth;
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

function getAuth() {
  return localStorage.getItem(config.AccessTokenName);
}

export default axios;
