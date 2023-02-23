<template>
  <div>
    <van-nav-bar
      :title="title"
      style="position: fixed; top: 0; left: 0; width: 100%"
      @click-left="toShowNav"
    >
      <template #left>
        <van-icon name="apps-o" size="18" color="black" />
      </template>
    </van-nav-bar>
    <div id="content" ref="content" style="margin-top: 40px">
      <MainContent
        :loading="isLoadingChat"
        :conversationList="conversationList"
        v-show="conversationList.length > 0"
      ></MainContent>
      <MainContentEmpty
        v-show="conversationList.length === 0"
        :type="type"
        @commit="commit"
      />
    </div>
    <div class="bottom-area">
      <div class="bottom-area-form">
        <field
          v-model="promptValue"
          :placeholder="placeholder"
          label-class="left-label"
          show-word-limit
          size="large"
          maxlength="1000"
          type="textarea"
          row="3"
          border
        >
          <template #button>
            <van-button
              :loading="isLoadingChat"
              @click="commit(promptValue)"
              icon="guide-o"
              type="default"
            />
          </template>
        </field>
        <div class="bottom-area-text">
          基于OpenAi GPT-3模型，{{ groupName }}提供体验服务
        </div>
      </div>
    </div>
    <van-popup
      v-model="showNav"
      position="left"
      :style="{ width: '70%', height: '100%' }"
    >
      <LeftSide @go="go"></LeftSide>
    </van-popup>
  </div>
</template>

<script>
import api from "@/api/index";
import { Field, Button, NavBar, Popup } from "vant";
import MainContentEmpty from "@/components/MainContentEmpty.vue";
import MainContent from "@/components/MainContent.vue";
import LeftSide from "@/components/LeftSide.vue";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // 选择自己喜欢的主题

export default {
  name: "BaseChat",
  components: {
    // NavBar
    Field,
    LeftSide,
    MainContent,
    VanButton: Button,
    MainContentEmpty,
    VanNavBar: NavBar,
    VanPopup: Popup,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    api: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      promptValue: "",
      isProfession: false,
      haveSideBar: false,
      isLoadingChat: false,
      showNav: false,
      conversationList: [],
      testMsg: "",
      code: ``,
      groupName: this.$global.name,
    };
  },
  mounted() {
    let mode = this.$route.query?.mode;
    if (mode && mode === "full") {
      this.haveSideBar = true;
    } else {
      this.haveSideBar = false;
    }
    api.getChatTextStream("如何实现服务端发送事件?").then((data) => {
      console.log(
        "🚀 ~ file: BaseChat.vue:96 ~ api.getChatTextStream ~ data",
        data
      );
    });
    const evtSource = new EventSource("v1/completions", {
      withCredentials: true,
    });
    evtSource.addEventListener("data", (event) => {
      console.log(
        "🚀 ~ file: BaseChat.vue:99 ~ evtSource.addEventListener ~ event",
        event
      );
    });
  },
  methods: {
    go(obj) {
      this.$router.push({
        name: obj.name,
      });
      this.conversationList = [];
      this.showNav = false;
    },
    toShowNav() {
      if (this.isLoadingChat) {
        return this.$toast("正在获取答案，请稍候");
      }
      this.showNav = true;
    },
    highlightCode() {
      if (this.type !== "code") {
        return;
      }
      const blocks = this.$el.querySelectorAll("pre code");
      blocks.forEach((block) => {
        hljs.highlightBlock(block);
      });
    },
    async commit(content) {
      if (this.isLoadingChat) {
        return;
      }
      this.isLoadingChat = true;
      this.promptValue = "";
      this.conversationList.push({
        type: "question",
        content,
      });
      this.conversationList.push({
        type: "answer",
        content: "",
      });
      let result = {};
      // const bodyEle = document.body; // 内容总高度
      // const htmlEle = document.body.parentElement;
      try {
        let requestApi = api[this.api];
        let response = await requestApi(content);
        let { answer = "" } = response.data;
        result = {
          type: "answer",
          content: answer,
        };
      } catch (error) {
        this.promptValue = content;
        result = {
          type: "error",
          content: error.message,
        };
      }
      this.conversationList.pop();
      this.conversationList.push(result);
      this.highlightCode();
      this.isLoadingChat = false;
    },
    recommit() {
      this.conversationList.pop();
      let question = this.conversationList.pop().content;
      this.commit(question);
    },
  },
  computed: {
    placeholder() {
      let obj = {
        code: `要用注释把需求括起来, 如: /* 请用JavaScript实现一个深拷贝 */`,
        chat: "请输入问题",
      };
      return obj[this.type];
    },
  },
};
</script>

<style>
.bottom-area {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
}
.bottom-area-form {
  display: flex;
  flex-wrap: wrap;
  border-top: solid 0.5px rgba(0, 0, 0, 0.5);
}
.bottom-area-text {
  width: 100%;
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: center;
  padding: 0.5rem 0.75rem 0.75rem 0.75rem;
}
.left-label {
  margin: 0;
  width: 75px;
}
</style>
