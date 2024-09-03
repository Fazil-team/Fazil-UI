<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import axios from 'axios'
import { renderAsync } from "docx-preview";
let docx = import.meta.glob("docx-preview");
import {review_file} from '../apis'

const previewfile = (id: string) => {
  review_file(id).then(response=>{
    let docData = new Blob([response.data]);
    let docxDiv = document.getElementsByClassName("docxDiv");
    renderAsync(docData, docxDiv[0], null, {
      inWrapper: true, // 启用围绕文档内容渲染包装器
      ignoreWidth: false, // 禁止页面渲染宽度
      ignoreHeight: false, // 禁止页面渲染高度
      ignoreFonts: false, // 禁止字体渲染
      breakPages: true, // 在分页符上启用分页
      ignoreLastRenderedPageBreak: true, //禁用lastRenderedPageBreak元素的分页
      experimental: false, //启用实验性功能（制表符停止计算）
      trimXmlDeclaration: true, //如果为真，xml声明将在解析之前从xml文档中删除
      debug: false,
    }).then((res) => {
    });
  })
};

const viewer = reactive({
  open: false,
  show(id: string){
    viewer.open = true
    previewfile(id)
  }
})

defineExpose({
  viewer
})
</script>

<template>
  <n-modal v-model:show="viewer.open">
    <div
        ref="docxDiv"
        class="docxDiv"
    ></div>
  </n-modal>

</template>

<style scoped>
.docxDiv{
//background: red;
}
:deep(.docx-wrapper){

}
</style>
