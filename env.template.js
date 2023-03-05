const env = {
  KEY: "sk-你在OpenAI获取到的私钥",
  BASE_URL: "你的后端转发服务器或OpenAI官网接口地址，如果你所在的地区不能直接请求OpenAI的接口，则需要额外的服务器进行请求的转发",
};

(function (root, factory) {
  if (typeof exports === "object" && typeof module === "object") {
    // CommonJS
    module.exports = factory();
  } else {
    // 全局变量
    root.env = factory();
  }
})(this, function () {
  // 导出模块
  return env;
});
