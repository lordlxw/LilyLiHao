<!--登录页面-->
<template>
  <transition appear name="fade" @before-enter="handleBeforeEnter" @enter="handleEnter" @after-enter="handleAfterEnter">
    <div class="login-wrapper">
      <!-- <el-image
        class="logo"
        :src="require('@/assets/images/logo.png')"
      ></el-image> -->
      <h3>Lily系统</h3>

      <transition appear @before-enter="handleFormBeforeEnter" @enter="handleFormEnter">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="login-form" size="medium">
          <div class="tit">登录</div>
          <el-form-item prop="username">
            <el-input placeholder="请输入账号" prefix-icon="el-icon-user" v-model="ruleForm.username"
              @keyup.enter.native="submitForm('ruleForm')" size="medium">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="ruleForm.password" show-password
              @keyup.enter.native="submitForm('ruleForm')" size="medium">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="btn-login" @click="submitForm('ruleForm')" size="medium">进入系统</el-button>
          </el-form-item>
        </el-form>
      </transition>
      <div class="icp">
        <a href="http://beian.miit.gov.cn" target="_blank">琼ICP备2023001153号-1</a>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Velocity from 'velocity-animate'
import api from '@/api/kk_login'
import { debounce } from '@/utils/debounce'
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
  computed: {
    ...mapState({
      socketMain: (state) => state.socketMain
    })
  },
  methods: {
    ...mapMutations(["SET_SOCKET_MAIN", "SET_SOCKET_KLINE"]),
    submitForm: debounce(function (formName) {
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
                      userName: response.user.userName,
                      userId: response.user.userId,
                      roleName: response.user.roles[0].roleName,
                      menutree: response.menutree
                    })
                  }
                  this.$router.push({ path: '/trade/bonds' })
                })
              })
            } else {
              this.$message({
                message: `${response.message}`,
                type: 'error'
              })
            }
          })
        } else {
          this.$message.error('验证失败')
        }
      })
    }),
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
  mounted() {
    if (this.socketMain != null) {
      this.socketMain.close()
    }
    this["SET_SOCKET_MAIN"](null)
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.login-wrapper {
  height: 100%;
  padding-top: 100px;
  background-color: $hover-color;

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
      color: $hover-color;
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

.icp {
  text-align: center;
  margin-top: 20px;

  a {
    color: white;
  }

  a:hover {
    color: rgb(240, 238, 238);
  }
}
</style>
