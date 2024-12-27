<script setup>
import {onMounted, reactive} from "vue";
import {baseURL} from "assets/config/network.js";

const excel = ref()
// let XLSX = ref(null);


const load_modules = async () => {
  // XLSX.value = await import('xlsx')
}


const viewer = reactive({
  open: false,
  url: ``,
  show: async (token) => {
    await load_modules()
    viewer.url = `${baseURL}/stream/perview/${token}`
    const file = await (await fetch(viewer.url)).arrayBuffer();
    const workbook = XLSX.value.read(file);
    var first_sheet = workbook.Sheets[workbook.SheetNames[0]];
    let s = XLSX.value.utils.sheet_to_html(first_sheet, {header: '', footer: ''});
    excel.value = s
    viewer.open = true
  }
})

defineExpose({
  viewer
})

</script>

<template>
  <n-modal v-model:show="viewer.open">
    <n-card
        style="width: 800px"
        title="Excel预览"
        :bordered="true"
        role="dialog"
        aria-modal="true"
    >
      <template #header>
        创建文件夹
      </template>
      <div class="excel-bar" v-html="excel"></div>
      <template #footer>
        <div style="display: flex;justify-content: right">
          <n-button type="primary" @click="viewer.open = false">确定</n-button>
        </div>
      </template>
    </n-card>

  </n-modal>
</template>


<style scoped lang="scss">
.excel-bar {
  :deep(table) {
    border-collapse: collapse;

    td {
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
    }

    tr:first-child td {
      border-top: 1px solid #000;
    }

    tr td:first-child {
      border-left: 1px solid #000;
    }
  }
}

.excel-bar{
  background: var(--n-color);
  padding: 1rem;
  text-align: center;
}
</style>
