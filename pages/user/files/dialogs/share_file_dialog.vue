<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import * as apis from '../apis'
import {share} from "../apis";
import {useUserStore} from "~/store/UseUserStore";
import {storeToRefs} from "pinia";
import * as msg from "assets/utils/message";

const user = storeToRefs(useUserStore()).user_info

const emits = defineEmits(['success'])
const percent = ref({})
const dialog = reactive({
  title: '',
  open: false,
  data: {
    shareExpireTime: null,
    sharePwd: '',
    hasCode: true,
    codeGenType: 'random',
    fileName: '',
    shareFileId: '',

  },
  show: (row) => {
    console.log(row)
    dialog.data.fileName = row.fileName
    dialog.data.shareFileId = row.fileId
    dialog.open = true
  },
  close: () => {
    Object.assign(dialog.data, {})
    dialog.open = false
  },
  rules: {},
  submit: () => {
    share(dialog.data).then(res => {
      navigator.clipboard.writeText(res.data.data.shareUrl)
      msg.success("分享地址已复制到剪切板")
      dialog.close()
    });
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
        分享文件 - {{dialog.data.fileName}}
      </template>
      <n-form label-placement="left">
        <n-form-item label="有效期" path="user.name">
          <n-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" v-model:formatted-value="dialog.data.shareExpireTime" placeholder="请选择过期时间"/>
        </n-form-item>
        <n-form-item label="提取码">
          <div>
            <div>
              <n-checkbox v-model:checked="dialog.data.hasCode">有提取码</n-checkbox>
            </div>
            <div v-if="dialog.data.hasCode">
              <n-radio-group v-model:value="dialog.data.codeGenType">
                <n-radio value="random">系统随机生成提取码</n-radio>
                <n-radio value="custom">
                  自定义提取码
                </n-radio>
              </n-radio-group>
            </div>
          </div>
        </n-form-item>
        <n-form-item v-if="dialog.data.codeGenType == 'custom' && dialog.data.hasCode" label="自定义提取码">
          <n-input v-model:value="dialog.data.sharePwd" placeholder="请输入六位提取码"></n-input>
        </n-form-item>
      </n-form>
      <template #footer>
        <div style="display: flex;justify-content: right">
          <n-button style="margin-right: 1rem" @click="dialog.close()">取消</n-button>
          <n-button type="primary" @click="dialog.submit()">确定</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>
