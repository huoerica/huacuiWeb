<template>
    <div class="community-detail">
        <div class="detail-title">
            <h4>{{community.title}}</h4>
            <!--<el-row class="flex-wrap" type="flex" align="middle">
                <el-avatar :size="24" :src="community.headPortrait">
                    <img :src="defaultAvatar"/>
                </el-avatar>
                <div>
                    <span v-show="community.nickName" class="item">{{community.nickName || ''}}</span>
                    <span class="item"><i class="el-icon-time" color="#939393" size="12px"/>{{community.createTime | parseTime}}</span>
                    <span v-show="community.readVolume" class="item"><svg-icon class="icon" icon-class="look"
                                                                               color="#939393"/>{{community.readVolume || 0}}</span>
                    <span v-show="community.totalShare" class="item"><svg-icon class="icon" icon-class="share"
                                                                               color="#939393"/>{{community.totalShare || 0}}</span>
                </div>
            </el-row>-->
        </div>
        <div class="detail-content">
            <el-image v-for="(item, index) in detailImages" :key="index"
                      :src="item" fit="fill">
                <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                </div>
            </el-image>

            <div v-html="htmlText(community.content)">
            </div>

            <el-row type="flex" align="middle" justify="end" class="detail-counter">
                <el-link class="item" :underline="false">
                    <svg-icon icon-class="comment" color="#fe3506"/>
                    评论({{community.totalComment}})
                </el-link>
                <el-link class="item" :underline="false" @click="addCommunityInterest">
                    <svg-icon icon-class="thumbsup" :color="community.isLike ? '#FE3506' : ''"/>
                    {{(community.isLike ? '取消' : '') + '点赞'}}({{community.totalLike}})
                </el-link>
            </el-row>

            <el-divider content-position="left">评论</el-divider>

            <div class="comment-box">
                <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="评论内容"
                        v-model="commentText">
                </el-input>
                <el-button type="primary" size="small" @click="subimitComment">评论</el-button>
            </div>

            <ul v-if="community.outCommunityCommentDetails && community.outCommunityCommentDetails.length">
                <li v-for="(item, index) in community.outCommunityCommentDetails" :key="index">
                    <el-avatar :size="30" :src="item.headPortrait">
                        <img :src="defaultAvatar"/>
                    </el-avatar>
                    <div class="inner">
                        <div>
                            <span class="user-name">{{item.nickName}}</span>
                            <span class="time">{{item.createTime | parseTime}}</span>
                        </div>
                        <p>{{item.commentContent}}</p>
                    </div>
                </li>
            </ul>
        </div>

    </div>
</template>

<script>
  import {communityDetail, addCommentDetail, communityInterest, getCommentDetail} from '@/api/community'
  import store from "@/store";

  export default {
    name: "CommunityDetail",
    data() {
      return {
        detailImages: [],
        community: {},
        communityInfoId: null,
        commentText: ''
      }
    },
    created() {
      this.queryDetail()
    },
    mounted() {
    },
    methods: {
      queryDetail() {
        this.communityInfoId = parseInt(this.$route.query.communityInfoId) || null
        communityDetail(this.communityInfoId).then(res => {
          if (res.flag) {
            let data = res.data
            this.community = data
            if (data.images) {
              this.detailImages = data.images.split(',')
            }
          }

        })
      },
      queryCommentDetail() {
        getCommentDetail({
          communityInfoId: this.communityInfoId
        }).then(res => {
          this.community.outCommunityCommentDetails = res.data || []
        })
      },
      isLogined() {
        const hasToken = this.$store.getters.token
        if (hasToken) {
          return true
        } else {
          store.dispatch('app/setLoginRegister', true)
          return false
        }
      },
      subimitComment() {
        if (!this.commentText && !this.isLogined()) {
          return
        }
        addCommentDetail({
          commentContent: this.commentText,
          communityInfoId: this.communityInfoId
        }).then(res => {
          if (res.flag) {
            this.commentText = ''
            this.queryCommentDetail()
          }
        })
      },
      addCommunityInterest() {
          if (!this.isLogined()) {
              return false
          }
          let submitData = {
              communityInfoId: this.community.id,
              type: 1
          }
          if (this.community.isLike) {
              submitData['isCancel'] = 0
          }
          communityInterest(submitData).then(res => {
              if (res.flag) {
                  this.$message({
                      message: this.community.isLike ? '已取消' : '已点赞',
                      type: 'success',
                      duration: 1000
                  });
                  this.$emit('addInterest', res.data)
                  this.community.isLike = !this.community.isLike
                  if (this.community.isLike) {
                      this.community.totalLike += 1
                  } else {
                      this.community.totalLike -= 1
                  }
              }
          })
      }
    }
  }
</script>

<style scoped lang="scss">
    .community-detail {
        background: #ffffff;
        padding: 0 15px 40px;

        .detail-title {
            border-bottom: 1px solid #eaeaea;
            padding: 10px 0;

            h4 {
                margin: 0;
                padding: 10px 0;
                font-weight: 500;
                font-size: 26px;
                line-height: 36px;
            }
        }

        .detail-content {
            padding: 15px 0;

            .el-image {
                margin-bottom: 5px;
            }
        }

        .item {
            display: inline-block;
            padding: 0 10px;
            font-size: 12px;

            .icon {
                margin-right: 0;
            }
        }

        .detail-counter {
            padding: 20px 0;
            text-align: right;

            .item {
                line-height: 20px;
                color: $--color-text-light;
                font-size: 12px;

                .icon {
                    float: left;
                    margin-right: 6px;
                    cursor: pointer;
                }
            }
        }

        ul {
            padding: 0;
            margin: 15px 0 0;

            li {
                list-style: none;
                padding: 10px 0;
                display: flex;

                .inner {
                    padding-left: 10px;
                    flex: 1;

                    .user-name {
                        font-size: 12px;
                        color: #939393;
                    }

                    .time {
                        float: right;
                        font-size: 12px;
                        color: #C3C3C3;
                    }

                    p {
                        margin: 8px 0 0;
                        white-space: pre-line;
                    }
                }
            }

        }

        .comment-box {
            padding: 15px 0;
            text-align: right;

            .el-button {
                margin-top: 8px;
                min-width: 100px;
            }

        }
    }

</style>
