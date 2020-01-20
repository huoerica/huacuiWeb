<template>
    <el-row class="order-item" type="flex" :gutter="10" align="middle">
        <el-image :src="order.picImg || order.productImg">
            <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
        <el-col :span="16">
            <h4 class="title">{{order.productName}}</h4>
            <p class="desc">{{order.remark}}</p>
        </el-col>
        <el-col :span="3" class="is-center">
            <span class="desc">{{order.price | moneyFilter}}</span>
        </el-col>
        <el-col :span="3" class="is-center">
            <span class="desc">x{{order.amount || order.buyNumber || 0}}</span>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "OrderItem",
        props: {
            order: {
                type: Object,
                default () {
                    return {}
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .order-item{
        border: none;
        padding:10px 0 10px 5px;
        border-bottom: 1px solid #eaeaea;

        .el-image{
            width: 84px;
            height: 84px;
            margin-right: 5px;
        }

        h4{
            @include title(3);
        }

        .desc{
            @include description(1, 12px, 5px 0 0);
        }
    }
</style>

