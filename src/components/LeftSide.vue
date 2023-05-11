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
      <van-list>
        <van-cell @click="goToGPT4" style="font-size: 16px; cursor: pointer">
          【进阶能力】GPT4 问答
        </van-cell>
      </van-list>
      <div v-if="userName" class="user-name">欢迎你，{{ userName }}</div>
      <div
        v-else
        class="user-name"
        style="cursor: pointer"
        @click="goto('login')"
      >
        游客你好，登录后立即免费使用
      </div>
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
    goToGPT4() {
      this.$dialog
        .confirm({
          title: "确认",
          message:
            "是否在新窗口打开 GPT4 问答？\n如果是第一次使用，欢迎群里咨询技巧",
        })
        .then(() => {
          window.open("https://gpt4.gpthink.xyz");
        })
        .catch(() => {});
    },
    goto(name) {
      this.$router.push({ name });
    },
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
