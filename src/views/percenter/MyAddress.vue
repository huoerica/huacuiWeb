<template>
    <div class="my-address">
        <div class="form-box">
            <el-divider content-position="left">
                <span class="form-title">{{addrForm.id ? '编辑' : '新增'}}收货地址</span>
            </el-divider>
            <el-row>
                <el-col :xs="24" :sm="12" :md="10">
                    <el-form class="form-personal" ref="addrForm" :model="addrForm" :rules="ruleValidate" size="small"
                             label-width="110px">
                        <el-form-item label="收货人姓名" prop="userName">
                            <el-input v-model="addrForm.userName" placeholder=""/>
                        </el-form-item>
                        <el-form-item label="收货人手机号" prop="userPhone">
                            <el-input v-model="addrForm.userPhone" placeholder=""/>
                        </el-form-item>
                        <el-form-item label="所在地区" prop="location">
                            <el-cascader :options="areaJSON" v-model="addrForm.location"></el-cascader>
                        </el-form-item>

                        <el-form-item label="详细地址" prop="userAddress">
                            <el-input v-model="addrForm.userAddress" placeholder="街道/楼牌号"/>
                        </el-form-item>
                        <!--<el-form-item label="邮编">
                          <Input v-model="addrForm.postcode" placeholder="街道/楼牌号"/>
                        </el-form-item>-->
                        <el-form-item label="设为默认地址">
                            <el-checkbox v-model="addrForm.isDefault" :true-value="1" :false-value="0"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" shape="circle" @click="handleSubmit('addrForm')">提 交</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>

        <template v-if="addressList.length > 0">
            <el-alert
                    :closable="false"
                    :title="`已保存了${addressList.length}条地址`"
                    type="success"
                    show-icon>
            </el-alert>
            <div class="address-list">
                <el-row class="flex-wrap" type="flex" align="middle" v-for="(item, index) in addressList" :key="index">
                    <el-col :xs="12" :sm="6" :md="6">
                        <span class="name">{{item.userName}}</span>
                        <el-tag type="danger" size="mini" v-if="item.isDefault">默认地址</el-tag>
                    </el-col>
                    <el-col :xs="12" :sm="3" :md="4"><span class="name">{{item.userPhone}}</span></el-col>
                    <el-col :xs="20" :sm="16" :md="10">
                        {{item.areaIdPath | addressCN}} {{item.userAddress}}
                    </el-col>
                    <div class="action">
                        <el-row>
                            <el-col :span="12" :xs="24" class="is-right">
                                <el-link icon="el-icon-edit" type="primary" @click="handleUpdate(item, index)">编辑</el-link>
                            </el-col>
                            <el-col :span="12" :xs="24" class="is-right">
                                <el-link icon="el-icon-delete" type="warning" @click="handleDelete(item, index)">删除</el-link>
                            </el-col>
                        </el-row>
                    </div>
                </el-row>
            </div>
        </template>

    </div>
</template>

<script>
    import {getAllAddress, insertAddress, updateAddress, deleteAddress} from '@/api/address.js'
    import AREA from '../../../public/area.js'

    export default {
        name: "MyAddress",
        data() {
            const validatePhoneNum = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请填写收货人手机号'))
                } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
                    callback(new Error('手机格式有误'))
                } else {
                    callback()
                }
            }

            const validateArea = (rule, value, callback) => {
                if (value === '' || value.length === 0) {
                    callback(new Error('请选择所在地区'))
                } else {
                    callback()
                }
            }
            return {
                addFlag: false,
                areaJSON: [],
                addressList: [],
                addrForm: {
                    userName: '',
                    userPhone: '',
                    location: [],
                    userAddress: '',
                    postcode: '',
                    isDefault: ''
                },
                editIndex: null,
                ruleValidate: {
                    userName: [
                        {required: true, message: '请填写收货人姓名', trigger: 'blur'}
                    ],
                    userPhone: [
                        {required: true, validator: validatePhoneNum, trigger: 'blur'}
                    ],
                    location: [
                        {required: true, validator: validateArea, trigger: 'change'}
                    ],
                    userAddress: [
                        {required: true, message: '请填写详细地址', trigger: 'change'}
                    ]
                }
            }
        },
        created() {
            this.getAllAddress()
            this.areaJSON = AREA
        },
        mounted() {
        },
        methods: {
            handleDelete(item, index) {
                this.$confirm('删除操作不可恢复, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.handleAddressDelete({addressId: item.id, index: index})
                })
            },
            handleUpdate(item, index) {
                this.editIndex = index
                let location = (item.areaIdPath || '').split('_')
                this.addrForm = JSON.parse(JSON.stringify(item))
                this.addrForm['location'] = location
                this.addrForm.isDefault = (item.isDefault ? true : false)
                this.addFlag = true
            },
            insertAddress(submitData, formName) {
                insertAddress(submitData).then(res => {
                    if (res.flag) {
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        })
                        this.$refs[formName].resetFields()
                        this.addrForm.isDefault = false
                        this.getAllAddress()
                    } else {
                        this.$message({
                            message: '新增失败',
                            type: 'error'
                        });
                    }
                })
            },
            updateAddress(submitData, formName) {
                updateAddress(submitData).then(res => {
                    if (res.flag) {
                        this.$set(this.addressList, this.editIndex, submitData)
                        this.$refs[formName].resetFields()
                        this.editIndex = null
                        this.addFlag = false
                        this.addrForm.isDefault = false
                        this.$message({
                            message: '更新成功',
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: '更新失败',
                            type: 'error'
                        });
                    }
                })
            },
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let submitData = JSON.parse(JSON.stringify(this.addrForm))
                        let city = this.addrForm.location
                        submitData.province = city[0] || null
                        submitData.city = city[1] || null
                        submitData.area = city[2] || null
                        submitData.isDefault = submitData.isDefault ? 1 : 0

                        if (submitData.id) {
                            this.updateAddress(submitData, name)
                        } else {
                            this.insertAddress(submitData, name)
                        }
                    }
                })
            },
            getAllAddress() {
                getAllAddress().then(res => {
                    this.addressList = res.data
                })
            },
            // 确认删除地址
            handleAddressDelete(options) {
                let {addressId, index} = options

                deleteAddress({
                    addressId: addressId
                }).then(res => {
                    if (res.flag) {
                        this.$message.success('删除成功')
                        this.addressList.splice(index, 1)
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .form-box {
        .form-title {
            color: $--color-primary;
        }

        .el-form {
            .el-button {
                min-width: 120px;
            }


            .el-cascader{
                width: 100%;
            }
        }
    }

    .address-list {
        padding: 10px;

        &>.el-row {
            padding: 5px 30px 5px 0;
            border-bottom: 1px solid #EAEAEA;

            &:hover {
                background: #fafafa;
                cursor: pointer;
            }

            .el-col {
                padding: 5px 10px;
            }

            .action {
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                display: flex;
                align-items: center;

                .el-link + .el-link{
                    margin-left: 10px;
                }
            }
        }
    }

</style>
