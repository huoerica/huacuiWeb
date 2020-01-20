<template>
    <div class="community-item">
        <el-row type="flex">
            <div class="item-img">
                <el-avatar :size="36" :src="community.headPortrait" fit="fill">
                    <img :src="defaultAvatar"/>
                </el-avatar>
            </div>

            <el-col class="item-content">
                <div class="user-name">{{community.nickName}}</div>
                <div class="comment-content">{{community.content}}</div>
                <div class="comment-imgs" v-if="community.images">
                    <el-image v-for="(picture, pindex) in community.images" :key="pindex"
                              :src="picture"
                              :preview-src-list="community.images">
                    </el-image>
                </div>
                <el-row type="flex" justify="space-between">
                    <el-col :xs="8" :sm="12">
                        <span class="subscript">{{community.createTime}}</span>
                    </el-col>
                    <div class="action">
                        <el-link :underline="false" @click="handleCommentShow">
                            <svg-icon icon-class="comment"/>
                            评论({{community.totalComment}})
                        </el-link>
                        <el-link :underline="false" @click="addCommunityInterest">
                            <svg-icon icon-class="thumbsup" :color="community.isLike ? '#FE3506' : ''"/>
                            {{(community.isLike ? '取消' : '') + '点赞'}}({{community.totalLike}})
                        </el-link>
                    </div>
                </el-row>

                <div>
                    <div class="comment-input" v-show="community.showInput">
                        <el-input
                                type="textarea"
                                autosize
                                placeholder="请输入内容"
                                v-model="community.inputContent">
                        </el-input>

                        <el-row type="flex" justify="end">
                            <el-button type="primary" size="mini" @click="subimitComment">发表</el-button>
                        </el-row>
                    </div>
                    <ul v-if="community.outCommunityCommentDetails && community.outCommunityCommentDetails.length">
                        <li v-for="(item, index) in community.outCommunityCommentDetails.slice(0, 3)" :key="index">
                            <span class="user-name">{{item.nickName}}：</span>
                            <span style="white-space: pre-line;">{{item.commentContent}}</span>
                        </li>

                        <li v-show="toggleStatus === true"
                            v-for="(item, bindex) in community.outCommunityCommentDetails.slice(3)" :key="3+bindex">
                            <span class="user-name">{{item.nickName}}：</span>
                            <span style="white-space: pre-line;">{{item.commentContent}}</span>
                        </li>
                        <li v-show="toggleStatus === true" class="comment-toggle" @click="toggleStatus = false">
                            <i class="el-icon-top"/>收起
                        </li>
                        <li v-show="toggleStatus === false" class="comment-toggle" @click="toggleStatus = true">
                            <i class="el-icon-bottom"/>展开
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {addCommentDetail, communityInterest} from '@/api/community'
    import store from "@/store";

    export default {
        name: "CommunityItem",
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
            computedImages(community) {
                community = JSON.parse(JSON.stringify(community))
                let {images = ''} = community
                if (images.length > 0) {
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
            handleCommentShow() {
                if (!this.isLogined()) {
                    return false
                }
                this.$set(this.community, 'inputContent', '')
                if (this.community.showInput) {
                    this.community.showInput = false
                } else {
                    this.$set(this.community, 'showInput', true)
                }
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
                addCommentDetail({
                    commentContent: this.community.inputContent,
                    communityInfoId: this.community.id
                }).then(res => {
                    if (res.flag) {
                        this.$message({
                            message: '已评论',
                            type: 'success',
                            duration: 1000
                        });
                        this.$emit('addComment', res.data)
                        this.community.showInput = false
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
    .community-item {
        padding: 15px 0;
        background-color: #ffffff;
        border-radius: 4px;

        .item-img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;
        }

        .item-content {
            width: calc(100% - 36px);
            padding-left: 10px;
        }

        .user-name {
            color: $--color-blue;
            padding: 5px 0;
        }

        .subscript {
            @include subscript();
        }

        .comment-content {
            margin: 5px 0 10px;
            white-space: pre-line;
        }

        .comment-imgs {
            margin-bottom: 10px;

            .el-image {
                width: 100px;
                height: 100px;
                margin: 0 2px 2px 0;
            }
        }

        .action {
            .el-link {
                margin-left: 10px;
                color: $--color-text-light;
                font-size: 12px;

                .svg-icon {
                    margin-right: 3px;
                }
            }
        }

        ul {
            padding: 0;
            background-color: #f7f7f7;
            margin: 15px 0 0;

            li {
                list-style: none;
                padding: 5px 10px;
                font-size: 12px;
            }

            .comment-toggle {
                text-align: center;
                color: $--color-text-light;
                cursor: pointer;
                font-size: 12px;

                &:hover {
                    color: $--color-text-regular;
                }
            }
        }

        .comment-input {
            position: relative;
            padding: 10px;
            background-color: #f7f7f7;

            .el-row {
                margin-top: 5px;
            }
        }
    }

</style>
