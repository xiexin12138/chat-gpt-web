<template>
  <div ref="wrap" style="height: calc(100vh - 200px); overflow: scroll">
    <div style="padding-bottom: 150px; overflow: scroll">
      <MainContent
        :loading="isLoading"
        :conversationList="conversationList"
        v-show="conversationList.length > 0"
      />
      <MainContentEmpty
        v-show="conversationList.length === 0"
        :demoBtnList="demoBtnList"
        :type="type"
        @commit="commit"
      />
    </div>
    <div class="bottom-area">
      <div class="bottom-area-form">
        <field
          v-model="promptValue"
          @keydown="sendMessage"
          :placeholder="placeholder"
          label-class="left-label"
          show-word-limit
          size="large"
          maxlength="2000"
          type="textarea"
          row="3"
          border
        >
          <template #label>
            <div class="field-label-text">开启<br />连续对话</div>
            <div style="width: 100%; text-align: center; margin-top: 10px">
              <van-switch v-model="checked" size="24px" />
            </div>
          </template>
          <template #button>
            <van-button
              @click="commit(promptValue)"
              :icon="isLoading ? 'stop-circle-o' : 'guide-o'"
              type="default"
            />
          </template>
        </field>
        <div class="bottom-area-text">
          基于语言模型，{{ groupName }}提供体验服务
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/index";
import { Field, Button, Switch } from "vant";
import MainContentEmpty from "@/components/MainContentEmpty.vue";
import MainContent from "@/components/MainContent.vue";

export default {
  name: "BaseChat",
  components: {
    // NavBar
    Field,
    MainContent,
    VanButton: Button,
    MainContentEmpty,
    VanSwitch: Switch,
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
    conversationTimes: {
      type: Number,
      default: 5,
    },
    systemContent: {
      type: String,
      default: "",
    },
    demoBtnList: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "(请勿输入敏感或涉密信息进行测试)请输入内容",
    },
    prefix: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      promptValue: "",
      isProfession: false,
      haveSideBar: false,
      isLoading: false,
      showNav: false,
      checked: false, // 是否开启多轮对话
      conversationList: [],
      testMsg: "",
      code: ``,
      groupName: this.$global.name,
      dataBuffer: "",
      windowHeight: 0,
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
    // 获取视窗高度
    this.windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
  },
  methods: {
    sendMessage(event) {
      if (this.isLoading) {
        return;
      }
      let isCtrlAndEnter = event?.ctrlKey && event.keyCode === 13;
      let isCommandAndEnter = event?.metaKey && event.keyCode === 13;
      if (isCommandAndEnter || isCtrlAndEnter) {
        // 如果是 ctrl+enter 或 command+enter 就发送请求
        this.commit(this.promptValue);
      }
    },
    async commit(content) {
      if (!this.isLoading && !content) {
        return this.$toast("请输入问题");
      }
      if (this.isLoading) {
        this.isLoading = false;
        this.stopGenerated();
      } else {
        this.isLoading = true;
        this.promptValue = this.promptValue === content ? "" : this.promptValue;
        this.conversationList.push({
          type: "question",
          content,
        });
        this.conversationList.push({
          type: "answer",
          content: "",
        });
        let answer = this.conversationList[this.conversationList.length - 1];
        let messages = [];
        let times = this.checked ? this.conversationTimes : 1;
        let list = this.conversationList.slice(-(2 * times)); // 获取最后5次对话
        list.forEach((conversation) => {
          if (conversation.type === "question") {
            messages.push({
              role: "user",
              content: this.prefix + conversation.content,
            });
          } else if (conversation.type === "answer" && conversation.content) {
            messages.push({
              role: "assistant",
              content: conversation.content,
            });
          }
        });
        try {
          let requestApi = api[this.api];
          let param = {
            messages,
            systemContent: this.systemContent,
            resolve: (data) => {
              this.$nextTick(() => {
                answer.content += data;
                if (
                  this.windowHeight + this.$refs.wrap.scrollTop + 50 >=
                  this.$refs.wrap.scrollHeight
                ) {
                  this.$refs.wrap.scrollTo(0, this.$refs.wrap.scrollHeight);
                }
              });
            },
            reject: (result) => {
              this.isLoading = false;
              if (result) {
                this.promptValue = this.promptValue
                  ? this.promptValue
                  : content;
                answer.type = "error";
                answer.content = result?.message;
              }
            },
            abort: () => {
              this.$toast("已中止请求");
              if (!answer.content) {
                answer.type = "error";
                answer.content = "已手动中止请求";
              }
            },
          };
          this.stopGenerated = requestApi(param);
        } catch (error) {
          this.promptValue = this.promptValue ? this.promptValue : content;
          answer.type = "error";
          answer.content = error.message;
          this.isLoading = false;
        }
        this.$nextTick(() => {
          this.$refs.wrap.scrollTo(0, this.$refs.wrap.scrollHeight);
        });
      }
    },
    recommit() {
      this.conversationList.pop();
      let question = this.conversationList.pop().content;
      this.commit(question);
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
.field-label-text {
  color: rgba(0, 0, 0, 0.5);
  font-size: 0.75rem;
  line-height: 1rem;
  white-space: pre-wrap;
  text-align: center;
}

.left-label {
  margin: 0;
  width: 75px;
}
</style>
