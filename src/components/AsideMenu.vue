<template>
    <div class="aside-menu">
        <div class="sider-logo">
            <img :src="logoUrl" />
        </div>

        <ul>
            <li>
                <router-link to="/sign" active-class="current">签到</router-link>
            </li>
            <li>
                <router-link to="/bookcircle" active-class="current">我的作品</router-link>
            </li>
            <li>
                <router-link to="/study" active-class="current">我的学习</router-link>
            </li>
            <li>
                <router-link to="/publish" active-class="current">发布作品</router-link>
            </li>
        </ul>
        <ul>
            <li>
                <router-link to="/" :active-class="$route.path === '/' ? 'current' : ''">首页</router-link>
            </li>
            <li>
                <router-link to="/college" active-class="current">学院</router-link>
            </li>
            <li>
                <router-link to="/market" active-class="current">商城</router-link>
            </li>
            <li>
                <router-link to="/community" active-class="current">社区</router-link>
            </li>
            <li>
                <router-link to="/shopcart" active-class="current">购物车</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    name: "AsideMenu",
    data () {
      return {
        logoUrl: require('@/assets/img/logo.png')
      }
    }
  }
</script>

<style scoped lang="scss">

    .aside-menu{
        background: #ffffff;
        position: relative;
        padding: 20px 30px;

        ul{
            padding: 0;
            position: relative;
            margin-top: 30px;

            &:before{
                content: '';
                position: absolute;
                width: 4px;
                height: 100%;
                border-radius: 4px;
                background: #F3F3F3;
            }
            li{
                list-style: none;

                a {
                    display: block;
                    line-height:20px;
                    padding: 10px 15px 10px 20px;
                    position: relative;
                    color: $--color-text-light;

                    &:before{
                        position: absolute;
                        left: 0;
                        top: calc(50% - 10px);
                        content: '';
                        width: 4px;
                        height: 20px;
                        background: transparent;
                        border-radius: 4px;
                    }

                    &:hover{
                        color: $--color-text-regular;
                        background: $--color-hover;
                    }

                    &.current{
                        color: $--color-text-regular;
                        &:before{
                            background: $--color-primary;
                        }
                    }
                }
            }
        }
    }

    .sider-logo {
        margin: 0 auto 20px;
        width: 70px;
        text-align: center;
    }
</style>
