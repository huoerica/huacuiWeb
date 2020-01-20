<template>
    <div id="app">
        <div class="body-bg">
            <img :src="bodybg"/>
        </div>
        <div id="page" class="container" :class="'container-' + device">
            <div class="aside-switch-btn" v-if="device === 'mobile'">
                <i :class="sidebar.opened ? 'el-icon-s-fold' : 'el-icon-s-unfold'" @click="handleClickOutside"></i>
            </div>
            <el-container class="layout">
                <transition name="fade-aside" mode="out-in">
                    <el-aside width="200px" class="layout-aside" v-show="sidebar.opened || device === 'desktop'">
                        <div class="aside-backdrop" @click="handleClickOutside"></div>
                        <AsideMenu/>
                    </el-aside>
                </transition>
                <el-main class="layout-main">
                    <el-row class="layout-header" type="flex" align="middle" justify="space-between">
                        <img :src="headerLogo" v-if="device === 'desktop'"/>
                        <div style="padding-left: 40px; display: inline-block">
                            <el-input class="search" placeholder="搜索内容" prefix-icon="el-icon-search" size="small"
                                      v-model="searchName" clearable @keyup.enter.native="handleSearch"/>
                        </div>

                        <div class="user-info">
                            <template v-if="username && token">
                                <router-link to="/percenter/mycount">
                                    <el-avatar :size="24" :src="userphoto">
                                        <img :src="defaultAvatar"/>
                                    </el-avatar>{{username}}
                                </router-link>
                                <el-link type="primary" @click="handleLogOut">退出</el-link>
                            </template>
                            <template v-else>
                                <el-button round type="primary" plain size="mini" @click="showLoginModal(2)">登录
                                </el-button>
                                <el-button round size="mini" @click="showLoginModal(1)">注册</el-button>
                            </template>
                        </div>
                    </el-row>
                    <div class="router-body">
                        <keep-alive :include="cachedViews">
                            <router-view :key="key"/>
                        </keep-alive>
                    </div>

                    <!--<div class="layout-footer">Footer</div>-->
                </el-main>
            </el-container>
        </div>

        <LoginRegister :type="loginType"/>
    </div>
</template>

<script>
  import ResizeMixin from './utils/ResizeHandler'
  import AsideMenu from './components/AsideMenu'
  import {mapState} from 'vuex'

  export default {
    name: 'App',
    components: {
      AsideMenu,
      LoginRegister: () => import("@/components/LoginRegister")
    },
    mixins: [ResizeMixin],
    data() {
      return {
        headerLogo: require('./assets/img/header-logo.png'),
        bodybg: require('./assets/img/bg.jpg'),
        searchName: this.$store.getters.searchName,
        loginType: 2
      }
    },
    computed: {
      ...mapState({
        sidebar: state => state.app.sidebar,
        device: state => state.app.device,
        fixedHeader: state => state.settings.fixedHeader,
        username: state => state.user.name,
        userphoto: state => state.user.avatar,
        token: state => state.user.token,
        cachedViews: state => state.tagsView.cachedViews
      }),
      key() {
        return this.$route.path
      }
    },
    mounted() {
    },
    destroyed() {
      this.$store.dispatch('user/logout').then(() => {
      })
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('app/toggleSideBar')
      },
      handleLogOut() {
        this.$store.dispatch('user/logout').then(() => {
          location.reload()
        })
      },
      showLoginModal(type) {
        this.loginType = type
        this.$store.dispatch('app/setLoginRegister', true)
      },
      handleSearch() {
        this.$store.dispatch('app/setSearchName', this.searchName)
        if (this.searchName) {
          this.$router.push({
            path: '/market/search'
          })
        } else {
          this.$router.push({
            path: '/market/index'
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
    .body-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('./assets/img/bg.jpg') center center no-repeat;
        background-size: cover;

        img {
            display: none;
            width: 100%;
            height: 100%;
        }
    }

    .layout-header {
        height: 60px;

        img {
            margin-right: 40px;
        }

        .search {
            width: 80%;
            border-radius: 50%;
            max-width: 280px;
        }

        .user-info {
            text-align: right;
            white-space: nowrap;

            a {
                margin-left: 10px;
                display: inline-block;
                line-height: 24px;

                &:hover{
                    color: $--color-primary;
                }

                .el-avatar{
                    float: left;
                    margin-right: 2px;
                }
            }
        }
    }

    .router-body {
        padding: 15px 0;
    }

    .layout-footer {
        height: auto;
        padding: 10px 15px;
        color: $--color-text-light;
        background: #ffffff;
    }

    .container-mobile {
        .layout-main {
            padding: 0 10px;
        }
    }

</style>
