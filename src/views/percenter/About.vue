<template>
    <div class="about">
        <p v-for="(item, index) in aboutUs" :key="index">
            {{item}}
        </p>
    </div>
</template>

<script>
    import {aboutUs} from '../../../public/percenter.js'
    export default {
        name: "About",
        data () {
            return {
                aboutUs: aboutUs
            }
        }
    }
</script>

<style scoped>

</style>
