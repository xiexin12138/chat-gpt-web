import server from "@/api/server";
import config from "@/api/config";
import { Toast } from "vant";

function copy(content) {
  navigator?.clipboard
    ?.writeText(content)
    .then(() => {
      Toast("已复制");
    })
    .catch(() => {
      let val = content || "";
      val = val.replace(/\\n/g, "\n"); // 将"\n"替换成实际的换行符
      const input = document.createElement("textarea"); // 创建textarea
      input.id = "copy-temp-input";
      input.value = val; // 设置textarea的value属性
      document.body.appendChild(input); // 添加这个dom对象
      input.select(); // 选中该输入框
      document.execCommand("copy"); // 复制该文本
      const child = document.getElementById("copy-temp-input");
      document.body.removeChild(child);
      Toast("已复制");
    });
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
  } catch (error) {
    console.log('error', error);
  }
}

export default {
  copy, updateWallet, updateUserInfo
};
