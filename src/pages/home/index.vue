<template>
    <div>
        <!-- 首页轮播图的结构 -->
        <Carousel></Carousel>
        <!-- 首页搜索医院的表单区域 -->
        <Search></Search>
        <!-- 底部展示医院的结构 -->
        <el-row :gutter="20">
            <el-col :span="20">
                <!-- 等级子组件 -->
                <Level @getLevel="getLevel"></Level>
                <!-- 地区子组件 -->
                <Region @getRegion="getRegion"></Region>
                <!-- 展示医院的结构 -->
                <div class="hospital" v-if="hasHospitalArr.length>0">
                    <Card class="item" v-for="(item, index) in hasHospitalArr" :key="index" :hospitalInfo="item"></Card>

                </div>
                <el-empty v-else description="没有医院信息" />
                <!-- 分页器 -->
                <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
                    :background="true" layout="total, sizes, prev, pager, next, jumper" :total="total" 
                    @current-change="currentChange"
                    @size-change="sizeChange"/>
            </el-col>
            <el-col :span="4">
                <Tip></Tip>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
// 引入组合式API函数
import { onMounted, ref } from 'vue';
import { reqHospital } from '@/api/home';
// 引入首页轮播图组件
import Carousel from './carousel/index.vue'
// 引入首页搜索的组件
import Search from './search/index.vue';
// 引入首页等级的组件
import Level from './level/index.vue';
// 引入首页地区选择的组件
import Region from './region/index.vue'
// 展示医院新的卡片组件
import Card from './card/index.vue';
import type {Content, HospitalResponseData} from '@/api/home/type'
// 引入右侧组件
import Tip from './tip/index.vue';


// 分页器页码
let pageNo = ref<number>(1)
// 一页要几条数据
let pageSize = ref<number>(10)

// 存储已有的医院的数据
let hasHospitalArr = ref<Content>([])
// 存储医院总个数
let total = ref<number>(0)

// 存储医院的等级响应数据
let hostype = ref<string>('')
// 存储医院的地区
let districtCode = ref<string>('')


// 组件挂载完毕：发一次请求
onMounted(() => {
    getHospitalInfo()
})

// 获取已有的医院的数据
const getHospitalInfo = async () => {
    // 获取医院的数据：默认获取第一页、一页十个医院的数据
    let result: HospitalResponseData = await reqHospital(pageNo.value, pageSize.value, hostype.value, districtCode.value)
    // console.log(result);
    if (result.code == 200) {
        // 存储已有的医院的数据
        hasHospitalArr.value = result.data.content
        // 存储医院的总个数
        total.value = result.data.totalElements
    }
}

// 分页器页码发生变化时的回调
const currentChange = () => {
    getHospitalInfo()
}

// 分页器下拉菜单发生变化的时候会触发
const sizeChange = () => {
    getHospitalInfo()
}


// 子组件自定义事件：获取儿子给父组件传递过来的等级的参数
const getLevel = (level: string) => {
    // 收集参数：等级参数
    hostype.value = level
    // 再次发请求
    getHospitalInfo()
}

// 子组件自定义事件：获取子组件给父组件传递过来的等级的参数
const getRegion = (region: string) => {
    // 收集参数：地区参数
    districtCode.value = region
    getHospitalInfo()
}
</script>

<style scoped lang="scss">
.hospital {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
        width: 48%;
        margin: 10px 0px;
    }
}
</style>