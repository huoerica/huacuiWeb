<template>
    <div class="work-item">
        <el-row type="flex" align="middle">
            <div class="item-img">
                <el-image :src="work.workImageUrl"
                          :preview-src-list="work.images">
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
            </div>

            <el-col class="item-content">
                <span class="subscript">作业分数：</span>{{work.workScore}}
            </el-col>
            <span class="subscript">{{work.createTime}}</span>
        </el-row>
    </div>
</template>

<script>
  export default {
    name: "WorkItem",
    props: {
      item: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    watch: {
      item: {
        handler(newVal) {
          let item = newVal
          if (item.workImageUrl) {
            item.images = item.workImageUrl.split(',') || []
            item.workImageUrl = item.images[0] || ''
          }
          this.work = item
        },
        immediate: true
      }
    },
    data() {
      return {
        work: {},
        inputContent: '',
        toggleStatus: null
      }
    }
  }
</script>

<style scoped lang="scss">
    .work-item {
        padding: 10px 0;
        background-color: #ffffff;
        border-radius: 4px;
        border-bottom: 1px solid #eaeaea;

        .item-img {
            width: 36px;
            height: 36px;
            overflow: hidden;

            .el-image {
                height: 36px;
            }
        }

        .item-content {
            width: calc(100% - 150px);
            padding-left: 10px;
        }

        .subscript {
            @include subscript();
        }
    }

</style>
