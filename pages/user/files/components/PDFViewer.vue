<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {baseURL} from "assets/config/network";

const viewer = reactive({
  open: false,
  url: ``,
  show(row){
    if(row.fileId == -1){
      viewer.url = `${baseURL}/stream/ex/download?fileAbsPath=${row.fileAbsPath}&filePath=${row.filePath}`
    }else {
      viewer.url = `${baseURL}/stream/download_file?file_id=${row.fileId}`
    }
    viewer.open = true
  }
})

defineExpose({
  viewer
})
</script>

<template>
  <n-modal v-model:show="viewer.open">
    <n-card
        style="width: 50%;height: 90vh"
        title="PDF预览"
        :bordered="true"
        role="dialog"
        aria-modal="true"
    >
      <template #header>
        创建文件夹
      </template>
      <div style="height: 100%;">
        <iframe style="width: 100%;height: 100%;overflow: hidden;"
                :src="viewer.url"></iframe>
      </div>
      <template #footer>
        <div style="display: flex;justify-content: right">
          <n-button type="primary" @click="viewer.open = false">确定</n-button>
        </div>
      </template>
    </n-card>

  </n-modal>

</template>

<style scoped>

</style>
