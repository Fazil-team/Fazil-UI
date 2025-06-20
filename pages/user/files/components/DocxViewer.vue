<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import { renderAsync } from "docx-preview";
let docx = import.meta.glob("docx-preview");
import {baseURL} from "assets/config/network";
import VueOfficeDocx from "@vue-office/docx";
import VueOfficePdf from "@vue-office/pdf";
const src = ref()
const error = ref(false)
const show = ref(false)
const row_raw = ref()
const viewer = reactive({
  open: false,
  show(file){
    row_raw.value = file;
    console.log(123)
    viewer.open = true
    if(file.fileId == -1){
      src.value = `${baseURL}/stream/ex/download?fileAbsPath=${encodeURIComponent(file.fileAbsPath)}&filePath=${encodeURIComponent(file.filePath)}`
    }else {
      src.value= `${baseURL}/stream/download_file?file_id=${file.fileId}`
    }
    setTimeout(()=>{
      show.value = true
    },100)
    // previewfile(file)
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
        Word预览 - {{row_raw?.fileName}}
      </div>
      <div style="width: 100%;height: 90vh;overflow: auto" :loading="!show" tip="This may take a while...">
        <vue-office-docx v-if="show" :src="src" @error="()=>{
        error = true
        show = false
      }"/>
        <div v-else style="padding: 4rem;background: #FFF">预览失败(暂不支持.doc文件)</div>
      </div>
      <div style="width: 100%; height: 5vh; display: flex;justify-content: end; align-items: center;padding-right: 1rem">
        <a-button type="primary" @click="()=>{
          viewer.open = false
        }">关闭</a-button>
      </div>
    </div>
<!--      <vue-office-docx v-if="show" :src="src" @error="()=>{-->
<!--        error = true-->
<!--        show = false-->
<!--      }"/>-->
<!--      <div v-else style="padding: 4rem;background: #FFF">预览失败(暂不支持.doc文件)</div>-->
  </n-modal>

</template>

<style scoped>
.docxDiv{
//background: red;
}
:deep(.docx-wrapper){

}
</style>
