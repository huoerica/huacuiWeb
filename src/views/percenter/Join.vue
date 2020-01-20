<template>
    <el-row class="join">
        <el-col :xs="{span: 24, offset: 0}" :sm="{span: 17, offset: 2}" :md="{span: 20, offset: 1}"
                :lg="{span: 15, offset: 2}">
            <el-form class="form-personal" ref="joinForm" :model="joinForm" :rules="ruleValidate" label-width="115px">
                <el-form-item label="收货人姓名" prop="userName">
                    <el-input v-model="joinForm.userName" placeholder="请填写真实姓名"/>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="joinForm.realName" placeholder="请填写真实姓名"/>
                </el-form-item>
                <el-form-item label="身份证号" prop="identityId">
                    <el-input v-model="joinForm.identityId" placeholder="本人身份证号码"/>
                </el-form-item>
                <el-form-item label="省/市/区" prop="city">
                    <el-cascader :options="areaJSON" v-model="joinForm.city"/>
                </el-form-item>
                <el-form-item label="详细地址" prop="addressStreet">
                    <el-input v-model="joinForm.addressStreet" placeholder="街道/楼牌号"/>
                </el-form-item>
                <el-form-item label="申请代理区域" prop="agentAddress">
                    <!--<el-cascader :data="areaJSON" v-model="joinForm.agentAddress" />-->
                    <el-input v-model="joinForm.agentAddress" placeholder="请填写申请代理区域"/>
                </el-form-item>
                <el-form-item label="上传身份证" required>
                    <div class="upload-idcard">
                        <el-form-item prop="identityPositivePicture">
                            <div class="upload-img">
                                <el-upload ref="identityPositivePicture" class="el-upload--picture-card"
                                           :show-file-list="false"
                                           accept="image/jpeg,image/gif,image/png"
                                           :before-upload="(file) =>beforeAvatarUpload(file, 'identityPositivePicture')"
                                           action="">
                                    <svg-icon icon-class="card1" color="#cacaca" size="148px"/>
                                    <img v-if="joinForm.identityPositivePicture"
                                         :src="joinForm.identityPositivePicture"/>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item prop="identityNegativePicture">
                            <div class="upload-img">
                                <el-upload ref="identityNegativePicture" class="el-upload--picture-card"
                                           :show-file-list="false"
                                           :before-upload="(file) =>beforeAvatarUpload(file, 'identityNegativePicture')"
                                           action="">
                                    <svg-icon icon-class="card2" color="#cacaca" size="148px"/>
                                    <img v-if="joinForm.identityNegativePicture"
                                         :src="joinForm.identityNegativePicture"/>
                                </el-upload>
                            </div>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="上传营业执照" prop="businessLicensePicture">
                    <div class="upload-idcard">
                        <div class="upload-img">
                            <el-upload ref="businessLicensePicture" class="el-upload--picture-card"
                                       :show-file-list="false"
                                       :before-upload="(file) =>beforeAvatarUpload(file, 'businessLicensePicture')"
                                       action="">
                                <svg-icon icon-class="license" color="#cacaca" size="148px"/>
                                <img v-if="joinForm.businessLicensePicture" :src="joinForm.businessLicensePicture"/>
                            </el-upload>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit('joinForm')">认 证</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
  import {uploadOne, agentApply, uploadSingle} from '@/api/file.js'
  import AREA from '../../../public/area.js'

  export default {
    name: 'Join',
    data() {
      const validateArea = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择省市区'))
        } else {
          callback()
        }
      }
      const validateIdentityId = (rule, value, callback) => {
        const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('请填写有效身份证号码'))
        }
      }
      return {
        uploadToken: {accessToken: this.$store.getters.token},
        uploadUrl: uploadOne,
        joinForm: {
          userName: '',
          realName: '',
          identityPositivePicture: '',
          identityNegativePicture: '',
          identityId: '',
          businessLicensePicture: '',
          agentAddress: '',
          addressProvince: '',
          addressCity: '',
          addressZone: '',
          addressStreet: ''
        },
        ruleValidate: {
          userName: [
            {required: true, message: '请填写收货人姓名', trigger: 'blur'}
          ],
          realName: [
            {required: true, message: '请填写真实姓名', trigger: 'blur'}
          ],
          identityId: [
            {required: true, validator: validateIdentityId, trigger: 'blur'}
          ],
          identityPositivePicture: [
            {required: true, message: '请上传身份证正面', trigger: 'change'}
          ],
          identityNegativePicture: [
            {required: true, message: '请上传身份证反面', trigger: 'change'}
          ],
          businessLicensePicture: [
            {required: true, message: '请上传身营业执照', trigger: 'change'}
          ],
          city: [
            {required: true, validator: validateArea, trigger: 'change'}
          ],
          addressStreet: [
            {required: true, message: '请填写详细地址', trigger: 'blur'}
          ],
          agentAddress: [
            {required: true, message: '请填写申请代理区域', trigger: 'blur'}
          ]
        },
        areaJSON: []
      }
    },
    methods: {
      queryAreas() {
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let submitData = JSON.parse(JSON.stringify(this.joinForm))
            let city = submitData.city
            submitData.addressProvince = city[0]
            submitData.addressCity = city[1]
            submitData.addressZone = city[2]
            agentApply(submitData).then(res => {
              if (res.flag) {
                this.$refs[name].resetFields()
                this.joinForm.city = []
              }
            })
          }
        })
      },
      beforeAvatarUpload(file, card) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        } else {
          let formData = new FormData();
          formData.append('pictureFile', file);
          uploadSingle(formData).then(res => {
            if (res.flag) {
              this.joinForm[card] = res.data
            }
          })
        }
        return false
      }
    },
    created() {
      this.queryAreas()
      this.areaJSON = AREA
    },
    mounted() {
      this.areaJSON = AREA
    }
  }
</script>

<style scoped>
    .el-cascader {
        display: block;
    }

    .upload-img {
        width: 200px;
        height: 150px;
        display: inline-block;
        line-height: 148px;
    }

    .upload-idcard .el-form-item {
        display: inline-block;
        margin-right: 20px;
    }

    .el-form .el-button {
        min-width: 140px;
    }
</style>
