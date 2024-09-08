<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {CloudDownloadOutlined, DeleteOutlined, ShareAltOutlined, EyeOutlined} from '@vicons/antd'
const props = defineProps(['fileId'])

const emits = defineEmits(['download', 'delete', 'share', 'preview'])
</script>

<template>
  <n-icon size="20" class="active-item" @click="()=>{
    emits('download')
  }">
    <CloudDownloadOutlined></CloudDownloadOutlined>
  </n-icon>
  <n-icon size="20" class="active-item" @click="()=>{
    emits('delete')
  }">
    <DeleteOutlined></DeleteOutlined>
  </n-icon>
  <n-popover trigger="hover">
    <template #trigger>
      <n-icon size="20" class="active-item" @click="()=>{
    emits('share')
  }">
        <ShareAltOutlined></ShareAltOutlined>
      </n-icon>
    </template>
    <span>还没做2333</span>
  </n-popover>

  <n-icon size="20" class="active-item" @click="()=>{
    emits('preview')
  }">
    <EyeOutlined></EyeOutlined>
  </n-icon>
</template>

<style scoped lang="scss">
.active-item{
  margin-right: 1rem;
  color: var(--n-td-text-color);
}


</style>
