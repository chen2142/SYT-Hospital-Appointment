import { defineStore } from 'pinia'
// pinia仓库写法：组合式API、选择式API写法
import {reqHospitalDetail, reqHospitalDepartment} from '@/api/hospital'
// 引入详情数据的ts类型
import type {DepartmentResponseData, HospitalDetail, DepartmentArr} from '@/api/hospital/type'
import type { DetailState } from './interface'
import type { HosPitalDetail } from '@/api/hospital/type'
const useDetailStore = defineStore('Detail', {
    state: ():DetailState => {
        return {
            // 医院详情的数据
            hospitalInfo:({} as HosPitalDetail),
            // 存储医院科室的数据
            departmentArr:[]
        }
    },
    actions: {
        // 获取医院详情的方法
        async getHospital(hoscode:string){
            let result:HospitalDetail = await reqHospitalDetail(hoscode)
            // console.log(result);
            if (result.code==200) {
                this.hospitalInfo = result.data
            }
        },
        // 获取某一个医院科室的数据
        async getDepartment(hoscode:string){
            let result:DepartmentResponseData = await reqHospitalDepartment(hoscode)
            // console.log(result);
            if (result.code==200) {
                this.departmentArr = result.data
            }
        }
    },
    getters: {

    }
})


// 获取仓库的方法对外暴露
export default useDetailStore