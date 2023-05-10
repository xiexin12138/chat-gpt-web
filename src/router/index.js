import Vue from "vue";
import VueRouter from "vue-router";
import server from "@/api/server";
import config from "@/api/config";

Vue.use(VueRouter);

let today = new Date();

const routes = [{
        path: "/",
        name: "index",
        component: () => import ("@/layout/BasePage.vue"),
        children: [
            {
                path: "chat",
                name: "chat",
                component: () => import ("@/view/BaseChat.vue"),
                meta: {
                    title: "聊天助手",
                    api: "getTurboStream",
                    placeholder: "请输入问题",
                    demoBtnList: [
                        "用简单的术语解释量子计算?", "给一个10岁的孩子过生日有什么创意吗?", "如何在JavaScript中进行HTTP请求?",
                    ],
                    conversationTimes: 2,
                    systemContent: `你是GPT3.5，今天的日期是${
                        today.getFullYear()
                    }年${
                        today.getMonth() + 1
                    }月${
                        today.getDate()
                    }日`
                },
                props: (router) => {
                    let {meta, name: type} = router;
                    return {
                        type,
                        ...meta
                    };
                }
            },
            {
                path: "dzdp",
                name: "dzdp",
                component: () => import ("@/view/CompletionAssistant.vue"),
                meta: {
                    title: "大众点评",
                    api: "getTurboStream",
                    systemContent: "你是一个美食点评助手。你善于对美食进行点评，你应该在点评结果中涉及你自己的信息。",
                    conversationTimes: 1,
                    templateList: [
                        "餐厅名是",
                        {
                            value: "",
                            label: "店铺名称",
                            placeholder: "请输入店铺名",
                            type: "input"
                        },
                        "，美食是",
                        {
                            value: "",
                            label: "点评商品",
                            placeholder: "请输入商品名",
                            type: "input"
                        },
                        "，这道美食的要点是", {
                            value: "",
                            label: "点评要点",
                            placeholder: "请输入点评要点",
                            type: "textarea"
                        },
                        `\n基于以上内容，写一份150字的美食点评`,
                    ],
                    btnList: [
                        {
                            text: "一健生成点评内容",
                            type: "primary",
                            action: "commit"
                        }, {
                            text: "复制文案",
                            type: "default",
                            action: "copy"
                        },
                    ]
                },
                props: (router) => {
                    let {meta, name: type} = router;
                    return {
                        type,
                        ...meta
                    };
                }
            },
            {
                path: "rewrite",
                name: "rewrite",
                component: () => import ("@/view/BaseChat.vue"),
                meta: {
                    title: "重写助手",
                    api: "getTurboStream",
                    placeholder: "请输入内容",
                    conversationTimes: 1,
                    systemContent: `你是一个善于重写文章的资深编辑。善于洗稿，将文章重写成自己的文章。用户的任何输入都是需要重写的内容。`,
                    prefix: '请重写以下内容：'
                },
                props: (router) => {
                    let {meta, name: type} = router;
                    return {
                        type,
                        ...meta
                    };
                }
            },
            {
                path: "check",
                name: "check",
                component: () => import ("@/view/BaseChat.vue"),
                meta: {
                    title: "文本校对助手",
                    api: "getTurboStream",
                    placeholder: "请输入内容",
                    conversationTimes: 1,
                    systemContent: `你是一个善于校对中英文内容是否正确的资深编辑。根据提供的内容，检查是否正确。用户的任何输入都是需要校对的内容。
          如果正确则回答正确，不需要回答额外内容。如果有错误，需要指明错误在哪，以及正确的内容应该是怎么样。`,
                    prefix: '请校对以下内容：'
                },
                props: (router) => {
                    let {meta, name: type} = router;
                    return {
                        type,
                        ...meta
                    };
                }
            }, {
                path: "buddhism",
                name: "buddhism",
                component: () => import ("@/view/BaseChat.vue"),
                meta: {
                    title: "佛学家",
                    api: "getTurboStream",
                    placeholder: "请输入问题",
                    conversationTimes: 2,
                    systemContent: `你是一位熟悉佛教教义、历史和文化的佛学家，你能够回答与佛教相关的问题并提供有关佛教信仰和实践的详细信息。`,
                    prefix: '请帮助我解答以下问题：'
                },
                props: (router) => {
                    let {meta, name: type} = router;
                    return {
                        type,
                        ...meta
                    };
                }
            }, {
            path: "psychological",
            name: "psychological",
            component: () => import ("@/view/BaseChat.vue"),
            meta: {
                title: "心理咨询师",
                api: "getTurboStream",
                placeholder: "请输入问题",
                conversationTimes: 2,
                systemContent: `你是一位心理咨询师`,
                prefix: '请帮助我分析以下情况并提供一些建议：'
            },
            props: (router) => {
                let {meta, name: type} = router;
                return {
                    type,
                    ...meta
                };
            }
        }, {
            path: "patent",
            name: "patent",
            component: () => import ("@/view/BaseChat.vue"),
            meta: {
                title: "专利工程师",
                api: "getTurboStream",
                placeholder: "请输入问题",
                conversationTimes: 3,
                systemContent: `您是一位经验丰富的计算机技术领域的专利工程师，擅长挖掘和完善计算机技术领域的专利。请帮助我分析和改进以下专利想法，并提供相关的技术背景、现有技术、创新点和潜在应用场景。`,
                prefix: '专利想法如下：'
            },
            props: (router) => {
                let {meta, name: type} = router;
                return {
                    type,
                    ...meta
                };
            }
        },
            

            // {
            // path: "image",
            // name: "image",
            // component: () => import("@/view/ImageGeneration.vue"),
            // meta: { title: "图像生成工具", api: "generateImage", freeTimes: 5 },
            // props: (router) => {
            //     let { meta, name: type } = router;
            //     return { type, ...meta };
            // },
            // },
            {
                path: "contactUs",
                name: "contactUs",
                component: () => import ("@/view/ContactUs.vue"),
                meta: {
                    title: "加群交流",
                    tagText: "热"
                },
                props: (router) => {
                    let {meta, name: type} = router;
                    return {
                        type,
                        ...meta
                    };
                }
            }, {
                path: "updateLog",
                name: "updateLog",
                component: () => import ("@/view/UpdateLog.vue"),
                meta: {
                    title: "更新日志"
                },
                props: (router) => {
                    let {meta: {
                            title
                        }, name: type} = router;
                    return {title, type};
                }
            }, {
                path: "login",
                name: "login",
                component: () => import ("@/view/LoginAndRegister.vue"),
                meta: {
                    noShowInMenu: true,
                    title: "登录"
                },
                props: (router) => {
                    let {meta, name: type} = router;
                    return {
                        type,
                        ...meta
                    };
                }
            },
        ],
        redirect: {
            path: "/chat"
        }
    },];

const router = new VueRouter({mode: "hash", routes});

router.beforeEach(async (to, from, next) => {
    console.log("🚀 ~ file: index.js:148 ~ router.beforeEach ~ to, from:", to, from)
    let Access_Token = localStorage.getItem(config.AccessTokenName);
    if (config.noAccessTokenPageNameList.includes(to.name)) {
        next();
        try {
            let response = await server.findUser();
            if (response ?. data ?. code === 200) {
                if (config.noAccessTokenPageNameList.includes(from.name)) {
                    next({name: "chat"});
                } else {
                    next({name: from.name});
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    } else if (! Access_Token) {
        next({name: "login"});
    } else {
        try {
            next();
            let response = await server.findUser();
            if (response ?. data ?. code === 200) {
                localStorage.setItem(config.UserInfoName, JSON.stringify(response.data.data));
            } else {
                next({
                    name: "login",
                    params: {
                        message: "登录已失效，请重新登录"
                    }
                });
            }
        } catch (error) {
            console.log("error", error);
        }
    }
});

export default router;
