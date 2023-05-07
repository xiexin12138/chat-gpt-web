import server from "@/api/server";
import config from "@/api/config";
import store from "@/store/store";

function copy(content) {
  let val = content || "";
  const input = document.createElement("input"); //创建input
  input.setAttribute("value", val); //把input设置value
  document.body.appendChild(input); //添加这个dom对象
  input.select(); //选中该输入框
  document.execCommand("copy"); //复制该文本
  document.body.removeChild(input); //移除输入框
}

async function updateUserInfo() {
  try {
    let response = await server.findUser();
    if (response?.data?.code === 200) {
      localStorage.setItem(
        config.UserInfoName,
        JSON.stringify(response.data.data)
      );
      return Promise.resolve()
    } else {
      return Promise.reject()
    }
  } catch (error) {
    return Promise.reject()
  }

}

async function updateWallet() {
  try {
    await updateUserInfo()
    store.dispatch("updateUserInfo");
  } catch (error) {
    console.log('error', error);
  }
}

export default {
  copy, updateWallet, updateUserInfo
};
