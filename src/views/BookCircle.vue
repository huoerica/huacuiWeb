<template>
    <div class="community-index">
        <div class="section">
            <div class="section-title">我的作品</div>

            <div class="section-body" v-scroll="loadMore">
                <div v-for="(community, index) in showList" :key="index">
                    <PublishItem class="list-item" :item="community" @delete="handleDelete(index)"/>
                </div>

                <LoadMore :empty="showList.length === 0" :loading="loading" :finished="isMax" @loadMore="loadMore"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {communityIndexInfo} from '@/api/community'

    export default {
        name: "BookCircle",
        components: {
            PublishItem: () => import("@/components/PublishItem"),
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
                loading: true,
                isMax: false
            }
        },
        created() {
            this.queryIndexInfo()
        },
        methods: {
            queryIndexInfo() {
                communityIndexInfo({
                    userId: this.userId,
                    page: this.page,
                    pageSize: this.pageSize,
                    type: 2
                }).then(res => {
                    let data = res.data || []

                    if (data.length < this.pageSize) {
                        this.isMax = true
                    }
                    this.loading = false
                    this.showList = this.showList.concat(data)

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
            handleCommunityDetail(communityInfoId) {
                this.$router.push({
                    path: '/community/detail',
                    query: {
                        communityInfoId
                    }
                })
            },
            handleDelete(index) {
                this.showList.splice(index, 1)
            }
        }
    }
</script>

<style scoped lang="scss">

    .community-index {
        .list-item {
            border-bottom: 1px solid $--border-color-light;

            .action-item {
                margin-left: 5px;

                .svg-icon {
                    margin-right: 3px;
                }
            }
        }
    }

</style>
