<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {CloudDownloadOutlined, DeleteOutlined, ShareAltOutlined, EyeOutlined} from '@vicons/antd'
const props = defineProps(['fileId'])
</script>

<template>
  <n-icon size="20" class="active-item">
    <CloudDownloadOutlined></CloudDownloadOutlined>
  </n-icon>
  <n-icon size="20" class="active-item">
    <DeleteOutlined></DeleteOutlined>
  </n-icon>
  <n-icon size="20" class="active-item">
    <ShareAltOutlined></ShareAltOutlined>
  </n-icon>
  <n-icon size="20" class="active-item">
    <EyeOutlined></EyeOutlined>
  </n-icon>
</template>

<style scoped>
.active-item{
  margin-right: 1rem;
}


</style>
