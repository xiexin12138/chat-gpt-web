const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const env = require(path.join(__dirname, "./env.js"));

let config = defineConfig({
  transpileDependencies: true,
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.optimization.minimizer("terser").tap((args) => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        return args;
      }); 
    }
  },
  devServer: {
    proxy: {
      "^/v1": {
        target: env.BASE_URL,
      },
    },
    compress: false, // 如果本地开发想要启用 SSE (Server-Sent Event)，必须设置为false
  },
  productionSourceMap: false,
});

module.exports = config;
