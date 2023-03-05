<template>
  <div>
    <van-nav-bar
      :title="conversationList.length > 0 ? title : ''"
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
        :title="title"
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
              @click="commit(promptValue)"
              :icon="isLoadingChat ? 'stop-circle-o' : 'guide-o'"
              type="default"
            />
          </template>
        </field>
        <div class="bottom-area-text">
          基于开源语音模型，{{ groupName }}提供体验服务
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
      dataBuffer: "",
      stopGenerated: () => {
        console.log("未更新的stop");
      },
    };
  },
  mounted() {
    let mode = this.$route.query?.mode;
    if (mode && mode === "full") {
      this.haveSideBar = true;
    } else {
      this.haveSideBar = false;
    }
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
    async commit(content) {
      if (!this.isLoadingChat && !content) {
        return this.$toast("请输入问题");
      }
      console.log(
        "🚀 ~ file: BaseChat.vue:144 ~ commit ~ content:",
        this.isLoadingChat,
        content
      );
      if (this.isLoadingChat) {
        this.isLoadingChat = false;
        this.stopGenerated();
      } else {
        this.isLoadingChat = true;
        this.conversationList.push({
          type: "question",
          content,
        });
        this.conversationList.push({
          type: "answer",
          content: "",
        });
        let answer = this.conversationList[this.conversationList.length - 1];
        try {
          let requestApi = api[this.api];
          let param = {
            messages: [],
            resolve: (data) => {
              answer.content += data;
            },
            reject: (error) => {
              this.isLoadingChat = false;
              if (error && error?.message?.includes("aborted")) {
                if (!answer.content) {
                  answer.type = 'error'
                  answer.content = '已终止获取回答'
                }
              } else if (error) {
                this.promptValue = this.promptValue
                  ? this.promptValue
                  : content;
                answer.type = "error";
                answer.content = error.message;
              }
            },
          };
          let list = this.conversationList.slice(-(2 * 5)); // 获取最后5次对话
          list.forEach((conversation) => {
            if (conversation.type === "question") {
              param.messages.push({
                role: "user",
                content: conversation.content,
              });
            } else if (conversation.type === "answer" && conversation.content) {
              param.messages.push({
                role: "assistant",
                content: conversation.content,
              });
            }
          });
          this.stopGenerated = requestApi(param);
        } catch (error) {
          this.promptValue = this.promptValue ? this.promptValue : content;
          answer.type = "error";
          answer.content = error.message;
          this.isLoadingChat = false;
        }
      }
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
