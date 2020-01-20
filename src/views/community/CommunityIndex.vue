<template>
    <div class="community-index">
        <TabsBar :activeName.sync="activeName" :list="tabsList" @click="handleTabClick"/>
        <Banner :list="bannerInfoList"/>

        <div class="section">
            <div class="section-title">
                {{activeCateName}}
            </div>

            <div class="section-body" v-scroll="loadMore">
                <template v-if="activeName === '1'">
                    <el-row :gutter="10">
                        <el-col :xs="24" :sm="24" :md="12" v-for="(news, index) in showList" :key="index">
                            <CommunityNews :news="news" @click.native="handleCommunityDetail(news.id)"/>
                        </el-col>
                    </el-row>
                </template>

                <template v-else>
                    <div v-for="(community, index) in showList" :key="index">
                        <CommunityItem :item="community" @addComment="queryIndexInfo"/>
                    </div>
                </template>


                <LoadMore :empty="showList.length === 0" :loading="loading" :finished="isMax" @loadMore="loadMore"/>
            </div>
        </div>
    </div>
</template>

<script>
  import {communityIndexInfo} from '@/api/community'

  export default {
    name: "CommunityIndex",
    components: {
      TabsBar: () => import("@/components/TabsBar"),
      Banner: () => import("@/components/Banner"),
      CommunityNews: () => import("@/components/CommunityNews"),
      CommunityItem: () => import("@/components/CommunityItem"),
      LoadMore: () => import("@/components/LoadMore")
    },
    data() {
      const tabsList = [
        {label: '新闻资讯', name: '1', icon: 'news', color: '#F75555'},
        {label: '书友圈', name: '2', icon: 'argument', color: '#FDBB32'},
        {label: '名人堂', name: '3', icon: 'fame', color: '#3058FF'}
      ];
      return {
        activeCateName: '新闻资讯',
        activeName: '1',
        tabsList: tabsList,
        bannerInfoList: [],
        showList: [],

        page: 1,
        loading: true,
        isMax: false
      }
    },
    created() {
      this.queryIndexInfo()
    },
    methods: {
      queryIndexInfo(page) {
        let pagesize = this.activeName === '1' ? this.pageSize * 2 : this.pageSize
        page = page || this.page
        this.loading = true
        communityIndexInfo({
          page: page,
          pageSize: pagesize,
          type: parseInt(this.activeName)
        }).then(res => {
          let data = res.data || []

          if(data.length < pagesize) {
            this.isMax = true
          }
          this.loading = false
          this.showList = page === 1 ? data : this.showList.concat(data)
        }).catch(() => {
          this.loading = false
        })
      },
      handleTabClick(tab) {
        if (tab.label) {
          this.activeCateName = tab.label
        }

        if (tab.name !== this.activeCateName) {
          this.page = 1
          this.isMax = false
          this.showList = []
          this.queryIndexInfo()
        }
      },
      loadMore() {
        if (!this.isMax) {
          this.page += 1
          this.queryIndexInfo()
        }
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

<style scoped lang="scss">

    .community-index {
    }

</style>
