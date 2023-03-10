<template>
  <div
    style="
      height: 100vh;
      width: 100vw;
      background-color: rgb(247, 248, 250);
      padding-top: 60px;
    "
  >
    <van-cell-group inset style="">
      <van-cell
        v-for="(item, index) in updateList"
        :key="index"
        :label="item.contentList | toText"
        label-class="pre-wrap"
      >
        <template #title>
          <span class="custom-title">{{ item.title }} | {{ item.date }} </span>
          <van-tag
            v-if="index === 0 || item.isNew"
            type="danger"
            style="margin-left: 5px"
            >新</van-tag
          >
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { Cell, CellGroup, Tag } from "vant";
export default {
  name: "UpdateLog",
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanTag: Tag,
  },
  data() {
    return {
      updateList: [
        {
          title: "V 0.0.1",
          date: "2023-03-10",
          contentList: [
            "使用最新的ChatGPT同款模型。",
            "新增支持记住最近5次对话内容的聊天。",
            "支持通过cmd+enter或ctrl+enter输入问题。",
            "支持手动中止答案输出。",
            "新增复制答案的按钮。",
            "加入更新日志记录。",
          ],
        },
      ],
    };
  },
  filters: {
    toText(list) {
      return `- ${list.join("\n- ")}`;
    },
  },
};
</script>

<style>
.pre-wrap {
  white-space: pre-wrap;
}
</style>
