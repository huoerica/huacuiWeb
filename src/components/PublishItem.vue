<template>
    <div class="community-item">
        <div class="item-content">
            <div class="item-top">
                <div class="comment-content">{{community.content}}</div>
                <el-link icon="el-icon-delete" type="primary" @click="handleDelete(community.id)">删除</el-link>
            </div>

            <div class="comment-imgs" v-if="community.images">
                <el-image v-for="(picture, pindex) in community.images" :key="pindex"
                          :src="picture"
                          :preview-src-list="community.images">
                </el-image>
            </div>
            <el-row type="flex" justify="space-between">
                <el-col :xs="12" :sm="12">
                    <span class="subscript">{{community.createTime}}</span>
                </el-col>
                <el-col :span="12" class="action">
                    <span class="action-item"><svg-icon icon-class="comment"/>评论({{community.totalComment}})</span>
                    <span class="action-item"><svg-icon icon-class="thumbsup"/>点赞({{community.totalLike}})</span>
                </el-col>
            </el-row>

            <ul v-if="community.outCommunityCommentDetails && community.outCommunityCommentDetails.length">
                <li v-for="(item, index) in community.outCommunityCommentDetails.slice(0, 3)" :key="index">
                    <span class="user-name">{{item.nickName}}：</span>
                    <span v-html="htmlText(item.commentContent)"></span>
                </li>

                <li v-show="toggleStatus === true"
                    v-for="(item, bindex) in community.outCommunityCommentDetails.slice(3)" :key="3+bindex">
                    <span class="user-name">{{item.nickName}}:</span>
                    {{item.commentContent}}
                </li>
                <li v-show="toggleStatus === true" class="comment-toggle" @click="toggleStatus = false">
                    <i class="el-icon-top" />收起
                </li>
                <li v-show="toggleStatus === false" class="comment-toggle" @click="toggleStatus = true">
                    <i class="el-icon-bottom" />展开
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {communityDelete} from '@/api/community.js'
    export default {
        name: "PublishItem",
        props: {
            item: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        watch: {
            item: {
                handler (newVal) {
                    this.community = this.computedImages(newVal)
                },
                immediate: true
            }
        },
        data() {
            return {
                community: this.item,
                inputContent: '',
                toggleStatus: null
            }
        },
        created() {
            this.community = this.computedImages(this.item)
        },
        methods: {
            computedImages (community) {
                community = JSON.parse(JSON.stringify(community))
                let {images = ''} = community
                if(images.length > 0) {
                    images = images.split(',') || []
                    community.images = images
                } else {
                    community.images = []
                }

                if (community.outCommunityCommentDetails && community.outCommunityCommentDetails.length > 3) {
                    this.toggleStatus = false
                }
                return community
            },
            handleDelete(id) {
                this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    communityDelete(id).then(res => {
                        if (res.flag) {
                            this.$message.success('删除成功')
                            this.$emit('delete')
                        }
                    })
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .community-item{
        padding: 15px 0;
        background-color: #ffffff;
        border-radius: 4px;

        .item-img{
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;
        }
        .item-content {
            .item-top{
                position: relative;

                .el-link{
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
        }

        .user-name{
            color: $--color-blue;
            padding: 5px 0;
        }
        .subscript{
            @include subscript();
        }
        .comment-content{
            margin: 0 54px 10px 0;
            white-space: pre-line;
        }
        .comment-imgs {
            margin-bottom: 10px;
            .el-image{
                width: 100px;
                height: 100px;
                margin: 0 2px 2px 0;
            }
        }
        .action{
            text-align: right;

            .action-item{
                margin-left: 10px;
                font-size: 12px;
                color: $--color-text-light;

                .svg-icon{
                    margin-right: 3px;
                }
            }
        }

        ul{
            padding:0;
            background-color: #f7f7f7;
            margin: 15px 0 0;

            li{
                list-style: none;
                padding:5px 10px;
                word-break: break-word;
                font-size: 12px;
            }

            .comment-toggle{
                text-align: center;
                color: $--color-text-light;
                cursor: pointer;
                font-size: 12px;

                &:hover{
                    color: $--color-text-regular;
                }
            }
        }

        .comment-input {
            position: relative;
            padding: 10px;
            background-color: #f7f7f7;

            .el-row{
                margin-top: 5px;
            }
        }
    }

</style>
