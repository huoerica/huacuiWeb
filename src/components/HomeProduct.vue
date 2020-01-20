<template>
    <el-card shadow="hover" class="home-product" :body-style="{ padding: '0' }">
        <div class="img-scale">
            <el-image :src="product.picImg">
                <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
        </div>

        <h4 class="title">{{product.productName}}</h4>
        <p class="desc">{{product.introduce}}</p>
        <p class="subscript">{{product.lastModifiedTime}}</p>
    </el-card>

</template>

<script>
    export default {
        name: "HomeProduct",
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
    .home-product{
        border: none;
        padding: 5px;
        margin-bottom: 10px;
        cursor: pointer;

        .img-scale{
            margin-bottom: 10px;
        }

        h4{
            @include link-colors();
            @include title();
        }

        .desc{
            @include description(1, 12px, 0 0 2px);
        }

        .subscript{
            @include subscript();
        }
    }
</style>
