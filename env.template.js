const env = {
  BASE_URL:
    "你的后端转发服务器或OpenAI官网接口地址，如果你所在的地区不能直接请求OpenAI的接口，则需要额外的服务器进行请求的转发",
  RANDOM_CODE:
    "可选，用于配置随机串到接口后，如原来请求地址是 http://host.com/v1，设置这个后变成http://host.com/{RANDOM_CODE}/v1，注意在随机串开头加上/",
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
