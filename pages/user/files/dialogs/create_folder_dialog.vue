<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import * as apis from '../apis'

const emits = defineEmits(['success'])
const percent = ref({})
const dialog = reactive({
  title: '',
  open: false,
  data: {
    folderName: '',
    filePath: ''
  },
  show: (pid) => {
    dialog.data.filePath = pid
    dialog.open = true
  },
  close: () => {
    Object.assign(dialog.data, {})
    dialog.open = false
  },
  rules: {},
  submit: () => {
    apis.new_folder(dialog.data).then(res => {
      emits('success')
    })
  }
})


defineExpose({
  dialog
})
</script>

<template>
  <n-modal v-model:show="dialog.open" title="">
    <n-card
        style="width: 600px"
        :title="dialog.title"
        :bordered="true"
        role="dialog"
        aria-modal="true"
    >
      <template #header>
        创建文件夹
      </template>
      <n-input v-model:value="dialog.data.folderName"></n-input>
      <template #footer>
        <div style="display: flex;justify-content: right">
          <n-button @click="dialog.close()">取消</n-button>
          <n-button type="primary" @click="dialog.submit()">确定</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>
