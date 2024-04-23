<template>
    <div class="notice">
        <h1 class="hosname">{{hospitalStore.hospitalInfo.hospital?.hosname}}预约挂号须知</h1>
        <div class="top">为方便您早日就医，请您认真阅读预约挂号须知：</div>
        <div class="info">
            <div class="tip">一、预约实名制：</div>
            <div class="text">统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效身份证号证件</div>
        </div>
        <div class="info">
            <div class="tip">二、预约挂号：</div>
            <div class="text">统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效身份证号证件</div>
        </div>
        <div class="info">
            <div class="tip">三、取消预约：</div>
            <div class="text">统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效身份证号证件</div>
        </div>
        <div class="info">
            <div class="tip">四、爽约处理：</div>
            <div class="text">统一平台电话预约和网上预约挂号均采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效身份证号证件</div>
        </div>
    </div>
</template>

<script setup lang="ts">
// 引入仓库
import useDetailStore from '@/store/modules/hospitalDetail';
let hospitalStore = useDetailStore()
</script>

<style scoped lang="scss">
.notice{
    .hosname{
        text-align: center;
        font-size: 30px;
    }

    .top{
        margin: 10px 0;
        color: #7f7f7f;
    }

    .info{
        .tip{
            color: red; 
            font-weight: 900;
        }

        .text{
            color: #7f7f7f;
            margin: 10px 0;
            line-height: 30px;
        }
    }
}
</style>