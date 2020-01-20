<template>
    <el-card shadow="hover" class="course-item" :body-style="{ padding: '0px' }">
        <div class="img-scale">

        </div>
        <div style="padding: 14px;">
            <span>标题</span>
            <div class="bottom clearfix">
                <time class="time"></time>
                <el-button type="text" class="button">操作按钮</el-button>
            </div>
        </div>
    </el-card>

</template>

<script>
  export default {
    name: "CourseItem"
  }
</script>

<style scoped>
    .course-item{
        cursor: pointer;
    }

</style>
