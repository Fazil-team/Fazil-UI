<script setup lang="ts">
import {ref, reactive, onMounted, onUnmounted} from "vue";
import {useHead} from "unhead";
import {definePageMeta} from "#imports";
import {useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";
import * as apis from './apis'
import {useUserStore} from "~/store/UseUserStore";
import {baseURL} from "assets/config/network";
import Files from "~/pages/dashboard/components/Files.vue";
import Notify from "~/pages/dashboard/components/Notify.vue";
const sys_setting = storeToRefs(useSettingStore()).setting
const user = storeToRefs(useUserStore()).user_info

let interval = setInterval(() => {
  if(sys_setting.value.title){
    useHead({
      title: `${sys_setting.value.title}｜ 概览`,
    })
    clearInterval(interval)
  }
}, 100)


definePageMeta({
  name: '仪表板',
  parent: null
});

const height = ref()
const height_files = ref()
const yiyan = ref()

const init = ()=>{
  apis.getHitokoto().then(res=>{
    yiyan.value = res.data
    console.log(res.data)
  })
  try {
    height.value = `calc(${document.querySelector("body").clientHeight}px - ${document.getElementById("card").clientHeight + 'px'} - 12rem)`
    height_files.value = `calc(${document.querySelector("body").clientHeight}px - ${document.getElementById("welcome-card").clientHeight + 'px'} - 12rem)`
  }catch (e){

  }
}

onMounted(()=>{
  init()
})


</script>

<template>
  <div>
    <n-grid cols="4" :x-gap="12" item-responsive responsive="screen">
      <n-grid-item span="4 m:3 l:3">
        <n-card id="welcome-card" style="margin-bottom: 1rem;">
          <span style="font-size: 1.2rem;font-weight: 800;">中午好，{{user?.username}}！</span> <br>
          <span>{{yiyan?.hitokoto}} ——— {{yiyan?.from}}</span>
        </n-card>
        <n-card>
          <div :style="{
            'height': height_files,
            'overflow': 'auto'
          }">
            <div class="title">
              最近文件
            </div>
            <Files />
          </div>
        </n-card>
      </n-grid-item>
      <n-grid-item  span="0 m:1 l:1">
          <n-card id="card" style="margin-bottom: 1rem;">
            <div class="user-content">
              <div class="avatar">
                <div class="img">
                  <n-avatar :src="baseURL+`/common/resource/avatar?user_id=${user?.id}`" circle size="large"></n-avatar>
                </div>
                <div class="text">
                  <div class="username">{{user?.username}}</div>
                  <div class="desc">{{ user?.lastLoginTime }}</div>
                </div>
              </div>
              <div class="tags">
                <n-space>
                  <n-tag type="success" size="small">{{ user?.role }}</n-tag>
                </n-space>
              </div>
<!--              <n-divider />-->
            </div>
          </n-card>
        <n-card >
          <div :style="{
          'height': height,
          'overflow': 'auto'
        }">
            <div class="title" style="">
              公告
            </div>
            <div>
              <Notify v-for="item in 1"></Notify>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped lang="scss">
.light-green {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: rgba(0, 128, 0, 0.12);
}
.green {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: rgba(0, 128, 0, 0.24);
}
.user-content{
  .avatar{
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    .img{
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 1rem;
    }
    .text{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: start;
    }
  }
}
.title{
  font-size: 1.2rem;font-weight: 800;
  margin-bottom: 1rem;
}

</style>