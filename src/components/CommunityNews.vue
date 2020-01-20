<template>
    <el-card shadow="hover" class="community-news" :body-style="{ padding: '0' }">
        <el-row type="flex" :gutter="10" align="middle">
            <el-col class="news-img">
                <div class="img-scale">
                    <el-image :src="news.images">
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </div>
            </el-col>
            <el-col class="news-content">
                <h4 class="title">{{news.title}}</h4>
                <p class="desc" v-html="htmlText(news.content)"></p>
                <p class="read"> <i class="el-icon-view"></i> {{news.readVolume}}次阅读</p>
                <p class="subscript">{{news.createTime}}</p>
            </el-col>
        </el-row>


    </el-card>

</template>

<script>
    export default {
        name: "CommunityNews",
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
    .community-news{
        border: none;
        padding: 10px;
        margin-bottom: 10px;
        cursor: pointer;

        .news-img {
            width: 117px;
            height: 117px;
        }

        .news-content {
            width: calc(100% - 117px);
        }

        h4{
            @include link-colors();
            @include title(1);
        }

        .desc{
            @include description(2, 12px);
        }
        .read{
            @include description(1, 12px);
        }
        .subscript{
            @include subscript();
        }
    }
</style>
