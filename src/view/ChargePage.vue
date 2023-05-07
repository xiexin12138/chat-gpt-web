<template>
  <div>
    <div style="padding-top: 10px">
      <van-cell-group inset>
        <div style="margin: 15px">
          <div style="color: #b3b3b3">充值金额：</div>
          <div style="font-size: 30px; padding: 15px 0">
            <!-- <van-icon
            name="gem-o"
            color="#000"
            size="18"
            style="margin-right: 5px"
          /> -->
            <van-field
              style="width: 200px"
              v-model="value"
              type="digit"
              size="large"
              clearable
              placeholder="整数金额，最低 1 元"
            >
              <template #left-icon>
                <van-icon
                  name="gem-o"
                  color="#000"
                  size="18"
                  style="margin-right: 5px"
                />
              </template>
              <template #extra>元</template>
            </van-field>
          </div>
          <div style="color: #b3b3b3; font-size: 15px; padding-bottom: 20px">
            <!-- 估算大约还可以交流 {{ remainCharacter }} 个字的中文内容 -->
            估算大约可用 {{ character }} 个字的中文内容
          </div>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { CellGroup as VanCellGroup, Field as VanField } from "vant";
export default {
  name: "ChargePage",
  components: { VanCellGroup, VanField },
  data() {
    return {
      userInfo: {},
      value: undefined,
    };
  },
  computed: {
    character() {
      return (this.value || 0) * 1000 * 0.6 * 25;
    },
  },
};
</script>

<style></style>
