<template>
    <el-dialog title="提示" :visible="loginRegisterModal" custom-class="login-modal"
               :width="(device === 'mobile' ? '300px' : '340px')"
               :show-close="false">
        <div class="login-modal" slot="title">
            <el-link type="primary" @click="changeLoginType">{{loginType === 1 ? '登录' : '注册'}}</el-link>
            <button type="button" class="el-dialog__headerbtn" @click="closeLoginModal"><i
                    class="el-dialog__close el-icon el-icon-close"></i></button>
        </div>
        <div class="login-form">
            <h4>{{loginType === 1 ? '注册' : '登录'}}</h4>
            <el-form ref="loginForm" :model="loginForm" :rules="ruleValidate">
                <el-form-item prop="phoneNum">
                    <el-input v-model="loginForm.phoneNum" placeholder="请输入手机号"/>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input v-model="loginForm.code" placeholder="请输入短信验证码">
                        <template slot="append">
                            <el-button round size="mini" :class="{'active': sending === 2}"
                                       :disabled="sending !== 1" :loading="sending === 2"
                                       @click="handleSendSmsCode">
                                <span v-if="sending < 2">发送验证码</span>
                                <span v-else-if="sending === 2">发送中...</span>
                                <span v-if="sending === 3">{{second}}秒后重发</span>
                            </el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <template v-if="loginType === 1">
                    <el-form-item prop="inviteCode">
                        <el-input v-model="loginForm.inviteCode" placeholder="请输入邀请码"/>
                    </el-form-item>
                    <el-form-item prop="remember">
                        <el-checkbox v-model="loginForm.remember">
                            <span class="remember">我同意<span class="protocol-text" @click.stop="dialogVisible = true">《注册协议》</span>，并开始注册</span>
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item class="action">
                        <el-button type="primary" @click="handleRegister('loginForm')">注 册</el-button>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item class="action">
                        <el-button type="primary" @click="handleSubmit('loginForm')">登 录</el-button>
                    </el-form-item>
                </template>

            </el-form>
        </div>

        <el-dialog :visible.sync="dialogVisible" fullscreen lock-scroll append-to-body :modal="false">
            <el-row>
                <el-col :xs="{span: 24, offset: 0}" :sm="{span:18, offset: 3}" :md="{span: 12, offset: 6}">
                    <div class="protocol">
                        <h4>{{protocol.title}}</h4>
                        <div class="content">{{protocol.content}}</div>
                        <ul>
                            <li v-for="(first, findex) in protocol.list" :key="findex">
                                <h4>{{first.title}}</h4>
                                <div class="content">{{first.content}}</div>
                                <ul>
                                    <li v-for="(second, sindex) in first.list" :key="sindex">
                                        <h4>{{second.title}}</h4>
                                        <div class="content">{{second.content}}</div>
                                        <ul>
                                            <li v-for="(third, tindex) in second.list" :key="tindex">
                                                <p>{{third}}</p>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div class="ending">{{protocol.ending}}</div>
                        <div class="footer">{{protocol.footer}}</div>

                        <div class="dialog-footer">
                            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </el-dialog>
</template>

<script>
  import {sendSmsCodeHttp} from "@/api/user"
  import PROTOCOL from '../../public/protocol.js'

  export default {
    name: "LoginRegister",
    props: {
      type: {
        type: Number,
        default: 2
      }
    },
    computed: {
      loginRegisterModal() {
        return this.$store.getters.loginRegister
      },
      device() {
        return this.$store.getters.device
      }
    },
    data() {
      const validatePhoneChange = (rule, value, callback) => {
        if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
          this.sending = 1
          callback()
        } else {
          this.sending = 0
          callback()
        }
      }
      const validatePhoneNum = (rule, value, callback) => {
        if (value === '') {
          this.sending = 0
          callback(new Error('请输入手机号码'))
        } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
          this.sending = 0
          callback(new Error('手机号格式有误'))
        } else {
          this.sending = 1
          callback()
        }
      }
      return {
        loginType: this.type,  // 1:注册 ； 2, 登录
        sending: 0, // 0： disabled , 1: 点击， 2：发送中, 3: 倒计时
        second: 60,
        remember: false,
        loginForm: {
          phoneNum: '',
          code: '',
          inviteCode: '',
          remember: null
        },
        ruleValidate: {
          phoneNum: [
            {validator: validatePhoneChange, trigger: 'change'},
            {required: true, validator: validatePhoneNum, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
          remember: [
            {required: true, message: '请确认协议内容', trigger: 'change'}
          ]
        },
        protocol: PROTOCOL,
        dialogVisible: false
      }
    },
    watch: {
      type: {
        handler(newVal) {
          this.loginType = newVal
        },
        immediate: true
      }
    },
    methods: {
      changeLoginType() {
        this.loginType = (this.loginType === 1 ? 2 : 1)
        this.$refs.loginForm.clearValidate()
      },
      timeOut() {
        let result = setInterval(() => {
          --this.second
          if (this.second < 0) {
            clearInterval(result)
            this.sending = 1
            this.second = 60
          }
        }, 1000)
      },
      handleSendSmsCode() {
        this.$refs.loginForm.validateField('phoneNum', res => {
          if (!res) {
            this.sending = 2
            sendSmsCodeHttp({
              phoneNum: this.loginForm.phoneNum,
              type: this.loginType + ''
            }).then(res => {
              if (res.flag) {
                this.sending = 3
                this.timeOut()
              } else {
                this.$message({
                  message: '验证码发送失败',
                  type: 'error'
                })
              }
            }).catch(() => {
              this.sending = 1
            })
          }
        })
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            window.console.log(this.$route.query)
            let query = this.$route.query
            this.$store.dispatch('user/login', this.loginForm).then(() => {
              this.$refs[name].resetFields()
              if (query && query.redirect) {
                let redirect = ''
                redirect = query.redirect
                this.$router.push({path: (redirect || '/'), query: ''})
              } else {
                this.$router.push({path: '/'})
              }
            })
          }
        })
      },
      getOtherQuery(query) {
        return Object.keys(query).reduce((acc, cur) => {
          if (cur !== 'redirect') {
            acc[cur] = query[cur]
          }
          return acc
        }, {})
      },
      handleRegister(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$store.dispatch('user/register', this.loginForm).then(() => {
              this.$refs[name].resetFields()
              this.$router.push({path: '/'})
            })
          }
        })
      },
      closeLoginModal() {
        this.loginType = 2
        this.$refs.loginForm.clearValidate()
        this.$store.dispatch('app/setLoginRegister', false)
      }
    }
  }
</script>

<style scoped lang="scss">
    .protocol {
        ul {
            padding-left: 0;

            li {
                list-style: none;
                padding-left: 0;
            }
        }

        & > h4 {
            text-align: center;
            font-size: 22px;
            font-weight: 500;
            margin: 10px 0 20px;
        }

        .content {
            text-indent: 2em;
            line-height: 24px;
        }

        & > ul {
            margin-top: 20px;

            & > li {
                list-style: none;

                & > h4 {
                    margin: 10px 0;
                }

                ul {
                    & > li {
                        margin-top: 5px;

                        h4 {
                            font-weight: 500;
                        }

                        ul {
                            padding-left: 1em;
                        }
                    }
                }
            }
        }

        .ending {
            text-indent: 2em;
        }

        .footer {
            padding: 30px;
            text-align: right;
        }

        .close {
            text-align: center;

            .ivu-btn {
                width: 160px;
            }
        }

        .dialog-footer {
            text-align: center;

            .el-button {
                min-width: 120px;
            }
        }
    }

    .remember {
        font-size: 12px;
        color: #939393;
    }

    .protocol-text {
        color: $--color-primary;
    }
</style>
