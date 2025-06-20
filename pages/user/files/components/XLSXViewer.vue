<script setup>
import {onMounted, reactive} from "vue";
import {baseURL} from "assets/config/network.js";
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'
import VueOfficeDocx from "@vue-office/docx";
const excel = ref()
const src = ref()
const show = ref(false)
const row_raw = ref()
let XLSX = ref(null);


const load_modules = async () => {
  XLSX.value = await import('xlsx')
}


const viewer = reactive({
  open: false,
  show(file){
    row_raw.value = file
    viewer.open = true
    if(file.fileId == -1){
      src.value = `${baseURL}/stream/ex/download?fileAbsPath=${encodeURIComponent(file.fileAbsPath)}&filePath=${encodeURIComponent(file.filePath)}`
    }else {
      src.value= `${baseURL}/stream/download_file?file_id=${file.fileId}`
    }    setTimeout(()=>{
      show.value = true
    },0)
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
        Excel预览 - {{row_raw?.fileName}}
      </div>
      <div style="width: 100%;height: 90vh;overflow: auto" :loading="!show" tip="This may take a while...">
        <vue-office-excel style="width: 100%; height: 90vh" v-if="show" :src="src"/>
        <div v-else style="padding: 4rem;background: #FFF">预览失败(暂不支持.doc文件)</div>
      </div>
      <div style="width: 100%; height: 5vh; display: flex;justify-content: end; align-items: center;padding-right: 1rem">
        <a-button type="primary" @click="()=>{
          viewer.open = false
        }">关闭</a-button>
      </div>
    </div>

<!--    <div v-else>123</div>-->
  </n-modal>
</template>


<style scoped lang="scss">
.excel-bar {
  :deep(table) {
    border-collapse: collapse;

    td {
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
    }

    tr:first-child td {
      border-top: 1px solid #000;
    }

    tr td:first-child {
      border-left: 1px solid #000;
    }
  }
}

.excel-bar{
  background: var(--n-color);
  padding: 1rem;
  text-align: center;
}
</style>
