<template>
    <div class="container">
        <h1 class="tip">确认挂号信息</h1>
        <!-- 卡片：用于展示就诊人信息的 -->
        <el-card class="box-card">
            <!-- 卡片的头部 -->
            <template #header>
                <div class="card-header">
                    <span>请选择就诊人</span>
                    <el-button type="primary" size="default" :icon="User" @click="goUser">添加就诊人</el-button>
                </div>
            </template>
            <!-- 卡片的身体部分要展示就诊人信息 -->
            <div class="user">
                <Visitor @click="changeIndex(index)" v-for="(user, index) in userArr" :key="user.id" class="item"
                    :user="user" :index="index" :currentIndex="currentIndex"></Visitor>
            </div>
        </el-card>
        <!-- 卡片:展示医生的信息 -->
        <el-card class="box-card">
            <!-- 卡片的头部 -->
            <template #header>
                <div class="card-header">
                    <span>挂号信息</span>
                </div>
            </template>
            <!-- 卡片的身体部分展示医生的信息 -->
            <el-descriptions class="margin-top" title="With border" :column="2" border>
                <template #extra>
                    <el-button type="primary">Operation</el-button>
                </template>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            就诊日期:
                        </div>
                    </template>
                    {{ docInfo.workDate }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            就诊医院:
                        </div>
                    </template>
                    {{ docInfo.param?.hosname }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            就诊科室:
                        </div>
                    </template>
                    {{ docInfo.param?.depname }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            医生姓名:
                        </div>
                    </template>
                    {{ docInfo.docname }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            医生职称:
                        </div>
                    </template>
                    {{ docInfo.title }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            医生专长:
                        </div>
                    </template>
                    {{ docInfo.skill }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            医生服务费:
                        </div>
                    </template>
                    <span style="color: red;">{{ docInfo.amount }}</span>
                </el-descriptions-item>
            </el-descriptions>
        </el-card>

        <!-- 确定挂号按钮 -->
        <div class="btn">
            <el-button type="primary" size="default" :disabled="currentIndex == -1" @click="submitOrder">确认挂号</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    User
} from '@element-plus/icons-vue'
// 引入获取就诊人信息接口
import { reqGetUser, reqDoctorInfo } from '@/api/hospital';
import { onMounted, ref } from 'vue';
import type { UserResponseData, UserArr, DoctorInfoData, Doctor } from '@/api/hospital/type';
import { useRoute, useRouter } from 'vue-router'
import { reqSubmitOrder } from '@/api/user'
// 获取路由对象
let $route = useRoute()

// 存储医生信息
let docInfo = ref<Doctor>({
    id: '',
    createTime: '',
    updateTime: '',
    isDeleted: '',
    param: {
        dayOfWeek: '',
        depname: '',
        hosname: ''
    },
    hoscode: '',
    depcode: '',
    title: '',
    docname: '',
    skill: '',
    workDate: '',
    workTime: 0,
    reservedNumber: 0,
    availableNumber: 0,
    amount: 0,
    status: 0,
    hosScheduleId: ''
})

// 获取路由器对象
let $router = useRouter()

// 存储用户确定就诊人索引值
let currentIndex = ref<number>(-1)
// 就诊人组件
// import Visitor from './visitor.vue'
import { SubmitOrder } from '@/api/user/type';
import { ElMessage } from 'element-plus';
// 存储全部就诊人信息
let userArr = ref<UserArr>([])

// 组件挂载完毕获取数据
onMounted(() => {
    // 获取就诊人信息
    fetchUserData()
    // 获取医生信息
    fetchInfo()
})
// 获取就诊人信息
const fetchUserData = async () => {
    // 获取就诊人信息
    // 如果你是新的账号,切记在已经写好的项目中先注册几个就诊人信息
    let result: UserResponseData = await reqGetUser()
    if (result.code == 200) {
        userArr.value = result.data
    }
}

// 获取医生信息
const fetchInfo = async () => {
    let result: DoctorInfoData = await reqDoctorInfo($route.query.docId as string)
    if (result.code == 200) {
        docInfo.value = result.data
    }
}

// 点击就诊人子组件的回调
const changeIndex = (index: number) => {
    // 存储当前用户选中就诊人信息的索引值
    currentIndex.value = index
}

// 确定挂号按钮回调
const submitOrder = async () => {
    // 医院编号
    let hoscode = docInfo.value.hoscode
    // 医生的ID
    let scheduleId = docInfo.value.id
    // 就诊人的ID
    let patientId = userArr.value[currentIndex.value].id
    // 提交订单
    let result: SubmitOrder = await reqSubmitOrder(hoscode, scheduleId, patientId)
    // 提交订单成功
    if (result.code == 200) {
        $router.push({ path: '/user/order', query: { orderId: result.data } })
    } else {
        ElMessage({
            type: 'error',
            message: result.message
        })
    }
}

// 预约挂号添加就诊人按钮的方法
const goUser = () => {
    // 路由跳转
    $router.push({path:'/user/patient',query:{type:'add'}})
}
</script>

<style scoped lang="scss">
.container {
    .tip {
        font-weight: 900;
        color: #7f7f7f;
        font-size: 20px;
    }

    .box-card {
        margin: 20px 0;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .user {
            display: flex;
            flex-wrap: wrap;

            .item {
                width: 32%;
                margin: 5px;
            }
        }
    }

    .btn {
        display: flex;
        justify-content: center;
        margin: 10px 0;
    }
}
</style>