<template>
    <div v-scroll="loadMore">
        <ProductComment :comment="comment" v-for="(comment, index) in courseCommentInfoList" :key="index"></ProductComment>

        <LoadMore :empty="courseCommentInfoList.length === 0" :loading="loading" :finished="isMax" @loadMore="loadMore">
            暂无评价
        </LoadMore>
    </div>
</template>

<script>
  import {getCourseCommentList} from '@/api/course.js'
  export default {
    name: "CourseComment",
    components: {
      ProductComment: () => import("@/components/ProductComment"),
      LoadMore: () => import("@/components/LoadMore")
    },
    props: {
      courseId: {
        type: Number,
        default: null
      },
      chapterId: {
        type: Number,
        default: null
      },
      currPage: {
        type: Number,
        default: 1
      },
      scroll: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      currPage: {
        handler(newVal) {
          if (newVal) {
            this.queryCourseCommentList(newVal)
          }
        },
        immediate: true
      }
    },
    data () {
      return {
        courseCommentInfoList: [],
        page: this.currPage,
        loading: true,
        isMax: false
      }
    },
    methods: {
      async queryCourseCommentList(page) {
        page = page || 1
        await getCourseCommentList({
          page: page,
          pageSize: this.pageSize,
          courseId: this.courseId,
          chapterId: this.chapterId
        }).then(res => {
          this.loading = false
          let length = res.data.length || 0
          let data = res.data || []
          if (res.flag) {
            this.courseCommentInfoList = page ===1 ? data : this.courseCommentInfoList.concat(data)

            if (length < this.pageSize) {
              this.isMax = true
            } else {
              this.isMax = false
            }
          } else {
            this.isMax = false
          }
        })
      },
      loadMore() {
        if (!this.isMax && this.scroll) {
          this.page += 1
          this.queryCourseCommentList(this.page)
        }
      }
    }
  }
</script>

<style scoped>

</style>
