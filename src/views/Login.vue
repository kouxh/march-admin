<template>
  <div class="login_contenter">
    <div class="login_box">
      <!-- 登录表单 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        class="login_from"
        ref="loginFormRef"
        label-position="left"
      >
        <h3 class="title">元家军 后台管理系统</h3>
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
            auto-complete="off"
            placeholder="账号"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
          >
            <i slot="prefix" class="iconfont icon-mima" />
          </el-input>
        </el-form-item>
        <el-form-item prop="loginCode">
          <el-input
            v-model="loginForm.loginCode"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
          >
            <i slot="prefix" class="iconfont icon-yanzhengma" />
          </el-input>
          <div class="login-code" @click="refreshCode">
            <s-identify :identifyCode="identifyCode"></s-identify>
          </div>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px 0">
          记住我
        </el-checkbox>
        <!-- 按钮 -->
        <el-form-item>
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click="login"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { login } from "@/api/api.js";
import SIdentify from "@/components/sIdentify.vue";
import Cookies from "js-cookie";
import Config from "../config/index";
export default {
  components: { "s-identify": SIdentify },
  data() {
    return {
      identifyCode: "",
      identifyCodes: "123456789ABPLMKQ", //随便打的
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        loginCode: "",
      },
      loading: false,
      //表单验证
      loginFormRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        loginCode: [
          { required: true, trigger: "change", message: "验证码不能为空" },
        ],
      },
    };
  },
  created() {
    // 获取验证码
    this.refreshCode();
    // 获取用户名密码等Cookie
    this.getCookie();
    // token 过期提示
    this.token();
  },
  mounted() {
    const self = this;
    self.identifyCode = "";
    self.makeCode(this.identifyCodes, 4);
  },

  methods: {
    // 获取用户名密码等Cookie判断本地缓存是否有用户名密码
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");

      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
        code: "",
      };
    },
    // 登录
    login() {
      let that = this;
      let { username, password, loginCode, rememberMe } = that.loginForm;
      // 验证码转成小写 目标不区分大小写
      const identifyCode=that.identifyCode.toLowerCase();
      loginCode=loginCode.toLowerCase();
      that.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (loginCode != identifyCode) that.refreshCode();
          if (loginCode != identifyCode)
            return this.$message("验证码不一致,请重新输入");
          //是否记住密码
          if (rememberMe) {
            Cookies.set("username", username, {
              expires: Config.cookieExpires,
            });
            Cookies.set("password", password, {
              expires: Config.cookieExpires,
            });
            Cookies.set("rememberMe", rememberMe, {
              expires: Config.cookieExpires,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$api
            .login({
              account: username,
              pwd: password,
            })
            .then((res) => {
              this.loading = false;
              if (res.bool) {
                Cookies.set("token", res.data.Token, {
                  expires: Config.cookieExpires,
                });
                Cookies.set("account", res.data.account, {
                  expires: Config.cookieExpires,
                });
                this.$message.success("登录成功");
                this.$router.push("/home");
              } else {
                this.$message.error(res.errMsg);
              }
            })
            .catch(() => {
              this.loading = false;
              this.refreshCode();
            });
        } else {
          return false;
        }
      });
    },
    // 验证码处理
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    // 刷新验证码
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    // 随机生成验证码字符串
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
          this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
      }
    },
    // token 过期提示
    token() {
      const token = Cookies.get("token");
      if (token == undefined) {
        this.$notify({
          title: "提示",
          message: "当前登录状态已过期，请重新登录！",
          type: "warning",
          duration: 5000,
        });
        Cookies.remove("token");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.login_contenter {
  background-image: url(https://el-admin.xin/static/img/background.9b952c4a.jpg);
  height: 100%;
  background-size: cover;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 385px;
  height: 380px;
  background-color: #fff;
  border-radius: 6px;
  transform: translate(-50%, -50%);
}
.icon-mima {
  font-size: 14px;
  margin-left: 6px;
}
.icon-yanzhengma {
  font-size: 20px;
  margin-left: 4px;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}
.btns {
  display: flex;
  justify-content: space-around;
  margin-left: -52px;
}

.login_from {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0px 25px;
  box-sizing: border-box;
}
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  position: absolute;
  right: 0px;
  top: 0px;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
</style>
