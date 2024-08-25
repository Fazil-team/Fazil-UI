<script setup lang="ts">
import {ref, reactive, onMounted, nextTick} from "vue";
import {useHead} from "unhead";
import {definePageMeta} from "#imports";
import {type DropdownOption, NButton} from "naive-ui";
import * as apis from './apis'
import {size2Str} from "assets/utils/commons";
import FileIcon from './components/FileIcon.vue'
import Upload_file_dialog from "~/pages/user/files/dialogs/upload_file_dialog.vue";
import Create_folder_dialog from "~/pages/user/files/dialogs/create_folder_dialog.vue";

let id = useRouter().currentRoute.value.params.id;
const upload_file_dialog = ref()
const loading = ref(false)
const height = ref("400px")
const x = ref(0)
const y = ref(0)
const showDropdown = ref()
const createFolderRef = ref()
const columns = [
  {
    title: '',
    width: "40",
    render(row) {
      return h(FileIcon, {
        row: row
      })
    }
  },
  {
    title: '文件名称',
    key: 'fileName',
    minWidth: '200px'
  },
  {
    title: '文件大小',
    width: '100',
    render(row) {
      return size2Str(row.fileSize)
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: '180'
  },
  {
    title: '操作',
    width: '100',
    render(row) {
      return h('div', null, [
        h(NButton, {
          onClick: () => {
            apis.add_download_task(row)
          }
        }, '下载')
      ])
    }
  }
]
const tb_data = ref([{}])
const checkedRowKeys = ref([])
const filePath = ref('/')
const filePid = ref(0)
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

const init = () => {
  loading.value = true
  height.value = `calc(100vh - ${document.querySelector(".n-card").clientHeight}px - 2rem - 6rem - 10rem - 2.3rem)`;
  apis.load_files({
    current_page: pagination.page,
    page_size: pagination.pageSize,
    path: filePath.value
  }).then(res => {
    loading.value = false
    tb_data.value = res.data.data.data
    pagination.itemCount = res.data.data.total
    if (tb_data.value.length == 0 && pagination.page != 1) {
      pagination.page--;
      init()
    }
  })
}

useHead({
  title: '致飞网盘｜我的文件',
})

definePageMeta({
  name: '我的文件',
  parent: null
});

const current_row = ref()

const options: DropdownOption[] = [
  {
    label: '添加下载任务',
    key: 'download'
  },
  {
    label: () => h('span', {style: {color: 'red'}}, '删除'),
    key: 'delete'
  }
]

const onClickoutside = () => {
  showDropdown.value = false
}

const handleSelect = (str) => {
  let current = current_row.value
  switch (str) {
    case 'download':
      apis.add_download_task(current)
      break
    case 'delete':
      apis.remove_file(current.fileId).then(res => {
        init()
      })
      break
  }
  showDropdown.value = false
}

interface Song {
  no: number
  title: string
  length: string
}

const rowProps = (row) => {
  return {
    onContextmenu: (e) => {
      // window.$message.success(JSON.stringify(row, null, 2))
      e.preventDefault();
      showDropdown.value = false;
      current_row.value = row
      nextTick().then(() => {
        showDropdown.value = true;
        x.value = e.clientX;
        y.value = e.clientY;
      });
    },
    onClick: () => {
      if (row.fileType == 'folder') {
        let path = ''
        if (useRouter().currentRoute.value.path == '/user/files/') {
          path = `/user/files/${row.fileName}`
        } else {
          path = `${useRouter().currentRoute.value.path}/${row.fileName}`
        }
        console.log(path)
        navigateTo({
          path: path
        })
      } else {
        console.log("文件")
      }
    }
  };
}

onMounted(() => {
  init()
})

const path = () => {
  let path = '/';
  if (id) {
    for (let i = 0; i < id.length; i++) {
      path += `${id[i]}/`
    }
  }
  filePath.value = path;

  return path
}

const previous = ()=>{
  let path = useRouter().currentRoute.value.path
  var number = path.lastIndexOf("/");
  let path1 = path.substring(0, number)
  console.log(path1)
  navigateTo({
    path: path1
  })
}
</script>

<template>
  <div>
    <n-card id="active">
      <n-button style="margin-right: 1rem;" type="primary" @click="upload_file_dialog.dialog.show()">上传文件</n-button>
      <n-button style="margin-right: 1rem;" type="primary" @click="createFolderRef.dialog.show(filePath)">创建文件夹</n-button>
      <n-button type="primary" @click="previous()">上一级</n-button>
    </n-card>
    <n-card style="margin-top: 1rem;">
      <template #header>
        查询结果
      </template>
      <div style="height: 1.3rem;margin-bottom: 1rem;">
       路径 {{ path() }}
      </div>
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
          :row-props="rowProps"
          v-model:checked-row-keys="checkedRowKeys"
      >
      </n-data-table>
      <n-dropdown
          placement="bottom-start"
          trigger="manual"
          :x="x"
          :y="y"
          :options="options"
          :show="showDropdown"
          :on-clickoutside="onClickoutside"
          @select="handleSelect"
      />
    </n-card>
    <upload_file_dialog :filePid="filePath" @upload_success="init()" ref="upload_file_dialog"/>
    <create_folder_dialog @success="init()" ref="createFolderRef"/>
  </div>
</template>

<style scoped lang="scss">
:deep(.n-scrollbar-container){
  .n-data-table-tr{
    cursor: pointer;
  }
}
</style>
