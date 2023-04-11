import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

let today = new Date();
let yesterday = new Date(new Date() - 24 * 60 * 60 * 1000);

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
        meta: {
          title: "聊天助手",
          api: "getTurboStream",
          placeholder: "请输入问题",
          demoBtnList: [
            "用简单的术语解释量子计算?",
            "给一个10岁的孩子过生日有什么创意吗?",
            "如何在JavaScript中进行HTTP请求?",
          ],
          conversationTimes: 2,
          systemContent: `你叫刘百万，你善于聊天，你知识库的截止日期是${yesterday.getFullYear()}年${
            yesterday.getMonth() + 1
          }月${yesterday.getDate()}日，现在的日期是${today.getFullYear()}年${
            today.getMonth() + 1
          }月${today.getDate()}日`,
        },
        props: (router) => {
          let { meta, name: type } = router;
          return { type, ...meta };
        },
      },
      {
        path: "dzdp",
        name: "dzdp",
        component: () => import("@/view/CompletionAssistant.vue"),
        meta: {
          title: "大众点评",
          api: "getTurboStream",
          systemContent:
            "你是一个美食点评助手。你善于对美食进行点评，你应该在点评结果中涉及你自己的信息。",
          conversationTimes: 1,
          templateList: [
            "餐厅名是",
            {
              value: "",
              label: "店铺名称",
              placeholder: "请输入店铺名",
              type: "input",
            },
            "，美食是",
            {
              value: "",
              label: "点评商品",
              placeholder: "请输入商品名",
              type: "input",
            },
            "，这道美食的要点是",
            {
              value: "",
              label: "点评要点",
              placeholder: "请输入点评要点",
              type: "textarea",
            },
            `\n基于以上内容，写一份150字的美食点评`,
          ],
          btnList: [
            {
              text: "一健生成点评内容",
              type: "primary",
              action: "commit",
            },
            {
              text: "复制文案",
              type: "default",
              action: "copy",
            },
          ],
        },
        props: (router) => {
          let { meta, name: type } = router;
          return { type, ...meta };
        },
      },
      {
        path: "image",
        name: "image",
        component: () => import("@/view/ImageGeneration.vue"),
        meta: { title: "图像生成工具", api: "generateImage", freeTimes: 5 },
        props: (router) => {
          let { meta, name: type } = router;
          return { type, ...meta };
        },
      },
      {
        path: "contactUs",
        name: "contactUs",
        component: () => import("@/view/ContactUs.vue"),
        meta: { title: "加群交流 (Contact Us)", tagText: "热" },
        props: (router) => {
          let { meta, name: type } = router;
          return { type, ...meta };
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
    redirect: { path: "/chat" },
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

export default router;
