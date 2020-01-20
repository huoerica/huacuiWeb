<template>
    <div id="percenter" class="percenter">
        <div :style="{width: layoutWidth}">
            <TabsBar :activeName.sync="activeName" :list="tabsList" @click="handleTabClick"/>
        </div>

        <div class="section">
            <div class="section-title">
                {{activeCateName}}
            </div>

            <div class="section-body">
                <router-view :key="activeName"/>
            </div>
        </div>
    </div>
</template>

<script>
  const percenterList = [
    {label: '账号设置', name: '/percenter/mycount', icon: 'sett', color: '#939393'},
    {label: '我的收货地址', name: '/percenter/myaddress', icon: 'addr', color: '#939393'},
    {label: '新人指南', name: '/percenter/guide', icon: 'guide', color: '#939393'},
    {label: '加盟代理', name: '/percenter/join', icon: 'join', color: '#939393'},
    {label: '关于我们', name: '/percenter/about'}
  ]
  export default {
    name: "Percenter",
    components: {
      TabsBar: () => import("@/components/TabsBar")
    },
    data() {
      return {
        tabsList: percenterList,
        activeName: this.$route.path
      }
    },
    computed: {
      layoutWidth() {
        return this.$store.getters.layoutWidth + 'px'
      },
      device() {
        return this.$store.getters.device
      },
      activeCateName() {
        let tab = this.tabsList.find(item => item.name === this.activeName)
        return tab.label
      }
    },
    mounted() {
    },
    methods: {
      handleTabClick(tab) {
        this.activeName = tab.name
        this.$router.push({path: tab.name})
      }
    }
  }
</script>

<style scoped lang="scss">
    .section {
        padding: 10px 15px;
        background: #ffffff;
        box-shadow: $--box-shadow-light;
    }

</style>
