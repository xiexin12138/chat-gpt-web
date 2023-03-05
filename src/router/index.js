import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: () => import("@/App.vue"),
    children: [
      {
        path: "chat",
        name: "chat",
        component: () => import("@/view/BaseChat.vue"),
        meta: { title: "文本生成工具", api: "getTurboStream" },
        props: (router) => {
          let {
            meta: { title, api },
            name: type,
          } = router;
          return { title, type, api };
        },
      },
      {
        path: "code",
        name: "code",
        component: () => import("@/view/BaseChat.vue"),
        meta: { title: "代码生成工具", api: "getCodeTextStream" },
        props: (router) => {
          let {
            meta: { title, api },
            name: type,
          } = router;
          return { title, type, api };
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

export default router;
