<template>
  <div style="height: 100vh">
    <van-nav-bar
      :title="title"
      style="position: fixed; top: 0; left: 0; width: 100%"
      @click-left="toShowNav"
    >
      <template #left>
        <van-icon name="apps-o" size="18" color="black" />
      </template>
    </van-nav-bar>
    <router-view></router-view>
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
    };
  },
  mounted() {
    console.log(this.$route);
    this.title = this.$route.meta.title;
  },
  methods: {
    toShowNav() {
      const childComponent = this.$children.find(
        (child) => child.$options.name === "BaseChat"
      );
      if (childComponent?.isLoadingChat) {
        return this.$toast("正在获取答案，请稍候");
      }
      this.showNav = true;
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
