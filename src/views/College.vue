<template>
    <div>
        <TabsBar :activeName.sync="activeName" :list="tabsList" @click="handleTabClick"/>

        <router-view />
    </div>
</template>

<script>
  export default {
    name: "College",
    components: {
      TabsBar: () => import("@/components/TabsBar")
    },
    data() {
      const tabsList = [
        {label: '公开课', name: '/college/index', icon: 'public', color: '#369CFF'},
        {label: '云课堂', name: '/college/cloud', icon: 'cloud', color: '#FF5252'}
      ];
      return {
        tabsList: tabsList,
        activeName: this.$route.path,
        activeCateName: '公开课'
      }
    },
    methods: {
      handleTabClick(tab) {
        this.activeName = tab.name
        this.$router.push({path: tab.name})
      }
    }
  }
</script>

<style scoped>

</style>
