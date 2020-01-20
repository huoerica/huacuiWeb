<template>
    <div class="myinfo">
        <template v-if="!isEdit">
            <el-row class="detail" type="flex" align="middle">
                <el-col :sm="8" :md="8" class="is-center">
                    <el-avatar :size="60" fit="cover" :src="myInfo.userPhoto">
                        <img class="avatar-img" width="70" :src="defaultAvatar"/>
                    </el-avatar>
                    <h4>{{myInfo.userName}}</h4>
                    <p>{{myInfo.userPhone}}</p>
                </el-col>
                <el-divider direction="vertical"></el-divider>
                <el-col :sm="16" :md="16">
                    <el-button type="primary" size="mini" plain @click="handleEditClick">编辑资料</el-button>
                    <div class="info-items">
                        <div class="item">
                            <p>积分</p>
                            <h4>{{myInfo.userScore}}</h4>
                        </div>
                        <div class="item">
                            <p>排名</p>
                            <h4>{{myInfo.ranking}}</h4>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </template>
        <template v-else>
            <el-row class="form-personal">
                <el-col :xs="{span: 24, offset: 0}" :sm="{span: 18, offset: 2}" :md="{span: 10, offset: 3}">
                    <el-form ref="userInfo" :model="editUser" :rules="ruleValidate"
                             label-width="80px">
                        <el-form-item label="头像" prop="userPhoto">
                            <el-upload class="upload-avatar" ref="upload"
                                       :show-file-list="false"
                                       accept="image/jpeg,image/gif,image/png"
                                       :before-upload="(file) =>beforeAvatarUpload(file)"
                                       action="">
                                <div class="img-show">
                                    <el-avatar v-if="editUser.userPhoto" :size="80" :src="editUser.userPhoto"/>
                                    <Icon v-else type="ios-camera"></Icon>
                                </div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="昵称" prop="userName">
                            <el-input v-model="editUser.userName"/>
                        </el-form-item>
                        <el-form-item label="手机号">
                            {{editUser.userPhone}}
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSubmit('userInfo')">确定</el-button>
                            <el-button type="default" @click="handleCancel('userInfo')">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </template>

    </div>
</template>

<script>
  import {getInfo, updateUserInfo} from '@/api/user.js'
  import {uploadOne} from '@/api/file.js'
  import {uploadSingle} from "@/api/file";

  export default {
    name: "MyInfo",
    data() {
      const validatePhoneNum = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'))
        } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
          callback(new Error('手机号格式有误'))
        } else {
          callback()
        }
      }
      return {
        myInfo: {},
        editUser: {},
        isEdit: false,
        uploadToken: {accessToken: this.$store.getters.token},
        uploadUrl: uploadOne,
        ruleValidate: {
          phoneNum: [
            {required: true, validator: validatePhoneNum, trigger: 'blur'}
          ],
          userName: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
            {type: 'string', min: 1, max: 12, message: '请输入1~12个字符', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      this.queryMyInfo()
    },
    methods: {
      queryMyInfo() {
        getInfo().then(res => {
          if (res.flag) {
            this.myInfo = res.data
          }
        })
      },
      handleEditClick() {
        this.isEdit = true
        this.editUser = JSON.parse(JSON.stringify(this.myInfo))
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        } else {
          let formData = new FormData();
          formData.append('pictureFile', file);
          uploadSingle(formData).then(res => {
            if (res.flag) {
              this.editUser.userPhoto = res.data
            }
          })
        }
        return false
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let {userName, userPhoto} = this.editUser
            updateUserInfo(this.editUser).then(res => {
              if (res.flag) {
                this.myInfo.userName = userName
                this.myInfo.userPhoto = userPhoto
                this.$store.dispatch('user/updateName', userName)
                this.handleCancel(name)
                this.$message({
                  message: '操作成功',
                  type: 'success'
                });
              } else {
                this.$message({
                  message: '操作失败',
                  type: 'error'
                });
              }
            })
          }
        })
      },
      handleCancel(name) {
        this.isEdit = false
        this.$refs[name].resetFields();
      }
    }
  }
</script>

<style scoped>
    .avatar-img {
        width: 100%;
        height: 100%;
    }

    .el-divider {
        height: 80px;
        width: 1px !important;
    }

    .el-avatar {
        display: inline-block;
    }

    .el-avatar img{
        width: 100%;
    }
    .detail{
        padding-top: 10px;
    }
    .detail h4 {
        margin: 0;
        padding: 5px 0;
        font-weight: 500;
    }

    .detail p {
        margin: 0;
        color: #939393;
        font-size: 12px;
    }

    .detail .el-button{
        position: absolute;
        top: 0;
        right: 10px;
    }

    .info-items .item {
        display: inline-block;
        padding: 0 20px;
    }

    .detail .el-button {
        padding: 3px 5px;
    }

    .form-personal {
        margin: 40px 0;

    }

    .form-personal .el-button--default{
        min-width: 90px;
    }

    .form-personal .el-button--primary{
        min-width: 120px;
    }
</style>
