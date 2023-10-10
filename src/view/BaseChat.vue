<template>
  <div ref="wrap" style="">
    <div
      style="padding-bottom: 170px; overflow: scroll; box-sizing: border-box"
    >
      <MainContent
        :loading="isLoading"
        :beginGenerateImg="beginGenerateImg"
        :conversationList="conversationList"
        @delete-item="deleteItem"
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
                height: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: space-between;
                gap: 5px;
              "
            >
              <van-button
                @click="isShowSetting = true"
                icon="setting-o"
                type="default"
                size="small"
                >设置</van-button
              >
              <van-button
                @click="generateImage"
                icon="share-o"
                type="default"
                size="small"
                >分享</van-button
              >
              <span style="font-size: 12px"
                >{{
                  conversationTimes > 1 && checked ? "✅" : "❌"
                }}
                连续对话</span
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
    <van-popup
      v-model="isShowSetting"
      closeable
      position="bottom"
      style="
        height: 40%;
        box-sizing: border-box;
        padding: 15px;
        color: rgba(0, 0, 0, 0.5);
      "
    >
      <div
        style="font-size: 17px; display: flex; gap: 5px; align-items: center"
      >
        <van-icon name="setting-o" />功能设置
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          padding-top: 40px;
          box-sizing: border-box;
          gap: 15px;
        "
      >
        <div style="display: flex; align-items: center; gap: 10px">
          <div class="field-label-text">开启连续对话</div>
          <div style="idth: 100%; text-align: left">
            <van-switch
              v-if="conversationTimes > 1"
              v-model="checked"
              size="24px"
            />
            <div
              v-else
              style="
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.8rem;
              "
            >
              <van-switch :value="true" disabled size="24px" />
              <p>该模式暂不支持<br />连续对话</p>
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px">
          <div class="field-label-text">清空对话内容</div>
          <div style="idth: 100%; text-align: left">
            <van-button
              icon="delete-o"
              size="small"
              @click="clearAllConversation"
            />
          </div>
        </div>
      </div>
    </van-popup>
    <!-- <van-dialog
      v-model="showShareImg"
      close-on-click-overlay
      confirm-button-text="下载保存"
      cancel-button-text="关闭"
      confirm-button-color="#333"
      @confirm="downloadImg"
      :show-confirm-button="!isWechat"
      show-cancel-button
      :title="isWechat ? '长按保存图片分享' : ''"
      style="text-align: center; max-height: 80vh"
    >
      <div style="overflow: auto; max-height: 75vh">
        <img
          :src="image.url"
          style="padding: 10px; width: 100%; box-sizing: border-box"
          @click="previewImg"
        />
      </div>
    </van-dialog> -->
  </div>
</template>

<script>
import server from "@/api/server";
import html2canvas from "html2canvas";
import { Field, Button, Switch, Popup, ImagePreview } from "vant";
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
    VanPopup: Popup,
    // VanDialog: Dialog.Component,
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
      beginGenerateImg: false,
      isShowSetting: false,
      conversationList: [],
      isWechat: /MicroMessenger/i.test(navigator.userAgent),
      testMsg: "",
      code: ``,
      groupName: this.$global.name,
      dataBuffer: "",
      windowHeight: 0,
      showShareImg: false,
      image: {
        url: "",
        height: 0,
        width: 0,
      },
      stopGenerated: () => {
        console.log("未更新的stop");
      },
    };
  },
  created() {
    let listStr = localStorage.getItem("conversationList") || "[]";
    this.conversationList = JSON.parse(listStr);
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

    this.$nextTick(() => {
      this.$refs.wrap?.scrollTo(0, this.$refs.wrap.scrollHeight);
    });
  },
  methods: {
    previewImg() {
      ImagePreview({ images: [this.image.url], closeable: true });
    },
    deleteItem(_item, index) {
      if (this.isLoading) {
        return this.$toast("请等待回答完成后再进行删除");
      }
      this.$dialog
        .confirm({
          title: "警告",
          message: "确认删除该条记录吗？",
        })
        .then(() => {
          this.conversationList.splice(index, 1);
          localStorage.setItem(
            "conversationList",
            JSON.stringify(this.conversationList)
          );
          this.$toast("删除成功！");
        })
        .catch(() => {});
    },
    clearAllConversation() {
      this.$dialog
        .confirm({
          title: "警告",
          message: "确认清空历史问答？本地一旦清空无法找回",
        })
        .then(() => {
          this.conversationList = [];
          localStorage.removeItem("conversationList");
          this.$toast("清除成功！");
        })
        .catch(() => {});
    },
    generateImage() {
      if (this?.conversationList?.length <= 0) {
        return this.$toast("请先问答后，再分享对话");
      }
      if (this.isLoading) {
        return this.$toast("请待回答完成后再进行分享");
      }
      this.$toast("生成中，请稍候...", { type: "loading", duration: 0 });
      this.beginGenerateImg = true;
      // 获取需要截图的元素
      const element = document.getElementById("contentImage");
      // 使用html2canvas将元素转换为canvas
      this.$nextTick(() => {
        html2canvas(element)
          .then((canvas) => {
            this.showShareImg = true;
            // 将canvas转换为图片
            const imgData = canvas.toDataURL("image/png");
            this.image.url = imgData;
            // this.image.height = canvas.height;
            // this.image.width = canvas.width;
            this.$toast.clear();
            this.previewImg();
          })
          .catch((err) => {
            this.$toast(`生成失败！${err.message}`);
          })
          .finally(() => (this.beginGenerateImg = false));
      });
    },
    downloadImg() {
      // 创建一个a标签，用于下载图片
      const link = document.createElement("a");
      link.download = "share.png";
      link.href = this.image.url;
      // 将a标签添加到页面中，并模拟点击下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
          title: this.$route.meta.title,
        });
        let answer = this.conversationList[this.conversationList.length - 1];
        let messages = [];
        let times = this.checked ? this.conversationTimes : 1;
        let list = this.conversationList.slice(-(2 * times)); // 获取最后5次对话
        list.forEach((conversation) => {
          if (conversation.type === "question") {
            messages.push({
              role: "user",
              content:
                (this.$route.meta.prefix ? this.$route.meta.prefix : "") +
                conversation.content,
            });
          } else if (conversation.type === "answer" && conversation.content) {
            messages.push({
              role: "assistant",
              content: conversation.content,
            });
          }
        });
        this.$nextTick(() => {
          this.$refs.wrap?.scrollTo(0, this.$refs.wrap.scrollHeight);
        });
        try {
          let requestApi = server[this.api];
          let param = {
            messages,
            systemContent: this.systemContent,
            resolve: (data) => {
              this.$nextTick(() => {
                answer.content += data;
                if (
                  this.windowHeight + this.$refs.wrap?.scrollTop + 50 >=
                  this.$refs.wrap.scrollHeight
                ) {
                  this.$refs.wrap?.scrollTo(0, this.$refs.wrap.scrollHeight);
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
              } else {
                let list = this.conversationList.slice(-(2 * 10));
                localStorage.setItem("conversationList", JSON.stringify(list));
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
          this.stopGenerated = await requestApi(param);
        } catch (error) {
          this.promptValue = this.promptValue ? this.promptValue : content;
          answer.type = "error";
          answer.content = error.message;
          this.isLoading = false;
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
    imgStyle() {
      return this.image.height > this.image.width
        ? "height: 70vh"
        : "width:80vw";
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
  flex: 0 0 140px;
  /* font-size: 0.75rem; */
  line-height: 1rem;
  white-space: pre-wrap;
  text-align: center;
}

.left-label {
  margin: 0;
  width: 75px;
}
</style>
