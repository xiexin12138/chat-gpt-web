<template>
  <div class="login">
    <div class="login-top"></div>
    <van-cell-group class="panel" inset>
      <div class="panel-top">
        <div class="panel-top_title">
          智能助手 · {{ pageType === "login" ? "登陆" : "注册" }}
        </div>
        <div class="panel-top_sub-title">你工作学习的智能助手</div>
      </div>
      <van-form>
        <template>
          <!-- <template v-if="pageType === 'login'"> -->
          <van-field
            v-model="login.email"
            type="email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            autocomplete
            :rules="[{ required: true, message: '请填写邮箱' }]"
            key="login.email"
          />
          <van-field
            v-model="login.code"
            name="验证码"
            label="验证码"
            placeholder="验证码"
          >
            <!-- :rules="[{ required: true, message: '请填写验证码' }]" -->
            <template #button>
              <van-button
                ref="sendCodeBtn"
                size="small"
                type="info"
                :disabled="countDown > 0"
                @click="sendCode"
              >
                <template v-if="countDown > 0"
                  >{{ countDown }}s 后重新发送</template
                >
                <template v-else>发送验证码</template></van-button
              >
            </template></van-field
          >
          <div style="margin: 16px 26px; font-size: 14px">
            <van-checkbox
              v-model="login.isSevenLogin"
              icon-size="14px"
              shape="square"
            >
              <span style="color: #969799"> 7天内免登录 </span>
            </van-checkbox>
          </div>
          <div style="margin: 16px">
            <van-button
              round
              block
              type="info"
              native-type="submit"
              :loading="loading"
              @click="onSubmit"
              >登陆</van-button
            >
          </div>
          <!-- <div class="panel-bottom">
            <div class="clickable" @click="goto('register')">
              没有账号？注册得额度
            </div>
          </div> -->
        </template>
        <!-- <template v-else>
          <van-field
            v-model="register.email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            :rules="[{ required: true, message: '请填写邮箱' }]"
          />
          <van-field
            v-model="register.code"
            name="验证码"
            label="验证码"
            placeholder="验证码"
            :rules="[{ required: true, message: '请填写验证码' }]"
          >
            <template #button>
              <van-button size="small" type="info" @click="sendCode"
                >发送验证码</van-button
              >
            </template></van-field
          >
          <van-field
            v-model="register.password"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <van-field
            v-model="register.confirmPassword"
            type="password"
            name="确认密码"
            label="确认密码"
            placeholder="确认密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <div style="margin: 16px">
            <van-button round block type="info" native-type="submit"
              >注册</van-button
            >
          </div>
          <div class="panel-bottom">
            <div class="clickable" @click="goto('login')">已有账号？去登陆</div>
          </div>
        </template> -->
      </van-form>
    </van-cell-group>
  </div>
</template>

<script>
import {
  CellGroup as VanCellGroup,
  Form as VanForm,
  Field as VanField,
  Button as VanButton,
  Checkbox as VanCheckbox,
  // Divider as VanDivider,
} from "vant";
export default {
  name: "LoginAndRegister",
  components: {
    VanCellGroup,
    VanForm,
    VanField,
    VanButton,
    VanCheckbox,
    // VanDivider,
  },
  mounted() {
    let message = this.$route?.params?.message;
    if (message) {
      this.$toast(message);
    }
    this.countDown = Number.parseInt(localStorage.getItem("countDown")) || 0;
    if (this.countDown > 0) {
      this.timer = setInterval(() => {
        if (this.countDown > 0) {
          this.countDown--;
        } else {
          // 倒计时结束，启用按钮
          clearInterval(this.timer);
          this.$refs.sendCodeBtn.disabled = false;
          this.countDown = 0;
        }
      }, 1000);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  data() {
    return {
      login: {
        email: "",
        code: "",
        isSevenLogin: true,
      },
      register: {
        email: "",
        password: "",
        confirmPassword: "",
        code: "",
      },
      pageType: "login",
      loading: false,
      timer: null, // 定时器
      countDown: 0,
    };
  },
  methods: {
    async onSubmit() {
      let result;
      this.loading = true;
      this.$refs.sendCodeBtn.disabled = true;
      try {
        switch (this.pageType) {
          case "login":
            result = await this.$server.login({
              email: this.login.email.trim(),
              code: this.login.code,
              isSevenLogin: this.login.isSevenLogin,
            });

            if (result?.data?.code === 200 && result?.data?.data) {
              localStorage.setItem(
                this.$config.AccessTokenName,
                result?.data?.data
              );
              this.$toast("登陆成功");
              localStorage.setItem("countDown", 0);
              this.$router.push({ name: "chat" });
            } else {
              this.$toast(result?.data?.meg || "登陆异常");
            }
            break;
          // case "register":
          //   result = await this.$server.sign({
          //     email: this.register.email.trim(),
          //     password: this.register.password,
          //     code: this.register.code,
          //   });
          //   if (result?.data?.code === 200) {
          //     this.$toast("注册成功");
          //     this.login.email = this.register.email;
          //     this.register = this.$options.data().register;
          //     this.$router.push({ name: "login" });
          //   } else if (result?.data?.code) {
          //     this.$toast(result?.data?.meg);
          //   } else {
          //     this.$toast("注册失败");
          //   }
          //   break;
        }
      } catch (error) {
        this.$toast(error.message);
      }
      this.loading = false;
      this.$refs.sendCodeBtn.disabled = false;
    },
    async sendCode() {
      if (!this.login.email) {
        return this.$toast("请填写邮箱");
      }
      try {
        this.$refs.sendCodeBtn.disabled = true;
        let res = await this.$server.sendCode({
          email: this.login.email || "",
        });
        console.log(
          "🚀 ~ file: LoginAndRegister.vue:180 ~ sendCode ~ res:",
          res
        );
        if (res?.data?.code === 200) {
          this.$toast("发送成功！");
          // 禁用按钮
          this.$refs.sendCodeBtn.disabled = true;
          this.countDown = 60;
          // 开始倒计时
          this.timer = setInterval(() => {
            if (this.countDown > 0) {
              this.countDown--;
            } else {
              // 倒计时结束，启用按钮
              clearInterval(this.timer);
              this.$refs.sendCodeBtn.disabled = false;
              this.countDown = 0;
              localStorage.setItem("countDown", 0);
            }
          }, 1000);
        } else if (res?.data?.meg) {
          this.$toast(res?.data?.meg || "发送失败");
        } else {
          this.$toast(res?.data?.meg || "发送失败");
        }
      } catch (error) {
        this.$toast(error.message || "发送失败！");
      }
      this.$refs.sendCodeBtn.disabled = false;
    },
    goto(name) {
      this.$router.push({ name });
    },
  },
  watch: {
    countDown(val) {
      localStorage.setItem("countDown", val);
    },
  },
};
</script>

<style>
.login {
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-top {
  flex: 0 0 15vh;
}
.panel {
  display: flex;
  flex-direction: column;
  width: 90vw;
  max-width: 500px;
}
.panel-top {
  text-align: center;
}
.panel-top_title {
  font-size: 24px;
  padding-top: 50px;
}
.panel-top_sub-title {
  color: #7f7f7f;
  line-height: 40px;
}
.panel-bottom {
  display: flex;
  flex-direction: row;
  line-height: 40px;
  padding: 0 15px;
  color: #7f7f7f;
  font-size: 14px;
}
.clickable {
  cursor: pointer;
}
</style>
