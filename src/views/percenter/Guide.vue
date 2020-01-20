<template>
    <div>
        <div class="guide-title">
            <span>常见问题</span>
        </div>
        <el-collapse v-model="activeNames">
            <el-collapse-item :title="item.name" :name="index" v-for="(item, index) in newPerson" :key="index">
                <div class="guide-content" v-for="(content, cindex) in item.content" :key="cindex">{{content}}</div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import {newPerson} from '../../../public/percenter.js'
    export default {
        name: "Guide",
        data () {
            return {
                newPerson: newPerson,
                activeNames: ['1']
            }
        }
    }
</script>

<style scoped>
    .guide-content{
        color: #939393;
        font-size: 12px;
    }

    .guide-title span{
        display: inline-block;
        margin: 0 0 10px;
        color: #131313;
        padding: 10px 0;
        border-bottom: 1px solid #eaeaea;
    }
</style>
