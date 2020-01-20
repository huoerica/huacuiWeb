<template>
    <el-card shadow="hover" class="home-news" :body-style="{ padding: '0' }">
        <el-row type="flex" :gutter="10" align="middle">
            <el-image :src="news.images">
                <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
            <el-col :span="19">
                <h4 class="title">{{news.title}}</h4>
                <p class="desc">{{news.content}}</p>
                <p class="subscript">{{news.createTime}}</p>
            </el-col>
        </el-row>
    </el-card>

</template>

<script>
    export default {
        name: "HomeNews",
        props: {
            news: {
                type: Object,
                default () {
                    return {}
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .home-news{
        border: none;
        padding: 10px 10px 10px 15px;
        margin-bottom: 10px;
        cursor: pointer;

        .el-image{
            width: 84px;
            height: 84px;
            margin-right: 5px;
        }

        h4{
            @include link-colors();
            @include title(1);
        }

        .desc{
            @include description(2, 12px);
        }

        .subscript{
            @include subscript();
        }
    }
</style>
