<template>
    <el-card shadow="hover" class="home-course" :body-style="{ padding: '0' }">
        <div class="img-scale">
            <el-image :src="course.courseImage">
                <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>
        </div>

        <h4 class="title">{{course.courseName}}</h4>
        <p class="desc">{{course.courseDetail}}</p>
        <p class="subscript">{{course.lastModifiedTime}}</p>
    </el-card>

</template>

<script>
    export default {
        name: "Homecourse",
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
        padding: 5px;
        margin-bottom: 10px;

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
