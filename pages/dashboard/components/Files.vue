<template>
  <n-data-table :loading="loading" :bordered="false" :columns="columns" :data="data" />
</template>

<script setup lang="ts">
import {useRouter} from "#app";
import {load_last_file} from '../apis'
import { defineComponent, ref } from 'vue'
import FileIcon from "~/pages/user/files/components/FileIcon.vue";
import {NButton} from "naive-ui";

const loading = ref(false)

const router = useRouter();
function createColumns() {
  return [
    {
      title: '-',
      width: "40",
      render(row) {
        return h(FileIcon, {
          row: row
        })
      }
    },
    {
      title: '文件名称',
      key: 'fileName'
    },
    {
      title: '操作时间',
      key: 'updateTime'
    },
    {
      title: '操作',
      width: '100',
      render(row) {
        return h('div', null, [
          h(NButton, {
            onClick: () => {
              let path = row.filePath.substr(0 ,row.filePath.lastIndexOf('/'))
              router.push({
                path: row.filePath == '/'?'/user/files':'/user/files'+path
              })
            },
            text: true
          }, '查看详情')
        ])
      }
    }
  ]
}

const data = ref([])
const columns = createColumns()

const init = ()=>{
  loading.value = true
  load_last_file().then(res=>{
    data.value = res.data.data
    loading.value = false
  })
}

onMounted(()=>{
  init()
})
</script>


<style scoped>

:deep(.n-data-table-thead){
  display: none;
}
</style>