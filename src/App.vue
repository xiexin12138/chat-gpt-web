<template>
  <div style="height: 100vh">
    <router-view />
  </div>
</template>

<script>
import "@/assets/index.css";

export default {
  name: "App",
  components: {},
  data() {
    return {};
  },
  mounted() {
    // this.$store.dispatch("updateUserInfo");
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
