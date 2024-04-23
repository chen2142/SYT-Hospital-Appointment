<template>
    <div>
        <span>获取验证码({{time}}s)</span>
    </div>
</template>

<script setup lang="ts">
// 引入组合式API
import {ref,watch} from 'vue'
// 倒计时时间
let time = ref<number>(5)

// 接受父组件传来的props->flag:用于控制计数器组件的显示与隐藏
let props = defineProps(['flag'])

// 接受自定义事件
let $emit = defineEmits(['getFlag'])

// 监听父组件传递过来的props数据变化
watch(() => props.flag, ()=>{
    // 开启定时器
    let timer = setInterval(()=>{
        time.value--
        if(time.value == 0){
            // 通知父组件倒计时模式结束
            $emit('getFlag', false)

            // 清除定时器
            clearInterval(timer)
        }
    }, 1000)
},
{
    immediate:true
})




</script>

<style scoped>

</style>