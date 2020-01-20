<template>
    <div class="order-route" id="orders-route" v-scroll="loadMore">
        <div :style="{width: layoutWidth}">
            <TabsBar class="order-tabs" :list="tabsList" :activeName.sync="activeName" @click="handleOrderChange"/>

            <el-card class="order-card" shadow="never" v-for="(order, index) in showList" :key="index"
                     :body-style="{ padding: '0 10px' }">
                <div slot="header" class="clearfix">
                    <span class="order-no">订单号：{{order.orderNo}}</span>
                </div>
                <OrderItem v-for="product in order.productInfoResponseList" :order="product" :key="product.id"/>

                <el-row class="order-action" type="flex" align="middle" justify="space-between">
                    <div class="total"><span>合计金额：</span>{{order.totalMoney | moneyFilter}}</div>
                    <el-col :span="16" class="is-right">
                        <template v-if="activeName === '0'">
                            <!--<el-button round size="mini" type="primary" plain @click="hanldeToPayment(order)">立即购买
                            </el-button>-->
                            <!--待支付-->
                            <el-button round size="mini" plain
                                       @click="handleDeleteOrder(order.orderNo, index)">删除订单
                            </el-button>
                        </template>
                        <template v-else-if="activeName === '1' || activeName === '7' || activeName === '8'">
                            <!--待支付关闭 && 退款完成 && 已完成订单-->
                            <el-button round size="mini" plain
                                       @click="handleDeleteOrder(order.orderNo, index)">删除订单
                            </el-button>
                        </template>
                        <template v-else-if="activeName === '2' || activeName === '6'">
                            <!--已付款，待发货 && 申请退款-->
                            <el-tooltip effect="dark" content="400-004-3199" placement="top">
                                <el-link class="el-button" :underline="false" href="tel:400-004-3199">
                                    联系客服
                                </el-link>
                            </el-tooltip>
                        </template>
                        <!--<template v-else-if="activeName === '3'">
                            &lt;!&ndash;待收货&ndash;&gt;
                            <el-button round size="mini" plain>查看物流</el-button>
                            <el-button round size="mini" type="primary" plain>确定收货</el-button>
                        </template>
                        <template v-else-if="activeName === '4'">
                            &lt;!&ndash;已收货&ndash;&gt;
                            <el-button round size="mini" plain>去评价</el-button>
                            <el-button round size="mini" type="primary" plain>申请退款</el-button>
                        </template>
                        <template v-else-if="activeName === '5'">
                            &lt;!&ndash;待评价&ndash;&gt;
                            <el-button round size="mini" plain>去评价</el-button>
                        </template>-->
                    </el-col>
                </el-row>
            </el-card>

            <LoadMore :empty="showList.length === 0" :loading="loading" :finished="isMax" @loadMore="loadMore"/>
        </div>
    </div>
</template>
<!--0:待支付 1:待支付关闭 2:已付款，待发货 3:待收货 4:已收货 5:待评价 6:申请退款 7:退款完成 8:已完成订单-->
<script>
    const tabsList = [
        {label: '待支付', name: '0'},
        {label: '已取消', name: '1'},
        {label: '待发货', name: '2'},
        {label: '待收货', name: '3'},
        {label: '已收货', name: '4'},
        {label: '待评价', name: '5'},
        {label: '申请退款', name: '6'},
        {label: '退款完成', name: '7'},
        {label: '已完成订单', name: '8'}
    ]

    import {getOrderList, deleteOrder} from '@/api/orders.js'

    export default {
        name: "Orders",
        components: {
            TabsBar: () => import("@/components/TabsBar"),
            OrderItem: () => import("@/components/OrderItem"),
            LoadMore: () => import("@/components/LoadMore")
        },
        data() {
            return {
                tabsList: tabsList,
                activeName: '',
                page: 1,
                showList: [],
                loading: true,
                isMax: false
            }
        },
        computed: {
            layoutWidth() {
                return this.$store.getters.layoutWidth + 'px'
            }
        },
        created() {
            window.console.log(this.$route.params)
            const params = this.$route.params
            if (params && params.type) {
                this.activeName = params.type
            } else {
                this.activeName = '0'
            }
            this.queryOrderList()
        },
        mounted() {

        },
        methods: {
            queryOrderList(page) {
                page = page || this.page || 1
                this.loading = true
                getOrderList({
                    page: page,
                    pageSize: this.pageSize,
                    status: parseInt(this.activeName)
                }).then(res => {
                    this.loading = false
                    let length = res.data.length || 0
                    let data = res.data || []
                    if (res.flag) {
                        this.showList = page === 1 ? data : this.showList.concat(data)

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
                    this.queryOrderList()
                }
            },
            handleDeleteOrder(orderNo, index) {
                deleteOrder({
                    orderNo: orderNo
                }).then(res => {
                    if (res.flag) {
                        this.showList.splice(index, 1)
                        this.$message({
                            message: '订单取消成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: '订单取消失败',
                            type: 'error'
                        })
                    }
                })
            },
            handleOrderChange() {
                this.page = 1
                this.isMax = false
                this.queryOrderList()
            }
            /*hanldeToPayment(order) {
                window.console.log(order)
                let orderInfo = {
                  source: 2,
                  freight: order.freight,
                  totalMoney: order.totalMoney,
                  products: order.productInfoResponseList
                }
                this.$store.dispatch('order/initOrder', orderInfo).then(() => {
                  this.$router.push({
                    path: '/shopcart/settle'
                  })
                })
            }*/
        }
    }
</script>

<style scoped lang="scss">
    .order-route {
        position: relative;

        .order-action {
            padding: 10px 0;

            .el-button {
                padding: 7px 0;
                width: 70px;
            }

            .el-link {
                font-size: 12px;
                border-radius: 20px;
            }
        }

        .total {
            color: $--color-primary;

            span {
                color: $--color-text-light;
                font-size: 12px;
            }
        }
    }
</style>
