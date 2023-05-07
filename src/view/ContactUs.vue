<template>
  <div style="text-align: center; padding-top: 10px">
    <div style="height: 50vw; width: 50vw; display: inline-block">
      <van-image lazy-load :src="qrCode || ''" />
    </div>
    <div style="margin-top: 15px">☕️ 如果你对 AIGC 感兴趣，欢迎加群</div>
    <div style="margin-top: 15px">如无法入群，请联系微信：{{ wechatCode }}</div>
    <div style="margin: 15px;50px">
      <van-button type="primary" block icon="guide-o" @click="copy"
        >点击复制微信号：{{ wechatCode }}</van-button
      >
    </div>
    <van-divider></van-divider>
    <div style="margin-top: 15px">如果你是开发者，欢迎加入 TG 讨论技术</div>
    <div style="margin: 15px;50px">
      <van-button
        url="https://t.me/+TAOMF75X6IxmMmI1"
        type="info"
        block
        icon="guide-o"
        >Telegram</van-button
      >
    </div>
  </div>
</template>

<script>
import {
  Image as VanImage,
  Button as VanButton,
  Divider as VanDivider,
} from "vant";
import joinGroup from "@/assets/images/joinGroup.jpg";
import util from "@/api/util";

export default {
  name: "ContactUs",
  components: { VanImage, VanButton, VanDivider },
  data() {
    return {
      qrCode: joinGroup,
      wechatCode: "AIGCHelper",
    };
  },
  mounted() {},
  methods: {
    copy() {
      util.copy(this.wechatCode);
      this.$toast("已复制微信号");
    },
  },
};
</script>

<style></style>
