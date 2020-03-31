<template>
  <div class="login-container">
    <div class="top-title"><img src="@/assets/all_images/login_title.png" alt="德生科技"></div>
    <div class="left-alt"><img src="@/assets/all_images/login_bg.png" alt="德生科技"></div>
    <div class="logo-alt"><img src="@/assets/all_images/logo.png" alt="德生科技"></div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <!--        <h3 class="title">德生数字中台管理系统</h3>-->
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入帐号"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item prop="verify">
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="17">
            <span class="svg-container">
              <svg-icon icon-class="form" />
            </span>
            <el-input
              ref="username"
              v-model="verifyCode"
              placeholder="验证码"
              name="verify"
              type="text"
              tabindex="3"
            />
          </el-col>
          <el-col :span="7">
            <div class="verify-item">
              <vue-img-verify ref="vueImgVerify" @getImgCode="getImgCode" />
            </div>
          </el-col>
        </el-row>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import SocialSign from './components/SocialSignin'
import vueImgVerify from '@/components/VueImgVerify/vue-img-verify'

import { EncryptNoIV, DecryptNoIV } from '@/utils/aesUtil.js'

export default {
  name: 'Login',
  components: { vueImgVerify },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的帐号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      verifyCode: '', // 用户输入的验证码
      imgCode: '' // 图形验证码获取的验证码
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.imgCode = this.imgCode.toLowerCase()
      this.verifyCode = this.verifyCode.toLowerCase()
      var password = EncryptNoIV(this.loginForm.password)
      var params = {
        username: this.loginForm.username,
        password: password
      }
      if (this.imgCode === this.verifyCode) {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            // 清除token
            this.$store.dispatch('user/resetToken')
            this.$store.dispatch('user/login', params)
              .then(() => {
                this.$router.push({ path: '/', query: this.otherQuery })
                this.loading = false
              })
              .catch(() => {
                this.loading = false
                this.handleClick()
              })
          } else {
            return false
          }
        })
      } else {
        this.$message.error('请输入正确的验证码！')
        this.handleClick()
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // 点击图片获取验证码
    getImgCode(code) {
      this.imgCode = code
    },
    // 点击按钮获取验证码
    handleClick() {
      this.imgCode = this.$refs.vueImgVerify.draw()
    },
    afterQRScan() {
      if (e.key === 'x-admin-oauth-code') {
        const code = getQueryObject(e.newValue)
        const codeMap = {
          wechat: 'code',
          tencent: 'code'
        }
        const type = codeMap[this.auth_type]
        const codeName = code[type]
        if (codeName) {
          this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
            this.$router.push({ path: this.redirect || '/' })
          })
        } else {
          alert('第三方登录失败')
        }
      }
    }
  }
}
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;
  $cursor_txt: #333;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $cursor_txt;
        height: 47px;
        /* caret-color: $cursor; */

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      /*background: rgba(0, 0, 0, 0.1);*/
      background: #efefef;
      border-radius: 5px;
      color: #454545;
    }

  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    overflow: hidden;
    background: url(../../assets/all_images/bg.jpg) no-repeat fixed top;
    background-size: 100% 100%;
    position: relative;

    .top-title {
      position: absolute;
      padding: 45px 70px;

      > img {
        width: auto;
        height: 75px;
      }
    }

    .left-alt {
      position: absolute;
      left: 250px;
      bottom: 110px;

      > img {
        width: auto;
        height: 620px;
      }
    }

    .logo-alt {
      position: absolute;
      right: 145px;
      bottom: 110px;

      > img {
        width: auto;
        height: 65px;
      }
    }

    .login-form {
      position: absolute;
      right: 110px;
      width: 520px;
      max-width: 100%;
      padding: 230px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media screen and (min-width: 1441px) and (max-width: 1680px) {
      .top-title {
        padding: 30px 55px;

        > img {
          width: auto;
          height: 60px;
        }
      }
      .left-alt {
        left: 220px;
        bottom: 90px;

        > img {
          width: auto;
          height: 520px;
        }
      }
      .logo-alt {
        right: 145px;
        bottom: 90px;

        > img {
          width: auto;
          height: 55px;
        }
      }
    }
    @media screen and (min-width: 1367px) and (max-width: 1440px) {
      .top-title {
        padding: 30px 50px;

        > img {
          width: auto;
          height: 52px;
        }
      }
      .left-alt {
        left: 170px;
        bottom: 90px;

        > img {
          width: auto;
          height: 500px;
        }
      }
      .logo-alt {
        right: 145px;
        bottom: 90px;

        > img {
          width: auto;
          height: 46px;
        }
      }
    }
    @media screen and (min-width: 1024px) and (max-width: 1366px) {
      .top-title {
        padding: 30px 50px;

        > img {
          width: auto;
          height: 48px;
        }
      }
      .left-alt {
        left: 160px;
        bottom: 70px;

        > img {
          width: auto;
          height: 440px;
        }
      }
      .logo-alt {
        right: 135px;
        bottom: 50px;

        > img {
          width: auto;
          height: 46px;
        }
      }
      .login-form {
        right: 100px;
        width: 500px;
        padding: 180px 35px 0;
      }
    }
    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }

    .verify-item {
      display: flex;
      align-items: center;
      height: 100%;
    }
  }
</style>
