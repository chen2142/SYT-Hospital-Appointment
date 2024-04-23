<template>
    <div class="login_container">
        <!-- title：对话框左上角的标题 v-model：控制对话框显示与隐藏 -->
        <el-dialog v-model="userStore.visible" title="用户登录">
            <!-- 对话框身体部分的结构 -->
            <el-row>
                <!-- 左侧结构：手机号码登录、微信扫一扫登录 -->
                <el-col :span="12">
                    <div class="login">
                        <div v-show="scene == 0">
                            <el-form :model="loginParam" :rules="rules" ref="form">
                                <el-form-item prop="phone">
                                    <el-input placeholder="请输入手机号码" :prefix-icon="User" v-model="loginParam.phone">
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="code">
                                    <el-input placeholder="请输入手机验证码" :prefix-icon="Lock" v-model="loginParam.code">
                                    </el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button :disabled="isDisabled" @click="getCode">
                                        <CountDown v-if="flag" :flag="flag" @getFlag="getFlag"></CountDown>
                                        <span v-else>获取验证码</span>
                                    </el-button>
                                </el-form-item>
                            </el-form>
                            <div class="bottom">
                                <el-button style="width: 100%;" type="primary" size="default"
                                    :disabled="!isPhone || loginParam.code.length < 6 ? true : false"
                                    @click="login">用户登录</el-button>
                                <div @click="changeScene">
                                    <p>微信扫码登录</p>
                                    <p>此处放微信图标</p>
                                </div>
                            </div>
                        </div>
                        <div class="webchat" v-show="scene == 1">
                            <!-- 在这个容器中显示微信扫码登录的页面 -->
                            <div id="login_container"></div>
                            <div class="phone" @click="handler">
                                <p>手机短信验证码登录</p>
                                <div>这里是手机图标</div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="leftContent">
                        <div class="top">
                            <div class="item">
                                <img src="../../assets/images/code_app.png" alt="">
                                <p>小图标</p>
                                <p>微信扫一扫关注</p>
                                <p>快速预约挂号</p>
                            </div>
                            <div class="item">
                                <img src="../../assets/images/code_login_wechat.png" alt="">
                                <p>手机图标</p>
                                <p>扫一扫下载</p>
                                <p>“预约挂号APP”</p>
                            </div>
                        </div>
                    </div>
                    <p class="tip">商医通官方指定平台</p>
                    <p class="tip">快速挂号 安全放心</p>

                </el-col>
            </el-row>
            <template #footer>
                <el-button type="primary" size="default" @click="closeWindow">关闭窗口</el-button>
            </template>
        </el-dialog>

    </div>
</template>

<script setup lang="ts">
// 引入微信扫码登录参数请求
import {reqWxLogin} from '@/api/hospital'
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue'
import type {WXLoginResponseData} from '@/api/hospital/type'
import {useRouter,useRoute} from 'vue-router'
// 获取user仓库的数据（ visible）可以控制login组件的对话框显示与隐藏
import useUserStore from '@/store/modules/user';
let userStore = useUserStore()
import { reactive, ref, computed, watch } from 'vue'
// 引入倒计时组件
import CountDown from '../countdown/index.vue'

// 获取路由器对象
let $router = useRouter()
let $route = useRoute()

// 定义一个响应式数据控制倒计时显示与隐藏
let flag = ref<boolean>(false) //flag如果为真，开启倒计时，flag如果为假并非倒计时

let scene = ref<number>(0) //0代表手机号码 如果是1代表微信扫码

defineOptions({ name: 'Login' })

// 获取form组件实例
let form = ref<any>()

// 收集表单数据---手机号码
let loginParam = reactive({
    phone: '', //收集手机号码
    code: '',  //收集验证码
})

// 计算出当前表单元素收集的内容是否是手机号码格式
let isPhone = computed(() => {
    // 手机号码正则表达式
    const reg = /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/
    // 返回布尔值：真代表手机号码、假代表的不是手机号码
    return reg.test(loginParam.phone)
})

let isDisabled = computed(() => {
    return !isPhone.value || flag.value
})

// 点击微信扫码登录和微信小图标切换为微信扫码登陆
const changeScene = async function () {
    // 切换为场景1
    scene.value = 1
    // 发请求获取微信扫码二维码需要的参数
    // 咱们在向硅谷学校的服务器发请求，获取微信扫码登录页面的参数
    // 还需要携带一个参数：告诉学校的服务器用户授权成功以后重定向到项目的某一个页面
    let redirect_URL = encodeURIComponent(window.location.origin)
    let result:WXLoginResponseData = await reqWxLogin(redirect_URL)
    // 生成微信扫码登录的二维码页面
    // @ts-ignore
    new WxLogin({
        self_redirect: true, //true:手机点击确认登录后可以在ifram内跳转到redirect_uri
        id: 'login_container', //显示二维码的容器设置
        appid: result.data.appid, //应用位置标识appid
        scope: 'snsapi_login',//当前微信扫码登录页面已经授权了
        redirect_uri: result.data.redirectUri,//填写授权回调域路径，就是用户授权成功以后微信服务器向公司后台推送code地址
        state: result.data.state,//state就是学校服务器重定向地址携带用户信息
        style: 'black',//字的颜色黑还是白
        href: '',
    })
}

const closeWindow = function () {
    userStore.visible = false
}

// 获取验证码按钮的回调
const getCode = async () => {
    // 解决element-plus按钮禁用还能点击的问题
    if (isDisabled.value) return
    // 开启倒计时模式
    flag.value = true
    // 通知pinia仓库存储验证码
    try {
        // 获取验证码成功
        await userStore.getCode(loginParam.phone)
        loginParam.code = userStore.code
    } catch (error) {
        // 获取验证码失败
        ElMessage({
            type: 'error',
            message: (error as Error).message,
        })
    }
}

// 计数器子组件绑定的自定义事件
// 当倒计时为零的时候，通知父组件倒计时组件隐藏
const getFlag = (val: boolean) => {
    flag.value = val
}

// 点击登录按钮的回调
const login = async () => {
    // 保证表单校验的两项都符合条件
    await form.value.validate()
    // 发起登录请求
    // 登录请求成功：顶部组件需要展示用户名字、对话框关闭
    // 登录请求失败：弹出对应登录失败的错误信息
    try {
        // 用户登录成功
        await userStore.userLogin(loginParam)
        // 关闭对话框
        userStore.visible = false
        // 获取url的query参数
        let redirect = $route.query.redirect
        if (redirect) {
            $router.push(redirect as string)
        }else{
            $router.push('/home')
        }
    } catch (error) {
        ElMessage({
            type: 'error',
            message: (error as Error).message
        })
    }
}

// 自定义校验规则：手机号码自定义校验规则
const validatorPhone = (rule: any, value: any, callBack: any) => {
    // rule即为表单校验规则对象
    // value即为当前文本内容
    // callBack相应的回调函数
    const reg = /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/
    if (reg.test(value)) {
        callBack() //放行
    } else {
        callBack(new Error('请输入正确的手机号码格式'))
    }
}

// 自定义校验规则：验证码
const validatorCode = (rule: any, value: any, callBack: any) => {
    // rule即为表单校验规则对象
    // value即为当前文本内容
    // callBack相应的回调函数
    const reg = /^\d{6}$/
    if (reg.test(value)) {
        callBack() //放行
    } else {
        callBack(new Error('请输入正确的验证码格式'))
    }
}

// 表单校验的规则对象
const rules = {
    // 手机号码的校验规则
    // required:代表当前字段务必进行校验
    // message:代表的校验错误的提示信息
    // trigger:代表的表单校验触发的时机     change:文本发生变化的时候进行校验 blur:失去焦点的时候去校验
    // min：代表的是最小位数
    // max：代表的是最大位数
    // phone:[
    //     {required:true,message:'手机号码务必11位', trigger:'change', min:11}
    // ]

    // 自定义校验
    phone: [{ trigger: 'change', validator: validatorPhone }],
    code: [{ trigger: 'change', validator: validatorCode }],
}

// 对话框关闭事件回调
// const close = () => {
//     // 清空收集到的数据
//     Object.assign(loginParam, { phone: '', code: '' })
//     form.value.resetFields()
// }

// 点击手机短信验证码盒子的回调
const handler = ()=>{
    scene.value = 0 
}

// 监听场景的数据
watch(()=>scene.value,(val:number)=>{
    if (val==1) {
        userStore.queryState()
    }
})
</script>

<style scoped lang="scss">
.login_container {

    // 深度选择器
    ::v-deep(.el-dialog__body) {
        border-top: 1px solid #ccc;
        border-bottom: solid 1px #ccc;
    }

    .login {
        border: 1px solid #ccc;
        padding: 20px;
        .webchat{
            display: flex;
            flex-direction: column;
            align-items: center;
            .phone{
                display: flex;
                flex-direction: column;
                align-items: center;
                p{
                    margin: 10px 0;
                }
            }
        }
    }

    .bottom {
        display: flex;
        flex-direction: column;
        align-items: center;

        p {
            margin: 10px 0;
        }
    }

    .leftContent {
        .top {
            display: flex;
            justify-content: space-around;

            .item {
                display: flex;
                flex-direction: column;
                align-items: center;

                img {
                    width: 130px;
                    height: 130px;
                }

                p {
                    margin: 5px 0;
                }
            }
        }


    }

    .tip {
        text-align: center;
        margin: 20px 0;
        font-size: 20px;
        font-weight: 900;
    }
}
</style>