<template>
    <div>
        <div class="info">
            <h1>{{ hospitalStore.hospitalInfo.hospital?.hosname }}查询信息</h1>
            <el-empty description="暂无信息"></el-empty>
        </div>
    </div>
</template>

<script setup lang="ts">
// 引入仓库
import useDetailStore from '@/store/modules/hospitalDetail';
let hospitalStore = useDetailStore()

</script>

<style scoped lang="scss">
.info{
    h1{
        text-align: center;
        font-size: 30px;
    }
}

</style>