<script setup>
import {useHead} from "unhead";
import {definePageMeta} from "#imports";
import {onUnmounted, reactive, ref} from "vue";
import FileIcon from "~/pages/user/files/components/FileIcon.vue";
import ActiveBar from "~/pages/user/files/components/ActiveBar.vue";
import * as apis from "~/pages/user/files/apis";
import {size2Str} from "assets/utils/commons";
import {load_all_shares} from "~/pages/user/share/api/index";
import {NButton} from 'naive-ui'
import AButton from 'ant-design-vue/lib/button'
import * as msg from '~/assets/utils/message'
import {useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";
import NewStorageDialog from "~/pages/user/storage/dialog/new-storage-dialog.vue";
import {all, del} from "~/pages/user/storage/api/index.js";
import ChangeStorageDialog from "~/pages/user/storage/dialog/change-storage-dialog.vue";
import StorageIcon from './component/storage-icon.vue'
const sys_setting = storeToRefs(useSettingStore()).setting


let interval = setInterval(() => {
  if(sys_setting.value.title){
    useHead({
      title: `${sys_setting.value.title}｜ 空间配置`,
    })
    clearInterval(interval)
  }
}, 100)

definePageMeta({
  name: `空间配置 `,
  parent: null
});

const tb_data = ref()
const loading = ref()
const height = ref()
const newStorageDialog = ref()
const changeStorageDialog = ref()

const pagination = reactive({
  page: 1, //受控模式下的当前页
  pageSize: 10, //受控模式下的分页大小,每一页的数据大小
  showSizePicker: true, //是否显示每页条数
  pageSizes: [10, 20, 50], //每页条数,可自定义
  showQuickJumper: true,
  pageCount: 0,
  itemCount: 0, //总条数
  prefix: () => { //分页前缀
    return '共 ' + pagination.itemCount + ' 项';
  },
  onChange: page => { //切换第几页时
    pagination.page = page;
    init();
  },
  onPageSizeChange: pageSize => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    init();
  },
});

const columns = [
  {
    title: '文件名称',
    key: 'name',
    width: '200px',
    render(row) {
      return h('span', {}, row.name)
    }
  },
  {
    title: '类型',
    key: 'type',
    minWidth: '200px',
    render(row) {
      return h(StorageIcon, {
        type: row.type
      })
    }
  },
  {
    title: '操作',
    width: '260',
    render(row) {
      return h('div', null, [
        h(AButton, {
          onClick: () => {
            changeStorageDialog.value.dialog.show(row);
          },
          size: 'small',
          type: "primary"
        }, '修改'),
        h(AButton, {
          onClick: () => {
            loading.value = true
            del(row.id).then(res=>{
              init()
            })
          },
          size: 'small',
          type: "primary",
          danger: true,
          style: 'margin-left: 1rem'
        }, '删除')
      ])
    }
  }
]
const init = () => {
  loading.value = true
  all(pagination.pageSize, pagination.page).then(res => {
    console.log(res.data.data)
    tb_data.value = res.data
    pagination.itemCount = res.total
    loading.value = false
  })
}

onMounted(() => {
  height.value = `calc(100vh - 14rem`;
  init()
})
</script>

<template>
  <div>
    <n-card>
      <a-button style="margin-bottom: 1rem;" @click="()=>{
        newStorageDialog.dialog.show()
      }" type="primary">添加存储</a-button>
      <n-data-table
          :style="{ height: `${height}` }"
          flex-height
          :loading="loading"
          ref="tableRef"
          striped
          :columns="columns"
          :pagination="pagination"
          :bordered="false"
          :data="tb_data"
          :row-key="row => row.id"
          remote
      >
      </n-data-table>
    </n-card>

    <new-storage-dialog @success="init()" ref="newStorageDialog" />
    <change-storage-dialog @success="init()" ref="changeStorageDialog" />
  </div>
</template>

<style scoped>

</style>