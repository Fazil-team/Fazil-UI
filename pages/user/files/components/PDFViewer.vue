<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {baseURL} from "assets/config/network";

const viewer = reactive({
  open: false,
  url: ``,
  show(token){
    viewer.url = `${baseURL}/stream/perview/${token}`
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
        style="width: 800px"
        title="PDF预览"
        :bordered="true"
        role="dialog"
        aria-modal="true"
    >
      <template #header>
        创建文件夹
      </template>
      <div style="height: 500px;">
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
