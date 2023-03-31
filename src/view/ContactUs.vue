<template>
  <div style="text-align: center; margin-top: 50px">
    <van-image width="50%" height="50%" lazy-load :src="qrCode || ''" />
    <div style="margin-top: 15px">欢迎加群，共同探讨 AIGC</div>
    <div style="margin-top: 15px">
      如无法入群，请联系微信：xiexin12138
    </div>
  </div>
</template>

<script>
import { Image as VanImage } from "vant";
import joinGroup from "@/assets/images/joinGroup.png";

export default {
  name: "ContactUs",
  components: { VanImage },
  data() {
    return {
      qrCode: joinGroup,
    };
  },
  mounted() {},
};
</script>

<style></style>
