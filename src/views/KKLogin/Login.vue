<!--登录页面-->
<template>
  <transition
    appear
    name="fade"
    @before-enter="handleBeforeEnter"
    @enter="handleEnter"
    @after-enter="handleAfterEnter"
  >
    <div class="login-wrapper">
      <!-- <el-image
        class="logo"
        :src="require('@/assets/images/logo.png')"
      ></el-image> -->
      <h3>Lily系统</h3>

      <transition
        appear
        @before-enter="handleFormBeforeEnter"
        @enter="handleFormEnter"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="login-form"
        >
          <div class="tit">登录</div>
          <el-form-item prop="username">
            <el-input
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              v-model="ruleForm.username"
              @keyup.enter.native="submitForm('ruleForm')"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              v-model="ruleForm.password"
              show-password
              @keyup.enter.native="submitForm('ruleForm')"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              class="btn-login"
              @click="submitForm('ruleForm')"
              >进入系统</el-button
            >
          </el-form-item>
        </el-form>
      </transition>
    </div>
  </transition>
</template>

<script>
import Velocity from 'velocity-animate'
import api from '@/api/kk_login'
export default {
  data() {
    return {
      show: true,
      ruleForm: {
        username: '',
        password: '',
        uuid: '',
        code: ''
      },
      rules: {
        username: [{ required: true, message: '账号必填', trigger: 'blue' }],
        password: [{ required: true, message: '密码必填', trigger: 'blue' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.login({
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            uuid: this.uuid,
            code: this.ruleForm.code
          }).then(response => {
            if (response && response.code === 200) {
              // 保存token信息
              Promise.all([
                this.$store.commit('SET_TOKEN', response.token)
              ]).then(() => {
                api.auth().then(response => {
                  if (response && response.code === 200) {
                    this.$store.commit('SET_USER_INFO', {
                      permissions: response.permissions,
                      userName: response.user.userName
                    })
                  }
                  this.$router.push({ path: '/kline' })
                })
              })
            }
          })
        } else {
          this.$message.error('验证失败')
        }
      })
    },
    handleBeforeEnter: (el) => {
      el.style.opacity = 0
    },
    handleEnter: (el, done) => {
      Velocity(el, {
        opacity: 1
      }, {
        duration: 1000,
        complete: done
      })
    },
    handleAfterEnter: (el) => {

    },
    handleFormBeforeEnter: (el) => {
      el.style.opacity = 0
      Velocity(el, {
        scale: 0.5,
        scaleX: 0.5,
        scaleY: 0.5
      })
    },
    handleFormEnter: (el, done) => {
      Velocity(el, {
        opacity: 1,
        scale: 1,
        scaleX: 1,
        scaleY: 1
      }, {
        duration: 1000,
        complete: done
      })
    }
  },
  mounted() { }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.login-wrapper {
  height: 100%;
  padding-top: 100px;
  background-color: $main-color;

  .logo {
    width: 60px;
    margin: auto;
    display: block !important;
  }

  h3 {
    font-size: 30px;
    color: white;
    text-align: center;
  }

  .login-form {
    width: 324px;
    margin: auto;
    background: white;
    padding: 10px 30px;
    box-shadow: 0 0 10px #333;

    .tit {
      color: $main-color;
      text-align: center;
      font-size: 18px;
      line-height: 60px;
    }

    .code {
      position: relative;

      .img {
        position: absolute;
        left: 175px;
        top: 0;
        cursor: pointer;
      }
    }

    .btn-login {
      margin: auto;
      display: block;
    }
  }
}
</style>
