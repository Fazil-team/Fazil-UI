<script setup lang="ts">
import {ref, reactive, onUnmounted} from "vue";
import '@arco-design/web-vue/dist/arco.css';
import FileIcon from "~/pages/user/files/components/FileIcon.vue";
import {useRouter} from "#app";
import {check_share_code, get_share_user_info} from "~/pages/user/files/apis";
import {baseURL} from "assets/config/network.js";
import {size2Str} from "assets/utils/commons";
import ICP from "~/components/ICP.vue";
import {useHead} from "unhead";
import {type Setting, useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";
const sys_setting: Ref<Setting | any> = storeToRefs(useSettingStore()).setting

let interval = setInterval(()=>{useHead({
  title: `${sys_setting.value.title}｜ 文件分享`,
})},100)

onUnmounted(()=>{
  clearInterval(interval)
})
const router = useRouter();

const onFinish = () => {
  check()
}

const isChecked = ref(false)
const share_id = ref()
const share_code = ref()
const fileInfo = ref()
const shareInfo = ref()

onMounted(() => {
  share_code.value = router.currentRoute.value.query.pwd;
  share_id.value = router.currentRoute.value.query.id;
  get_share_user_info(share_id.value).then(res=>{
    console.log(res)
    shareInfo.value = res.data.data
  })
})

const check = () => {
  check_share_code(share_code.value, share_id.value).then(res => {
    if (res.data.data != null) {
      fileInfo.value = res.data.data
      isChecked.value = true
    }
    console.log(res)
  })
}

const download = () => {
  window.open(`${baseURL}/stream/download_file?file_id=${fileInfo.value.fileId}`)
}
</script>

<template>
  <div class="main-container">
    <div class="share-box">
      <div class="share-user">
        <div class="avatar">
          <a-avatar :style="{ backgroundColor: '#3370ff' }">
            <img
                alt="avatar"
                :src="baseURL+`/common/resource/avatar?user_id=${shareInfo?.shareUserId}`"
            />
          </a-avatar>

        </div>
        <div style="display: flex;flex-direction: column;">
          <span style="margin-left: 1rem">{{shareInfo?.shareUsername}}</span>
          <span style="margin-left: 1rem;font-size: .7rem">{{ shareInfo?.shareTime }}</span>
        </div>
      </div>
      <div class="share-file">
        <!--        提取码界面-->
        <div v-if="!isChecked">
          <div style="font-size: 1.1rem;text-align: center;margin: 2rem 0;">请输入提取码</div>
          <div>
            <a-verification-code size="large" v-model="share_code" style="width: 300px" @finish="onFinish"/>
          </div>
          <div style="margin-top: 2rem;display: flex;justify-content: center;align-items: center;">
            <a-button style="width: 200px" type="primary" @click="check">提取</a-button>
          </div>
        </div>
        <div v-else>
          <div style="text-align: center;margin-top: 4rem;">
            <FileIcon :row="fileInfo"/>
          </div>
          <div style="text-align: center;color: rgba(0 0 0 / .7);margin-top: 1rem;">
            {{ fileInfo.fileName }} - {{size2Str(fileInfo.fileSize)}}
          </div>
          <div style="text-align: center;margin-top: 3rem;">
            <a-button type="primary" @click="download">下载</a-button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <ICP color="#FFF" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-container {
  width: 100vw;
  height: 100vh;
  background: #3370ff;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;

  .share-box {
    width: 40rem;
    height: 30rem;
    background: #FFF;
    margin: 4rem 0;
    border-radius: 8px;
    border: 1px solid #dfdfdd;
    box-shadow: 0 0 10px rgba(0 0 0 /.3);

    .share-user {
      display: flex;
      width: 100%;
      height: 4rem;
      border-radius: 8px 8px 0 0;
      border-bottom: 1px solid #dfdfdd;
      display: flex;
      align-items: center;
      padding: 1rem;
      box-sizing: border-box;
    }

    .share-file {
      display: flex;
      width: 100%;
      height: calc(100% - 4rem);
      flex-wrap: wrap;
      justify-content: center;

    }
  }
}

:deep(.colorful-icon) {
  zoom: 4;
}
</style>