<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import Folder from "assets/icon/colorful/Folder.vue";
import type {UploadCustomRequestOptions} from "naive-ui";
import {service} from "assets/utils/request";
import SparkMD5 from 'spark-md5'
import * as msg from '@/assets/utils/message'
import * as layout_api from '~/layouts/apis'
import BMF from "browser-md5-file/dist/index.esm";
import {useUploadTaskStore} from "~/store/UseUploadFileTask";
import {storeToRefs} from "pinia";
import { InboxOutlined } from '@ant-design/icons-vue';
import {UploadDragger} from "ant-design-vue";

const uploadTasks = storeToRefs(useUploadTaskStore()).task
const props = defineProps(['filePid', 'path'])
const emits = defineEmits(['upload_success'])
const bmf = new BMF();
const percent = ref({})
const file_list = ref([])
const dialog = reactive({
  title: '',
  open: false,
  data: {},
  show: () => {
    dialog.open = true
  },
  close: () => {
    // Object.assign(dialog.data, {})
    dialog.open = false
  },
  rules: {},
  submit: () => {
  }
})

const customRequest = ({
                         file,
                         data,
                         headers,
                         withCredentials,
                         action,
                         onFinish,
                         onError,
                         onProgress
                       }: UploadCustomRequestOptions) => {
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(
          key,
          data[key as keyof UploadCustomRequestOptions['data']]
      )
    })
  }
  // msg.warn('正在计算MD5')
  formData.append(file.name, file.file as File)
  // 计算MD5
  // var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
  //     file_c = file.file,
  //     chunkSize = 209715200,                             // Read in chunks of 2MB
  //     chunks = Math.ceil(file_c.size / chunkSize),
  //     currentChunk = 0,
  //     spark = new SparkMD5.ArrayBuffer(),
  //     fileReader = new FileReader();
  //
  // fileReader.onload = function (e) {
  //   console.log('read chunk nr', currentChunk + 1, 'of', chunks);
  //   spark.append(e.target.result);                   // Append array buffer
  //   currentChunk++;
  //
  //   if (currentChunk < chunks) {
  //     loadNext();
  //   } else {
  //     console.log('finished loading');
  //     console.info('computed hash', spark.end());  // Compute hash
  //   }
  // };
  //
  // fileReader.onerror = function () {
  //   console.warn('oops, something went wrong.');
  // };
  //
  // function loadNext() {
  //   var start = currentChunk * chunkSize,
  //       end = ((start + chunkSize) >= file_c.size) ? file_c.size : start + chunkSize;
  //
  //   fileReader.readAsArrayBuffer(blobSlice.call(file_c, start, end));
  // }
  //
  // loadNext();

  // bmf.md5(
  //     file.file,
  //     (err, md5) => {
  //       console.log('file', file)
  //       console.log('err:', err);
  //       console.log('md5 string:', md5); // 97027eb624f85892c69c4bcec8ab0f11
  //       msg.warn(`MD5计算成功：${md5}`)
  //
  //     },
  //     progress => {
  //       console.log(progress)
  //       onProgress({percent: progress*100})
  //     },
  // )

  // 上传文件
  upload_chunk(file.file, 0, null, {
    file,
    data,
    headers,
    withCredentials,
    action,
    onFinish,
    onError,
    onProgress
  })





}

const customRequest_ant = (data) => {
  console.log(data)
  upload_chunk(data.file, 0, null, data)
}

const upload_chunk = (file, index, id, upload_options) => {
  const file_name = file.name;
  const file_size = file.size;
  if(file_size == 0){
    window.$message.warning("文件大小不能为空")
    return;
  }
  const chunk_size = 1024 * 1024 * 10
  let chunk_num = Math.ceil(file_size / chunk_size)
  let start_dit = index * chunk_size;
  let end_dit = Math.min(start_dit + chunk_size, file_size)
  const chunk = file.slice(start_dit, end_dit)

  if (index == 0) {
    percent.value[file_name] = {
      percent: (((index + 1) / chunk_num) * 100).toFixed(0),
      canceled: false
    }
  } else {
    percent.value[file_name] = {
      percent: (((index + 1) / chunk_num) * 100).toFixed(0),
      canceled: percent.value[file_name].canceled
    }
  }
  upload_options.onProgress({percent: (((index + 1) / chunk_num) * 100).toFixed(0)})
  if (percent.value[file_name].canceled == true) {
    upload_options.onSuccess()
    emits('upload_success')
    Reflect.deleteProperty(percent.value, file_name)
    return
  }
  // 上传
  let data = new FormData()
  data.append("file", chunk)
  data.append("file_name", file_name)
  data.append("chunk_num", chunk_num)
  data.append("chunk_index", index)
  data.append("file_id", id)
  data.append("file_size", file_size)
  data.append("file_pid", props.filePid)
  data.append("filePath", props.path)
  service.post(`/stream?chunkNum=${chunk_num}&chunkIndex=${index}`, data).then(res => {
    if (chunk_num == index + 1) {
      upload_options.onSuccess()
      emits('upload_success')
      Reflect.deleteProperty(percent.value, file_name)
      layout_api.get_user_storage()
      return
    } else {
      upload_chunk(file, index + 1, res.data.data, upload_options)
    }
  })

}

defineExpose({
  dialog
})

const change = (file, fileList)=>{
  console.log(file_list.value)
  uploadTasks.value = file_list.value
}
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
        上传文件
      </template>
<!--      <n-upload-->
<!--          v-model:file-list="uploadTasks"-->
<!--          multiple-->
<!--          directory-dnd-->
<!--          :custom-request="customRequest"-->
<!--      >-->
<!--        <n-upload-dragger>-->
<!--          <div style="margin-bottom: 12px">-->
<!--            <n-icon size="48" :depth="3">-->
<!--              <Folder/>-->
<!--            </n-icon>-->
<!--          </div>-->
<!--          <n-text style="font-size: 16px">-->
<!--            点击或者拖动文件到该区域来上传-->
<!--          </n-text>-->
<!--          <n-p depth="3" style="margin: 8px 0 0 0">-->
<!--            请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码-->
<!--          </n-p>-->
<!--        </n-upload-dragger>-->
<!--      </n-upload>-->
      <upload-dragger
          name="file"
          :multiple="true"
          :customRequest="customRequest_ant"
      >
        <p class="ant-upload-drag-icon">
          <inbox-outlined></inbox-outlined>
        </p>
        <p class="ant-upload-text">点击或者拖动文件到该区域来上传</p>
        <p class="ant-upload-hint">上传过程中请勿关闭该窗口</p>
        <p class="ant-upload-hint">
          请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
        </p>
      </upload-dragger>
      <template #footer>
        <div style="display: flex;justify-content: right">
          <n-button @click="dialog.close()">取消</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>
