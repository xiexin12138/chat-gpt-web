<template>
  <div ref="wrap" style="height: 100vh; overflow: scroll">
    <div style="padding-top: 40px; padding-bottom: 150px; overflow: scroll">
      <MainContent
        id="imageContent"
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
          type="textarea"
          row="3"
          border
        >
          <template #label>
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 5px;
                margin-right: 10px;
              "
            >
              <van-button
                size="small"
                @click="clearAllConversation"
                :disabled="isLoading"
                >清空</van-button
              >
              <van-button
                size="small"
                @click="generateImage"
                :disabled="isLoading"
                >分享</van-button
              >
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
import { Field, Button } from "vant";
import MainContentEmpty from "@/components/MainContentEmpty.vue";
import MainContent from "@/components/MainContent.vue";
import html2canvas from "html2canvas";

export default {
  name: "BaseChat",
  components: {
    // NavBar
    Field,
    MainContent,
    VanButton: Button,
    MainContentEmpty,
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
    clearAllConversation() {
      this.$dialog
        .confirm({
          title: "确认",
          message: "是否清空全部对话？",
        })
        .then(() => {
          this.conversationList = [];
        })
        .catch(() => {});
    },
    generateImage() {
      // 获取需要截图的元素
      const element = document.getElementById("imageContent");
      // 使用html2canvas将元素转换为canvas
      html2canvas(element).then((canvas) => {
        // 将canvas转换为图片
        const imgData = canvas.toDataURL("image/png");
        // 创建一个a标签，用于下载图片
        const link = document.createElement("a");
        link.download = "share.png";
        link.href = imgData;
        // 将a标签添加到页面中，并模拟点击下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
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
        let requestApi = api[this.api];
        let messages = [];
        let list = this.conversationList.slice(-(2 * this.conversationTimes)); // 获取最后5次对话
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
        let request = requestApi({
          messages,
          systemContent: this.systemContent,
        });
        this.stopGenerated = request.abort;
        try {
          let es = await request.fetch();
          let decoder = new TextDecoder("utf-8");
          let reader = es.body.getReader();
          let res = await reader?.read();
          let dataStringList = decoder.decode(res.value).split("data: ");
          answer.content = dataStringList?.[0];
        } catch (error) {
          if (error.message.includes("abort")) {
            this.$toast("已中止请求");
            if (!answer.content) {
              answer.type = "error";
              answer.content = "已手动中止请求";
            }
          } else {
            this.promptValue = this.promptValue ? this.promptValue : content;
            answer.type = "error";
            answer.content = error.message;
            this.isLoading = false;
          }
        }
        this.isLoading = false;
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
.left-label {
  margin: 0;
  width: 75px;
}
</style>
