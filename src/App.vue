<template>
  <div style="height: 100vh">
    <van-nav-bar
      :title="title"
      style="position: fixed; top: 0; left: 0; width: 100%"
      @click-left="toShowNav"
    >
      <template #left>
        <van-icon name="apps-o" size="18" color="black" :dot="showNew" />
        <span style="margin-left: 5px">菜单</span>
      </template>
    </van-nav-bar>
    <van-notice-bar
      v-if="showNoticeBar"
      left-icon="volume-o"
      color="#1989fa"
      background="#ecf9ff"
      mode="closeable"
      scrollable
      text="网站使用个人经费，请合理使用，切勿滥用; 为防止被蔷导致失联，请点击加群防丢"
      @click="goToJoinGroup"
      @close="closeNoticeBart"
    />
    <router-view :style="defaultStyle"/>
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
import "@/assets/index.css";
import { NavBar, Popup, NoticeBar } from "vant";
import LeftSide from "@/components/LeftSide.vue";
import log from "@/assets/log.json";

export default {
  name: "App",
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
      showNoticeBar: false,
      currentCode: "000",
    };
  },
  mounted() {
    console.log("mounted");
    this.title = this.$route.meta.title;
    this.checkIsNeedShowNew();
    this.checkIsNeedShowNoticeBar();
  },
  methods: {
    checkIsNeedShowNoticeBar() {
      let closeNoticeBarTime = localStorage.getItem("Close_Notice_Bar_Time");
      if (!closeNoticeBarTime) {
        localStorage.setItem("Close_Notice_Bar_Time", this.currentCode + "_0");
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
    defaultStyle() {
      return this.showNoticeBar
        ? "height: calc(100vh-40px)"
        : "padding-top:25px;height: calc(100vh-50px)";
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
