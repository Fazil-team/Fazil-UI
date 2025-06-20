<script setup lang="ts">
import {ref, reactive, onMounted, nextTick, onUnmounted} from "vue";
import {useHead} from "unhead";
import {definePageMeta} from "#imports";
import {type DropdownOption, NButton} from "naive-ui";
import * as apis from './apis'
import {size2Str} from "assets/utils/commons";
import FileIcon from './components/FileIcon.vue'
import Upload_file_dialog from "~/pages/user/files/dialogs/upload_file_dialog.vue";
import Create_folder_dialog from "~/pages/user/files/dialogs/create_folder_dialog.vue";
import DocxViewer from "~/pages/user/files/components/DocxViewer.vue";
import PDFViewer from "~/pages/user/files/components/PDFViewer.vue";
import ActiveBar from "~/pages/user/files/components/ActiveBar.vue";
import XLSXViewer from "~/pages/user/files/components/XLSXViewer.vue";
import * as msg from '~/assets/utils/message'
import Share_file_dialog from "~/pages/user/files/dialogs/share_file_dialog.vue";
import VideoViewer from "~/pages/user/files/components/VideoViewer.vue";
import {type Setting, useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";
import {baseURL} from "assets/config/network";

const sys_setting: Ref<Setting | any> = storeToRefs(useSettingStore()).setting

let id = useRouter().currentRoute.value.params.id;
const router = useRouter();
const upload_file_dialog = ref()
const loading = ref(false)
const height = ref("400px")
const x = ref(0)
const y = ref(0)
const showDropdown = ref()
const createFolderRef = ref()
const doc_viewer_ref = ref()
const pdf_viewer_ref = ref()
const xlsx_viewer_ref = ref()
const share_file_dialog = ref()
const video_viewer_dialog = ref()
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
  // {
  //   title: '文件名称',
  //   key: 'fileName',
  //   minWidth: '200px',
  //   render(row) {
  //     return h('span', {
  //       class: 'file_name',
  //       onClick: () => {
  //         file_name_click(row)
  //       }
  //     }, row.fileName)
  //   }
  // },
  {
    title: '文件名称',
    key: 'fileName',
    minWidth: '200px',
    render(row) {
      return h(FileName, {
        data: row,
        onUpdate: () => {
          init()
        },
        onClick: () => {
          file_name_click(row)
        }
      })
    }
  },
  {
    title: '',
    key: 'action',
    width: '200',
    render(row: any) {
      return h(ActiveBar, {
        fileId: row.fileId,
        onDownload: () => {
          download(row)
          // apis.add_download_task(row)
        },
        onDelete: () => {
          apis.remove_file(row).then(res => {
            init()
          })
        },
        onShare: () => {
          current_row.value = row
          handleSelect("share")
        },
        onPreview: () => {
          file_name_click(row)
        }
      }, null)
    }
  },
  {
    title: '文件大小',
    width: '100',
    render(row) {
      if (row.fileType == 'folder') {
        return ""
      } else {
        return size2Str(row.fileSize)
      }
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: '180',
    sorter(rowA, rowB) {
      return rowA.createTime - rowB.createTime
    }
  },
  // {
  //   title: '操作',
  //   width: '100',
  //   render(row) {
  //     return h('div', null, [
  //       h(NButton, {
  //         onClick: () => {
  //           apis.add_download_task(row)
  //         }
  //       }, '下载')
  //     ])
  //   }
  // }
]
const tb_data = ref([{}])
const checkedRowKeys = ref([])
const filePath = ref('/')
const fileName = ref("")
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

const sort_style = ref()

const init = () => {
  loading.value = true
  height.value = `calc(100vh - ${document.querySelector(".n-card").clientHeight}px - 2rem - 3rem - 10rem - 1.3rem)`;
  apis.load_files({
    current_page: pagination.page,
    page_size: pagination.pageSize,
    path: encodeURIComponent(filePath.value),
    sort: sort_style.value,
    fileName: fileName.value
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

const sort = (data) => {
  sort_style.value = data?.order
  init()
}

definePageMeta({
  name: '我的文件',
  parent: null
});

const current_row = ref()

import Excel from "assets/icon/colorful/Excel.vue";
import FileName from "~/pages/user/files/components/FileName.vue";
import {useRouter} from "#app";
import Home from "assets/icon/colorful/Home.vue";
import Folder from "assets/icon/colorful/Folder.vue";

const options: DropdownOption[] = [
  {
    label: '预览',
    key: 'view'
  },
  {
    label: '重命名',
    key: 'rename'
  },
  {
    label: '分享',
    key: 'share',
    disabled: false
  },
  {
    label: '下载',
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

const download = (fileInfo) => {
  console.log()
  if (fileInfo?.fileId == -1 && fileInfo.fileType !== 'folder') {
    window.open(`${baseURL}/stream/ex/download?fileAbsPath=${encodeURIComponent(fileInfo.fileAbsPath)}&filePath=${encodeURIComponent(fileInfo.filePath)}`)
  } else if (fileInfo.fileId != -1) {
    window.open(`${baseURL}/stream/download_file?file_id=${encodeURIComponent(fileInfo.fileId)}`)
  }
}

const handleSelect = (str) => {
  let current = current_row.value
  switch (str) {
    case 'download':
      console.log(123)
      download(current)
      break
    case 'delete':
      apis.remove_file(current).then(res => {
        init()
      })
      break
    case 'share':
      share_file_dialog.value.dialog.show(current)
      break
    case 'rename':
      current.edit = true
      break
    case 'view':
      file_name_click(current)
      break
  }
  showDropdown.value = false
}

interface Song {
  no: number
  title: string
  length: string
}

const file_name_click = (row) => {
  switch (row.fileType) {
    case 'doc':
      doc_viewer_ref.value.viewer.show(row)
      break
    case 'pdf':
      pdf_viewer_ref.value.viewer.show(row)
      break
    case 'excel':
      xlsx_viewer_ref.value.viewer.show(row)
      break
    case 'media':
      video_viewer_dialog.value.viewer.show(row)
      break
  }
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
        if (row.fileId == -1 || row.fileType == 'folder') {
          options[2].disabled = true
        } else {
          options[2].disabled = false
        }
        x.value = e.clientX;
        y.value = e.clientY;
      });
    },
    onClick: () => {
      switch (row.fileType) {
        case 'folder':
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
          break
      }
    }
  };
}

onMounted(() => {
  init()
})

const path = () => {
  let paths = []
  let path = '/';
  if (id) {
    for (let i = 0; i < id.length; i++) {
      path += `${id[i]}/`
      paths.push(id[i])
    }
  }
  filePath.value = path;

  return {path, paths}
}

const previous = () => {
  let path = useRouter().currentRoute.value.path
  if (path == '/user/files') {
    msg.warn("已经在根目录啦~")
    return;
  }
  var number = path.lastIndexOf("/");
  let path1 = path.substring(0, number)
  console.log(path1)
  navigateTo({
    path: path1
  })
}

function getPathUntil(arr, index) {
  if (!Array.isArray(arr)) throw new Error('路径必须是数组');
  if (index < 0 || index >= arr.length) throw new Error('下标越界了你想干嘛？');
  return '/' + arr.slice(0, index + 1).join('/');
}
</script>

<template>
  <div>
    <n-card id="active">
      <a-button style="margin-right: 1rem;" type="primary" @click="upload_file_dialog.dialog.show()">上传文件</a-button>
      <a-button style="margin-right: 1rem;" type="primary" @click="createFolderRef.dialog.show(filePath)">创建文件夹
      </a-button>
      <a-button type="primary" @click="previous()">上一级</a-button>
    </n-card>
    <n-card style="margin-top: 1rem;">
      <template #header-extra>
        <n-input v-model:value="fileName" @change="()=>{
          init()
        }" size="tiny" placeholder="请输入文件名称(不支持第三方存储，仅支持本机存储)"></n-input>
      </template>
      <template #header>
        我的文件
        <div style="height: 1.3rem">
          <a-link @click="()=>{
            router.push({
              path: '/user/files'
            })
          }">
            <template #icon>
              <home />
            </template>
            根目录
          </a-link>
          <span v-for="(item, index) in path().paths">
            <a-link v-if="index == path().paths.length-1" @click="">
            <template #icon>
              <folder />
            </template>
            {{ item }}
          </a-link>
            <a-link v-else @click="()=>{
            router.push({
              path: '/user/files'+getPathUntil(path().paths, index)
            })
          }">
            <template #icon>
              <folder />
            </template>
            {{ item }}
          </a-link>
<!--            <n-button v-if="index == path().paths.length-1" type="success">{{ item }}</n-button>-->
<!--            <n-button v-else type="primary">{{ item }}</n-button>-->
          </span>
        </div>
      </template>

      <n-data-table
          :on-update:sorter="sort"
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
    <upload_file_dialog :filePid="filePid" @upload_success="init()" :path="filePath" ref="upload_file_dialog"/>
    <create_folder_dialog @success="init()" ref="createFolderRef"/>
    <DocxViewer ref="doc_viewer_ref"/>
    <PDFViewer ref="pdf_viewer_ref"/>
    <XLSXViewer ref="xlsx_viewer_ref"/>
    <share_file_dialog ref="share_file_dialog"/>
    <video-viewer ref="video_viewer_dialog"/>
  </div>
</template>

<style scoped lang="scss">
:deep(.n-scrollbar-container) {
  .n-data-table-tr {
    cursor: pointer;
  }
}

:deep(.file_name) {
  transition: all .2s;

  &:hover {
    color: #3471df;
  }
}

:deep(.n-data-table-tr) {
  .active-item {
    color: rgba(0 0 0 / 0);
    transition: all .2s;
    transition: all .2s;

  }

  &:hover .active-item {
    color: var(--n-td-text-color);

    &:hover {
      color: #00dc82;
    }
  }
}
</style>
