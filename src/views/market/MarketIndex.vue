<template>
    <div class="market-index" id="marketIndex">
        <TabsBar :activeName.sync="activeName" addable :list="tabsList" @click="handleTabClick"
                 :style="{width: layoutWidth}"/>
        <Banner :position="3" />

        <div class="section">
            <div class="section-title">
                {{activeCateName}}
            </div>

            <div class="section-body">
                <el-row :gutter="10" v-scroll="loadMore">
                    <el-col :xs="12" :sm="8" :md="8" :lg="6" v-for="(product, index) in productList" :key="index">
                        <MarketProduct :product="product" @click.native="handleProductDetail(product.id)"/>
                    </el-col>
                </el-row>

                <LoadMore :empty="productList.length === 0" :loading="loading" :finished="isMax" @loadMore="loadMore"/>
            </div>
        </div>
    </div>
</template>

<script>
  import {getMallIndexInfo, getProductCategoryInfo} from '@/api/market'

  export default {
    name: "MarketIndex",
    components: {
      TabsBar: () => import("@/components/TabsBar"),
      Banner: () => import("@/components/Banner"),
      MarketProduct: () => import("@/components/MarketProduct"),
      LoadMore: () => import("@/components/LoadMore")
    },
    data() {
      return {
        tabsList: [{label: '新品', name: '', icon: 'new', color: '#FE3506'}],
        activeName: '',
        activeCateName: '新品',
        page: 1,
        showList: [],
        loading: true,
        isMax: false,

        categoryList: [],
        productList: []
      }
    },
    computed: {
      layoutWidth() {
        return this.$store.getters.layoutWidth + 'px'
      }
    },
    created() {
      this.queryIndexInfo()
      this.queryCateInfo()
    },
    mounted() {
    },
    methods: {
      queryIndexInfo() {
        getMallIndexInfo().then(async res => {
          let {
            categoryList = []
          } = res.data
          this.categoryList = categoryList.map(item => {
            return {
              label: item.name,
              name: item.id + ''
            }
          })
          await this.tabsList.push(...this.categoryList)
          // this.productList = productNewList
        })
      },
      queryCateInfo(page) {
        page = page || this.page || 1
        this.loading = true
        getProductCategoryInfo({
          page: page,
          pageSize: this.pageSize,
          productCategoryId: parseInt(this.activeName) || null
        }).then(res => {
          this.loading = false
          let productInfoResponseList = res.data.productInfoResponseList || []
          let length = productInfoResponseList.length || 0
          if(length < this.pageSize) {
            this.isMax = true
          }
          this.productList = page === 1 ? productInfoResponseList : this.productList.concat(productInfoResponseList)
        }).catch(() => {
          this.loading = false
        })
      },
      loadMore() {
        if (!this.isMax) {
          this.page += 1
          this.queryCateInfo()
        }
      },
      handleTabClick(tab) {
        this.activeCateName = tab.label
        this.page = 1
        this.productList = []
        this.isMax = false
        this.queryCateInfo()
      },
      handleProductDetail(productId) {
        this.$router.push({
          path: '/market/detail',
          query: {
            productId
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
