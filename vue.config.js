const { defineConfig } = require("@vue/cli-service");
require("dotenv").config();

let config = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "^/user": {
        target: `${process.env.BASE_URL}:${process.env.BACKEND_PORT}`,
        changeOrigin: true,
      },
      "^/v1": {
        target: process.env.OPEN_AI_API_BASE_URL,
        changeOrigin: true,
      },
    },
  },
  productionSourceMap: false,
});

console.log(
  "🚀 ~ file: vue.config.js:22 ~ config",
  JSON.stringify(config, null, "  ")
);
module.exports = config;
