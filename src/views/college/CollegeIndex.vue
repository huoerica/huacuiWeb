<template>
    <div class="college-index" v-scroll="loadMore">
        <Banner :position="bannerPosition">
            <div class="section">
                <div class="section-title">
                    公开课【简介】：
                </div>
                <div class="section-body">
                    {{introduce.public}}
                </div>
            </div>
        </Banner>

        <div class="section">
            <div class="section-title">
                公开课
            </div>

            <div class="section-body">
                <el-row :gutter="10">
                    <el-col :xs="12" :sm="12" :md="8" :lg="6" v-for="(course, index) in showList" :key="index">
                        <PublicCourse :course="course" @click.native="handleCourseDetail(course.id)"/>
                    </el-col>
                </el-row>
                <LoadMore :empty="showList.length === 0" :loading="loading" :finished="isMax" @loadMore="loadMore"/>
            </div>
        </div>
    </div>
</template>

<script>
  import {getCourseList} from '@/api/course'
  import collegeIntroduce from '../../../public/collegeIntroduce.js'

  export default {
    name: "CollegeIndex",
    components: {
      Banner: () => import("@/components/Banner"),
      PublicCourse: () => import("@/components/PublicCourse"),
      LoadMore: () => import("@/components/LoadMore")
    },
    data() {
      return {
        bannerPosition: 4,
        introduce: collegeIntroduce,
        page: 1,
        showList: [],
        loading: true,
        isMax: false
      }
    },
    mounted() {
      this.queryIndexInfo()
    },
    methods: {
      queryIndexInfo(page) {
        page = page || this.page || 1
        this.loading = true
        getCourseList({
          type: 1,
          pageSize: this.pageSize,
          page: page
        }).then(res => {
          this.loading = false
          let length = res.data.length || 0
          let data = res.data || []
          if (res.flag) {
            this.showList = page ===1 ? data : this.showList.concat(data)

            if (length < this.pageSize) {
              this.isMax = true
            }
          } else {
            this.isMax = false
          }
        }).catch(() => {
          this.loading = false
        })
      },
      loadMore() {
        if (!this.isMax) {
          this.page += 1
          this.queryIndexInfo()
        }
      },
      handleCourseDetail(courseId) {
        /*let path = ''
        if (this.activeName === 'cloud') {
          path = '/college/cloud'
        } else {
          path = '/college/detail'
        }*/
        this.$router.push({
          path: '/college/detail',
          query: {
            courseId
          }
        })
      }
    }

  }
</script>

<style scoped>
    .section-body {
        padding-left: 5px;
        padding-right: 5px;
    }

</style>
