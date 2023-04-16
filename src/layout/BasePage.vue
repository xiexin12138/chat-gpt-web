<template>
  <div :class="showNavBar ? 'base-page-with-bar' : 'base-page'">
    <van-nav-bar
      v-if="showNavBar"
      :title="title"
      style="position: fixed; top: 0; left: 0; width: 100%"
      @click-left="toShowNav"
    >
      <template #left>
        <van-icon name="apps-o" size="18" color="black" :dot="showNew" />
        <span style="margin-left: 5px">菜单</span>
      </template>
      <template #right
        ><van-icon name="gem-o" color="#000" /><span style="margin-left: 5px">{{
          walletRemain
        }}</span></template
      >
    </van-nav-bar>
    <van-notice-bar
      v-if="showNoticeBar"
      left-icon="volume-o"
      color="#1989fa"
      background="#ecf9ff"
      mode="closeable"
      scrollable
      text="如果你对 AIGC 感兴趣，欢迎加群讨论"
      @click="goToJoinGroup"
      @close="closeNoticeBart"
    />
    <router-view :style="defaultStyle" />
    <van-popup
      v-model="showNav"
      position="left"
      style="width: 70%; height: 100vh; max-width: 400px"
    >
      <LeftSide @go="go" :user="name" :wallet="walletRemain"></LeftSide>
    </van-popup>
  </div>
</template>

<script>
import "@/assets/index.css";
import { NavBar, Popup, NoticeBar } from "vant";
import LeftSide from "@/components/LeftSide.vue";
import log from "@/assets/log.json";
import config from "@/api/config";

export default {
  name: "BasePage",
  components: {
    // NavBar
    LeftSide,
    VanNavBar: NavBar,
    VanPopup: Popup,
    VanNoticeBar: NoticeBar,
  },
  data() {
    return {
      title: "",
      showNav: false,
      showNew: false,
      showNavBar: false,
      showNoticeBar: false,
      currentCode: "001",
      name: "用户",
      wallet: 0,
    };
  },
  mounted() {
    this.title = this.$route.meta.title;
    this.showNavBar = !this.$route.meta?.noShowInMenu;
    this.checkIsNeedShowNew();
    this.checkIsNeedShowNoticeBar();
  },
  updated() {
    console.log("update");
    this.updateUserInfo();
  },
  methods: {
    checkLogin() {
      // let auth = localStorage.getItem("Auth");
    },
    updateUserInfo() {
      let str = localStorage.getItem("User_Info");
      if (str) {
        let userInfo = JSON.parse(str);
        this.name = userInfo.name;
        this.wallet = userInfo.remainToken;
      } else {
        this.name = "用户";
        this.wallet = 0;
      }
    },
    checkIsNeedShowNoticeBar() {
      // 如果没有登陆态，不需要显示通知栏
      if (config.noAccessTokenPageNameList.includes(this.$route.name)) {
        this.showNoticeBar = false;
        return;
      }
      let closeNoticeBarTime = localStorage.getItem("Close_Notice_Bar_Time");
      if (!closeNoticeBarTime) {
        localStorage.setItem(
          "Close_Notice_Bar_Time",
          this.currentCode + "_0"
        );
        this.showNoticeBar = true;
      } else {
        let code = closeNoticeBarTime.split("_")[0];
        let timeStr = closeNoticeBarTime.split("_")[1];
        let time = Number.parseInt(timeStr);
        if (this.currentCode === code) {
          if (time < 2) {
            this.showNoticeBar = true;
          }
        } else {
          this.showNoticeBar = true;
          localStorage.setItem(
            "Close_Notice_Bar_Time",
            this.currentCode + "_0"
          );
        }
      }
    },
    checkIsNeedShowNew() {
      let gptVersion = localStorage.getItem("GPT_Version");
      if (!gptVersion) {
        this.showNew = true;
      } else {
        let timestamps = Date.parse(log?.[0]?.date);
        if (Number.parseInt(timestamps) > Number.parseInt(gptVersion)) {
          this.showNew = true;
          localStorage.setItem("GPT_Version", timestamps);
        } else {
          this.showNew = false;
        }
      }
    },
    hideNeedShowNew() {
      this.showNew = false;
      let date = log?.[0]?.date;
      localStorage.setItem("GPT_Version", Date.parse(date));
    },
    toShowNav() {
      let isLoading = this.$children.some((child) => child?.isLoading);
      if (isLoading) {
        return this.$toast("正在获取答案，请稍候");
      }
      this.showNav = true;
      this.hideNeedShowNew();
    },
    go(obj) {
      if (this.$route.name !== obj.name) {
        this.$router.push({
          name: obj.name,
        });
      }
      this.showNav = false;
      this.title = obj.title;
    },
    goToJoinGroup() {
      this.go({
        name: "contactUs",
        title: "加群交流",
      });
    },
    closeNoticeBart() {
      let closeNoticeBarTime = localStorage.getItem("Close_Notice_Bar_Time");
      let code = closeNoticeBarTime.split("_")[0];
      let timeStr = closeNoticeBarTime.split("_")[1];
      let time = Number.parseInt(timeStr);
      time++;
      localStorage.setItem("Close_Notice_Bar_Time", code + "_" + time);
      this.showNoticeBar = false;
    },
  },
  computed: {
    walletRemain() {
      return this.wallet / 100;
    },
    defaultStyle() {
      let top = this.showNavBar ? 46 : 0;
      top = this.showNoticeBar ? top + 40 : top;
      return this.showNoticeBar
        ? `height: calc(100vh - ${top}px); background-color: rgb(247, 247, 248);overflow: scroll;`
        : "height: 100vh; background-color: rgb(247, 247, 248);overflow: scroll;";
    },
  },
  watch: {
    $route(to) {
      this.showNavBar = !to.meta?.noShowInMenu;
      if (to.meta?.noShowInMenu) {
        this.showNav = false;
      }
    },
  },
};
</script>

<style>
.base-page-with-bar {
  height: calc(100vh - 46px);
  padding-top: 46px;
}
.base-page {
  height: 100vh;
  padding-top: 0px;
}
</style>
