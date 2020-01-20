<template>
    <div class="studying-page">
        <el-image :src="picture">
            <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
            </div>
        </el-image>
        <!--<el-card shadow="hover" class="studying" :body-style="{ padding: '0' }" v-for="item in 9" :key="item">
            <el-row type="flex" :gutter="10" align="middle" justify="space-between">
                <el-image src="http://hc-bucket.oss-cn-shanghai.aliyuncs.com/web-h5/images20191224846da34621e3499ba4a700b49b07b3cb.png">
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
                <el-col :span="17">
                    <h4 class="title">【{{item}}月】硬笔书法打卡练习，快速变身专业小</h4>
                    <p class="desc">我的宝贝硬币书法工作室</p>
                </el-col>
                <el-col :span="4" class="is-right">
                    <p class="subscript">昨天</p>
                    <el-badge :value="item" />
                </el-col>
            </el-row>
        </el-card>-->
    </div>
</template>

<script>
    export default {
        name: "Studying",
        data() {
            return {
                picture: require('@/assets/img/study.jpg')
            }
        }
    }
</script>

<style scoped lang="scss">
    .studying{
        border: none;
        padding: 10px 10px 10px 15px;
        margin-bottom: 10px;

        .el-image{
            width: 48px;
            height: 48px;
            margin-right: 5px;
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
    }
</style>
