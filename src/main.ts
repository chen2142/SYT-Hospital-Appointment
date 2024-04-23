
// vue3框架提供的方法createApp方法，可以用来创建应用实例方法
import { createApp } from 'vue'
// 引入清除默认样式
import '@/style/reset.scss'
// 引入根组件App
import App from './App.vue'
// 引入全局组件--顶部、底部都是全局组件
import HospitalTop from '@/components/hospital_top/index.vue'
import HospitalBottom from '@/components/hospital_bottom/index.vue'
import Login from '@/components/login/index.vue';

// 引入vue-router核心插件并安装
import router from '@/router'

// 引入element-plus插件
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
// 国际化文件
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// 引入pinia仓库
import pinia from '@/store'
// 全局组件visitor
import Visitor from '@/components/visitor/visitor.vue'


// 利用createApp方法创建应用实例
const app = createApp(App)
app.component('HospitalTop',HospitalTop)
app.component('HospitalBottom',HospitalBottom)
app.component('Login', Login)
// 就诊人全局组件
app.component('Visitor', Visitor)


// 安装pinia仓库
app.use(pinia)

// 安装vue-router
app.use(router)
// 安装element-plus插件
app.use(ElementPlus,{
    locale:zhCn,
})
// 引入路由鉴权的文件
import './permission'
//挂载
app.mount('#app')