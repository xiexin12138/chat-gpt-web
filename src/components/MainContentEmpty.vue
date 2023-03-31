<template>
  <div class="demo-list">
    <div class="demo-block" v-show="demoBtnList.length > 0">
      <h2 class="demo-block-title">
        <svg
          stroke="currentColor"
          fill="none"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        样例
      </h2>
      <div
        class="demo-button"
        v-for="(item, index) in demoBtnList"
        :key="index"
      >
        <van-button
          @click="commit(item)"
          @touchstart="commit(item)"
          block
          style="color: black"
          >"{{ item }}" →</van-button
        >
      </div>
    </div>
    <div class="demo-block">
      <h2 class="demo-block-title">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
          height="1em"
          width="1em"
          class="h-6 w-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          ></path>
        </svg>
        能力
      </h2>
      <div class="demo-button">
        <van-button block style="color: black"
          >记得用户之前在最近的对话中说过什么
        </van-button>
      </div>
      <div class="demo-button">
        <van-button block style="color: black">
          允许用户提供后续更正
        </van-button>
      </div>
      <div class="demo-button">
        <van-button block style="color: black">
          接受过拒绝不适当请求的训练
        </van-button>
      </div>
    </div>
    <div class="demo-block">
      <h2 class="demo-block-title">
        <svg
          stroke="currentColor"
          fill="none"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
        >
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          ></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        限制
      </h2>
      <div class="demo-button">
        <van-button block style="color: black">
          可能偶尔产生不正确的信息
        </van-button>
      </div>
      <div class="demo-button">
        <van-button block style="color: black">
          可能偶尔会产生有害的指示或偏见内容
        </van-button>
      </div>
      <div class="demo-button">
        <van-button block style="color: black">
          对2021年后的世界和事件了解有限
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from "vant";
export default {
  name: "MainContentEmpty",
  components: { VanButton: Button },
  props: {
    title: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
    },
    demoBtnList: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    commit(question) {
      console.log(
        "🚀 ~ file: MainContentEmpty.vue:142 ~ commit ~ question",
        question
      );
      this.$emit("commit", question);
    },
  },
  computed: {
    demoQuestionList() {
      let demoList = [
        "用简单的术语解释量子计算?",
        "给一个10岁的孩子过生日有什么创意吗?",
        "如何在Javascript中进行HTTP请求?",
      ];
      if (this.type === "code") {
        demoList = [
          `// 用Java实现连接MySQL`,
          `# 基于Shell实现定时重启`,
          `/* 用JS实现深拷贝 */`,
        ];
      }
      return demoList;
    },
  },
};
</script>

<style>
.demo-list {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  flex-direction: column;
  align-items: center;
}
.demo-block {
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin-top: 20px;
}
.demo-block-title {
  text-align: center;
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 400;
  align-items: center;
  display: flex;
  margin: auto;
  gap: 0.75rem;
}
.demo-button {
  padding: 0 25px;
}
.demo-button > button {
  color: black !important;
  border-radius: 8px;
}
.text-color {
  color: rgb(52, 53, 65);
}
</style>
