<template>
    <div class="shop-cart">
        <div class="section">
            <div class="section-title">我的学习</div>
            <div class="section-body">
                <div v-for="(work, index) in showList" :key="index">
                    <WorkItem class="list-item" :item="work"/>
                </div>

                <LoadMore :empty="showList.length === 0" :loading="loading" :finished="isMax" @loadMore="loadMore"/>
            </div>
        </div>
    </div>
</template>

<script>

    import {getUserWorkList} from '@/api/course-work'
    export default {
        name: "MyStudy",
        components: {
            WorkItem: () => import("@/components/WorkItem"),
            LoadMore: () => import("@/components/LoadMore")
            // TabsBar: () => import("@/components/TabsBar")
        },
        data() {
            return {
                // tabsList: [
                //     {label: '我的学习', name: '/study/works'}
                //     ],
                // activeName: this.$route.path,
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

<style scoped>

</style>
