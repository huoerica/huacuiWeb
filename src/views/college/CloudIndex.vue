<template>
    <div class="college-detail">
        <Banner :position="5">
            <div class="section">
                <div class="section-title">
                    {{course.courseName}}【简介】：
                </div>
                <div class="section-body">
                    <div v-html="htmlText(course.courseDetail)">
                    </div>
                </div>
                <div class="section-body is-center" v-if="whetherBuy">
                    <el-button style="width: 50%" type="primary" round @click="toStudy" >立即学习</el-button>
                </div>
            </div>
        </Banner>
        <template v-if="!whetherBuy">
            <div class="section">
                <template v-if="courseProductInfos">
                    <div class="section-title">
                        套餐信息
                    </div>
                    <div class="section-body">
                        <el-checkbox-group v-model="mealId" size="mini" :max="1">
                            <el-checkbox :label="item.mealId" border v-for="(item, index) in courseProductInfos"
                                         :key="index"
                                         @change="((val) => {changeMeal(val, item)})">
                                {{item.mealName}} <span class="money">{{item.productPrice | moneyFilter}}</span>
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </template>
                <el-row type="flex" align="middle" class="cloud-action">
                    收货地址：
                    <AddressDropdown :addressId.sync="purchase.userDeliveryAddressId"/>
                </el-row>
                <el-row type="flex" align="middle" class="cloud-action">
                    <el-col :span="16">
                        商品价格：<span class="money">{{course.price | moneyFilter}}</span>
                    </el-col>
                    <el-col :span="8" class="is-right">
                        <el-button round size="small" type="primary" @click="purchaseCloud">
                            立即购买
                        </el-button>
                    </el-col>
                </el-row>
            </div>

            <el-dialog title="支付" :visible.sync="dialogVisible" width="300px" custom-class="pay-dialog"
                       :close-on-click-modal="false">
                <div class="wepay-code">
                    <img v-if="payImg" :src="BASE64+payImg"/>
                    <img class="text" :src="wePayImg"/>
                </div>
            </el-dialog>
        </template>
    </div>
</template>

<script>
  import {getCourseDetail, purchaseCourse, queryOrder} from '@/api/course.js'

  export default {
    name: "CloudIndex",
    components: {
      Banner: () => import("@/components/Banner"),
      AddressDropdown: () => import("@/components/AddressDropdown")
    },
    data() {
      return {
        activeName: 'detail',
        courseId: null,
        course: {},
        courseCommentInfoList: [],
        courseProductInfos: [],
        whetherBuy: false,

        mealId: [],
        purchase: {
          courseId: null,
          mealId: null,
          payPrice: 0,
          userDeliveryAddressId: null
        },
        buyProduct: null,
        dialogVisible: false,
        payImg: '',
        payImgUrl: '',
        orderNo: '',
        wePayImg: require('@/assets/img/WePayTxt.png'),
        timer: null
      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    created() {
      this.courseId = parseInt(this.$route.query.courseId) || 1
      this.queryCourseDetail()
    },
    mounted() {
      this.purchase.courseId = this.courseId
      this.purchase.payPrice = this.course.price || 1
      this.purchase.tradeType = "NATIVE"
    },
    destroyed() {
      clearInterval(this.timer)
    },
    methods: {
      queryCourseDetail() {
        getCourseDetail(this.courseId).then(res => {
          let {courseInfo = {}, courseProductInfos = [], whetherBuy = false} = res.data
          this.course = courseInfo
          this.courseProductInfos = courseProductInfos
          this.whetherBuy = whetherBuy
        })
      },
      changeMeal(val, item) {
        if (val) {
          this.purchase.payPrice += item.productPrice
          this.purchase.mealId = item.mealId

          this.buyProduct = {
            picImg: item.picImg || item.productImg || '',
            productName: item.mealName,
            remark: item.remark,
            amount: 1,
            price: item.productPrice
          }
        } else {
          this.purchase.payPrice -= item.productPrice
          this.purchase.mealId = null

          this.buyProduct = null
        }
      },
      purchaseCloud() {
        purchaseCourse(this.purchase)
          .then(res => {
            this.payImg = res.data.qr_code_base64
            this.payImgUrl = res.data.code_url
            this.dialogVisible = true
            this.orderNo = res.data.orderNo
            if (res.data.orderNo) {
              this.getOrderStatus()
            }
          })
      },
      getOrderStatus() {
        this.$message.closeAll()
        this.timer = setInterval(() => {
          queryOrder({
            orderNo: this.orderNo
          }).then(res => {
            if (res.flag) {
              clearInterval(this.timer)
              this.$message({
                message: '支付成功',
                type: 'success',
                duration: '1500',
                onClose: () => {
                  this.dialogVisible = false
                  this.payImg = ''
                  this.queryCourseDetail()
                }
              })
            } else {
              clearInterval(this.timer)
            }
          }).catch(() => {
            clearInterval(this.timer)
          })
        }, 1000)
      },
      toStudy(){
        this.$router.push({
          path: '/college/catalog',
          query: {courseId: this.courseId}
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .college-detail {
        .hc-video {
            position: relative;
            width: 100%;
            background: #eaeaea;
            border-radius: 4px;
            height: 200px;
            margin-bottom: 15px;
            line-height: 200px;
            text-align: center;
            font-size: 60px;
            color: $--color-text-lighter;
        }

        .course-info {
            padding: 10px 15px;

            .name {
                margin: 0;
            }

            .desc {
                font-size: 12px;
                line-height: 18px;
                color: $--color-text-light;
                margin: 5px 0 0;
            }
        }

        .course-product {
            padding: 0 15px 15px;

            h4 {
                background: $--border-color-lighter;
                margin: 0 0 10px;
                padding: 5px 10px;
            }
        }

        .cloud-action {
            padding: 10px 0 20px;

            .money {
                @include price(16px, 0 10px);
            }
        }

        .course-detail {
            padding: 0 15px 30px;

            .title {
                color: $--color-text-regular;
                margin: 0 auto;
                @include title(2, 16px);
            }

            .desc {
                @include description(1, 12px);
            }

            .subscript {
                @include subscript();
            }

            .price {
                @include price();
            }

            .action {
                padding: 10px 0;
            }

            .detail-items {

                .el-tabs__header {
                    background-color: #1E1E1E;
                }
            }

            .comment-type-list {
                padding: 0;
                margin: 0 0 10px;

                li {
                    list-style: none;
                    display: inline-block;
                    padding: 4px 10px;
                    margin: 2px 5px;
                    border-radius: 20px;
                    background-color: $--border-color-lighter;
                    color: $--color-text-regular;
                    font-size: 12px;
                    cursor: pointer;

                    &.active {
                        color: $--color-primary;
                    }
                }
            }
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
