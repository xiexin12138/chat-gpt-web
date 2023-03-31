<template>
  <div style="height: 100vh">
    <van-nav-bar
      :title="title"
      style="position: fixed; top: 0; left: 0; width: 100%"
      @click-left="toShowNav"
    >
      <template #left>
        <van-icon name="apps-o" size="18" color="black" :dot="showNew" />
      </template>
    </van-nav-bar>
    <router-view style="padding-top:25px;height: calc(100vh-50px);" :key="$route.fullPath" />
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
import { NavBar, Popup } from "vant";
import LeftSide from "@/components/LeftSide.vue";
import log from "@/assets/log.json";

export default {
  name: "App",
  components: {
    // NavBar
    LeftSide,
    VanNavBar: NavBar,
    VanPopup: Popup,
  },
  data() {
    return {
      title: "",
      showNav: false,
      showNew: false,
    };
  },
  mounted() {
    this.title = this.$route.meta.title;
    this.checkIsNeedShowNew();
  },
  methods: {
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
