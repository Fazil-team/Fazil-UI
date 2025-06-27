<script setup>
import {h, ref, onMounted, watch} from "vue";
import {
  NIcon,
  darkTheme,
  useOsTheme,
  NConfigProvider,
  useLoadingBar,
  useMessage,
  useDialog,
  useNotification
} from "naive-ui";
import * as msg from '@/assets/utils/message'

import {HddOutlined} from '@vicons/antd'
import swBtn from '@/components/switch.vue'
import text from '~/components/logo-text.vue'
import {useRouter, useRoute} from "#app";
import LogoSmall from "~/components/logo-small.vue";
import {gen_router_paths} from "assets/utils/utils.js";
import NuxtLink from "#app/components/nuxt-link.js";
import {theme} from '~/assets/config/theme'
import {renderIcon} from "assets/utils/icons.js";
import {useUserStore} from "~/store/UseUserStore";
import {useDownloadTaskStore} from "~/store/UseDownloadTaskStore";
import {useStorageStore} from "~/store/UseStorageStore";
import {storeToRefs} from "pinia";
import * as auth_api from '~/layouts/apis'
import {CloseOutlined} from '@vicons/antd'
import {creatWebSocket} from '@/assets/utils/websocket'
import {size2Str} from "../assets/utils/commons.js";
import {get_user_storage, getVer} from "~/layouts/apis";
import {wsURL, baseURL} from "assets/config/network.js";
import {useUploadTaskStore} from "~/store/UseUploadFileTask";

const tasks = storeToRefs(useUploadTaskStore()).task

const links = ref([])
const user = storeToRefs(useUserStore()).user_info
const download_tasks = storeToRefs(useDownloadTaskStore()).task
const storage = storeToRefs(useStorageStore()).data
const loading = ref(true)
const router = useRouter();
const percent = ref(0)
const path = ref()
const loadingBar = useLoadingBar();
const settings_open = ref(false)

const keepalive = {
  include: ["/user/files"],
};

const options = [
  {
    label: '个人设置',
    key: 'setting',
    disabled: false
  },
  {
    label: '退出登陆',
    key: 'logout',
    disabled: false
  }
]
// 设置前置路由守卫
router.beforeEach((to, from, next) => {
  // 路由中导入-开始
  loadingBar.start()
  next()
})
// 设置后置路由守卫
router.afterEach((to, from, next) => {
  // 路由中导入-结束
  loadingBar.finish()
})


const themeOverrides = theme
const dark = ref()
const header = {
  label:
      () => h(NuxtLink, {
        to: '/'
      }, renderIcon(text)),
  icon: renderIcon(LogoSmall)
}
const menuOptions = ref([])

const collapsed = ref(false)
const small = ref(false)
let interval = ref()

setInterval(()=>{
  small.value = window.innerWidth < 768
},300)

watch(()=>small.value, (value)=>{
  collapsed.value = small.value
})


watch(() => router.currentRoute.value, () => {
  setTimeout(() => {
    path.value = router.currentRoute.value.fullPath
  }, 100)
})

const getToken = ()=>{
  return localStorage.getItem('Authorization')
}

const set_item = () => {
  if (router.currentRoute.value.fullPath == '/') {
    return;
  }
  for (let j = 0; j < links.value.length; j++) {
    let item = links.value[j]
    item.checked = false
  }
  for (let i = 0; i < links.value.length; i++) {
    let element = links.value[i]
    if (element.path == router.currentRoute.value.fullPath) {
      element.checked = true
      return
    }
  }
  links.value.push({
    title: router.currentRoute.value.meta.name,
    path: router.currentRoute.value.fullPath,
    checked: true
  })
}

watch(() => router.currentRoute.value, () => {
  set_item()
})

const handleSelect = (key) => {
  switch (key) {
    case 'logout':
      auth_api.logout()
      break
    case 'setting':
      settings_open.value = true
      break
  }
}

const getStorage = () => {
  percent.value = ((storage.value?.used_storage / storage.value?.total_storage) * 100).toFixed(2);
}

watch(() => storage.value, () => {
  percent.value = ((storage.value?.used_storage / storage.value?.total_storage) * 100).toFixed(2);
})

const version = ref('')

const init = async () => {
  loading.value = true
  get_user_storage().then(res => {
    getStorage()
  })
  if (process.client) {
    loadingBar.start()
    path.value = router.currentRoute.value.fullPath
  }
  if (user.value == undefined && router.currentRoute.value.path !== '/share') {
    auth_api.logout()
    return
  }
  if(user.value){
    let genRouterPaths = await gen_router_paths(user.value.menus);
    genRouterPaths.unshift(header)
    menuOptions.value = genRouterPaths
    loading.value = false
    interval.value = setInterval(() => {
      if (useOsTheme().value == 'dark') {
        dark.value = darkTheme
      } else {
        dark.value = undefined
      }
    }, 100)
    if (process.client) {
      loadingBar.finish()
    }
    getVer().then(res => {
      version.value = res.data.data
    })
  }
}

const init_ws = async () => {
  if(user.value){
    creatWebSocket(`${wsURL}/wsInterface/${user.value.token}`)
  }
}

onMounted(async () => {
  $mount()
  await init()
  await init_ws()
})


const $mount = () => {
  if (process.client) {
    window.$message = useMessage()
    window.$dialog = useDialog()
    window.$notify = useNotification()
    set_item()
    let interval = setInterval(() => {
      var elementById = document.getElementById('space');
      if (elementById != null) {
        clearInterval(interval)
        document.getElementById('space').addEventListener('wheel', (event) => {
          event.preventDefault();
          document.getElementById('space').scrollBy({
            left: event.deltaY < 0 ? -30 : 30,  // >0 是下滑，<0是上滑
          });
        });
      }
    }, 100)

  }
}

const changeTheme = (mode) => {
  clearInterval(interval.value)
  if (mode.mode) {
    dark.value = darkTheme
  } else {
    dark.value = undefined
  }
}

const change = (e) => {
  if (process.client) {
    localStorage.setItem('path', e.target.innerText)
  }
}

const cancel_download = (id) => {
  for (let i = 0; i < download_tasks.value.length; i++) {
    let ele = download_tasks.value[i]
    if (ele.file_id == id) {
      download_tasks.value = download_tasks.value.filter(item => item !== ele);
    }
  }
}

const upload_avatar = (options)=>{

}

watch(()=>path.value, (value, oldValue, onCleanup)=>{
  if(value.startsWith("/user/files")){
    path.value = "/user/files";
  }
})

</script>

<template>
  <ClientOnly>
    <n-config-provider :theme="dark" :theme-overrides="themeOverrides">
      <n-layout has-sider>
        <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            width="240px"
            style="height: 100vh"
            :collapsed="collapsed"
            show-trigger="bar"
            @collapse="collapsed = true"
            @expand="collapsed = false"
        >
          <div
              style="display: flex;height: 100vh; width: 100%;  justify-content: space-between;flex-direction: column;">
            <n-skeleton v-if="loading" :width="'100%'" :height="'100%'" size="medium"/>
            <n-menu
                v-else
                v-model:value="path"
                :collapsed="collapsed"
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="menuOptions"
                @click="change"
                key-field="key"
            />
            <div
                :style="{'position': 'relative', 'z-index': '999', 'height': collapsed?'5rem':'6rem'}" class="admin">
              <div v-if="!collapsed"
                   style="display: flex;justify-content: left;align-items: center;width: 100%;flex-wrap: wrap">
                <div style="margin: 0 1rem">
                  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
                    <n-avatar circle :src="baseURL+`/common/resource/avatar?user_id=${user?.id}`"></n-avatar>
                  </n-dropdown>
                </div>
                <div>

                  {{ user?.username }}
                </div>
                <div style="width: 100%;padding: 0 1rem;display: flex;justify-content: start">
                  <n-tag round :bordered="false" type="success" size="small">
                   存储空间：{{ size2Str(storage?.total_storage - storage?.used_storage) }}
                    <template #icon>
                      <n-icon>
                        <HddOutlined></HddOutlined>
                      </n-icon>
                    </template>
                  </n-tag>
                </div>
                <div style="width: 100%;padding: 0 1rem">
                  <n-progress
                      style="width: 100%"
                      type="line"
                      :percentage="percent"
                  />
                </div>
              </div>
              <div v-else style="margin-left: 1rem" class="small">
                <n-avatar circle :src="baseURL+`/common/resource/avatar?user_id=${user?.id}`"></n-avatar>
<!--                <n-progress-->
<!--                    style="width: 30px;height: 30px;font-size: .2rem"-->
<!--                    type="circle"-->
<!--                    :percentage="percent"-->
<!--                />-->
              </div>
            </div>
          </div>
        </n-layout-sider>
        <n-layout>
          <n-layout-header bordered style="height: 3rem;display: flex;align-items: center;padding: 0 1rem">
            <div style="display: flex;justify-content: space-between;align-items: center;width: 100%">
              <div>
                <Bread/>
              </div>
              <div style="flex-direction: row;display: flex;">
<!--                <div style="margin-right: 1rem;">-->
<!--                  <n-popover style="width: 600px;height: 800px" trigger="click">-->
<!--                    <template #trigger>-->
<!--                      <n-badge :value="download_tasks.length">-->
<!--                        <i style="font-size: 1.2rem;cursor: pointer" class="iconfont icon-sorting"></i>-->
<!--                      </n-badge>-->
<!--                    </template>-->
<!--                    <template #header>-->
<!--                      <div-->
<!--                          style="display: flex;justify-content: center;align-items: center;font-size: 1.2rem;font-weight: 800;">-->
<!--                        上传任务-->
<!--                      </div>-->
<!--                    </template>-->
<!--                                        {{tasks}}-->
<!--&lt;!&ndash;                    <n-scrollbar style="max-height: 740px">&ndash;&gt;-->
<!--&lt;!&ndash;                      <n-empty v-if="download_tasks.length == 0" description="当前没有上传任务">&ndash;&gt;-->
<!--&lt;!&ndash;                        <template #extra>&ndash;&gt;-->

<!--&lt;!&ndash;                        </template>&ndash;&gt;-->
<!--&lt;!&ndash;                      </n-empty>&ndash;&gt;-->
<!--&lt;!&ndash;                      <div v-else v-for="item in tasks"&ndash;&gt;-->
<!--&lt;!&ndash;                           style="border: 1px solid #dfdfdf;padding: .5rem;border-radius: 4px;margin: .5rem 0">&ndash;&gt;-->
<!--&lt;!&ndash;                        <div style="display: flex;justify-content: space-between">&ndash;&gt;-->
<!--&lt;!&ndash;                          <div>{{ item?.name }}</div>&ndash;&gt;-->
<!--&lt;!&ndash;                          <div>{{ item }}</div>&ndash;&gt;-->
<!--&lt;!&ndash;                          <div @click="cancel_download(item.file_id)" class="close-btn"><i&ndash;&gt;-->
<!--&lt;!&ndash;                              class="iconfont icon-close"></i></div>&ndash;&gt;-->
<!--&lt;!&ndash;                        </div>&ndash;&gt;-->
<!--&lt;!&ndash;                        <n-progress status="success" :show-indicator="false" type="line" :percentage="item.percentage"&ndash;&gt;-->
<!--&lt;!&ndash;                                    :processing="item.percentage != 100"/>&ndash;&gt;-->
<!--&lt;!&ndash;                        <div style="display: flex;justify-content: end">&ndash;&gt;-->
<!--&lt;!&ndash;                          <div>{{ item.percentage }}%</div>&ndash;&gt;-->
<!--&lt;!&ndash;                        </div>&ndash;&gt;-->
<!--&lt;!&ndash;                      </div>&ndash;&gt;-->
<!--&lt;!&ndash;                    </n-scrollbar>&ndash;&gt;-->
<!--&lt;!&ndash;                    <template #footer>&ndash;&gt;-->
<!--&lt;!&ndash;                    </template>&ndash;&gt;-->
<!--                  </n-popover>-->
<!--                </div>-->
                <div style="display: flex;align-items: center">
                  <swBtn @change="changeTheme"></swBtn>
                </div>
              </div>
            </div>
          </n-layout-header>
          <!--          <n-layout-header bordered style="height: 3rem;display: flex;align-items: center;padding: 0 1rem">-->
          <!--            <n-space id="space" style="flex-flow: nowrap;overflow: auto">-->
          <!--              <n-tag :disabled="item.checked" @click="navigateTo(item.path)" checkable closable round @checkedChange="val=>{-->
          <!--               return false-->
          <!--              }" v-for="item in links" v-model:checked="item.checked" type="info"-->
          <!--                     style="cursor: pointer;">-->
          <!--                {{ item.title }}-->
          <!--                <CloseOutlined style="width: 10px"></CloseOutlined>-->
          <!--              </n-tag>-->
          <!--            </n-space>-->
          <!--          </n-layout-header>-->
          <n-layout-content bordered
                            style="height: calc(100vh - 6rem);display: flex;align-items: center;padding: 1rem 1rem;width: 100%;">
            <NuxtPage :keepalive/>
          </n-layout-content>
          <n-layout-footer bordered style="height: 3rem;display: flex;align-items: center;padding: 0 0 0 1rem;font-weight: 100;">Powered
              By Virus_Cui @ Fazil
            <ICP color="#000" style="margin-left: 1rem"/>
          </n-layout-footer>
        </n-layout>
      </n-layout>

      <n-drawer v-model:show="settings_open" :width="502" placement="right">
        <n-drawer-content title="个人设置">
          <n-form-item label="头像">
            <n-upload
                :on-before-upload="data => {
                  if((data.file.file.size / 1024) > 1024*5){
                    msg.warn('文件过大')
                    Promise.reject('文件过大')
                  }
                }"
                :headers="{
                  'Authorization': getToken()
                }"
                :action="baseURL+'/user/change_user_avatar'"
                list-type="image-card"
                :default-file-list="user?.avatar != null ? [
                    {
                      id: 'c',
          name: 'avatar.png',
          status: 'finished',
          url: baseURL+`/common/resource/avatar?user_id=${user?.id}`
                    }
                ]: []"
                max="1"
            >
              点击上传
            </n-upload>
          </n-form-item>
        </n-drawer-content>
      </n-drawer>
    </n-config-provider>
  </ClientOnly>
</template>

<style scoped>


:deep(.n-menu > .n-menu-item:first-child > .n-menu-item-content.n-menu-item-content--selected::before) {
  background: none;
}

:deep(.n-layout-scroll-container) {
  width: 100%;
}

:deep(.n-layout-toggle-bar) {
  right: -24px;
}

.admin {
  display: flex;
  justify-content: left;
  align-items: center;
  overflow: hidden;
}

:deep(.n-space) {
  display: inline;
  flex-wrap: nowrap;
  flex-flow: nowrap;
}

/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 16px;
  height: 0px;
  background-color: #F5F5F5;
}

/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #F5F5F5;
}

/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #555;
}

.close-btn {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid #dfdfdf;
  transition: all .2s;
  cursor: pointer;
  margin-bottom: .2rem;

  &:hover {
    background: rgba(223, 223, 223, .6);
  }

  i {
    &::before {
      vertical-align: middle;
    }
  }
}

.small {
  :deep(.n-progress-text) {
    font-size: .6rem;
  }
}

</style>
