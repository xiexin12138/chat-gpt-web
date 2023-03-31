<template>
  <div style="background-color:rgb(247, 248, 250)">
    <van-cell-group>
      <van-field
        v-for="(item, index) in fieldList"
        :key="index"
        v-model.trim="item.value"
        :type="item.type"
        :label="item.label"
        :placeholder="item.placeholder"
        clearable
      />
    </van-cell-group>
    <template v-if="result">
      <van-divider
        :hairline="false"
        style="margin: 32px 16px 0 16px"
        content-position="left"
        >文案内容</van-divider
      >
      <div style="margin: 16px 16px 0 16px;white-space: pre-wrap">
        {{ result }}<BlinkBlock v-show="isLoading" />
      </div>
    </template>
    <div style="padding: 20px">
      <van-button
        v-for="(btn, index) in btnList"
        :key="index"
        style="margin-top: 20px"
        :type="btn.type"
        block
        :disabled="isLoading && btn.action !== 'commit'"
        @click="commit(btn)"
      >
        {{ isLoading && btn.action === "commit" ? "⏸️ 停止加载" : btn.text }}
      </van-button>
    </div>
  </div>
</template>

<script>
import { Field, CellGroup, Button, Divider } from "vant";
import BlinkBlock from "@/components/BlinkBlock.vue";
import api from "@/api/index";
import util from "@/api/util";

export default {
  name: "BaseChat",
  components: {
    VanField: Field,
    VanCellGroup: CellGroup,
    VanButton: Button,
    VanDivider: Divider,
    BlinkBlock,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    api: {
      type: String,
      required: true,
    },
    conversationTimes: {
      type: Number,
      default: 5,
    },
    systemContent: {
      type: String,
      default: "",
    },
    templateList: {
      type: Array,
      required: true,
    },
    btnList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      result: "",
      isLoading: false,
      promptList: [],
      stopGenerated: undefined,
    };
  },
  mounted() {
    this.promptList = JSON.parse(JSON.stringify(this.templateList));
  },
  methods: {
    commit(btn) {
      let prompt = "";
      let noFillFormIndex = -1;
      switch (btn.action) {
        case "commit":
          for (let i = 0; i < this.promptList.length; i++) {
            if (
              typeof this.promptList[i] === "object" &&
              !this.promptList[i]?.value
            ) {
              noFillFormIndex = i;
              break;
            } else {
              prompt += this.promptList[i]?.value || this.promptList[i];
            }
          }
          if (noFillFormIndex > -1) {
            this.$toast(this.promptList[noFillFormIndex]?.placeholder);
          } else {
            if (this.isLoading) {
              this.isLoading = false;
              this.stopGenerated();
            } else {
              this.isLoading = true;
              let messages = [
                {
                  role: "user",
                  content: prompt,
                },
              ];
              try {
                let requestApi = api[this.api];
                let param = {
                  messages,
                  systemContent: this.systemContent,
                  resolve: (data) => {
                    this.$nextTick(() => {
                      this.result += data;
                    });
                  },
                  reject: (error) => {
                    this.isLoading = false;
                    if (error) {
                      this.result = "生成失败：" + error?.message;
                    }
                  },
                  abort: () => {
                    this.$toast("已中止请求");
                  },
                };
                this.result = "";
                this.stopGenerated = requestApi(param);
              } catch (error) {
                this.result = "生成失败：" + error?.message;
                this.isLoading = false;
              }
            }
          }
          break;
        case "copy":
          if (this.result) {
            this.$toast("文案已复制");
            util.copy(this.result);
          } else {
            this.$toast("请生成文案后复制");
          }
          break;
      }
    },
  },
  computed: {
    fieldList() {
      let list = this.promptList.filter((item) => typeof item === "object");
      return list;
    },
  },
};
</script>

<style></style>
