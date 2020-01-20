<template>
    <div class="load-more">
        <el-row type="flex" align="middle" justify="center" class="empty" v-if="empty && !loading">
            <div>
                <i class="el-icon-info"></i>
                <p class="">
                    <slot>抱歉！暂无内容</slot>
                </p>
            </div>
        </el-row>
        <el-divider v-else>
            <el-button loading v-if="loading">加载中</el-button>
            <div class="load-btn" v-else-if="finished">已加载全部</div>
            <el-link :underline="false" v-else @click="handleClick">点击加载更多</el-link>
        </el-divider>
    </div>
</template>

<script>
  export default {
    name: "LoadMore",
    props: {
      empty: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      finished: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleClick() {
        this.$emit('loadMore', !this.finished)
      }
    }
  }
</script>

<style scoped>
    .load-more {
        margin: 30px auto;
        text-align: center;
        width: 80%;
    }
    .load-more .el-button{
        width: 100%;
        border: none;
        border-radius: 0;
    }
    .load-more .load-btn, .load-more .el-link {
        font-size: 12px;
        padding: 10px 0;
        color: #939393;
    }

    .empty {
        text-align: center;
        min-height: 280px
    }
    .empty i{
        font-size: 80px;
        color: #cccccc;
    }
    .empty p{
        color: #939393;
    }
</style>
