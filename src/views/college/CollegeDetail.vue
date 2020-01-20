<template>
    <div class="college-detail">
        <videoPlayer class="hc-video"
                     ref="videoPlayer"
                     :options="playerOptions"
                     :playsinline="true">
        </videoPlayer>
        <div class="course-info">
            <h4 class="name">{{course.courseName}}</h4>
            <div class="desc">{{course.remark}}</div>
            <el-row class="tool-row" type="flex" align="middle" justify="space-between">
                <span class="subscript">最近在学{{course.readVolume}}人</span>
                <div>
                    <el-tooltip effect="dark" content="400-004-3199" placement="top">
                        <el-link :underline="false" href="tel:400-004-3199">
                            <svg-icon icon-class="service" color="#fe3506"/>
                            咨询老师
                        </el-link>
                    </el-tooltip>
                    <el-link :underline="false" @click="handleCommentToggle">
                        <svg-icon icon-class="comment" color="#fe3506"/>
                        评价
                    </el-link>
                </div>
            </el-row>
        </div>
        <div class="course-comment" v-show="commentDialog">
            <el-divider content-position="left">评价</el-divider>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入评价内容"
                      v-model="commentContent"/>
            <div class="images-box">
                <el-upload ref="upload" action="" multiple list-type="picture-card" :file-list="fileList"
                           accept="image/jpeg,image/gif,image/png"
                           :before-upload="hanldeBeforeUpload">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
            <div class="is-center">
                <el-button type="primary" size="small" round @click="submitComment">发布评价</el-button>
            </div>
        </div>
        <div class="course-detail">
            <el-tabs v-model="activeName" class="detail-items">
                <el-tab-pane label="课程详情" name="detail">
                    <div class="detail-box" v-html="htmlText(course.courseDetail)">
                    </div>
                </el-tab-pane>
                <el-tab-pane label="课程评价" name="comment">
                    <CourseComment ref="comments" :scroll="activeName === 'comment'" :course-id="courseId" :curr-page="commentPage"/>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
  import {videoPlayer} from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  import '@/assets/css/video-player-custom.css'

  import {getCourseOpenDetail, syncLearn} from '@/api/course.js'
  import {uploadSingle} from "@/api/file";
  import {addCourseComment} from "@/api/course";
  import store from "@/store";

  export default {
    name: "CollegeDetail",
    components: {
      videoPlayer,
      CourseComment: () => import("@/components/CourseComment")
    },
    data() {
      return {
        activeName: 'detail',
        courseId: null,
        course: {},
        type: 1,
        courseCommentInfoList: [],

        playerOptions: {},
        playTime: 0, // 播放时长
        commentDialog: false,
        commentContent: '',
        fileList: [],
        commentPage: 1
      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      },
      isLogined() {
        const hasToken = this.$store.getters.token
        if (hasToken) {
          return true
        } else {
          return false
        }
      }
    },
    created() {
      this.courseId = parseInt(this.$route.query.courseId) || null
      this.queryOpenCourseDetail()
    },
    mounted() {
    },
    methods: {
      queryOpenCourseDetail() {
        getCourseOpenDetail(this.courseId).then(res => {
          let {
            courseInfo = {},
            outCourseComment = []
          } = res.data
          this.course = courseInfo
          this.courseCommentInfoList = outCourseComment
          this.playerOptions = {
            aspectRatio: '2:1',
            autoplay: false,
            controls: true,
            language: 'zh-CN',
            playbackRates: [0.75, 1.0, 1.5, 2.0],
            sources: [{
              type: "video/3gp",
              // mp4
              src: courseInfo.videoLink
            },
              {
                type: "video/mp4",
                // mp4
                src: courseInfo.videoLink
              }],
            notSupportedMessage: '此视频暂无法播放，请稍后再试'
          }
        })
      },
      hanleSyncLearn(time) {
        syncLearn({
          courseId: this.courseId,
          learnTime: time
        }).then()
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
      hanldeBeforeUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        } else {
          let formData = new FormData();
          formData.append('pictureFile', file);
          uploadSingle(formData).then(res => {
            if (res.flag) {
              this.fileList.push({
                name: file.filename,
                url: res.data
              })
            }
          })
        }
        return false
      },
      handleCommentToggle() {
        if (this.isLogined) {
          this.commentDialog = !this.commentDialog
        } else {
          store.dispatch('app/setLoginRegister', true)
        }
      },
      submitComment() {
        if (!this.commentContent.trim()) {
          this.$message.error('请填写评价内容');
          return
        }
        let commentImages = this.fileList.map(item => {return item.url})
        let submitData = {
          courseId: this.courseId,
          commentImages: commentImages.join(','),
          commentContent: this.commentContent
        }
        addCourseComment(submitData).then(res => {
          if (res.flag) {
            this.$message.success('评价发布成功');
            this.commentContent = ''
            this.fileList = []
            this.commentDialog = false
            this.$refs.comments.queryCourseCommentList(1)
          } else {
            this.$message.error('评价发布失败');
          }
        }).catch(() => {
          this.commentContent = ''
          this.fileList = []
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .college-detail {
        background-color: #ffffff;

        .course-info {
            padding: 10px 15px;

            .name {
                margin: 0;
            }

            .desc {
                font-size: 12px;
                line-height: 18px;
                color: $--color-text-light;
                margin: 5px 0 0;
            }

            .subscript {
                font-size: 12px;
                color: $--color-text-light;
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
        }

        .course-detail {
            padding: 0 15px 30px;
            background-color: #ffffff;
            min-height: 200px;

            .title {
                color: $--color-text-regular;
                margin: 0 auto;
                @include title(2, 16px);
            }

            .desc {
                @include description(1, 12px);
            }

            .subscript {
                @include subscript();
            }

            .price {
                @include price();
            }

            .action {
                padding: 10px 0;
            }

            .detail-items {
                margin-top: 20px;

                .el-tabs__header {
                    background-color: #1E1E1E;
                }
            }

            .comment-type-list {
                padding: 0;
                margin: 0 0 10px;

                li {
                    list-style: none;
                    display: inline-block;
                    padding: 4px 10px;
                    margin: 2px 5px;
                    border-radius: 20px;
                    background-color: $--border-color-lighter;
                    color: $--color-text-regular;
                    font-size: 12px;
                    cursor: pointer;

                    &.active {
                        color: $--color-primary;
                    }
                }
            }
        }

        .course-comment {
            padding: 15px 30px;

            h4{
                margin: 0;
                padding: 0 0 10px;
                border-bottom: 1px solid #e6ebf5;
            }

            .images-box{
                padding: 10px 0;
            }

            .el-button{
                min-width: 140px;
            }
        }
    }
</style>
