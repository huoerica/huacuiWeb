<template>
    <div class="product-comment">
        <el-row type="flex">
            <el-avatar :size="30" :src="commentItem.userPhoto" fit="fill">
                <img :src="defaultAvatar"/>
            </el-avatar>

            <div class="comment-info">
                <div class="user-name" v-show="commentItem.userName">{{commentItem.userName}}</div>
                <div class="comment-content">{{htmlText(commentItem.commentContent)}}</div>
                <div class="comment-imgs">
                    <el-image v-for="(picture, pindex) in commentItem.commentPictures" :key="pindex"
                              :src="picture"
                              :preview-src-list="commentItem.commentPictures">
                    </el-image>
                </div>
                <div class="subscript">{{commentItem.createTime}}</div>
            </div>
        </el-row>
    </div>
</template>

<script>
  export default {
    name: "ProductComment",
    props: {
      comment: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    computed: {
      commentItem () {
        let comment = JSON.parse(JSON.stringify(this.comment))
        let commentPictures = ''
        if(comment.commentPictures !== null) {
          commentPictures = comment.commentPictures
        }
        if(comment.commentImages !== null) {
          commentPictures = comment.commentImages
        }

        if (comment.nickName) {
          comment.userName = comment.nickName
        }

        if (comment.headPortrait) {
          comment.userPhoto = comment.headPortrait
        }
        commentPictures = commentPictures ? commentPictures.split(',') : []
        comment.commentPictures = commentPictures
        return comment
      }
    }
  }
</script>

<style scoped lang="scss">
    .product-comment {
        padding: 10px 0;

        .comment-info {
            width: calc(100% - 36px);
            padding-left: 10px;
        }

        .user-name {
            @include description(1, 12px, 0);
        }

        .comment-content {
            margin-top: 5px;
            white-space: pre-line;
        }

        .comment-imgs {
            margin-top: 5px;

            .el-image {
                width: 80px;
                height: 80px;
                margin: 0 2px 2px 0;
            }
        }
        .subscript {
            @include subscript();
        }
    }

</style>
