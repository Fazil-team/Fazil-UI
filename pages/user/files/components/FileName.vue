<script setup lang="ts">

import {renameFile} from "~/pages/user/files/apis";

const props = defineProps([
  'data'
])

const emits = defineEmits(['update'])

const rename = (data)=>{
  renameFile(data).then(res=>{
    props.data.edit = false
    emits('update')
  })
}


</script>

<template>
  <div>
    <div v-if="props.data.edit" >
      <n-space>
        <n-input v-model:value="props.data.fileName"></n-input>
        <n-button strong secondary type="primary" @click="rename(props.data)">
          确定
        </n-button>
        <n-button strong secondary type="info" @click="props.data.edit = false">
          取消
        </n-button>
      </n-space>

    </div>
    <span v-else>{{ props?.data?.fileName }}</span>
  </div>
</template>

<style scoped>

</style>