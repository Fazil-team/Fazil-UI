<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {baseURL} from "assets/config/network";
import VueOfficePdf from '@vue-office/pdf'
const show = ref(false)
const row_raw = ref()
const loading = ref(true)
const viewer = reactive({
  open: false,
  url: ``,
  show(row){
    loading.value = true
    row_raw.value = row
    if(row.fileId == -1){
      viewer.url = `${baseURL}/stream/ex/download?fileAbsPath=${encodeURIComponent(row.fileAbsPath)}&filePath=${encodeURIComponent(row.filePath)}`
    }else {
      viewer.url = `${baseURL}/stream/download_file?file_id=${row.fileId}`
    }
    viewer.open = true
    setTimeout(()=>{
      show.value = true
    },100)
  }
})

defineExpose({
  viewer
})
</script>

<template>
  <n-modal v-model:show="viewer.open">
    <div style="width: 100%; background: white">
      <div style="width: 100%; height: 5vh;background: white;font-size: 1.2rem;font-weight: 800;line-height: 5vh;padding-left: 1rem">
        PDF预览 - {{row_raw?.fileName}}
      </div>
      <a-spin style="width: 100%;height: 90vh" :loading="loading" tip="正在加载，请耐心等待。。。(如遇长时间加载，请尝试关闭重新预览)">
        <vue-office-pdf @rendered="()=>{
          loading = false
        }" style="width: 100%;height: 90vh" v-if="show" :src="viewer.url"/>
      </a-spin>
      <div style="width: 100%; height: 5vh; display: flex;justify-content: end; align-items: center;padding-right: 1rem">
        <a-button type="primary" @click="()=>{
          viewer.open = false
        }">关闭</a-button>
      </div>
    </div>
  </n-modal>

</template>

<style scoped>

</style>
