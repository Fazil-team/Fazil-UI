<template>
  <div class="min-h-screen flex animate-fadeIn">
    <!-- 左侧品牌区 -->
    <div class="w-2/5 bg-gradient-to-br from-blue-900 to-blue-800 text-white p-12 flex flex-col justify-between relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-3xl font-bold mb-4">{{ sys_setting.title }}</h1>
        <p class="text-lg text-blue-100">安全可靠的企业级数据存储与协作平台</p >
      </div>
      <div class="relative z-10 flex-grow flex items-center justify-center">
        <img :src="heroImage" alt="企业网盘" class="w-full h-auto object-contain" />
      </div>
      <div class="relative z-10">
        <div class="grid grid-cols-2 gap-6 mb-8">
          <div v-for="(feature, index) in features" :key="index" class="flex items-start">
            <i :class="feature.icon" class="text-blue-400 mr-3 mt-1"></i>
            <div>
              <h3 class="font-medium mb-1">{{ feature.title }}</h3>
              <p class="text-sm text-blue-200">{{ feature.desc }}</p >
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 右侧登录区 -->
    <div class="w-3/5 bg-white flex items-center justify-center right-panel">
      <div style="width: 100%;height: 100%;backdrop-filter: blur(16px)" class="p-12 flex items-center justify-center">
        <div class="w-[480px]" style="">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-800">{{ isLogin ? '欢迎回来' : '创建企业账号' }}</h2>
            <p class="text-gray-300 mt-2">{{ isLogin ? '请登录您的账号' : '开始使用网盘服务' }}</p >
          </div>
          <div class="mb-6 flex justify-center space-x-8">
            <button
                class="pb-2 px-4 font-medium whitespace-nowrap cursor-pointer"
                :class="isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'"
                @click="isLogin = true"
            >
              登录
            </button>
            <button
                class="pb-2 px-4 font-medium whitespace-nowrap cursor-pointer"
                :class="!isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-400'"
                @click="isLogin = false"
            >
              注册
            </button>
          </div>
          <a-form
              layout="vertical"
              style="width: 100%"
              :model="formState"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
          >
            <a-form-item
                name="email"
                :rules="[]"
            >
              <a-input
                  v-model="formState.email"
                  size="large"
                  placeholder="邮箱"
              >
                <template #prefix>
                  <mail-outlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item
                name="password"
                :rules="[]"
            >
              <a-input-password
                  v-model="formState.password"
                  size="large"
                  placeholder="密码"
              >
                <template #prefix>
                  <lock-outlined />
                </template>
              </a-input-password>
            </a-form-item>

            <a-form-item v-if="!isLogin" name="verificationCode" :rules="[]">
              <div class="flex" style="width: 100%">
                <a-input
                    v-model="formState.verificationCode"
                    size="large"
                    placeholder="验证码"
                    class="flex-1 mr-2"
                >
                  <template #prefix>
                    <safety-outlined />
                  </template>
                </a-input>
                <a-button
                    size="large"
                    :disabled="codeSending || !formState.email"
                    @click="sendVerificationCode"
                    class="whitespace-nowrap !rounded-button"
                >
                  {{ codeButtonText }}
                </a-button>
              </div>
            </a-form-item>
            <div class="flex justify-between mb-6">
              <a-checkbox v-if="isLogin" v-model:checked="formState.remember">
                记住我
              </a-checkbox>
              <a v-if="isLogin" class="text-blue-600 hover:text-blue-700" href=" ">忘记密码？</a >
            </div>
            <a-button
                type="primary"
                html-type="submit"
                size="large"
                class="w-full !rounded-button"
                :loading="loading"
                @click="submit"
            >
              {{ isLogin ? '登 录' : '注 册' }}
            </a-button>
            <div class="mt-8">
              <div class="relative">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-gray-200"></div>
                </div>
                <div class="relative flex justify-center">
                  <span class="px-4 text-sm text-white">其他登录方式</span>
                </div>
              </div>
              <div class="mt-6 flex justify-center space-x-6">
                <a-button class="!rounded-button whitespace-nowrap" shape="round">
                  <template #icon>
                    <wechat-outlined />
                  </template>
                  企业微信
                </a-button>
                <a-button class="!rounded-button whitespace-nowrap" shape="round">
                  <template #icon>
                    <dingtalk-outlined />
                  </template>
                  钉钉
                </a-button>
                <a-button class="!rounded-button whitespace-nowrap" shape="round">
                  <template #icon>
                    <icon-qq />
                  </template>
                  QQ
                </a-button>
              </div>
            </div>
          </a-form>
        </div>
      </div>

    </div>
    <!-- 登录结果提示 -->
    <a-modal
        v-model:visible="modalVisible"
        :title="modalTitle"
        :footer="null"
        @ok="handleModalOk"
    >
      <p>{{ modalContent }}</p >
      <div v-if="isLogin" style="display: flex;justify-content: end">
        <a-button type="primary" @click="jump_in">好的</a-button>
      </div>
      <div v-else  style="display: flex;justify-content: end">
        <a-button type="primary" @click="()=>{
          isLogin = true;
          modalVisible = false
        }">好的</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import {ref, reactive, computed, onUnmounted} from 'vue';
import {useLayoutStore} from "~/store/UseLayoutStore";
import {useUserStore} from "~/store/UseUserStore";
import {type Setting, useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";
import {useLoadingBar} from "naive-ui";
import * as apis from './apis'
import {baseURL} from "assets/config/network";
import * as msg from '~/assets/utils/message'

const loadingBar = useLoadingBar();
loadingBar.finish()
const layout = storeToRefs(useLayoutStore()).layout
const user = storeToRefs(useUserStore()).user_info
const sys_setting: Ref<Setting | any> = storeToRefs(useSettingStore()).setting
const bg = `url("${baseURL}/common/resource/sys?user_id=1")`

import {
  MailOutlined,
  LockOutlined,
  WechatOutlined,
  DingtalkOutlined,
  SafetyOutlined
} from '@ant-design/icons-vue';
import {useHead} from "unhead";
const isLogin = ref(true);
const loading = ref(false);
const modalVisible = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const heroImage = 'https://public.readdy.ai/ai/img_res/44c92fdf33d1a4c748ed7fc534283583.jpg';
const features = [
  {
    icon: 'fas fa-shield-alt',
    title: '企业级安全',
    desc: '多重加密保护，确保数据安全'
  },
  {
    icon: 'fas fa-sync',
    title: '实时同步',
    desc: '多端数据实时同步'
  },
  {
    icon: 'fas fa-users',
    title: '团队协作',
    desc: '高效的团队文件共享'
  },
  {
    icon: 'fas fa-clock',
    title: '24/7 支持',
    desc: '全天候技术支持服务'
  }
];
const formState = reactive({
  email: '',
  password: '',
  remember: false,
  verificationCode: ''
});

const emailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formState.email);
});

const codeSending = ref(false);
const countdown = ref(0);
const codeButtonText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}秒后重新获取` : '获取验证码';
});

const seqId = ref()

const sendVerificationCode = () => {
  codeSending.value = true;
  countdown.value = 60;

  apis.sendEmailCode(formState.email).then(res=>{
    seqId.value = res.data.data
    msg.success(`验证码已发送至 ${formState.email}，请查收`)
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
        codeSending.value = false;
      }
    }, 1000);
  })
  // 模拟发送验证码
  setTimeout(() => {

  }, 1000);
};
const handleModalOk = () => {
  modalVisible.value = false;
};
const onFinish = (values: any) => {

};
const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
const submit = ()=>{
  loading.value = true;
  if(isLogin.value){
    apis.login({
      username: formState.email,
      password: formState.password
    }).then(res => {
      loading.value = false;
      modalTitle.value = isLogin.value ? '登录成功' : '注册成功';
      modalContent.value = isLogin.value ? `欢迎回来！` : '账号创建成功，请登录使用。';
      modalVisible.value = true;
    }).catch(err=>{
      loading.value = false;
    })
  }else {
    apis.register({
      userName: formState.email,
      password: formState.password,
      checkCode: formState.verificationCode,
      seqId: seqId.value
    }).then(res=>{
      loading.value = false;
      modalTitle.value = isLogin.value ? '登录成功' : '注册成功';
      modalContent.value = isLogin.value ? `欢迎回来！` : '账号创建成功，请登录使用。';
      modalVisible.value = true;
    })
  }
}

let interval = setInterval(()=>{useHead({
  title: `${sys_setting.value.title}｜ 欢迎您`,
})},100)

onUnmounted(()=>{
  clearInterval(interval)
})

const jump_in = ()=>{
  localStorage.setItem("Authorization", <string>user.value?.token)
  layout.value = 'default'
}
</script>
<style scoped>
:deep(.ant-input-affix-wrapper) {
  @apply border border-gray-200 hover:border-blue-500 focus:border-blue-500;
}
:deep(.ant-input-affix-wrapper-focused) {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
:deep(.ant-btn-primary) {
  @apply bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700;
}
:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  @apply bg-blue-600 border-blue-600;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes slideInFromLeft {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInFromRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.w-2\/5 {
  animation: slideInFromLeft 0.8s ease-out;
}

.w-3\/5 {
  animation: slideInFromRight 0.8s ease-out;
}
.right-panel{
  background: v-bind(bg) no-repeat center rgba(0 0 0 / .2);
}
</style>
