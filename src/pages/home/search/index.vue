<template>
    <div class="search">
        <el-autocomplete
            clearable
            class="inline-input w-50"
            placeholder="请输入医院名称"
            v-model="hosname"
            :fetch-suggestions="fetchData"
            :trigger-on-focus="false"
            @select="goDetail"
        />
        <el-button type="primary" size="default" :icon="Search">搜索</el-button>
    </div>
</template>

<script setup lang="ts">
// 引入element-plus提供图标
import { Search } from '@element-plus/icons-vue';
import {ref} from 'vue';
import {useRouter} from 'vue-router';
// 引入请求方法
import {reqHospitalInfo} from '@/api/home';
import type { HospitalInfo } from '@/api/home/type';

defineOptions({name:'Search'})


// 创建路由器对象
let $router = useRouter()



// 收集搜索的关键字（医院的名字）
let hosname = ref<string>('')

// 顶部组件的回调
const fetchData = async (keyword:string, cb:any) => {
    // 当用户输入完关键字，此函数会执行一次，发请求获取需要展示的数据
    let result: HospitalInfo = await reqHospitalInfo(keyword)
    // 整理数据，变成人家组件需要的数据格式
    let showData = result.data.map(item=>{
        return {
            value:item.hosname, //展示医院的名字
            hoscode:item.hoscode // 存储医院的编码
        }
    })
    // 给组件提供展示的数据
    cb(showData)
}

// 点击某一个推荐项
const goDetail = (item:any) => {
    // 点击推荐项目进入医院详情页，将来需要携带query参数（医院的编码）
    $router.push({path:'/hospital/register', query:{hoscode:item.hoscode}})
}

</script>

<!-- 深度选择器：>>>    /deep/  ::v-deep -->
<style scoped>
.search{
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
}



:deep(.el-input__wrapper) {
    width: 600px;
    margin-right: 10px;
}
</style>