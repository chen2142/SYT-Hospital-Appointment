import type { HosPitalDetail, DepartmentArr, UserInfo } from "@/api/hospital/type";


// 定义仓库内部存储数据state的ts类型
export interface DetailState {
    hospitalInfo: HosPitalDetail,
    departmentArr:DepartmentArr
}

// 用户仓库相关state数据的ts类型定义
export interface UserState{
    visible:boolean, //用于控制dialog的显示与隐藏   
    code:string,        // 存储用户的验证码
    userInfo:UserInfo
}