const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const env = require(path.join(__dirname, "./env.js"));

let config = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      // 修改js文件输出路径
      config.output
        .filename("dist/chat/0311/js/[name].[contenthash:8].js")
        .chunkFilename("dist/chat/0311/js/[name].[contenthash:8].js")
        .end();
      // 修改css文件输出路径
      config.plugin("extract-css").tap((args) => {
        args[0].filename = "dist/chat/0311/css/[name].[contenthash:8].css";
        args[0].chunkFilename = "dist/chat/0311/css/[name].[contenthash:8].css";
        return args;
      });
      // 修改index.html为asms.html
      config.plugin("html").tap((args) => {
        args[0].filename = "asms2.html";
        return args;
      });
      config.optimization.minimizer("terser").tap((args) => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        return args;
      });
    }
  },
  devServer: {
    proxy: {
      "^/mygpt3": {
        target: env.BASE_URL,
      },
     
    },
    compress: false, // 如果本地开发想要启用 SSE (Server-Sent Event)，必须设置为false
  },
  productionSourceMap: false,
});

module.exports = config;
