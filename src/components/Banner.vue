<template>
    <div class="banner-box" id="banner">
        <el-carousel v-show="bannerList.length > 0 && percents.length > 0" :autoplay="true" class="banner-carousel"
                     :arrow="bannerList.length > 1 ? 'hover': 'never'"
                     :indicator-position="bannerList.length > 1 ? '': 'none'"
                     :height="imageHeight"
                     @change="handleCarouselChange">
            <el-carousel-item v-for="(item, index) in bannerList" :key="index" indicator-position="none">
                <div class="inner-box" :class="{'hover': item.url !== null}">
                    <el-image ref="imgHeight"
                              :src="item.picture"
                              fit="fill" @click="handleClick(item)"
                              @load="(e) =>hanldeLoad(e, index)">
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </div>
            </el-carousel-item>
        </el-carousel>
        <slot></slot>
    </div>

</template>

<script>
  import {getBannerInfo} from '@/api/file'

  export default {
    name: "Banner",
    props: {
      position: {
        type: Number,
        default: 0 // 1首页，2产品页，3商城页，4公开课，5云课堂，6签到页面
      },
      list: {
        type: Array,
        default() {
          return []
        }
      },
      path: {
        type: String,
        default: ''
      },
      query: {
        type: String,
        default: ''
      },
      introduce: {
        type: Boolean,
        default: false
      },
      action: {
        type: Boolean,
        default: false
      },
      height: {
        type: String,
        default: '200px'
      }
    },
    data() {
      return {
        bannerList: this.list || [],
        percents: [],
        boxWidth: 0,
        curIndex: 0,
        imageHeight: ''
      }
    },
    watch: {
      position: {
        handler(newVal) {
          if (newVal > 0) {
            this.queryBannerInfo()
          }
        },
        immediate: true
      },
      list: {
        handler(newVal) {
          if (newVal.length > 0) {
            this.bannerList = newVal
          }
        },
        immediate: true
      },
      boxWidth: {
        handler(newVal) {
          let percent = this.percents[this.curIndex]
          this.imageHeight = (newVal * percent) + 'px'
        },
        immediate: true
      }
    },

    computed: {
      device() {
        return this.$store.getters.device
      }
    },
    created() {
      if (this.list.length > 0 || this.position === 0) {
        this.bannerList = this.list
      }
    },
    mounted() {
      const boxEle = document.getElementById('banner');
      this.boxWidth = boxEle.clientWidth

      window.addEventListener('resize', () => {
        this.boxWidth = boxEle.clientWidth
      })
    },
    methods: {
      queryBannerInfo() {
        getBannerInfo({
          position: this.position
        }).then(res => {
          if (res.flag) {
            this.bannerList = res.data
          }
        })
      },
      handleClick(item) {
        if (item.url && item.url.length > 0) {
          window.open(item.url)
        }
        if (this.path && this.path.length > 0) {
          this.$router.push({
            path: this.path,
            query: {[this.query]: item.id || ''}
          })
        }
      },
      toPayment(product) {
        let {id, productImg = '', productName = '', remark = '', price, buyNumber} = product
        this.$store.dispatch('order/initOrder', {
          source: 1,
          productCartIds: product.id.toString(),
          products: [{id, productImg, productName, remark, price, buyNumber}],
          totalMoney: price * buyNumber
        }).then(() => {
          this.$router.push({
            path: '/shopcart/settle'
          })
        })
      },
      handleCarouselChange(index) {
        this.curIndex = index
        this.imageHeight = (this.boxWidth * this.percents[index]) + 'px'
      },
      hanldeLoad(e, index) {
        let img = e.path[0]
        let percent = img.naturalHeight / img.naturalWidth
        this.percents.splice(index, 1, percent)
      }
    }
  }
</script>

<style scoped lang="scss">
    .banner-box {
        background-color: #ffffff;
        border-radius: 4px;
    }

    .banner-carousel {
        margin-bottom: 15px;

        .el-carousel-item {
            cursor: pointer;
            position: relative;
        }

        .inner-box {
            position: relative;
            width: 100%;
            height: 100%;

            &.hover {
                cursor: pointer;
            }

            .el-image {
                height: 100%;
            }

            .item-text {
                padding: 12px 0;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, .5);

                h4 {
                    color: #ffffff;
                    @include title(1);
                }

                .desc {
                    color: #ffffff;
                    @include title(2, 12px);
                }

                .el-button {
                    margin-top: 10px
                }
            }
        }
    }
</style>
