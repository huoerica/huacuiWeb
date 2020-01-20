<template>
    <el-tabs v-model="active" @tab-click="handleClick" class="layout-tabs">
        <el-tab-pane :name="tab.name" :label="tab.label" v-for="(tab, index) in list" :key="index">
            <span slot="label"><svg-icon v-if="tab.icon" :icon-class="tab.icon" :color="tab.color"/> {{tab.label}}</span>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    export default {
        name: "TabsBar",
        props: {
            activeName: {
                type: String,
                default: ''
            },
            list: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                active: this.activeName
            }
        },
        methods: {
            handleClick(tab) {
                this.$emit('update:activeName', this.active)
                this.$emit('click', tab)
            }
        }
    }
</script>

<style lang="scss">
    .layout-tabs {
        .el-tabs__header {
            background: #ffffff;

            .el-tabs__item.is-top:nth-child(2){
                padding-left: 10px;
            }
            & .el-tabs__item.is-top:last-child{
                padding-right: 10px;
            }
            .el-tabs__nav-next, .el-tabs__nav-prev{
                width: 20px;
                text-align: center;
                background: #EAEAEA;
                color: #fe3506;
                font-size: 14px;
                height: 100%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>
