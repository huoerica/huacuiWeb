<template>
    <div v-scroll="loadMore">
        <div v-for="(work, index) in showList" :key="index">
            <WorkItem class="list-item" :item="work"/>
        </div>

        <LoadMore :empty="showList.length === 0" :loading="loading" :finished="isMax" @loadMore="loadMore"/>
    </div>
</template>

<script>
  import {getUserWorkList} from '@/api/course-work'
  export default {
    name: "BookCircle",
    components: {
      WorkItem: () => import("@/components/WorkItem"),
      LoadMore: () => import("@/components/LoadMore")
    },
    computed: {
      userId() {
        return this.$store.getters.userId
      }
    },
    data() {
      return {
        showList: [],
        page: 1,
        isMax: false,
        loading: true,
        empty: false
      }
    },
    created () {
      this.queryIndexInfo()
    },
    methods: {
      queryIndexInfo(page) {
        page = page || this.page
        this.loading = true
        getUserWorkList({
          page: page,
          pageSize: this.pageSize
        }).then(res => {
          this.loading = false
          if (res.flag) {
            let data = res.data || []
            this.showList = this.showList.concat(data)
            if (data.length < this.pageSize) {
              this.isMax = true
            }
          }
        }).catch(() => {
          this.loading = false
        })
      },
      loadMore() {
        if (!this.isMax) {
          this.page += 1
          this.queryIndexInfo(this.page)
        }
      }
    }
  }
</script>

<style scoped lang="scss">

    .community-index {
        .list-item{
            border-bottom: 1px solid $--border-color-light;
        }
    }

</style>
