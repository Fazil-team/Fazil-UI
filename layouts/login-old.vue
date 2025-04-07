<script setup lang="ts">
import {useLayoutStore} from "~/store/UseLayoutStore";
import {useUserStore} from "~/store/UseUserStore";
import {type Setting, useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";
import {useLoadingBar} from "naive-ui";
import {reactive, type Ref} from "vue";
import * as apis from './apis'
import {baseURL} from "assets/config/network";
import * as msg from '~/assets/utils/message'

const loadingBar = useLoadingBar();
loadingBar.finish()
const layout = storeToRefs(useLayoutStore()).layout
const user = storeToRefs(useUserStore()).user_info
const sys_setting: Ref<Setting | any> = storeToRefs(useSettingStore()).setting

const bg = `url("${baseURL}/common/resource/sys?user_id=1")`

const formdata = reactive({
  username: '',
  password: ''
})

const login = () => {
  apis.login(formdata).then(res => {
    localStorage.setItem("Authorization", <string>user.value?.token)
    layout.value = 'default'
  })
}

onMounted(() => {
  console.log(`${baseURL}/common/resource/sys?user_id=1`)
})

const status = ref('login')
const sended_email = ref(false)
const time = ref(60)

const register_form = reactive({
  userName: '',
  password: '',
  checkCode: '',
  seqId: ''
})

const getEmailCode = ()=>{
  sended_email.value = true
  let interval = setInterval(()=>{
    time.value--;
    if(time.value == 0){
      time.value = 60;
      sended_email.value = false
      clearInterval(interval)
    }

  },1000)
  apis.sendEmailCode(register_form.userName).then(res=>{
    console.log(res.data.data)
    register_form.seqId = res.data.data
    msg.success("验证码发送成功")
  })
}

const register = ()=>{
  apis.register(register_form).then(res=>{
    console.log(res)
    msg.success("注册成功")
    status.value = 'login'
  })
}
</script>

<template>
  <div class="login-box">
    <div class="img">

    </div>
    <div class="login-panel" v-if="status === 'login'">
      <div style="display: flex;justify-content: center;margin: 1rem 0">
        <img :src="baseURL+'/common/resource/sys?user_id=3'" width="200" alt="">
      </div>
      <div class="title">登陆 - {{ sys_setting.title }}｜用户端</div>
      <div class="form">
        <n-form>
          <n-form-item label="用户名">
            <n-input v-model:value="formdata.username" placeholder="请输入用户名"></n-input>
          </n-form-item>
          <n-form-item label="密码">
            <n-input v-model:value="formdata.password" type="password" placeholder="请输入密码"></n-input>
          </n-form-item>
        </n-form>
      </div>
      <div class="btn" style="display: flex;justify-content: space-around">
        <n-button style="width: 48%" type="primary" @click="login()">登陆</n-button>
        <n-button style="width: 48%" type="primary" @click="status = 'register'">注册</n-button>
      </div>
      <div class="footer">
        <a href="https://blog.mrcsh.cn" class="link">Powered By Virus_Cui</a>
        <ICP color="#FFF" />
      </div>
    </div>
    <div class="login-panel" v-if="status === 'register'">
      <div style="display: flex;justify-content: center;margin: 1rem 0">
        <img :src="baseURL+'/common/resource/sys?user_id=3'" width="200" alt="">
      </div>
      <div class="title">注册 - {{ sys_setting.title }}｜用户端</div>
      <div class="form">
        <n-form>
          <n-form-item label="邮箱">
            <n-input v-model:value="register_form.userName" placeholder="请输入邮箱"></n-input>
          </n-form-item>
          <n-form-item label="密码">
            <n-input v-model:value="register_form.password" type="password" placeholder="请输入密码"></n-input>
          </n-form-item>
          <n-form-item label="邮箱验证码">
            <n-input v-model:value="register_form.checkCode" placeholder="请输入邮箱验证码">
            </n-input>
            <n-button :disabled="sended_email" type="primary" style="margin-left: 1rem" @click="getEmailCode">{{sended_email?time+' 秒':'获取验证码'}}</n-button>
          </n-form-item>
        </n-form>
      </div>
      <div class="btn" style="display: flex;justify-content: space-around">
        <n-button style="width: 48%" type="primary" @click="register()">注册</n-button>
        <n-button style="width: 48%" type="primary" @click="status = 'login'">去登陆</n-button>
      </div>
      <div class="footer">
        <a href="https://blog.mrcsh.cn" class="link">Powered By Virus_Cui</a>
        <ICP color="#FFF" />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.login-box {
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  flex-direction: row;
  display: flex;
  justify-content: center;
  align-items: center;
  background: v-bind(bg) no-repeat center;
  background-size: cover;

  .img {
    width: 70%;
    height: 100vh;
  }

  .login-panel {
    width: 30%;
    height: 100vh;
    color: #f5f5f7;
    //width: 24rem;
    //border-radius: 8px;
    padding: 15rem 2rem 2rem 2rem;
    box-sizing: border-box;
    box-shadow: 0 0 10px rgba(0 0 0 / .2);
    backdrop-filter: blur(8px);
    background: rgba(0 0 0 / .4);

    .title {
      font-size: 1.2rem;
      font-weight: 800;
      text-align: center;
      margin: 0 0 1rem 0;
    }

    .form {
      :deep(.n-form) {
        .n-form-item-label {
          .n-form-item-label__text {
            color: #f5f5f7;
          }
        }
      }
    }

    .footer {
      text-align: center;
      margin-top: 1rem;
    }
  }
}

@media (max-width: 765px) {
  .img {
    display: none;
  }
  .login-box{
    .login-panel {
      width: 100vw;
    }
  }

}
</style>


