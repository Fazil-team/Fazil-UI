<template>
  <div class="excel-bar" v-html="excel"></div>
</template>

<script setup>
import {onMounted} from "vue";
import {review_file} from '@/pages/user/files/apis'

const excel = ref()
let XLSX;
if (process.client) {
  XLSX = await import('xlsx')
}
onMounted(async () => {
  const file = await (await fetch('http://127.0.0.1:8080/stream/download_file?file_id=1831534928770883584')).arrayBuffer();
  const workbook = XLSX.read(file);
  var first_sheet = workbook.Sheets[workbook.SheetNames[0]];
  console.log(first_sheet)
  let s = XLSX.utils.sheet_to_html(first_sheet, {header: '', footer: ''});
  excel.value = s
})
</script>

<style scoped lang="scss">
.excel-bar {
  :deep(table) {
    border-collapse: collapse;
    td{
      border-bottom: 1px solid #000000;
      border-right: 1px solid #000000;
    }
    tr:first-child td{
      border-top: 1px solid #000000;
    }
    tr td:first-child{
      border-left: 1px solid #000000;
    }
  }
}
</style>
