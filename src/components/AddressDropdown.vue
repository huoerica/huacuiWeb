<template>
    <el-dropdown trigger="click" @command="handleCommand">
      <span class="el-dropdown-link">
          <template v-if="addressId !== null">
              <div class="address-select">
                    <span class="user-name">{{currentAddress.userName}}</span>
                    <span class="user-phone">{{currentAddress.userPhone}}</span>
                    <div class="address">{{currentAddress.areaIdPath|addressCN}} {{currentAddress.userAddress}}</div>
              </div>
          </template>
          <template v-else>
              选择收货地址
          </template>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
        <el-dropdown-menu slot="dropdown" style="max-height: 300px;overflow: auto">
            <el-dropdown-item v-if="addressList.length === 0" disabled>暂无收货地址</el-dropdown-item>
            <el-dropdown-item v-for="(item, index) in addressList"
                              :key="index" :command="item">
                <div class="name-phone">
                    <span class="user-name">{{item.userName}}</span>
                    <span class="user-phone">{{item.userPhone}}</span>
                    <div class="address">{{item.areaIdPath|addressCN}} {{item.userAddress}}</div>
                </div>
            </el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
  import {getAllAddress} from '@/api/address'

  export default {
    name: "AddressDropdown",
    props: {
      addressId: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        addressList: [],
        currentAddress: {}
      }
    },
    created() {
      this.queryAllAddress()
    },
    methods: {
      queryAllAddress() {
        getAllAddress().then(res => {
          if (res.flag) {
            let list = res.data || []
            this.addressList = list
            this.currentAddress = list.find(item => item.isDefault === 1)
            if (this.currentAddress !== null) {
              this.$emit('update:addressId', this.currentAddress.id)
            }
          }
        })
      },
      handleCommand(address) {
        this.currentAddress = address
        this.$emit('update:addressId', address.id)
      }
    }
  }
</script>

<style scoped>
    .name-phone {
        padding: 5px 0;
        line-height: 20px;
    }

    .user-name {
        display: inline-block;
        padding-right: 10px;
    }

    .user-phone {
        color: #939393;
        font-size: 12px;
    }

    .address {
        line-height: 20px;
        margin-top: 2px;
        color: #939393;
        font-size: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .address-select {
        max-width: 240px;
        display: inline-block;
        padding-right: 30px;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
        height: 33px;
        min-width: 220px;
        cursor: pointer;
    }
</style>
