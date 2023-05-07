<template>
  <div class="menu-wrap">
    <div>
      <div class="nav-title">
        <van-icon name="apps-o" />
        菜单
      </div>
      <van-divider />
      <van-list>
        <van-cell
          v-for="(item, index) in menuList"
          :key="index"
          @click="go(item)"
          style="cursor: pointer"
        >
          <van-icon name="arrow" />
          {{ item.title }}
          <van-tag v-if="item.tagText" type="danger" style="margin-left: 5px">{{
            item.tagText
          }}</van-tag>
        </van-cell>
      </van-list>
    </div>
    <div>
      <div class="user-name">欢迎你，{{ userName }}</div>
      <!-- <van-list>
        <van-cell
          v-for="(item, index) in menuList"
          :key="index"
          @click="go(item)"
          style="cursor: pointer"
        >
          <van-icon name="arrow" />
          {{ item.title }}
          <van-tag v-if="item.tagText" type="danger" style="margin-left: 5px">{{
            item.tagText
          }}</van-tag>
        </van-cell>
      </van-list> -->
    </div>
  </div>
</template>

<script>
import { List, Cell, Divider, Tag } from "vant";

export default {
  name: "LeftSide",
  components: {
    VanList: List,
    VanCell: Cell,
    VanDivider: Divider,
    VanTag: Tag,
  },
  data() {
    return {
      menuList: [],
    };
  },
  mounted() {
    this.initMenu();
  },
  methods: {
    initMenu() {
      let children = this.$router.options.routes?.[0].children;
      children.forEach((child) => {
        if (!child.meta.noShowInMenu) {
          this.menuList.push({
            title: child.meta.title,
            name: child.name,
            api: child.meta.api,
            tagText: child.meta.tagText,
          });
        }
      });
    },
    go(obj) {
      this.$emit("go", obj);
    },
  },
  computed: {
    userName() {
      return this.$store.state.userName;
    },
  },
};
</script>

<style scoped>
.nav-title {
  margin: 20px 20px 0 20px;
  font-size: 20px;
}
.menu-wrap {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
}
.user-name {
  padding: 20px;
  font-size: 16px;
}
</style>
