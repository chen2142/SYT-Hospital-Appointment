<template>
    <div class="region">
        <div class="content">
            <div class="left">地区：</div>
            <ul class="right">
                <li :class="{active:regionFlag==''}" @click="changeRegion('')">全部</li>
                <li v-for="region in regionArr" :key="region.value" :class="{active:regionFlag==region.value}" @click="changeRegion(region.value)">{{ region.name }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reqHospitalLevelAndRegion} from '@/api/home';
import {onMounted, ref} from 'vue';
import type {HospitalLevelAndRegionArr, HospitalLevelAndRegionResponseData} from '@/api/home/type';

defineOptions({
    name:'Region'
})


// 存储地区的数据
let regionArr = ref<HospitalLevelAndRegionArr>([])

// 地区高亮的响应式数据
let regionFlag = ref<string>('')

// 地区组件挂载完毕获取地区数据
onMounted(()=>{
    getRegion()
})

// 获取地区的数据
const getRegion = async () => {
    let result: HospitalLevelAndRegionResponseData = await reqHospitalLevelAndRegion('Beijin')
    // 存储全部地区的数据
    if (result.code==200) {
        regionArr.value = result.data
    }
}

// 点击不同区域按钮回调
const changeRegion = (value:string) => {
    regionFlag.value = value
    // 给父组件传递区域的参数
    $emit('getRegion', value)
}

let $emit = defineEmits(['getRegion'])
</script>

<style scoped lang="scss">
    .region{
        color: #7f7f7f;
        margin-top: 10px;

        .content{
        display: flex;

        .left{
            margin-right: 10px;
            width: 90px;
        }

        ul{
            display: flex;
            flex-wrap: wrap;



            li{
                margin-right: 5px;
                margin-bottom: 10px;

                &.active{
                color: #55a6fe;
            }
            }

            li:hover{
                color: #55a6fe;
                cursor: pointer;
            }
        }
    }
    }

    
</style>