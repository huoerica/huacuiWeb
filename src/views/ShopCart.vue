<template>
    <div class="shop-cart">
        <TabsBar :activeName.sync="activeName" :list="tabsList" @click="handleTabClick"/>

        <div class="section">
            <div class="section-title">
                {{activeCateName}}
            </div>

            <div class="section-body">
                <router-view :key="activeName" :device="device"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ShopCart",
        components: {
            TabsBar: () => import("@/components/TabsBar")
        },
        data() {
            return {
                tabsList: [
                  {label: '我的购物车', name: '/shopcart/my', icon: 'shopcart', color: '#FE3506'},
                  {label: '我的订单', name: '/shopcart/orders', icon: 'order', color: '#3098FF'}
                ],
                activeName: this.$route.path
            }
        },
        computed: {
            device() {
                return this.$store.getters.device
            },
            activeCateName() {
                let tab = this.tabsList.find(item => item.name === this.activeName)
                return tab.label
            }
        },
        methods: {
            handleTabClick(tab) {
                this.activeName = tab.name
                this.$router.push({path: tab.name})
            }
        }
    }
</script>

<style scoped>

</style>
