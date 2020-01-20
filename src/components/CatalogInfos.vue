<template>
    <div>
        <el-collapse accordion class="catalog-collapse first-collapse" v-model="selectChapter">
            <el-collapse-item v-for="(first, index) in showList" :key="index"
                              @click.native="handleCataLog(first, index)">
                <template slot="title">
                    <el-row type="flex" align="middle" class="catalog-item">
                        <el-image style="width: 30px; height: 30px" :src="first.catalogImage" fit="fit">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <div>{{first.catalogName}}</div>
                    </el-row>
                </template>
                <div>
                    <el-collapse accordion class="second-collapse" v-model="selectCatalog">
                        <el-collapse-item v-for="(second, sindex) in first.chapterInfos" :key="sindex">
                            <template slot="title">
                                <el-row type="flex" align="middle" class="catalog-item">
                                    <el-image style="width: 30px; height: 30px" :src="second.catalogImage" fit="fit">
                                        <div slot="error" class="image-slot">
                                            <i class="el-icon-picture-outline"></i>
                                        </div>
                                    </el-image>
                                    <div>{{second.catalogName}}</div>
                                </el-row>
                            </template>
                            <div>
                                <ul>
                                    <li v-for="(third, tindex) in second.courseChapterInfos" :key="tindex"
                                        @click="handleStudy(third)">
                                        {{third.chapterName}}
                                    </li>
                                </ul>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
  import {getCourseCatalog} from '@/api/course.js'

  export default {
    name: "CatalogInfos",
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      },
      chapterid: {
        type: Number,
        default() {
          return null
        }
      },
      catalogid: {
        type: Number,
        default() {
          return null
        }
      }
    },
    watch: {
      list: {
        handler(newVal) {
          this.showList = newVal
        },
        immediate: true
      }
    },
    data() {
      return {
        showList: [],
        chapterInfos: [],
        selectChapter: this.chapterid,
        selectCatalog: this.catalogid
      }
    },
    created() {
    },
    methods: {
      queryCourseCatalog(data, index) {
        getCourseCatalog(data).then(res => {
          if (res.flag) {
            let chapterInfos = res.data || []
            let data = this.showList[index]
            if (data.chapterInfos) {
              data.chapterInfos = chapterInfos
            } else {
              data['chapterInfos'] = chapterInfos
            }
            this.$set(this.showList, index, data)
          }

        })
      },
      handleCataLog(item, index) {
        this.queryCourseCatalog(item.courseId + '/' + item.id, index)
      },
      handleStudy(item) {
        this.$router.push({
          path: '/college/clouddetail',
          query: {
            chapterId: item.id
          }
        })
      }
    }
  }
</script>

<style lang="scss">
    .catalog-collapse {
        &.el-collapse {
            border: none;
        }

        .el-collapse-item {
            .el-collapse-item__header {
                height: 40px;
                line-height: 40px;
                color: #131313;
            }
        }

        & > .el-collapse-item {
            margin: 5px 0;

            & > div {
                & > .el-collapse-item__header {
                    padding: 0 10px;
                    background-color: #eaeaea;
                }

                & > .el-collapse-item__content {
                    padding: 0;
                    border: 1px solid #eaeaea;
                }
            }
        }

        .el-collapse-item__wrap,
        .el-collapse-item__header {
            border-bottom: none;
        }


        .second-collapse {
            border: none;

            .el-collapse-item {
                border-bottom: 1px solid #ececec;
            }

            .el-collapse-item__header {
                padding: 0 10px 0 20px;

                &:hover, &.is-active {
                    background-color: rgba(230, 235, 245, 0.4);
                }
            }

            .el-collapse-item__content {
                padding: 0;
            }

            ul {
                margin: 0;
                padding: 0;

                li {
                    padding: 5px 0 5px 65px;
                    margin: 5px 0;
                    transition: all 0.3s;

                    &:hover {
                        cursor: pointer;
                        color: #fe3506;
                        background-color: rgba(254, 53, 6, 0.1);
                    }
                }
            }
        }
    }
    .catalog-item {
        font-weight: 600;

        .el-image {
            line-height: 30px;
            text-align: center;
            background: $--border-color-light;
            color: $--color-text-lighter;
            margin-right: 15px;
        }
    }

</style>
