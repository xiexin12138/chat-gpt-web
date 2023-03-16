function copy(content) {
  let val = content || "";
  const input = document.createElement("input"); //创建input
  input.setAttribute("value", val); //把input设置value
  document.body.appendChild(input); //添加这个dom对象
  input.select(); //选中该输入框
  document.execCommand("copy"); //复制该文本
  document.body.removeChild(input); //移除输入框
}

export default {
  copy,
};
