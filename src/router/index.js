import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/chat",
  },
  {
    path: "/",
    name: "index",
    component: () => import("@/App.vue"),
    children: [
      {
        path: "chat",
        name: "chat",
        component: () => import("@/view/BaseChat.vue"),
        meta: { title: "文本生成工具", api: "getAnswerText" },
        props: (router) => {
          let {
            meta: { title, api },
            name: type,
          } = router;
          return { title, type, api };
        },
      },
      {
        path: "image",
        name: "image",
        component: () => import("@/view/ImageGeneration.vue"),
        meta: { title: "图像生成工具", api: "generateImage" },
        props: (router) => {
          let {
            meta: { title, api },
            name: type,
          } = router;
          return { title, type, api };
        },
      },
      {
        path: "watermark",
        name: "watermark",
        component: () => import("@/view/Watermark.vue"),
        meta: { title: "盲水印" },
        props: (router) => {
          let {
            meta: { title },
            name: type,
          } = router;
          return { title, type };
        },
      },
      {
        path: "extractWaterMark",
        name: "ExtractWaterMark",
        component: () => import("@/view/ExtractWaterMark.vue"),
        meta: { title: "提取水印" },
        props: (router) => {
          let {
            meta: { title },
            name: type,
          } = router;
          return { title, type };
        },
      },
      {
        path: "updateLog",
        name: "updateLog",
        component: () => import("@/view/UpdateLog.vue"),
        meta: { title: "更新日志" },
        props: (router) => {
          let {
            meta: { title },
            name: type,
          } = router;
          return { title, type };
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
