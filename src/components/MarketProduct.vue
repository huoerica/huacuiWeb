<template>
    <el-card shadow="hover" class="market-product" :body-style="{ padding: '0' }">
        <div class="img-scale">
            <el-image :src="product.picImg">
                <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
        </div>

        <h4 class="title">{{product.productName}}</h4>
        <p class="desc">{{product.introduce}}</p>
        <div>
            <span class="price">{{product.price | moneyFilter}}</span>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: "MarketProduct",
        props: {
            product: {
                type: Object,
                default () {
                    return {}
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .market-product{
        border: none;
        padding: 5px;
        margin-bottom: 10px;
        cursor: pointer;

        .img-scale{
            margin-bottom: 10px;
        }

        h4{
            @include link-colors();
            @include title(1);
        }

        .desc{
            @include description(1, 12px);
        }

        .subscript{
            @include subscript();
        }

        .price{
            @include price();
        }

        .price-old{
            @include priceOld();
        }
    }
</style>
