<template>
  <div ref="wrap" style="height: 100vh; overflow: scroll">
    <div style="padding-top: 40px; padding-bottom: 44px; overflow: scroll">
      <div class="uploader-wrap">
        <h3 style="font-size: 14px">盲水印图</h3>
        <van-uploader
          max-count="1"
          class="watermark-uploader"
          v-model="watermarkImgSource"
          :max-size="1000 * 1024 * 10"
          :after-read="watermarkImgSourceAfterRead"
          :before-delete="beforeDelete"
        />
      </div>
      <div class="uploader-wrap">
        <h3 style="font-size: 14px">
          {{ isText ? "文本水印" : "水印图" }}
          <!-- <span
            style="color: #ee0a24; font-size: 12; font-weight: normal"
            v-show="isText"
            >(支持数字及英文大小写)</span
          > -->
        </h3>
        <div class="uploader-wrap" v-if="isText">
          <div class="water-text-temp-wrap">
            <van-field
              v-model="watermarkText"
              @input="textInput"
              readonly
              disabled
            />
          </div>
        </div>
        <div class="water-img-temp-wrap" v-else>
          <van-image
            @click="selectedImg(item, 'isActiveImg2')"
            :class="{
              'active-img': isActiveImg2 === item,
              'default-img': 1,
            }"
            v-for="item in watermarkTemp"
            :src="item"
            :key="item"
            width="100"
            height="100"
            fit="contain"
          >
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </div>
      </div>
      <div class="uploader-wrap">
        <h3 style="font-size: 14px">
          提取的水印图
          <p
            v-show="isText"
            style="
              color: #ee0a24;
              font-size: 12;
              font-weight: normal;
              margin: 0;
            "
          >
            (提取的文字较小，轻触图片放大查看；长按图片可保存)
          </p>
          <span
            v-show="!isText"
            style="
              color: #ee0a24;
              font-size: 12;
              font-weight: normal;
              margin: 0;
            "
          >
            (长按图片可保存)
          </span>
        </h3>
        <van-image
          :src="watermarkImgTarget"
          width="100%"
          height="200"
          fit="contain"
          @click="imgPreview(watermarkImgTarget)"
        >
          <template v-slot:loading>
            <van-loading type="spinner" size="20" />
          </template>
          <template v-slot:error>提取的水印图</template>
        </van-image>
      </div>
      <div class="watermark-footer-button-wrap">
        <van-button type="default" @click="goback"> 返回 </van-button>
        <van-button type="info" @click="extract">提取水印</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/index";
import { Uploader, Button, ImagePreview, Image, Loading, Field } from "vant";

export default {
  name: "ExtractWaterMark",
  components: {
    VanUploader: Uploader,
    VanButton: Button,
    vanImage: Image,
    VanLoading: Loading,
    VanField: Field,
  },
  data() {
    return {
      isText: 0,
      watermarkText: "",
      isActiveImg2: "",
      watermarkImg: [],
      watermarkImgSource: [],
      watermarkImgTarget: "",
      afterWatermarkImg: "",
      watermarkTemp: [
        "https://pingantest-1317433877.cos.ap-nanjing.myqcloud.com/preinstallWatermark/watermark-selected-1.png",
        "https://pingantest-1317433877.cos.ap-nanjing.myqcloud.com/preinstallWatermark/watermark-selected-2.png",
        "https://pingantest-1317433877.cos.ap-nanjing.myqcloud.com/preinstallWatermark/watermark-selected-3.png",
        // "https://pingantest-1317433877.cos.ap-nanjing.myqcloud.com/preinstallWatermark/watermark-selected-4.png",
      ],
    };
  },
  beforeDestroy() {
    window.sessionStorage.removeItem("watermarkOptions");
  },
  mounted() {
    let options = window.sessionStorage.getItem("watermarkOptions");
    if (options) {
      options = JSON.parse(window.sessionStorage.getItem("watermarkOptions"));
      this.watermarkImgSource = [{ url: options.afterWatermarkImg }];
      if (options.isText === 0) {
        this.isText = 0;
        this.isActiveImg2 = options.watermark;
      } else {
        this.isText = 1;
        this.watermarkText = options.watermark;
      }
    }
  },
  methods: {
    beforeDelete() {
      this.watermarkImgTarget = "";
      return true;
    },
    textInput(v) {
      console.log(v);
      this.watermarkText = v.replace(/[\u4e00-\u9fa5]/, "");
    },
    goback() {
      this.$router.go(-1);
    },
    imgPreview(img) {
      if (!img) return;
      ImagePreview([img]);
    },
    watermarkImgSourceAfterRead(file) {
      console.log(file, this.watermarkImgSource);
    },
    getWatermarkImg() {
      if (!this.afterWatermarkImg) {
        this.$toast("请生成盲水印图");
        return;
      }
      this.activeTab = 1;
      this.watermarkImgSource = [{ url: this.afterWatermarkImg }];
      this.isActiveImg2 = this.isActiveImg;
    },
    generateMarkImg() {
      if (!this.isActiveImg) {
        this.$toast("请选择水印图");
        return;
      }
      if (this.sourceImg.length <= 0) {
        this.$toast("请上传原图");
        return;
      }
      this.addWatermark();
    },
    extract() {
      if (!this.isText) {
        if (!this.isActiveImg2) {
          this.$toast("请选择水印图");
          return;
        }
        // if (this.watermarkText.length <= 0) {
        //   this.$toast("请输入文本");
        //   return;
        // }
      }
      // else {

      // }
      if (this.watermarkImgSource.length <= 0) {
        this.$toast("请上传盲水印图");
        return;
      }
      this.extractWatermark();
    },
    async extractWatermark() {
      // this.$toast.allowMultiple();
      const t = this.$toast.loading({
        message: "水印提取中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        const formData = new FormData();
        if (this.watermarkImgSource[0] && this.watermarkImgSource[0].url) {
          formData.append(
            "addedWatermarkPicUrl",
            this.watermarkImgSource[0].url
          );
        } else {
          formData.append("addedWatermarkPic", this.watermarkImgSource[0].file);
        }
        if (this.isText) {
          formData.append("bwmType", "text");
          formData.append("watermarkText", this.watermarkText);
        } else {
          formData.append("bwmType", "pic");
          formData.append("watermarkPicUrl", this.isActiveImg2);
        }

        const res = await api.extractWatermark(formData);
        t.clear();
        if (res.data.rspCode === "000000") {
          this.watermarkImgTarget = res.data.data;
        } else {
          this.$toast({
            duration: 5000,
            message: res.data.rspMsg,
          });
          this.watermarkImgTarget = "";
        }
      } catch (err) {
        t.clear();
        console.log(err);
      }
    },
    async addWatermark() {
      const t = this.$toast.loading({
        message: "图片生成中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        const formData = new FormData();
        formData.append("bwmType", "pic");
        formData.append("watermarkPicUrl", this.isActiveImg);
        formData.append("originPicFile", this.sourceImg[0].file);
        const res = await api.addWatermark(formData);
        t.clear();
        if (res.data.rspCode === "000000") {
          this.afterWatermarkImg = res.data.data;
        } else {
          this.$toast(res.data.rspMsg);
        }
      } catch (err) {
        t.clear();
        console.log(err);
      }
    },
    selectedImg(img, type) {
      console.log(img, type);
      if (this[type] === img) {
        this[type] = "";
        return;
      }
      this[type] = img;
    },
    beforeRead(file) {
      const type = file.type;
      const acceptType = ["image/jpeg", "image/jpg", "image/png"];
      if (!acceptType.includes(type)) {
        this.$toast("仅支持png/jpg/jpeg等格式图片");
        return false;
      }
      return true;
    },
    afterRead(file, type) {
      console.log(file, type, this.sourceImg);
    },
  },
};
</script>

<style>
.watermark-uploader {
  width: 100%;
  height: 200px;
}
.water {
  width: 100px;
  height: 100px;
}
.watermark-uploader .van-uploader__wrapper,
.watermark-uploader .van-uploader__upload,
.watermark-uploader .van-uploader__preview,
.watermark-uploader .van-uploader__preview-image {
  width: 100%;
  height: 100%;
}
.watermark-uploader .van-uploader__preview-image .van-image__img {
  object-fit: contain !important;
}
.watermark-uploader .van-uploader__preview-delete {
  width: 25px;
  height: 25px;
}
.watermark-uploader
  .van-uploader__preview-delete
  .van-uploader__preview-delete-icon {
  font-size: 25px;
}
.watermark-uploader .van-uploader__upload {
  margin: 0;
}
.uploader-wrap {
  padding: 8px 10px;
}
.uploader-wrap h3 {
  margin: 0 0 10px 0;
}
.watermark-footer-button-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
}
.watermark-footer-button-wrap button {
  flex: 1;
  border-radius: 0;
}

.default-img {
  padding: 2px;
  border-radius: 2px;
  border: 2px solid transparent;
}
.active-img {
  border: 2px solid #1989fa;
}
.water-img-temp-wrap {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}
.watermark-uploader .van-uploader__wrapper--disabled {
  opacity: 1;
}
</style>
