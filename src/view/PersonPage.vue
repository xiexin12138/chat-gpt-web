<template>
  <div>
    <div style="padding-top: 10px">
      <van-cell-group inset>
        <div style="margin: 15px">
          <div style="color: #b3b3b3">账户余额</div>
          <div style="font-size: 30px; padding: 15px 0">
            <van-icon
              name="gem-o"
              color="#000"
              size="18"
              style="margin-right: 5px"
            />{{ getWalletReamin }}
          </div>
          <div style="color: #b3b3b3; font-size: 15px; padding-bottom: 20px">
            估算大约还可以交流 {{ remainCharacter }} 个字的中文内容
          </div>
          <div
            style="
              color: #b3b3b3;
              font-size: 15px;
              display: flex;
              flex-direction: column;
              gap: 3px;
            "
          >
            <div>计费规则：</div>
            <div
              style="display: flex; gap: 5px"
              v-for="(text, index) in rules"
              :key="index"
            >
              <span>- </span>
              <span>{{ text }}</span>
            </div>
          </div>
        </div>
      </van-cell-group>
      <van-cell-group style="margin-top: 15px" inset>
        <div style="margin: 15px">
          <div style="color: #b3b3b3">兑换码：（开发中）</div>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { CellGroup as VanCellGroup } from "vant";
import { mapGetters } from "vuex";
export default {
  name: "PersonPage",
  components: { VanCellGroup },
  data() {
    return {
      rules: [
        "1 个汉字消耗 0.02 点",
        "1 个英文字母消耗 0.01 点",
        "标点符号换行符等根据类型不同消耗 0.01 ~ 0.03 点",
        "根据使用经验，每 1 点余额大约可以处理 50 ~ 60 个含标点符号的中文文章",
        "计费是根据 OpenAI 的接口调用的算法，按交流的总字数计算，例如：问题有5个汉字，回答有10个汉字，最终会 15个字的消耗量，扣除 15 x 0.02 = 0.3 点",
        "开启连续对话会让你的点数消耗的更快，因为需要把前一段对话（包括问和答）也发送给 OpenAI，所以请谨慎打开，默认关闭连续对话",
      ],
    };
  },
  mounted() {},
  computed: {
    ...mapGetters(["getWalletReamin", "getRechargeToken"]),
    remainCharacter() {
      return (this.getWalletReamin * 0.6).toFixed();
    },
  },
};
</script>

<style></style>
