<template>
    <el-card shadow="hover" class="home-course" :body-style="{ padding: '0' }">
        <el-row type="flex" :gutter="10" align="middle">
            <el-image :src="course.courseImage">
                <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
            <el-col :span="18">
                <h4 class="title">{{course.courseName}}</h4>
                <p class="desc">{{course.courseDetail}}</p>
                <p class="subscript">{{course.lastModifiedTime}}</p>
            </el-col>
        </el-row>


    </el-card>

</template>

<script>
    export default {
        name: "HomeCourse",
        props: {
            course: {
                type: Object,
                default () {
                    return {}
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .home-course{
        border: none;
        padding: 10px 10px 10px 15px;
        margin-bottom: 10px;
        cursor: pointer;
        .el-image{
            width: 86px;
            height: 86px;
            margin-right: 5px;
        }

        h4{
            @include link-colors();
            @include title();
        }

        .desc{
            @include description(1, 12px);
        }

        .subscript{
            @include subscript();
        }
    }
</style>
