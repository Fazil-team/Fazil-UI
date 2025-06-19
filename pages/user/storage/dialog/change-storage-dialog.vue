<script setup lang="ts">
import {reactive, ref} from "vue";
import {change, checkConnect, newStorage} from "~/pages/user/storage/api";
import * as msg from '@/assets/utils/message';

const emits = defineEmits(['success'])

const dialog = reactive({
  title: '修改外部存储',
  open: false,
  data: {
    type: '',
    name: '',
    success: false,
    config: {},
    configJson: "",
  },
  show: (data)=>{
    Object.assign(dialog.data, data)
    dialog.data.config = JSON.parse(data.configJson)
    // Object.assign(dialog.data.configJson, JSON.parse(data.configJson))
    console.log(dialog.data)
    dialog.open = true
  },
  close: ()=>{
    dialog.open = false
  }
})

const storage_types = [
  {
    label: 'WebDAV',
    value: 'webdav'
  }
]

const check = ()=>{
  dialog.data.configJson = JSON.stringify(dialog.data.config)
  checkConnect(dialog.data).then(res=>{
    dialog.data.success = true
  });
}
const submit = ()=>{
  dialog.data.configJson = JSON.stringify(dialog.data.config)
  change(dialog.data).then(res=>{
    dialog.close()
    emits('success')
  })
}

defineExpose({
  dialog
})

</script>

<template>
  <n-modal v-model:show="dialog.open" title="">
    <n-card style="width: 600px"
            :title="dialog.title"
            :bordered="true"
            role="dialog"
            aria-modal="true">
      <n-form>
        <n-form-item label="存储类型">
          <n-select v-model:value="dialog.data.type" placeholder="请选择存储类型" :items="storage_types" />
        </n-form-item>
        <!-- WebDAV 表单 -->
        <section v-if="dialog.data.type == 'webdav'">
          <n-form-item label="WebDAV地址">
            <n-input v-model:value="dialog.data.config.baseUrl" placeholder="请输入WebDAV地址"></n-input>
          </n-form-item>
          <n-form-item label="WebDav文件夹">
            <n-input v-model:value="dialog.data.config.folder" placeholder="请输入WebDav文件夹"></n-input>
          </n-form-item>
          <n-form-item label="映射地址">
            <n-input v-model:value="dialog.data.name" placeholder="请输入映射地址"></n-input>
          </n-form-item>
          <n-form-item label="WebDav用户名">
            <n-input v-model:value="dialog.data.config.username" placeholder="请输入WebDav用户名"></n-input>
          </n-form-item>
          <n-form-item label="WebDav密码">
            <n-input type="password" v-model:value="dialog.data.config.password" placeholder="请输WebDav密码"></n-input>
          </n-form-item>
        </section>
      </n-form>

      <template #footer>
        <div style="display: flex;justify-content: end">
          <n-space>
            <n-button type="primary" @click="check">连接测试</n-button>
            <n-button :disabled="!dialog.data.success" @click="submit" type="primary">确定</n-button>
          </n-space>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>