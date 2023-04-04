<template>
  <div style="text-align: center; margin-top: 50px">
    <van-image width="50%" height="50%" lazy-load :src="qrCode || ''" />
    <div style="margin-top: 15px">☕️ 如果你对 AIGC 感兴趣，欢迎加群</div>
    <div style="margin-top: 15px">如无法入群，请联系微信：jiahim12138</div>
    <van-divider></van-divider>
    <div style="margin-top: 15px">If you don't have Wechat,</div>
    <div style="margin-top: 15px">welcome to join the Telegram group chat.</div>
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
import joinGroup from "@/assets/images/joinGroup.png";

export default {
  name: "ContactUs",
  components: { VanImage, VanButton, VanDivider },
  data() {
    return {
      qrCode: joinGroup,
    };
  },
  mounted() {},
};
</script>

<style></style>
