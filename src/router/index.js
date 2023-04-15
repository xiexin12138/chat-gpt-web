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
        meta: {
          title: "文本生成工具",
          api: "getAnswerText",
          placeholder: "(请勿输入敏感或涉密信息进行测试)请输入问题",
          demoBtnList: [
            "用简单的术语解释量子计算?",
            "给一个10岁的孩子过生日有什么创意吗?",
            "如何在JavaScript中进行HTTP请求?",
          ],
        },
        props: (router) => {
          let { meta, name: type } = router;
          return { type, ...meta };
        },
      },
      {
        path: "report",
        name: "report",
        component: () => import("@/view/BaseChat.vue"),
        meta: {
          title: "2022Q4 股份制商业银行投诉分析",
          api: "getAnswerText",
          placeholder:
            "2022年Q4 股份制商业银行业消费投诉情况通报分析。(请勿输入违规信息)请输入要分析的问题",
          demoBtnList: [
            "通报中说了什么？",
            "平安银行相关数据有什么?",
            "分析下平安银行?",
          ],
          conversationTimes: 1,
          systemContent: "你是一个报告分析助手",
          prefix:
            "2022年第四季度中国银保监会及其派出机构接收并转送银行业消费投诉情况通报,股份制商业银行数据如下\n股份制商业银行名称|投诉量中位数|投诉量占比|每千营业网点投诉量中位数(件/千营业网点)|每千万个人客户投诉量中位数(件/千万个人客户)|信用卡业务投诉量|个人贷款业务投诉量|理财类业务投诉量\n--|--|--|--|--|--|--|--\n平安银行| 4474|17.0%|3801.2|378.5|3514|646|147\n浦发银行| 3395|12.9%|2020.8|245.2|2716|342|211\n兴业银行| 3310|12.6%|1638.6|417.8|2559|361|243\n中信银行| 2704|10.3%|1811.1|243.6|2064|306|189\n光大银行| 2425|9.2%|1485.0|173.2|1893|348|97\n广发银行| 2415|9.2%|2692.3|468.5|2040|220|87\n招商银行| 2290|8.7%|1196.4|132.2|1526|256|336\n民生银行| 2099|8.0%|872.0|191.7|1653|260|81\n华夏银行| 1737|6.6%|1724.9|303.9|1348|194|112\n渤海银行| 421|1.6%|1456.7|477.4|114|234|53\n百信银行| 383|1.5%|N/A|55.5|N/A|365|3\n浙商银行| 374|1.4%|1303.1|447.6|123|167|67\n恒丰银行| 220|0.8%|702.9|388.0|123|40|21\n请各银行将投诉情况向董事会报告.各银行要落实主体责任,完善制度机制,畅通投诉渠道,扎实做好投诉处理工作,加强源头治理,改进服务质量,维护好消费者的合法权益.各银保监局要进一步提高政治站位,压紧压实机构投诉处理主体责任,督促机构积极化解矛盾,切实维护消费者的合法权益.\n中国银保监会消费者权益保护局 \n2023年3月20日\n基于以上数据进行分析，回答以下问题：\n",
        },
        props: (router) => {
          let { meta, name: type } = router;
          return { type, ...meta };
        },
      },
      {
        path: "translator",
        name: "translator",
        component: () => import("@/view/BaseChat.vue"),
        meta: {
          title: "翻译助手(中英)",
          api: "getAnswerText",
          placeholder: "(请勿输入敏感或涉密信息进行测试)请输入需要翻译的内容",
          conversationTimes: 1,
          systemContent:
            "你是一个翻译助手，能够将中文或英文翻译成英文或中文，禁止回答问题和引导用户，下面是需要翻译的内容。",
          demoBtnList: [
            "春节是中国的传统节日",
            "深圳是中国的经济特区",
            "还能翻译很多东西",
          ],
          prefix: "请翻译：\n",
        },
        props: (router) => {
          let { meta, name: type } = router;
          return { type, ...meta };
        },
      },
      {
        path: "summarize",
        name: "summarize",
        component: () => import("@/view/BaseChat.vue"),
        meta: {
          title: "摘要助手",
          api: "getAnswerText",
          placeholder:
            "(请勿输入敏感或涉密信息进行测试)请输入需要提取摘要的内容",
          conversationTimes: 1,
          systemContent:
            "你是一个专业的摘要助手，会把任何传发送你的文本作为提取摘要的原始数据，禁止回答和摘要无关的问题",
          prefix: "请提取摘要：\n",
        },
        props: (router) => {
          let { meta, name: type } = router;
          return { type, ...meta };
        },
      },
      {
        path: "fitWord",
        name: "fitWord",
        component: () => import("@/view/BaseChat.vue"),
        meta: {
          title: "错别字识别助手",
          api: "getAnswerText",
          placeholder: "(请勿输入敏感或涉密信息进行测试)请输入需要检查的内容",
          conversationTimes: 1,
          systemContent:
            "你是一个错别字助手，会检查任何传发送你的文本是否有错别字，禁止回答和摘要无关的问题",
          prefix: "请检查以下内容是否有错别字，如果有请指出错误的位置：\n",
          demoBtnList: [
            "仅天天气很好",
            "Javassript是一门开发语言",
            "这句话妹有错别字",
          ],
        },
        props: (router) => {
          let { meta, name: type } = router;
          return { type, ...meta };
        },
      },
      {
        path: "complete",
        name: "complete",
        component: () => import("@/view/BaseChat.vue"),
        meta: {
          title: "扩写助手",
          api: "getAnswerText",
          placeholder: "(请勿输入敏感或涉密信息进行测试)请输入需要扩写的内容",
          conversationTimes: 1,
          systemContent:
            "你是一个扩写助手，会基于文本进行扩写，禁止回答和摘要无关的问题",
          prefix: "请对下面的文本进一步扩写：\n",
          demoBtnList: ["从前有座山,", "今天，我", "德先生和赛先生"],
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
        meta: { title: "腾讯盲水印" },
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
        meta: { title: "提取水印", hideMenu: true },
        props: (router) => {
          let {
            meta: { title },
            name: type,
          } = router;
          return { title, type };
        },
      },
      {
        path: "aliwatermark",
        name: "AliWatermark",
        component: () => import("@/view/AliWatermark.vue"),
        meta: { title: "阿里盲水印" },
        props: (router) => {
          let {
            meta: { title },
            name: type,
          } = router;
          return { title, type };
        },
      },
      {
        path: "aliextractWaterMark",
        name: "AliExtractWaterMark",
        component: () => import("@/view/AliExtractWaterMark.vue"),
        meta: { title: "提取水印", hideMenu: true },
        props: (router) => {
          let {
            meta: { title },
            name: type,
          } = router;
          return { title, type };
        },
      },
      {
        path: "knowledgeBase",
        name: "knowledgeBase",
        component: () => import("@/view/IframePage.vue"),
        meta: { title: "智能知识库", url: process.env.VUE_APP_KNOWLEDGE_BASE_URL },
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
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

export default router;
