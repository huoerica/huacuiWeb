<template>
    <div id="myCarts" class="section mycart">
        <div class="cart-thead">
            <el-row type="flex" align="middle" justify="center" :gutter="10">
                <el-col :xs="24" :sm="15" :md="12" class="is-center">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <span class="info">商品信息</span>
                </el-col>
                <el-col :xs="0" :sm="9" :md="12">
                    <el-row>
                        <el-col :span="8" class="is-center">单价</el-col>
                        <el-col :span="8" class="is-center">数量</el-col>
                        <el-col :span="8" class="is-right">操作</el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>

        <el-checkbox-group v-model="checkedCarts" @change="handleCheckedCartChange">
            <el-card shadow="never" class="cart-item" :body-style="{ padding: '0' }" v-for="(item, index) in list"
                     :key="index">
                <el-row class="flex-wrap" type="flex" align="middle" :gutter="20">
                    <el-col :xs="24" :sm="15" :md="12">
                        <el-row type="flex" :gutter="10" align="middle">
                            <el-checkbox :label="item.id"></el-checkbox>
                            <el-col class="product">
                                <el-image :src="item.productImg">
                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                                <div class="content">
                                    <h4 class="title">{{item.productName}}</h4>
                                    <p class="desc">{{item.remark}}</p>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :xs="24" :sm="9" :md="12">
                        <el-row class="price-num">
                            <el-col :span="8" class="is-center">
                                <span class="price">{{item.price | moneyFilter}}</span>
                            </el-col>
                            <el-col :span="8" class="is-center">
                                <el-input-number v-model="item.buyNumber" :min="1" :step="1" size="small"
                                                 @change="((currentVal, oldval) => {handleByNumChange(currentVal, oldval, item, index)})"></el-input-number>
                            </el-col>
                            <el-col :span="8" class="is-right">
                                <el-button type="primary" size="mini"
                                           @click="handleCartMinusNum(item, index, item.buyNumber, item.buyNumber)">删除
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-card>
        </el-checkbox-group>
        <el-row class="buy-row" type="flex" align="middle" justify="space-between" :style="{width: layoutWidth}">
            <div>总计：<span>{{wantBy.money | moneyFilter}}</span></div>
            <el-button type="primary" size="medium" @click="handleOrderProduct">立即购买</el-button>
        </el-row>
    </div>
</template>

<script>
  import {getProductCartList, removeProductCart, addProductCart} from '@/api/cart'

  export default {
    name: "MyCart",
    props: ['device'],
    data() {
      return {
        checkAll: false,
        checkedCarts: [],
        isIndeterminate: false,
        list: [],
        allCartIds: []
      };
    },
    computed: {
      layoutWidth() {
        return this.$store.getters.layoutWidth + 'px'
      },
      wantBy() {
        let total = {
          num: 0,
          money: 0
        }
        let list = this.list
        this.checkedCarts.map(id => {
          let one = list.find(item => item.id === parseInt(id))
          total.num += one.buyNumber
          total.money += one.buyNumber * one.price
        })
        return total
      }
    },
    created() {
      this.queryCartList()
    },
    mounted() {
    },
    methods: {
      queryCartList() {
        getProductCartList().then(res => {
          this.list = res.data || []
          this.allCartIds = this.list.map(item => {
            return item.id
          })
        })
      },
      handleCheckAllChange(val) {
        this.checkedCarts = val ? this.allCartIds : [];
        this.isIndeterminate = false;
      },
      handleCheckedCartChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.allCartIds.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.allCartIds.length;
      },
      handleByNumChange(currentValue, oldValue, cart, index) {
        let num = currentValue - (oldValue || 0)
        if (num === 0) {
          return false
        }
        if (num > 0) {
          this.handleCartAddNum(cart, index, num, oldValue)
        } else {
          this.handleCartMinusNum(cart, index, num * -1, oldValue)
        }
      },
      handleCartAddNum(cart, index, num, oldValue) {
        addProductCart({
          productId: cart.productId,
          buyNumber: num
        }).then(res => {
          if (res.flag) {
            this.$set(this.list, index, cart)
          } else {
            cart.buyNumber = oldValue
          }
        })
      },
      handleCartMinusNum(cart, index, num, oldValue) {
        removeProductCart({
          cartId: cart.id,
          num: num || 1
        }).then(res => {
          if (res.flag) {
            if (num === oldValue || cart.buyNumber === 0) {
              this.list.splice(index, 1)
            } else {
              this.$set(this.list, index, cart)
            }
          } else {
            cart.buyNumber = oldValue
          }
        })
      },
      handleOrderProduct() {
        /**
         * 下单
         * source: 下单来源：1 购物车 2 立即购买 3 云课堂
         * userAddressId: 收货地址编号
         * productCartIds: 购物车编号集合
         * productId: 购买商品编号
         * score: 使用积分
         *
         * buyNumber: 购买商品数量
         **/
        if (this.checkedCarts && this.checkedCarts.length > 0) {
          let productList = this.list.filter(item => {
            if (this.checkedCarts.includes(item.id)) {
              let {id, productImg = '', productName = '', remark = '', price, buyNumber} = item
              return {id, productImg, productName, remark, price, buyNumber}
            }
          })
          this.$store.dispatch('order/initOrder', {
            source: 1,
            productCartIds: this.checkedCarts.toString(),
            products: productList,
            totalMoney: this.wantBy.money,
            buyNumber: this.wantBy.num
          }).then(() => {
            this.$router.push({
              path: '/shopcart/settle'
            })
          })
        } else {
          this.$message({
            message: '您还未选择购买商品',
            type: 'error'
          });
        }

      }
    }
  }
</script>

<style scoped lang="scss">
    .mycart {
        .el-checkbox {
            float: left;
            color: #939393;
        }

        .cart-thead {
            background-color: #ffffff;
            color: #939393;
            padding: 10px 15px;
        }

        .cart-item {
            margin-top: 10px;
            padding: 10px 20px;
            font-size: 14px;
        }

        .product {
            &:after {
                content: '';
                display: block;
                height: 0;
                clear: both;
            }

            .el-image {
                width: 88px;
                height: 88px;
                margin: 0 10px;
                float: left;
            }

            .content {
                width: calc(100% - 108px);
                float: right;

                h4 {
                    @include title(3);
                }

                .desc {
                    @include description(1, 12px, 10px 0 0);
                }

                .subscript {
                    @include subscript();
                }
            }
        }

        .price-num {
            height: 100%;
            line-height: 30px;

            .price {
                height: 20px;
                line-height: 20px;
            }
        }
    }

    .buy-row {
        z-index: 10;
        position: fixed;
        bottom: 0;
        background-color: #fafafa;
        padding: 0 0 0 40px;
        color: $--color-text-light;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

        span {
            color: $--color-primary;
        }

        .el-button {
            border-radius: 0;
            padding: 15px 30px;
        }
    }


</style>
