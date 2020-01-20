<template>
    <div class="home">
        <Banner :list="bannerInfoList"/>

        <div class="section">
            <div class="section-title">
                公开课
            </div>

            <div class="section-body">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="12" :md="12" v-for="(course, index) in courseInfoList" :key="index">
                        <HomeCourse :course="course" @click.native="handleCourseDetail(course.id)"/>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="section">
            <div class="section-title">
                热销商品
            </div>

            <div class="section-body">
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="8" :md="6" v-for="(product, index) in productHotList" :key="index">
                        <HomeProduct :product="product" @click.native="handleProductDetail(product.id)"/>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="section">
            <div class="section-title">
                新闻资讯
            </div>

            <div class="section-body">
                <el-row :gutter="10">
                    <el-col :xs="24" :sm="24" :md="12" v-for="(news, index) in newsList" :key="index">
                        <HomeNews :news="news" @click.native="handleCommunityDetail(news.id)"/>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
  import {getIndexInfo} from '@/api/user'

  export default {
    name: "Home",
    components: {
      Banner: () => import("@/components/Banner"),
      HomeCourse: () => import("@/components/HomeCourse"),
      HomeProduct: () => import("@/components/HomeProduct"),
      HomeNews: () => import("@/components/HomeNews")
    },
    data() {
      return {
        bannerInfoList: [],
        courseInfoList: [],
        productHotList: [],
        newsList: []
      }
    },
    created() {
      this.queryIndexInfo()
    },
    methods: {
      queryIndexInfo() {
        getIndexInfo().then(res => {
          let {
            bannerInfoList = [],
            courseInfoList = [],
            productHotList = [],
            newsList = []
          } = res.data;
          this.courseInfoList = courseInfoList
          this.productHotList = productHotList
          this.newsList = newsList
          this.bannerInfoList = bannerInfoList.map(item => {
            return {
              id: item.id,
              position: item.position,
              picture: item.picture,
              remark: item.remark,
              url: item.url,
              state: item.state,
              weight: item.weight
            }
          })
        })
      },
      handleCourseDetail(courseId) {
        this.$router.push({
          path: '/college/detail',
          query: {
            courseId
          }
        })
      },
      handleProductDetail(productId) {
        this.$router.push({
          path: '/market/detail',
          query: {
            productId
          }
        })
      },
      handleCommunityDetail(communityInfoId) {
        this.$router.push({
          path: '/community/detail',
          query: {
            communityInfoId
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
