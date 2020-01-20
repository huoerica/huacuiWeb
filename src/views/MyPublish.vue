<template>
    <div class="section">
        <div class="section-title">发布作品</div>

        <div class="section-body">
            <el-form :model="publishForm" :rules="rules" ref="publishForm" label-width="100px">
                <el-form-item label="发布内容" prop="content">
                    <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="publishForm.content" style="max-width: 300px;">
                    </el-input>
                </el-form-item>

                <el-form-item label="上传图片">
                    <el-upload ref="businessLicensePicture" multiple
                               list-type="picture-card"
                               accept="image/jpeg,image/gif,image/png"
                               :before-upload="beforeAvatarUpload"
                               :on-remove="handleRemove"
                               :on-preview="handlePictureCardPreview"
                               name="pictureFile"
                               :file-list="fileList"
                               action="">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit('publishForm')">立即发布</el-button>
                </el-form-item>
            </el-form>

            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>
    </div>
</template>

<script>
  import {communityPublish} from '@/api/community.js'
  import {uploadSingle} from "@/api/file";

  export default {
    name: "MyPublish",
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        files: [],
        fileList: [],
        publishForm: {
          type: 2,
          content: '',
          images: ''
        },
        rules: {
          content: [
            {required: true, message: '请输入发布内容', trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        } else {
          let formData = new FormData();
          formData.append('pictureFile', file);
          uploadSingle(formData).then(res => {
            if (res.flag) {
              this.files.push(res.data)
              this.fileList.push({
                name: file.filename,
                url: res.data
              })
            }
          })
        }
        return false
      },
      handleRemove(file, fileList) {
        this.files = fileList.map(item => {
          return item.url
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.publishForm.images = this.files.toString()
            communityPublish(this.publishForm).then(res => {
              if (res.flag) {
                this.$message.success(res.msg);
                this.fileList = []
                this.$refs[formName].resetFields()
              } else {
                this.$message.error(res.msg);
              }
            })
          } else {
            return false;
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
    .el-upload{
        width: 100px;
        height: 100px;
        line-height: 102px;
    }

</style>
