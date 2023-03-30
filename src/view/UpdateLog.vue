<template>
  <div
    style="
      height: 100vh;
      width: 100vw;
      background-color: rgb(247, 248, 250);
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
          <span class="custom-title"
            >V {{ item.version }} | {{ item.date }}
          </span>
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
import log from "@/assets/log.json";

export default {
  name: "UpdateLog",
  components: {
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanTag: Tag,
  },
  data() {
    return {
      updateList: log,
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
