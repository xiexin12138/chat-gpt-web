<template>
  <div ref="wrap" style="height: 100vh; overflow: scroll">
    <div style="padding-top: 40px; padding-bottom: 84px; overflow: scroll">
      <van-tabs v-model="activeTab">
        <van-tab title="图片水印">
          <div class="uploader-wrap">
            <h3 style="font-size: 14px">选择水印图</h3>
            <div class="water-img-temp-wrap">
              <van-image
                @click="selectedImg(item, 'isActiveImg')"
                :class="{
                  'active-img': isActiveImg === item,
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
            <h3 style="font-size: 14px">原图</h3>
            <van-uploader
              max-count="1"
              class="watermark-uploader"
              :before-read="beforeRead"
              :after-read="(v) => afterRead(v, 'sourceImg')"
              v-model="sourceImg"
              :before-delete="() => beforeDelete('afterWatermarkImg')"
            />
          </div>

          <div class="uploader-wrap">
            <h3 style="font-size: 14px">
              盲水印图<span
                style="color: #ee0a24; font-size: 12; font-weight: normal"
                >(长按图片可保存)</span
              >
            </h3>
            <van-image
              :src="afterWatermarkImg"
              width="100%"
              height="200"
              fit="contain"
              @click="imgPreview(afterWatermarkImg)"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template v-slot:error>盲水印图</template>
            </van-image>
          </div>
          <div class="watermark-footer-button-wrap">
            <van-button type="info" @click="generateMarkImg('pic')">
              生成盲水印图
            </van-button>
            <van-button type="default" @click="getWatermarkImg('pic')">
              提取图片水印
            </van-button>
          </div>
        </van-tab>
        <van-tab title="文本水印">
          <div class="uploader-wrap">
            <h3 style="font-size: 14px">
              输入文本
              <!-- <span style="color: #ee0a24; font-size: 12; font-weight: normal"
                >(支持数字及英文大小写)</span
              > -->
            </h3>
            <div class="water-text-temp-wrap">
              <van-field v-model="watermarkText" @input="textInput" />
            </div>
          </div>

          <div class="uploader-wrap">
            <h3 style="font-size: 14px">原图</h3>
            <van-uploader
              max-count="1"
              class="watermark-uploader"
              :before-read="beforeRead"
              :after-read="(v) => afterRead(v, 'watermarkTextSourceImg')"
              v-model="watermarkTextSourceImg"
              :before-delete="() => beforeDelete('afterWatermarkText')"
            />
          </div>

          <div class="uploader-wrap">
            <h3 style="font-size: 14px">
              盲水印图<span
                style="color: #ee0a24; font-size: 12; font-weight: normal"
                >(长按图片可保存)</span
              >
            </h3>
            <van-image
              :src="afterWatermarkText"
              width="100%"
              height="200"
              fit="contain"
              @click="imgPreview(afterWatermarkText)"
            >
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template v-slot:error>盲水印图</template>
            </van-image>
          </div>
          <div class="watermark-footer-button-wrap">
            <van-button type="info" @click="generateMarkImg('text')">
              生成盲水印图
            </van-button>
            <van-button type="default" @click="getWatermarkImg('text')">
              提取文本水印
            </van-button>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import api from "@/api/index";
import { shrinkImage } from "shrinkpng";
import {
  Tab,
  Tabs,
  Uploader,
  Button,
  ImagePreview,
  Image as VantImg,
  Loading,
  Field,
  Dialog,
} from "vant";

export default {
  name: "AliWaterMark",
  components: {
    VanTab: Tab,
    VanTabs: Tabs,
    VanUploader: Uploader,
    VanButton: Button,
    vanImage: VantImg,
    VanLoading: Loading,
    VanField: Field,
  },
  data() {
    return {
      afterWatermarkText: "",
      watermarkText: "",
      watermarkTextSourceImg: [],
      isActiveImg: "",
      activeTab: 0,
      sourceImg: [],
      afterWatermarkImg: "",
      watermarkTemp: [
        "https://pingantest002.oss-cn-shanghai.aliyuncs.com/watermark/watermark-selected-1.png",
        "https://pingantest002.oss-cn-shanghai.aliyuncs.com/watermark/watermark-selected-2.png",
        "https://pingantest002.oss-cn-shanghai.aliyuncs.com/watermark/watermark-selected-3.png",
      ],
    };
  },
  mounted() {},
  methods: {
    beforeDelete(type) {
      this[type] = "";
      return true;
    },
    textInput() {
      // let s = "";
      // for (let i = 0; i < v.length; i++) {
      //   let vi = v[i];
      //   vi = vi.replace(/^[\u4e00-\u9fa5]/g, "");
      //   s += vi;
      // }
      // this.watermarkText = s;
    },
    imgPreview(img) {
      if (!img) return;
      ImagePreview([img]);
    },
    getWatermarkImg(type) {
      const validateMap = {
        pic: () => {
          if (!this.afterWatermarkImg) {
            this.$toast("请生成图片盲水印图");
            return false;
          }
          return true;
        },
        text: () => {
          if (!this.afterWatermarkText) {
            this.$toast("请生成文本盲水印图");
            return false;
          }
          return true;
        },
      };
      const pass = validateMap[type]();
      if (!pass) return;
      window.sessionStorage.setItem(
        "watermarkOptions",
        JSON.stringify({
          isText: this.activeTab,
          watermark:
            this.activeTab == 0 ? this.isActiveImg : this.watermarkText,
          afterWatermarkImg:
            this.activeTab == 0
              ? this.afterWatermarkImg
              : this.afterWatermarkText,
        })
      );
      this.$router.push("/aliextractWaterMark");
    },
    generateMarkImg(type) {
      const validateMap = {
        pic: () => {
          this.afterWatermarkImg = "";
          if (!this.isActiveImg) {
            this.$toast("请选择水印图");
            return false;
          }
          if (this.sourceImg.length <= 0) {
            this.$toast("请上传原图");
            return false;
          }
          return true;
        },
        text: () => {
          this.afterWatermarkText = "";
          if (this.watermarkText.length <= 0) {
            this.$toast("请输入文本");
            return false;
          }
          if (this.watermarkTextSourceImg.length <= 0) {
            this.$toast("请上传原图");
            return false;
          }
          return true;
        },
      };
      const pass = validateMap[type]();
      if (!pass) return;
      this.addWatermark(type);
    },
    async addWatermark(type) {
      const t = this.$toast.loading({
        message: "图片生成中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        const formData = new FormData();
        formData.append("bwmType", type);

        if (type === "pic") {
          formData.append("watermarkPicUrl", this.isActiveImg);
          formData.append("originPicFile", this.sourceImg[0].file);
        } else {
          formData.append("watermarkText", this.watermarkText);
          formData.append("originPicFile", this.watermarkTextSourceImg[0].file);
        }

        const res = await api.aliAddWatermark(formData);
        t.clear();
        if (res.data.rspCode === "000000") {
          if (type === "pic") {
            this.afterWatermarkImg = res.data.data;
          } else {
            this.afterWatermarkText = res.data.data;
          }
        } else {
          this.$toast({
            message: res.data.rspMsg,
            duration: 5000,
          });
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
      if (file.file.size >= 3 * 1024 * 1000) {
        this[type] = [];
        Dialog.confirm({
          title: "温馨提示",
          message: '您选择的图片大于3M， 选择"确认压缩" 系统将自动压缩图片',
          confirmButtonText: "确认压缩",
          cancelButtonText: "重选图片",
        })
          .then(async () => {
            // on confirm
            const compressLoading = this.$toast.loading({
              message: "图片压缩中...",
              forbidClick: true,
              duration: 0,
            });
            const quality = 95;
            let _file = {};
            for (let i = quality; i > 0; i -= 10) {
              if (_file.size && _file.size / 1024 < 3 * 1024) {
                console.log(i);
                break;
              }
              _file = await shrinkImage(file.file, {
                quality: i,
              });
            }
            const fileReader = new FileReader();
            fileReader.readAsDataURL(_file);
            fileReader.onload = (e) => {
              compressLoading.clear();
              this[type] = [
                {
                  file: _file,
                  content: e.target.result,
                },
              ];
            };
            console.log(_file);
          })
          .catch(() => {
            // on cancel
            this[type] = [];
          });
      }
    },
  },
  computed: {},
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
  bottom: -1px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  background: #fff;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
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
.water-text-temp-wrap {
  border: 1px solid #1989fa;
  border-radius: 2px;
}
.water-text-temp-wrap .van-field__control {
  height: 24px !important;
}
</style>
