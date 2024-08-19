<!--登录页面-->
<template>
  <transition appear name="fade" @before-enter="handleBeforeEnter" @enter="handleEnter" @after-enter="handleAfterEnter">
    <div class="login-wrapper">
      <title-bar v-if="isElectron" bgColor="#2cad98">
      </title-bar>
      <!-- <el-image
        class="logo"
        :src="require('@/assets/images/logo.png')"
      ></el-image> -->
      <div class="login-body">
        <div class="login-title">Lily{{ labelPosition == 'lily' ? '管理' : '模拟' }}系统</div>
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
              <el-radio-group v-model="labelPosition" size="small">
                <el-radio-button label="lily">管理</el-radio-button>
                <el-radio-button label="Simulation">模拟</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" class="btn-login" @click="submitForm('ruleForm')" size="medium">进入系统</el-button>
            </el-form-item>
          </el-form>
        </transition>
        <div class="icp" v-if="!isElectron">
          <a href="http://beian.miit.gov.cn" target="_blank">琼ICP备2023001153号-1</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Velocity from 'velocity-animate'
import api from '@/api/kk_login'
import { debounce } from '@/utils/debounce'
import configUtil from '@/utils/config.js'
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
      },
      labelPosition: 'Simulation',
      isElectron: false
    }
  },
  computed: {
    ...mapState({
      socketMain: (state) => state.socketMain
    })
  },
  created() {
    if (window.v1) {
      this.isElectron = window.v1.isElectron();
    }
    this.labelPosition = this.$appType === 'cli' ? 'Simulation' : 'lily';
  },
  methods: {
    ...mapMutations(["SET_SOCKET_MAIN", "SET_SOCKET_KLINE"]),
    submitForm: debounce(function (formName) {
      const { mac } = this.isElectron ? window.v1.getNetwork() : { mac: 'cc:5e:f8:f0:5f:85' }
      console.log("mac:", mac);
      const hwinfo = this.$md5(mac.replace(/:/g, ""))
      console.log("mac info:", hwinfo);
      console.log("mac + username info:", this.$md5(hwinfo + this.ruleForm.username));
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.login({
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            uuid: this.uuid,
            code: this.ruleForm.code,
            hwinfo: hwinfo
          }, this.labelPosition === 'Simulation' ? 'BondHelper' : '', this.labelPosition === 'Simulation' ? 'sim' : 'admin').then(response => {
            if (response && response.code === 200) {
              // 保存token信息
              Promise.all([
                this.$store.commit('SET_TOKEN', response.token)
              ]).then(() => {
                api.auth().then(async response => {
                  if (response && response.code === 200) {
                    const { value: brokers } = await api.chatReceiver()
                    this.$store.commit('SET_USER_INFO', {
                      permissions: response.permissions,
                      userName: response.user.userName,
                      userId: response.user.userId,
                      roleName: response.user.roles[0].roleName,
                      menutree: response.menutree,
                      brokers: brokers,
                      ...response.user
                    })
                  }
                  let $path = '/simulation/main';
                  if (this.labelPosition === 'lily') {
                    $path = '/dashboard'
                  }

                  if (this.isElectron) {
                    const displays = await window.v1.getAllDisplays();
                    this.$store.commit('SET_WIN_INFO', {
                      displays
                    })
                    if (this.labelPosition === 'lily') {
                      const maxWidth = Math.max(...displays.map(display => display.bounds.width));
                      const minWidth = Math.ceil(maxWidth * 0.7);
                      const minHeight = Math.ceil(minWidth * 0.6);
                      const args = {
                        width: minWidth, // 窗口宽度
                        height: minHeight, // 窗口高度
                        isMainWin: true,
                        resize: true, // 是否支持缩放
                        maximize: false, // 最大化窗口
                        isMultiWin: true, // 是否支持多开窗口
                        route: $path
                      }

                      console.log(args)
                      window.v1.createWin(args).then((response) => {
                        window.v1.close();
                      }).catch((error) => {
                        // 处理错误
                        console.error(error);
                      });
                    } else {
                      const { code, value, message } = await api.getProfile(response.user.userId)
                      if (code !== '00000') {
                        return this.$message({
                          message: `${message}`,
                          type: 'error'
                        })
                      }
                      const klineWins = value && value.wins ? JSON.parse(value.wins) : [];
                      if (klineWins.length > 0 && this.labelPosition !== 'lily') {
                        klineWins.forEach((args, index) => {
                          window.v1.createWin(args).then((response) => {
                            console.log('args: ', response, args);
                          }).catch((error) => {
                            // 处理错误
                            console.error(error);
                          });
                        });
                        window.v1.close();
                      } else {
                        const maxWidth = Math.max(...displays.map(display => display.bounds.width));
                        const minWidth = Math.ceil(maxWidth / 2 + 100);
                        const minHeight = Math.ceil(minWidth * 0.63);

                        // const maxWidth = Math.max(...displays.map(display => display.bounds.width));
                        // const minWidth = Math.ceil(maxWidth * 0.7);
                        // const minHeight = Math.ceil(minWidth * 0.6);
                        const args = {
                          width: minWidth, // 窗口宽度
                          height: minHeight, // 窗口高度
                          minWidth: minWidth, // 窗口最小宽度
                          maxWidth: minWidth,
                          isMainWin: true,
                          resize: true, // 是否支持缩放
                          maximize: false, // 最大化窗口
                          isMultiWin: true, // 是否支持多开窗口
                          route: $path
                        }

                        console.log(args)
                        window.v1.createWin(args).then((response) => {
                          window.v1.close();
                        }).catch((error) => {
                          // 处理错误
                          console.error(error);
                        });
                      }
                    }
                  } else {
                    this.$router.push({ path: $path })
                  }
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
  async mounted() {
    if (!this.isElectron) {
      if (localStorage.getItem(configUtil.keys.tokenKey) && localStorage.getItem(configUtil.keys.tokenKey) !== 'null') {
        const { code } = await api.verifyToken(localStorage.getItem(configUtil.keys.tokenKey))
        if (code === '00000') {
          this.$router.push({ path: '/trade/bonds' })
        }
      } else {
        if (this.socketMain != null) {
          this.socketMain.close()
        }
        this["SET_SOCKET_MAIN"](null)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.login-wrapper {
  height: 100%;
  background: $background-style;

  .login-body {
    position: absolute;
    top: 45%;
    transform: translateY(-50%);
    /* 如需水平居中，还需添加以下属性 */
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .login-title-e {
    text-align: left;
    font-size: 18px;
    color: white;
    line-height: 40px;
    margin-left: 10px;
  }

  .login-title {
    text-align: center;
    font-size: 26px;
    color: white;
    font-weight: bold;
    line-height: 60px;
  }

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
    border-radius: 5px;
    background: white;
    padding: 10px 30px;
    box-shadow: 0 0 10px #333;

    .tit {
      color: $body-btn-hover;
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
