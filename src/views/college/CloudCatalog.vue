<template>
    <div class="cloud-catalog">
        <div class="section">
            <div class="section-title">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/college/cloud' }">云课堂</el-breadcrumb-item>
                    <el-breadcrumb-item><span>目录</span></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="section-body">
                <el-row class="search-row">
                    <el-col :xs="24" :sm="8" :md="6">
                        <el-input placeholder="毛笔 硬笔书法" suffix-icon="el-icon-search"
                                  v-model="search"
                                  clearable
                                  @clear="handleClear"
                                  @keyup.enter.native="handleSearch"/>
                    </el-col>
                </el-row>
                <template v-if="search === ''">
                    <CatalogInfos :list="catalogInfos" :chapterid="chapterId" :catalogid="catalogId"/>
                </template>
                <template v-else>
                    <ul class="search-list">
                        <li v-for="(item, index) in showList" :key="index" @click="handleStudy(item.id)">{{item.chapterWord}}</li>
                    </ul>

                    <LoadMore :empty="showList.length === 0">
                        暂无“{{search}}”相关内容
                    </LoadMore>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
  import {getCourseDetail, searchCourseChapter} from '@/api/course.js'
  import LoadMore from "@/components/LoadMore";

  export default {
    name: "CloudCatalog",
    components: {
      LoadMore,
      CatalogInfos: () => import("@/components/CatalogInfos"),
    },
    computed: {
      courseId() {
        return this.$route.query.courseId
      },
      chapterId() {
        return parseInt(this.$route.query.chapterId) || null
      },
      catalogId() {
        return parseInt(this.$route.query.catalogId) || null
      }
    },
    data() {
      return {
        search: '',
        catalogInfos: [],
        showList: []
      }
    },
    methods: {
      queryCourseDetail() {
        getCourseDetail(this.courseId).then(res => {
          let {catalogInfos = {}} = res.data
          this.catalogInfos = catalogInfos
        })
      },
      handleClear() {
        this.queryCourseDetail()
      },
      handleSearch() {
        searchCourseChapter({keyWord: this.search}).then(res => {
          this.showList = res.data || []
        })
      },
      handleStudy(id) {
        this.$router.push({
          path: '/college/clouddetail',
          query: {
            chapterId: id
          }
        })
      }
    },
    created() {
      this.queryCourseDetail()
    }
  }
</script>

<style scoped lang="scss">
    .cloud-catalog {
        position: relative;

        .el-breadcrumb {
            span{
                color: $--color-text-light;
            }
        }

        .search-row {
            margin-bottom: 20px;
        }

        .search-list{
            margin: 0;
            padding: 0;

            li{
                list-style: none;
                padding: 10px;
                border-bottom: 1px solid #EAEAEA;

                &:hover{
                    color: $--color-primary;
                    cursor: pointer;
                }
            }
        }
    }
</style>
