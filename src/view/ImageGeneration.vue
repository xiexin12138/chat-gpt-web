<template>
  <div ref="wrap" class="wrap">
    <template v-if="!isLoading">
      <div class="title-description">
        -
        用一段详细的描述来画画，生成后<strong>记得保存好图片</strong>，我们未做任何储存<br />
        - 因为费用问题，还可以体验 <strong>{{ currentTime }}</strong> 次
      </div>
      <!-- 编辑细节的描述 -->
      <van-cell-group
        inset
        style="box-shadow: 0 2px 4px 0 rgba(0, 0, 82, 0.15)"
      >
        <van-cell size="large">
          <van-field
            v-model.trim="prompt"
            style="height: 120px"
            type="textarea"
            maxlength="400"
            placeholder="(请勿输入敏感或涉密信息进行测试)一幅印象派油画，画的是紫色花瓶里的向日葵……"
          />
        </van-cell>
        <van-cell center>
          <template #default>
            <van-button
              :disabled="!canGenerate"
              :loading="!canGenerate"
              loading-text="图 片 加 载 中"
              round
              class="generation-btn"
              @click="generation(prompt)"
              >生 成 图 片</van-button
            >
          </template>
        </van-cell>
      </van-cell-group>
      <template v-if="imageList && imageList.length && imageList.length > 0">
        <van-divider
          :hairline="false"
          style="margin: 32px 16px 0 16px"
          content-position="left"
          >R E S U L T</van-divider
        >
        <div style="margin: 16px 16px 0 16px">
          <van-image
            v-for="(image, index) in imageList"
            :key="index"
            width="100%"
            height="100%"
            lazy-load
            :src="image.url"
            @load="generationDone"
            @error="loadError"
            @click="copyUrl(image.url)"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </div>
      </template>
      <van-divider
        :hairline="false"
        style="margin: 32px 16px 0 16px"
        content-position="left"
        >D E M O</van-divider
      >
      <van-row style="margin: 16px 16px 32px 16px">
        <van-col v-for="(image, index) in demoList" :key="index" span="12">
          <van-image
            @click="openDialog(image)"
            width="99%"
            height="99%"
            lazy-load
            :src="image.url"
          />
        </van-col>
      </van-row>
    </template>
    <image-loading :percentage="percentage" v-else></image-loading>
    <van-dialog
      v-model="dialogVisible"
      close-on-click-overlay
      confirm-button-text="试试这个例子"
      confirm-button-color="#333"
      @confirm="tryDemo"
    >
      <van-image width="100%" height="100%" lazy-load :src="dialog.url" />
      <div style="margin: 32px">{{ dialog.name }}</div>
    </van-dialog>
  </div>
</template>

<script>
import {
  Cell,
  CellGroup,
  Field,
  Button,
  Divider,
  Row,
  Col,
  Image,
  Dialog,
  Loading,
} from "vant";
import ImageLoading from "@/components/ImageLoading.vue";
import api from "@/api/index";
import util from "@/api/util";

export default {
  name: "ImageGeneration",
  components: {
    ImageLoading,
    VanCell: Cell,
    VanCellGroup: CellGroup,
    VanField: Field,
    VanButton: Button,
    VanDivider: Divider,
    VanRow: Row,
    VanCol: Col,
    VanImage: Image,
    VanDialog: Dialog.Component,
    VanLoading: Loading,
  },
  props: {
    freeTimes: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      prompt: "",
      demoList: [],
      imageList: [],
      dialogVisible: false,
      dialog: { name: "", url: "" },
      isLoading: false,
      canGenerate: true,
      percentage: 0,
      currentTime: 0,
      validateCode: "aouwiqruageiw7q239",
    };
  },
  mounted() {
    const context = require.context(
      "@/assets/demoImgs",
      true,
      /\.(png|jpg|jpeg|gif|webp)$/
    );
    context.keys().forEach((key) => {
      this.demoList.push({
        name: key.substring(2).replace(/\.(png|jpg|jpeg|gif|webp)$/, ""),
        url: context(key),
      });
    });
    this.initTimes();
  },
  methods: {
    initTimes() {
      let limitTime = localStorage.getItem("Limit_Times");
      if (!limitTime) {
        localStorage.setItem("Limit_Times", this.freeTimes);
      } else {
        this.currentTime = Number.parseInt(limitTime);
      }
    },
    copyUrl(url) {
      util.copy(url);
      this.$toast("已复制图片链接");
    },
    loadError() {
      this.$toast("哎呀，图片加载失败了");
      this.generationDone();
    },
    async generation() {
      if (!this.prompt) {
        return this.$toast("写点什么吧");
      }
      if (!this.haveTimesToGenerate) {
        return this.$toast("噢，次数用完了");
      }
      this.isLoading = true;
      this.canGenerate = false;
      this.percentage = 0;
      let isDone = false;
      let prompt = "";
      try {
        let response = await api.translate(this.prompt);
        prompt = response.data.choices[0].message.content;
      } catch (error) {
        this.$toast(error?.response?.data?.error?.message || error.message);
        this.generationDone();
        this.isLoading = false;
        return;
      }
      let promise = api.generateImage({ prompt });
      let intervalId = setInterval(() => {
        if (this.percentage < 80) {
          this.percentage = this.percentage + 0.5;
        } else if (this.percentage < 96) {
          this.percentage = this.percentage + 0.2;
        } else if (this.percentage < 99) {
          this.percentage = this.percentage + 0.05;
        }
        promise.then(
          (result) => {
            if (!isDone) {
              this.percentage = 100;
              isDone = true;
              if (this.$route.query.validateCode !== this.validateCode) {
                this.currentTime--;
              }
              localStorage.setItem("Limit_Times", this.currentTime);
              setTimeout(() => {
                this.isLoading = false;
                this.imageList = result?.data?.data || [];
              }, 500);
            }
            clearInterval(intervalId);
          },
          (error) => {
            if (!isDone) {
              isDone = true;
              console.log(
                "🚀 ~ file: ImageGeneration.vue:140 ~ intervalId ~ reason:",
                error
              );
              this.$toast(
                error?.response?.data?.error?.message || error.message
              );
              this.generationDone();
              this.isLoading = false;
            }
            clearInterval(intervalId);
          }
        );
      }, 1000 * 0.05);
    },
    generationDone() {
      setTimeout(() => {
        this.canGenerate = true;
      }, 2000);
    },
    tryDemo() {
      if (this.isLoading) {
        return this.$toast("图片生成中，一会再试试呗");
      }
      this.prompt = this.dialog.name;
      this.$nextTick(() => {
        this.$refs.wrap.scrollTo(0, 0);
      });

      this.generation();
    },
    openDialog(image) {
      this.dialog.url = image.url;
      this.dialog.name = image.name;
      this.dialogVisible = true;
    },
  },
  filters: {
    toText(list) {
      return `- ${list.join("\n- ")}`;
    },
  },
  computed: {
    haveTimesToGenerate() {
      if (this.$route.query.validateCode === this.validateCode) {
        return true;
      } else {
        return this.currentTime > 0;
      }
    },
  },
};
</script>

<style>
.wrap {
  height: calc(100vh - 60px);
  overflow: scroll;
  width: 100vw;
  background-color: rgb(247, 248, 250);
  padding-top: 60px;
}
.pre-wrap {
  white-space: pre-wrap;
}
.title-description {
  margin: 16px;
  color: #888;
  font-size: 15px;
}
.generation-btn {
  width: 100%;
  font-weight: 800;
  color: #666;
  font-size: 16px;
}
</style>
