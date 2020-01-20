<template>
    <div class="college-detail">
        <div class="chapter-info">
            <el-row class="top" type="flex" justify="space-between">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/college/cloud' }">云课堂</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{path: '/college/catalog', query: {courseId: chapterInfo.courseId}}">目录</el-breadcrumb-item>
                    <el-breadcrumb-item><span>{{chapterInfo.chapterWord}}</span></el-breadcrumb-item>
                </el-breadcrumb>
                <el-link type="primary" href="#/college/train" size="mini">点位训练</el-link>
            </el-row>

            <el-row type="flex" align="middle">
                <el-col class="item-content">
                    <div class="item-img">
                        <div class="img-scale">
                            <el-image v-if="chapterInfo.chapterImage" :src="chapterInfo.chapterImage">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                            </el-image>
                        </div>
                    </div>
                    <div class="subscript">{{chapterInfo.chapterWordIntro}}</div>
                </el-col>
                <div class="other-words" v-if="chapterInfo.chapterWordFontsImages">
                    <el-select size="mini" v-model="fontSelect" placeholder="请选择">
                        <el-option
                                v-for="(item, index) in chapterInfo.chapterWordFontsImages"
                                :key="index"
                                :label="item.key"
                                :value="item.value">
                            {{item.key}}
                        </el-option>
                    </el-select>
                    <el-image :src="fontSelect">
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                    </el-image>
                </div>
            </el-row>
        </div>



        <div class="hc-video">
            <videoPlayer v-if=" playerOptions!== null"
                         ref="videoPlayer"
                         :options="playerOptions"
                         :playsinline="true"
                         @statechanged="playerStateChanged">
            </videoPlayer>
        </div>

        <div class="chapter-info">
            <h4>{{chapterInfo.chapterWord}}</h4>
            <el-row class="tool-row" type="flex" align="middle" justify="space-between">
                <span class="subscript">最近在学{{chapterInfo.learnCount}}人</span>
                <div>
                    <el-tooltip effect="dark" content="400-004-3199" placement="top">
                        <el-link :underline="false" href="tel:400-004-3199">
                            <svg-icon icon-class="service" color="#fe3506"/>
                            咨询老师
                        </el-link>
                    </el-tooltip>
                    <el-link :underline="false" @click="commentDialog = !commentDialog">
                        <svg-icon icon-class="comment" color="#fe3506"/>
                        评价
                    </el-link>
                </div>
            </el-row>
        </div>

        <div class="cloud-comment" v-show="commentDialog">
            <el-divider content-position="left">评价</el-divider>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" placeholder="请输入评价内容"
                      v-model="commentContent"/>
            <div class="images-box">
                <el-upload ref="upload" action="" multiple list-type="picture-card" :file-list="fileList"
                           accept="image/jpeg,image/gif,image/png"
                           :before-upload="(file) => hanldeBeforeUpload(file, 'comment')">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
            <div class="is-center">
                <el-button type="primary" size="small" round @click="submitComment">提交评价</el-button>
            </div>
        </div>

        <div class="section">
            <el-tabs v-model="activeName" class="detail-items">
                <el-tab-pane label="用户评价" name="comment">
                    <CourseComment ref="comments" :scroll="activeName === 'comment'" :course-id="chapterInfo.courseId"
                                   :chapterId="chapterId"/>
                </el-tab-pane>
                <el-tab-pane label="排名" name="rank" v-scroll="loadMoreRank">
                    <el-row class="rank" type="flex" align="middle" justify="space-between" v-for="(item, index) in outUserWorkRank"
                            :key="index">
                        <el-avatar :size="30" :src="item.userPhoto" fit="fill">
                            <img :src="defaultAvatar"/>
                        </el-avatar>
                        <el-col :span="10" class="user-name">{{item.userName}}</el-col>
                        <svg-icon v-show="index < 3" :icon-class="'rank' + index" size="20px" />
                        <el-col :span="12" class="is-right">
                            <span class="rank-score">第{{item.rankNo}}名</span>
                        </el-col>
                    </el-row>

                    <LoadMore :empty="outUserWorkRank.length === 0" :loading="loading" :finished="isMax" @loadMore="loadMoreRank">
                        暂无排名
                    </LoadMore>
                </el-tab-pane>
            </el-tabs>
        </div>



        <el-tooltip class="item" effect="dark" content="提交作业" placement="top">
            <el-button class="work-btn" type="primary" size="small" circle icon="el-icon-s-promotion" @click="dialogVisible = true"></el-button>
        </el-tooltip>

        <!--提交作业-->
        <el-dialog :visible.sync="dialogVisible" :close-on-press-escape="false" fullscreen custom-class="work-dialog" center><div slot="title">
                作业
            </div>
            <el-row class="work-body">
                <el-col :xs="{span: 24, offset: 0}" :sm="{span: 12, offset: 6}" :md="{span: 10, offset: 7}">
                    <div class="work-title">
                        <p>要求：至少一张图片</p>
                        <h4>{{chapterInfo.chapterWord}}硬笔书法练习训练</h4>
                    </div>
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入文字..."
                              v-model="workContent"/>
                    <el-divider></el-divider>
                    <el-upload ref="upload" action="" multiple list-type="picture-card" :file-list="workFileList"
                               accept="image/jpeg,image/gif,image/png"
                               :before-upload="(file) => hanldeBeforeUpload(file, 'work')">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button style="width: 200px" type="primary" round @click="submitMyWork">提交作业</el-button>
              </span>
        </el-dialog>

    </div>
</template>

<script>
  import {videoPlayer} from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  import '@/assets/css/video-player-custom.css'

  import {
    getCourseChapterDetail,
    submitCourseWork,
    addCourseComment,
    syncLearn,
    getUserRakingInfo
  } from '@/api/course.js'
  import {uploadSingle} from '@/api/file.js'

  export default {
    name: "CloudIndex",
    components: {
      videoPlayer,
      CourseComment: () => import("@/components/CourseComment"),
      LoadMore: () => import("@/components/LoadMore")
    },
    data() {
      return {
        chapterId: null,
        chapterInfo: {},
        outUserWorkRank: [],
        playerOptions: null,

        page: 1,
        loading: true,
        isMax: false,

        fontSelect: '',

        activeName: 'comment',
        commentDialog: false,
        commentContent: '',
        fileList: [],
        myWork: {},
        playTime: 0, // 播放时长

        dialogVisible: false,
        workContent: '',
        workFileList: []
      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    created() {
      this.chapterId = parseInt(this.$route.query.chapterId) || 1
      this.queryCourseChapterDetail()
      this.queryRankInfo()
    },
    mounted() {
    },
    methods: {
      queryRankInfo(page) {
        page = page || this.page || 1
        getUserRakingInfo({
          page: page,
          pageSize: this.pageSize
        }).then(res => {
          this.loading = false
          let length = res.data.length || 0
          let data = res.data || []
          if (res.flag) {
            this.outUserWorkRank = page ===1 ? data : this.outUserWorkRank.concat(data)

            if (length < this.pageSize) {
              this.isMax = true
            }
          } else {
            this.isMax = false
          }
        }).catch(() => {
          this.loading = false
        })
      },
      loadMoreRank () {
        if (!this.isMax && this.activeName === 'rank') {
          this.page += 1
          this.queryRankInfo()
        }
      },
      queryCourseChapterDetail() {
        getCourseChapterDetail(this.chapterId).then(async res => {
          let {chapterInfo = {}} = res.data
          let {chapterWordFontsImages = ''} = chapterInfo
          if (chapterWordFontsImages && chapterWordFontsImages.length > 0) {
            chapterWordFontsImages = JSON.parse(chapterWordFontsImages)
            let result = []
            for (let key in chapterWordFontsImages) {
              result.push({
                key: key,
                value: chapterWordFontsImages[key]
              })
            }
            chapterInfo.chapterWordFontsImages = result
            this.fontSelect = result[0].value
          }
          this.chapterInfo = chapterInfo

          this.playerOptions = {
            aspectRatio: '2:1',
            autoplay: false,
            controls: true,
            language: 'zh-CN',
            playbackRates: [0.75, 1.0, 1.5, 2.0],
            sources: [{
              type: "video/mp4",
              // mp4
              src: chapterInfo.videoLink || '',
            }]
          }
          await this.$nextTick()
        })
      },
      hanleSyncLearn(time) {
        syncLearn({
          courseId: this.chapterInfo.courseId,
          chapterId: this.chapterId,
          learnTime: time
        }).then(() => {
        })
      },
      playerStateChanged(data) {
        let {timeupdate = 0, end = false, pause = false} = data
        if (timeupdate !== 0) {
          this.playTime = timeupdate
        }
        if ((timeupdate !== 0 && timeupdate % 30 === 0) || pause || end) {
          this.hanleSyncLearn(this.playTime)
        }
      },
      hanldeBeforeUpload(file, fileCate) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        } else {
          let formData = new FormData();
          formData.append('pictureFile', file);
          uploadSingle(formData).then(res => {
            if (res.flag) {
              if (fileCate === 'comment') {
                this.fileList.push({
                  name: file.filename,
                  url: res.data
                })
              } else {
                this.workFileList.push({
                  name: file.filename,
                  url: res.data
                })
              }
            }
          })
        }
        return false
      },
      clearInputSubmit() {
        this.commentContent = ''
        this.fileList = []
      },
      submitMyWork() {
        if (this.workFileList.length < 1) {
          this.$message.error('至少上传一张图片!');
          return
        }
        let workImage = this.workFileList.map(item => {
          return item.url
        })
        let submitData = {
          chapterId: this.chapterId,
          courseId: this.chapterInfo.courseId,
          workImage: workImage.join(','),
          remark: this.workContent
        }
        submitCourseWork(submitData).then(res => {
          if (res.flag) {
            this.$alert('作业评分请前往个人中心我的学习进行查询', '作业已提交', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              showClose: false,
              showCancelButton: false,
              center: true,
              customClass: 'hc-dialog',
              callback: () => {
                this.$router.push({path: '/study'})
              }
            })
          } else {
            this.$message.error('作业提交失败');
          }
        })
      },
      submitComment() {
        if (!this.commentContent.trim()) {
          this.$message.error('请填写评价内容');
          return
        }
        let commentImages = this.fileList.map(item => {
          return item.url
        })
        let submitData = {
          chapterId: this.chapterId,
          courseId: this.chapterInfo.courseId,
          commentImages: commentImages.join(','),
          commentContent: this.commentContent
        }
        addCourseComment(submitData).then(res => {
          if (res.flag) {
            this.$message.success('评价发布成功');
            this.clearInputSubmit()
            this.commentDialog = false
            this.$refs.comments.queryCourseCommentList(1)
          } else {
            this.$message.error('评价发布失败');
          }
        }).catch(() => {
          this.clearInputSubmit()
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .college-detail {
        background-color: #ffffff;
        position: relative;

        .work-btn{
            position: fixed;
            right: 30px;
            bottom: 60px;
            padding: 5px;
            font-size: 20px;
        }

        .hc-video {
            position: relative;
            width: 100%;
            background: #ffffff;
            border-radius: 4px;
            line-height: 200px;
            text-align: center;
            font-size: 60px;
            color: $--color-text-lighter;
        }

        .chapter-info {
            padding: 10px;

            .top{
                padding: 5px 0 5px;
                border-bottom: 2px solid #EAEAEA;
                margin-bottom: 15px;
            }

            .el-breadcrumb {
                line-height: 20px;
                font-weight: 600;
                color: #131313;

                span{
                    color: $--color-text-light;
                }
            }

            .el-link{
                white-space: nowrap;
            }

            .item-img {
                width: 70px;
                height: 70px;
                overflow: hidden;
                float: left;
                margin-right: 10px;

                .el-image {
                    height: 70px;
                }
            }

            .item-content {
                width: calc(100% - 60px);
                margin-right: 10px;
                padding: 0 10px 0;
            }

            h4 {
                margin: 0 0 10px;
            }

            .subscript {
                font-size: 12px;
                color: $--color-text-light;
            }
        }

        .tool-row {
            padding: 20px 0 20px;
            border-bottom: 1px solid #efefef;

            .el-link {
                margin-left: 10px;
                color: $--color-text-light;
                font-size: 12px;

                .svg-icon {
                    margin-right: 1px;
                }
            }

            .el-button {
                min-width: 120px;
            }
        }

        .cloud-comment {
            padding: 15px 30px;

            h4 {
                margin: 0;
                padding: 0 0 10px;
                border-bottom: 1px solid #e6ebf5;
            }

            .images-box {
                padding: 10px 0;
            }

            .el-button {
                min-width: 140px;
            }
        }

        .rank {
            padding: 10px 0;

            .el-avatar {
                margin-right: 10px;
            }

            .subscript {
                @include subscript();
            }
        }

    }

    .work-body {
        .work-title{
            padding: 30px 20px;
            background: rgba(254, 53, 6, 0.1);
            margin-bottom: 10px;

            p{
                margin: 0;
                color: $--color-primary;
                font-size: 12px;
            }

            h4{
                margin: 10px 0 0 0;
                font-size: 22px;
                font-weight: 500;
            }
        }

    }

    .other-words {
        width: 70px;
        border: 1px solid #409EFF;
        border-radius: 6px;
        text-align: center;

        .el-image{
            width: 54px;
            height: 54px;
            margin: 0 auto;
        }
    }
</style>
