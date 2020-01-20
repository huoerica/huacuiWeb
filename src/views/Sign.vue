<template>
    <div class="home">
        <Banner :position="6"/>

        <div class="section">
            <div class="section-title">
                每日签到
            </div>

            <div class="section-body">
                <el-row>
                    <el-col :xs="24" :sm="20" :md="20" :lg="18">
                        <div class="sign-days">
                            <el-button v-for="(item, index) in signDailyRewards" :key="index"
                                       disabled
                                       :type="index < day ? 'primary': 'default'">
                                <div>{{index+1}}天</div>
                                <p class="score">{{item}}积分</p>
                            </el-button>
                        </div>
                        <div class="is-center">
                            <template v-if="state === 0">
                                <el-button class="sign-btn" round type="primary"
                                           @click="handleSign">签到
                                </el-button>
                            </template>
                            <template v-else>
                                <el-button class="sign-btn" round type="info" disabled>已签到</el-button>
                            </template>

                        </div>
                    </el-col>
                </el-row>


            </div>
        </div>
        <div class="section">
            <div class="section-title">
                活动规则
            </div>
            <div class="section-body">
                <div class="rules">
                    {{rules}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {signRecordList, signRecord} from '@/api/sign.js'
  import {signRules} from '../../public/percenter.js'

  export default {
    name: "Sign",
    components: {
      Banner: () => import("@/components/Banner")
    },
    data() {
      return {
        day: 0,
        signDailyRewards: [],
        state: 0,
        list: [],
        rules: signRules
      }
    },
    created() {
      this.querySignList()
    },
    methods: {
      querySignList() {
        signRecordList().then(res => {
          if (res.flag) {
            this.day = res.data.day
            this.signDailyRewards = res.data.signDailyRewards
            this.state = res.data.state
          }
        })
      },
      handleSign() {
        // 签到状态,0今日签到，1明天签到，2已完成本轮签到
        if (this.state === 1) {
          this.$message.warning('已签到')
          return false
        }
        if (this.state === 0) {
          signRecord().then(res => {
            if (res.flag) {
              this.$message.success('签到' + res.msg)
              this.day = this.day + 1
              if (this.day === this.signDailyRewards.length) {
                this.state = 2
              } else {
                this.state = 1
              }
            } else {
              this.$message.error('签到' + res.msg)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

    .sign-days {
        display: flex;
        margin: 0 -5px 20px;
        padding: 20px 0;
        justify-content: space-between;
    }

    .sign-days .el-button {
        width: 100%;
        margin: 0 2px;
        flex: 1;
        padding: 16px 0;
        text-align: center;
        color: #ffffff;
    }

    .sign-days .el-button--default {
        background: #dedede;
    }

    .sign-days .el-button .score {
        margin: 10px 0 0;
        font-size: 12px;
    }

    .sign-btn {
        width: 60%;
        max-width: 280px;
    }

    .rules {
        font-size: 12px;
        color: #939393;
        min-height: 200px;
    }

</style>
