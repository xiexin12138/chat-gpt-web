const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const env = require(path.join(__dirname, "./env.js"));

let config = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "^/user": {
        target: `${env.BASE_URL}:${env.BACKEND_PORT}`,
        changeOrigin: true,
      },
      "^/v1": {
        target: env.OPEN_AI_API_BASE_URL,
      },
    },
    compress: false
  },
  productionSourceMap: false,
});

console.log(
  "🚀 ~ file: vue.config.js:22 ~ config",
  JSON.stringify(config, null, "  ")
);
module.exports = config;
