<template>
  <div style="padding: 40px 16px">
    <van-progress inactive :percentage="percentage" :show-pivot="false" />
    <div style="margin: 24px">
      <van-image
        width="100%"
        height="100%"
        lazy-load
        :src="randomImageUrl || ''"
      />
      <div style="background-color: #f2f2f4; padding: 16px">
        <div style="font-weight: 800; line-height: 21px; color: #7f7f7f">
          小技巧
        </div>
        <div style="color: #7f7f7f; line-height: 16px; margin: 8px 0 16px">
          你可以这样提问
        </div>
        <div style="font-size: 21px">“{{ randomImageText }}”</div>
      </div>
    </div>
  </div>
</template>

<script>
import { Progress, Image } from "vant";

export default {
  name: "image-loading",
  components: {
    VanProgress: Progress,
    VanImage: Image,
  },
  props: {
    percentage: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      imageList: [],
      randomIndex: 0,
    };
  },
  created() {
    const context = require.context(
      "@/assets/image",
      true,
      /\.(png|jpg|jpeg|gif|webp)$/
    );
    context.keys().forEach((key) => {
      this.imageList.push({
        name: key.substring(2).replace(/\.(png|jpg|jpeg|gif|webp)$/, ""),
        url: context(key),
      });
    });
    this.randomIndex = Number.parseInt(
      this.imageList.length * Math.random() + 1
    );
  },
  computed: {
    randomImageUrl() {
      return this.imageList?.[this.randomIndex]?.url || "";
    },
    randomImageText() {
      return this.imageList?.[this.randomIndex]?.name || "";
    },
  },
};
</script>

<style></style>
