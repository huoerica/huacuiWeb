<template>
    <div id="orderSettle" class="order-settle">
        <el-card class="order-settle-card" shadow="never" :body-style="{ padding: '0 20px' }">
            <el-row type="flex" align="middle" slot="header" class="clearfix">
                <span><svg-icon icon-class="addr" color="#FF5252" size="30"/> </span>
                <AddressDropdown :addressId.sync="userAddressId"/>
            </el-row>
            <OrderItem v-for="product in productList" :key="product.id" :order="product"/>

            <div class="pay-options">
                <el-row type="flex">
                    <span class="row-tit">支付方式： <el-checkbox class="el-checkbox_circle" :value="true"
                                                             label=""/>微信</span>
                </el-row>

                <el-row type="flex" align="middle">
                    <el-checkbox class="el-checkbox_circle" v-model="isScore" label=""/>
                    使用积分 <span class="score">共{{userScore || 0}}积分(可抵用现金{{scoreMoney | moneyFilter}}元)</span>
                </el-row>
            </div>
        </el-card>

        <div class="is-right order-summary">
            <p>商品总价： {{orderInfo.totalMoney | moneyFilter}}</p>
            <p>运费： {{orderInfo.freight | moneyFilter}}</p>
            <p>积分抵用： {{(isScore ? scoreMoney : 0.00) | moneyFilter}}</p>
        </div>
        <el-row class="buy-row" type="flex" align="middle" justify="space-between" :style="{width: layoutWidth}">
            <div>
                应付金额：<span>{{(isScore ? (orderInfo.totalMoney - scoreMoney) : orderInfo.totalMoney) | moneyFilter}}</span>
            </div>
            <el-button type="primary" size="medium" @click="handleOrder">提交订单</el-button>
        </el-row>

        <!--支付-->
        <el-dialog title="支付" :visible.sync="dialogVisible" width="300px" custom-class="pay-dialog"
                   :close-on-click-modal="false">
            <div class="wepay-code">
                <img :src="BASE64+payImg"/>
                <img class="text" :src="wePayImg"/>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {orderProduct, getOrderOne, getConversionMoney} from '@/api/orders'

  export default {
    name: "OrderSettle",
    components: {
      OrderItem: () => import("@/components/OrderItem"),
      AddressDropdown: () => import("@/components/AddressDropdown")
    },
    data() {
      return {
        userAddressId: null,
        orderInfo: this.$store.getters.orderInfo,
        label: '',
        productList: [],
        dialogVisible: false,
        payImg: '',
        orderNo: '',
        wePayImg: require('@/assets/img/WePayTxt.png'),

        isScore: false,
        userScore: this.$store.getters.userScore,
        scoreMoney: 0,
        timer: null
      }
    },
    computed: {
      layoutWidth() {
        return this.$store.getters.layoutWidth + 'px'
      }
    },
    created() {
      this.timer = null
      this.productList = this.orderInfo.products || []
      this.conversionMoney()
    },
    mounted() {
    },
    destroyed() {
      clearInterval(this.timer)
      this.$store.dispatch('order/initOrder', '').then(() => {
      })
    },
    methods: {
      conversionMoney() {
        getConversionMoney({
          score: this.userScore
        }).then(res => {
          if (res.flag) {
            this.scoreMoney = res.data || 0
          }
        })
      },
      handleOrder() {
        if (!this.userAddressId) {
          this.$message({
            message: '请选择收货地址',
            type: 'error'
          })
          return
        }
        let {source = 1, productCartIds = '', productId = null, score = 0, buyNumber = 0} = this.orderInfo
        if (this.isScore) {
          score = this.userScore
        }
        orderProduct({
          userAddressId: this.userAddressId,
          source,
          productCartIds,
          productId,
          score,
          buyNumber,
          tradeType: 'NATIVE'
        }).then(res => {
          if (res.flag) {
            this.payImg = res.data.qr_code_base64
            this.orderNo = res.data.orderNo
            this.dialogVisible = true
            if (res.data.orderNo) {
              this.getOrderStatus()
            }
          }
        })
      },
      getOrderStatus() {
        this.$message.closeAll()
        this.timer = setInterval(async () => {
          await getOrderOne({
            orderNo: this.orderNo
          }).then(res => {
            let data = res.data
            if (res.flag && data !== null) {
              if (data.isPay === 1) {
                this.$message({
                  message: '支付成功',
                  type: 'success',
                  duration: '1500',
                  onClose: () => {
                      clearInterval(this.timer)
                      this.dialogVisible = false
                    this.payImg = ''
                    this.$router.push({
                        name: 'orders',
                        params: {type: '2'}
                    })
                  }
                })
              }
            } else {
              clearInterval(this.timer)
              this.$message({
                message: res.msg,
                type: 'error',
                duration: '1500',
                onClose: () => {
                  this.dialogVisible = false
                  this.payImg = ''
                  clearInterval(this.timer)
                  this.$router.push({
                    path: '/shopcart/my'
                  })
                }
              })
            }
          }).catch(() => {
            clearInterval(this.timer)
          })
        }, 1000)
      }
    }
  }
</script>

<style scoped lang="scss">
    .el-radio-group {
        font-size: inherit;
    }

    .order-settle-card {
        border: none;
        margin-bottom: 20px;

        .svg-icon {
            margin-right: 10px;
        }

        .row-tit {
            color: #939393;
            font-size: 12px;
        }
    }

    .pay-options {
        margin-top: 15px;

        .el-row {
            padding: 15px 0;
            border-bottom: 1px solid #EAEAEA;

            .el-checkbox {
                margin-right: 5px;
                border-radius: 50%;
            }

            .score {
                margin-left: 5px;
                color: $--color-primary;
                font-size: 12px;
            }
        }
    }

    .order-summary {
        padding: 0 20px;

        p {
            margin: 0;
            padding: 5px 0;
        }
    }

    .buy-row {
        z-index: 10;
        position: fixed;
        bottom: 0;
        background-color: #fafafa;
        padding: 0 0 0 40px;
        color: $--color-text-light;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

        span {
            color: $--color-primary;
        }

        .el-button {
            border-radius: 0;
            padding: 15px 30px;
        }
    }

    .wepay-code {
        img {
            display: inherit;
            width: 100%;
            margin: 0 auto;

            &.text {
                width: 234px;
            }
        }
    }

</style>
