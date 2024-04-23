<template>
    <div class="wrap">
        <!-- 顶部结构 -->
        <div class="top">
            <div class="hosname">{{ workData.baseMap?.hosname }}</div>
            <div class="line"></div>
            <div>{{ workData.baseMap?.bigname }}</div>
            <div class="dot">.</div>
            <div class="hosdepartment">{{ workData.baseMap?.depname }}</div>
        </div>
        <!-- 中间展示日期的结构 -->
        <div class="center">
            <h1 class="time">{{ workData.baseMap?.workDateString }}</h1>
            <div class="container">
                <div class="item" v-for="item in workData.bookingScheduleList" :key="item"
                    :class="{ active: item.status == -1 || item.availableNumber == -1,cur:item.workDate==workTime.workDate }" @click="changeTime(item)">
                    <div class="top1">{{ item.workDate }}-{{ item.dayOfWeek }}</div>
                    <div class="bottom">
                        <div v-if="item.status == -1">停止挂号</div>
                        <div v-if="item.status == 0">{{ item.availableNumber == -1 ? '约满了' : `有号（${item.availableNumber}）`
                        }}</div>
                        <div v-if="item.status == 1">
                            即将放号</div>
                    </div>
                </div>
            </div>
            <el-pagination v-model:current-page="pageNo" layout="prev, pager, next" :total="workData.total"
                @current-change="fetchWorkData" />
        </div>
        <!-- 底部展示相应的医生的结构 -->
        <div class="bottom">
            <!-- 展示即将放号的时间 -->
            <div class="will" v-if="workTime.status==1">
                <span class="time">16点23分</span>
                <span class="willText">放号</span>
            </div>
            <!-- 展示医生的结构：上午，下午 -->
            <div class="doctor" v-else>
                <div class="morning">
                    <!-- 顶部文字提示 -->
                    <div class="tip">
                        <span>图标</span>
                        <span class="text">上午号源</span>
                    </div>
                    <!-- 每一个医生的信息 -->
                    <div class="doc_info" v-for="doctor in morningArr" :key="doctor.id">
                        <!-- 展示医生的名字|技能 -->
                        <div class="left">
                            <div class="info">
                                <span>{{ doctor.title }}</span>
                                <span>|</span>
                                <span>{{ doctor.docname }}</span>
                            </div>
                            <div class="skill">
                                {{ doctor.skill }}
                            </div>
                        </div>
                        <!-- 右侧区域展示挂号的钱数 -->
                        <div class="right">
                            <div class="money">{{ doctor.amount }}</div>
                            <el-button type="primary" size="default" @click="goStep2(doctor)">{{ doctor.availableNumber }}</el-button>
                        </div>
                    </div>
                </div>
                <div class="morning">
                    <!-- 顶部文字提示 -->
                    <div class="tip">
                        <span>图标</span>
                        <span class="text">下午号源</span>
                    </div>
                    <!-- 每一个医生的信息 -->
                    <div class="doc_info" v-for="doctor in afterArr" :key="doctor.id">
                        <!-- 展示医生的名字|技能 -->
                        <div class="left">
                            <div class="info">
                                <span>{{ doctor.title }}</span>
                                <span>|</span>
                                <span>{{ doctor.docname }}</span>
                            </div>
                            <div class="skill">
                                {{ doctor.skill }}
                            </div>
                        </div>
                        <!-- 右侧区域展示挂号的钱数 -->
                        <div class="right">
                            <div class="money">${{ doctor.amount }}</div>
                            <el-button type="primary" size="default" @click="goStep2(doctor)">{{ doctor.availableNumber }}</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { reqHospitalWork, reqHospitalDoctor } from '@/api/hospital';
import { useRoute, useRouter } from 'vue-router'
import type { DocArr, Doctor, DoctorResponseData, HospitalWordData } from '@/api/hospital/type';
// 获取路由对象
let $route = useRoute()
// 获取路由器对象
let $router = useRouter()
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let limit = ref<number>(6)
// 存储医院科室挂号的数据
let workData = ref<any>({})
// 存储排班日期：当前数据的第一个
let workTime: any = ref({})
// 存储排班医生的数据
let docArr = ref<DocArr>([])
// 组件挂载完毕发一次请求
onMounted(() => {
    fetchWorkData()
})
// 获取挂号的数据
const fetchWorkData = async () => {
    let result: HospitalWordData = await reqHospitalWork(pageNo.value, limit.value, $route.query.hoscode as string, $route.query.depcode as string)
    if (result.code == 200) {
        workData.value = result.data
        // 存储第一天日期的数据
        workTime.value = workData.value.bookingScheduleList[0]
        // 获取一次医生的数据
        getDoctorWorkData()
    }
}

// 获取某一天医生排班的数据
const getDoctorWorkData = async () => {
    // 医院的编号
    let hoscode: string = $route.query.hoscode as string
    // 科室的编号
    let depcode: string = $route.query.depcode as string
    // 时间
    let workDate: string = workTime.value.workDate as string
    // 获取排班医生的数据
    let result: DoctorResponseData = await reqHospitalDoctor(hoscode, depcode, workDate)
    if (result.code == 200) {
        docArr.value = result.data
    }
}

// 点击顶部某一天的时候触发回调
const changeTime = (item: any) => {
    // 存储用户选择的那一天的数据
    workTime.value = item
    // 再发一次获取医生排班的数据
    getDoctorWorkData()
}

// 计算出上午排班的医生数据
let morningArr = computed(() => {
    return docArr.value.filter((doc: Doctor) => {
        return doc.workTime == 0
    })
})
// 计算出下午排班的医生的数据
let afterArr = computed(() => {
    return docArr.value.filter((doc: Doctor) => {
        return doc.workTime == 1
    })
})

// 路由跳转进入到选择就诊人页面
const goStep2 = (doctor:Doctor) => {
    // 编程式导航进行路由跳转且携带医生的id
    $router.push({path:'/hospital/register_step2',query:{docId:doctor.id}})
}
</script>

<style scoped lang="scss">
.warp {

    .top {
        display: flex;
        color: #7f7f7f;

        .line {
            width: 1px;
            height: 20px;
            background-color: red;
            margin: 0 5px;
        }

        .dot {
            margin: 0px 10px;
            background-color: skyblue;
        }
    }

    .center {
        margin: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;

        .time {
            font-weight: 900;
        }

        .container {
            width: 100%;
            display: flex;
            margin: 30px 0;

            .item {
                flex: 1;
                width: 100%;
                border: 1px solid skyblue;
                margin: 0 5px;
                // display: flex;
                // flex-direction: column;
                // align-items: center;
                transition: all 0.3s;
                &.active {
                    border: 1px solid #ccc;
                    color: #7f7f7f;

                    .top1 {
                        background-color: #ccc;
                    }
                }

                &.cur{
                    transform:scale(1.1)
                }
                .top1 {
                    background-color: #e8f2ff;
                    height: 30px;
                    width: 100%;
                    text-align: center;
                    line-height: 30px;
                }

                .bottom {
                    width: 100%;
                    height: 60px;
                    text-align: center;
                    line-height: 60px;
                }
            }
        }
    }

    .bottom {
        .will {
            text-align: center;
            font-size: 30px;
            font-weight: 900;

            .time {
                color: red;
            }

            .willText {
                color: skyblue;
            }
        }

        .doctor {
            .morning {
                .tip {
                    display: flex;
                    align-items: center;

                    .text {
                        color: #7f7f7f;
                        font-weight: 900;
                    }
                }

                .doc_info {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    border-bottom: 1px solid #ccc;

                    .left {
                        .info {
                            color: skyblue;
                            margin: 10px 0;

                            span {
                                margin: 0 5px;
                                font-size: 18px;
                                font-weight: 900;
                            }
                        }

                        .skill {
                            margin: 10px 0;
                            color: #7f7f7f;
                        }
                    }

                    .right {
                        width: 150px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .money {
                            color: #7f7f7f;
                            font-weight: 900;
                        }
                    }
                }
            }
        }
    }
}
</style>