<template>
  <div>
    <div class="nav-title">
      <van-icon name="apps-o" />
      功能导航
    </div>
    <van-divider />
    <van-list>
      <van-cell
        v-for="(item, index) in menuList"
        :key="index"
        @click="go(item)"
      >
        <van-icon name="arrow" />
        {{ item.title }}
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { List, Cell, Divider } from "vant";

export default {
  name: "LeftSide",
  components: {
    VanList: List,
    VanCell: Cell,
    VanDivider: Divider,
  },
  data() {
    return {
      menuList: [],
    };
  },
  mounted() {
    console.log(
      "🚀 ~ file: LeftSide.vue:29 ~ mounted ~ this.$route",
      this.$route
    );
    this.initMenu();
  },
  methods: {
    initMenu() {
      let children = this.$router.options.routes?.[0].children;
      children.forEach((child) => {
        this.menuList.push({
          title: child.meta.title,
          name: child.name,
          api: child.meta.api,
        });
      });
    },
    go(obj) {
      this.$emit("go", obj);
    },
  },
};
</script>

<style>
.nav-title {
  margin: 20px 20px 0 20px;
  font-size: 20px;
}
</style>
