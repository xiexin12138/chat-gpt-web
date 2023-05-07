import Vue from "vue";
import Vuex from "vuex";
import config from "@/api/config";
import util from "@/api/util";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 账户余额
    walletRemain: 0,
    remainToken: 0,
    rechargeToken: 0,
    userName: "用户",
  },
  mutations: {
    updateWalletRemain(state, walletRemain) {
      state.walletRemain = walletRemain;
    },
    updateRemainToken(state, remainToken) {
      state.remainToken = remainToken;
    },
    updateRechargeToken(state, rechargeToken) {
      state.rechargeToken = rechargeToken;
    },

    updateUserName(state, name) {
      state.userName = name;
    },
  },
  actions: {
    // 异步操作的方法
    async updateUserInfo({ commit }) {
      let user;
      try {
        let str = localStorage.getItem(config.UserInfoName);
        user = JSON.parse(str);
      } catch (error) {
        console.error(error);
        await util.updateUserInfo();
        util.updateWallet();
      }
      commit("updateRemainToken", Number.parseInt(user?.remainToken || 0));
      commit("updateRechargeToken", Number.parseInt(user?.rechargeToken || 0));
      commit(
        "updateWalletRemain",
        Number.parseInt(user?.remainToken || 0) +
          Number.parseInt(user?.rechargeToken || 0)
      );
      commit("updateUserName", user?.email?.split("@")?.[0] || "");
    },
  },
  getters: {
    // 获取状态的方法
    getWalletReamin(state) {
      return (state.walletRemain / 100).toFixed(2);
    },
    // 赠送余额
    getRemainToken(state) {
      return (state.remainToken / 100).toFixed(2);
    },
    // 充值余额
    getRechargeToken(state) {
      return (state.rechargeToken / 100).toFixed(2);
    },
    getUserName(state) {
      return state.userName;
    },
  },
});
