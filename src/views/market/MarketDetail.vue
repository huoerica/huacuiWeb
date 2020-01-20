<template>
    <div class="market-detail">
        <div class="product-detail">
            <el-row class="flex-wrap" type="flex" :gutter="20">
                <el-col :xs="24" :sm="6" :md="7">
                    <div class="img-scale">
                        <el-image :src="product.picImg || ''">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="18" :md="17">
                    <h4 class="title">{{product.productName}}</h4>
                    <el-divider></el-divider>
                    <div>
                        <span class="price">{{productSpecPrice.price | moneyFilter}}</span>
                    </div>
                    <div class="action">
                        <el-button type="primary" size="small"
                                   @click="handleAddCart">加入购物车
                        </el-button>
                        <el-button type="primary" size="small"
                                   @click="toPayment" plain>立即购买
                        </el-button>
                    </div>
                    <el-row class="subscript">
                        <el-col :xs="12" :sm="8">剩余 {{productSpecPrice.stock}}</el-col>
                        <el-col :xs="12" :sm="8">销量 {{productSpecPrice.salesVolume}}</el-col>
                    </el-row>
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" class="detail-items" @tab-click="handleTabClick">
                <el-tab-pane label="宝贝详情" name="detail">
                    <div class="img-scale" v-for="(item, index) in productImageList" :key="index">
                        <el-image :src="item.picImg">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="宝贝评价" name="comment">
                    <ul class="comment-type-list">
                        <li :class="{'active': commentType === 0}" @click="handleCommentTypeChange(0)">全部 <span>({{totalNum}})</span>
                        </li>
                        <li :class="{'active': commentType === 1}" @click="handleCommentTypeChange(1)">好评 <span>({{hignNum}})</span>
                        </li>
                        <li :class="{'active': commentType === 5}" @click="handleCommentTypeChange(5)">有图 <span>({{imageNum}})</span>
                        </li>
                        <li :class="{'active': commentType === 2}" @click="handleCommentTypeChange(2)">中评 <span>({{middleNum}})</span>
                        </li>
                        <li :class="{'active': commentType === 3}" @click="handleCommentTypeChange(3)">差评 <span>({{lowNum}})</span>
                        </li>
                        <li :class="{'active': commentType === 4}" @click="handleCommentTypeChange(4)">追评 <span>({{appendNum}})</span>
                        </li>
                    </ul>

                    <div class="comment-list" v-for="(comment, index) in productCommentInfoList" :key="index">
                        <ProductComment :comment="comment"></ProductComment>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
  import {getProductInfo, getProductCommentList} from '@/api/market'
  import {addProductCart} from '@/api/cart'
  import store from "@/store";

  export default {
    name: "MarketDetail",
    components: {
      ProductComment: () => import("@/components/ProductComment")
    },
    data() {
      return {
        activeName: 'detail',
        productId: null,
        product: {},
        productCommentInfoList: [],
        productImageList: [],
        productSpecPrice: {},
        commentCount: 0,

        page: 1,
        isMax: false,
        commentType: 0,
        totalNum: 0,
        appendNum: 0,
        hignNum: 0,
        imageNum: 0,
        middleNum: 0,
        lowNum: 0
      }
    },
    mounted() {
      this.productId = this.$route.query.productId || null
      this.queryProductDetail()
      this.queryProductCommentList()
      this.$nextTick()
    },
    methods: {
      queryProductDetail() {
        getProductInfo({productId: this.productId}).then(res => {
          let {
            commentCount = 0,
            product = {},
            productCommentInfoList = [],
            productImageList = [],
            productSpecPrice = {}
          } = res.data
          this.commentCount = commentCount
          this.product = product
          this.productCommentInfoList = productCommentInfoList
          this.productImageList = productImageList
          this.productSpecPrice = productSpecPrice
        })
      },
      async queryProductCommentList(page) {
        page = page || this.page
        await getProductCommentList({
          page: page,
          pageSize: this.pageSize,
          productId: this.productId,
          type: this.commentType
        }).then(res => {
          let {
            totalNum = 0,
            appendNum = 0,
            hignNum = 0,
            imageNum = 0,
            lowNum = 0,
            middleNum = 0,
            productCommentInfoList = []
          } = res.data

          this.totalNum = totalNum
          this.appendNum = appendNum
          this.hignNum = hignNum
          this.imageNum = imageNum
          this.lowNum = lowNum
          this.middleNum = middleNum
          this.productCommentInfoList = productCommentInfoList
        })
      },
      handleTabClick(tab) {
        if (tab.name === 'comment') {
          this.commentType = 0
          this.page = 1
          this.queryProductCommentList()
        }
      },
      handleCommentTypeChange(type) {
        this.commentType = type
        this.page = 1
        this.queryProductCommentList()
      },
      isLogined () {
        const hasToken = this.$store.getters.token
        if (hasToken) {
          return true
        } else {
          store.dispatch('app/setLoginRegister', true)
          return false
        }
      },
      handleAddCart() {
        if (this.isLogined()) {
          addProductCart({
            "buyNumber": 1,
            "productId": this.productId
          }).then(res => {
            if (res.flag) {
              this.$message({
                message: '已成功加入购物车',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.msg || '加入购物车失败',
                type: 'error'
              });
            }
          })
        }
      },
      toPayment() {
        if (this.isLogined()) {
          let {id, picImg = '', productName = '', remark = '', buyNumber = 1} = this.product
          let price = this.productSpecPrice.price
          this.$store.dispatch('order/initOrder', {
            source: 2,
            products: [{id, productImg: picImg, productName, remark, price, buyNumber}],
            productId: id,
            buyNumber: 1,
            totalMoney: price * buyNumber
          }).then(() => {
            this.$router.push({
              path: '/shopcart/settle'
            })
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
    .product-detail {
        background-color: #ffffff;
        padding: 15px;

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
            margin-top: 20px;

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

        .comment-list {
            min-height: 300px;
        }
    }
</style>
