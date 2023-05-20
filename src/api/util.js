function copy(content) {
  if (navigator?.clipboard?.writeText) {
    navigator?.clipboard
      ?.writeText(content)
      .then(() => {
        this.$toast("已复制");
      })
      .catch((err) => {
        console.error("复制失败：", err.message);
      });
  } else {
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
    this.$toast("已复制");
  }
}

export default {
  copy,
};
