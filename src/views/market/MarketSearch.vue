<template>
    <div class="market-index" id="marketIndex">
        <div class="section">
            <div class="section-body">
                <el-row :gutter="10" v-scroll="loadMore">
                    <el-col :xs="12" :sm="8" :md="8" :lg="6" v-for="(product, index) in productList" :key="index">
                        <MarketProduct :product="product" @click.native="handleProductDetail(product.id)"/>
                    </el-col>
                </el-row>

                <LoadMore :empty="productList.length === 0" :loading="loading" :finished="isMax" @loadMore="loadMore">
                    暂无搜索结果
                </LoadMore>
            </div>
        </div>
    </div>
</template>

<script>
  import {productSearch} from '@/api/market'

  export default {
    name: "MarketSearch",
    components: {
      MarketProduct: () => import("@/components/MarketProduct"),
      LoadMore: () => import("@/components/LoadMore")
    },
    data() {
      return {
        page: 1,
        showList: [],
        loading: true,
        isMax: false,

        productList: []
      }
    },
    computed: {
      search () {
        return this.$store.getters.searchName
      },
      layoutWidth() {
        return this.$store.getters.layoutWidth + 'px'
      }
    },
    watch: {
      search() {
        this.querySearchInfo()
      }
    },
    created() {
      this.querySearchInfo()
    },
    methods: {
      querySearchInfo(page) {
        page = page || this.page || 1
        this.loading = true
        productSearch({
          page: page,
          pageSize: this.pageSize,
          keyword: this.search
        }).then(res => {
          this.loading = false
          let data = res.data || []
          if(data.length < this.pageSize) {
            this.isMax = true
          }
          this.productList = page === 1 ? data : this.productList.concat(data)
        }).catch(() => {
          this.loading = false
        })
      },
      loadMore() {
        if (!this.isMax) {
          this.page += 1
          this.querySearchInfo()
        }
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
