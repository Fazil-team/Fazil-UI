<script setup>
import {useHead} from "unhead";
import {definePageMeta} from "#imports";
import {reactive, ref} from "vue";
import FileIcon from "~/pages/user/files/components/FileIcon.vue";
import ActiveBar from "~/pages/user/files/components/ActiveBar.vue";
import * as apis from "~/pages/user/files/apis";
import {size2Str} from "assets/utils/commons";
import {load_all_shares} from "~/pages/user/share/api/index";
import {NButton} from 'naive-ui'
import * as msg from '~/assets/utils/message'

useHead({
  title: '致飞网盘｜我的分享',
})

definePageMeta({
  name: `我的分享 `,
  parent: null
});

const tb_data = ref()
const loading = ref()
const height = ref()


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
    title: '',
    width: "40",
    render(row) {
      return h(FileIcon, {
        row: row.fileInfo
      })
    }
  },
  {
    title: '文件名称',
    key: 'fileName',
    minWidth: '200px',
    render(row) {
      return h('span', {}, row.fileInfo.fileName)
    }
  },
  {
    title: '文件大小',
    width: '100',
    render(row) {
      return size2Str(row.fileInfo.fileSize)
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: '180',
    render(row) {
      return h('span', {}, row.share.createTime)
    }
  },
  {
    title: '分享地址',
    key: 'url',
    width: '180',
    render(row) {
      return h('span', {}, row.share.shareUrl)
    },
    ellipsis: true
  },
  {
    title: '操作',
    width: '260',
    render(row) {
      return h('div', null, [
        h(NButton, {
          onClick: () => {
            navigator.clipboard.writeText(row.share.shareUrl)
            msg.success("复制成功")
          },
          size: 'small',
          type: 'primary'

          }, '复制下载链接'),
        h(NButton, {
          onClick: () => {
            loading.value = true
            apis.delete_share(row.share.shareId).then(response => {
              init()
            })
          },
          size: 'small',
          type: 'error',
          style: 'margin-left: 1rem'
        }, '删除')
      ])
    }
  }
]
const init = ()=>{
  loading.value = true
  load_all_shares().then(res=>{
    tb_data.value = res
    loading.value = false
  })
}

onMounted(()=>{
  height.value = `calc(100vh - 14rem`;
  init()
})
</script>

<template>
  <div>
    <n-card>
      <n-button style="margin-bottom: 1rem;" @click="init()">查询</n-button>
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

  </div>
</template>

<style scoped>

</style>