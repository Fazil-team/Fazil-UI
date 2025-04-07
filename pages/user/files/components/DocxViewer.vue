<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import { renderAsync } from "docx-preview";
let docx = import.meta.glob("docx-preview");
import {review_file} from '../apis'

const previewfile = (id: string) => {
  review_file(id).then(response=>{
    let docData = new Blob([response.data]);
    console.log("data", docData)
    let docxDiv = document.getElementsByClassName("docxDiv");
    console.log('div',docxDiv)
    renderAsync(docData, docxDiv, null, {
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
    <n-card
        style="width: 800px;"
        title="Word预览"
        :bordered="true"
        role="dialog"
        aria-modal="true"
    >
      <template #header>
        创建文件夹
      </template>
      <div
          ref="docxDiv"
          class="docxDiv"
      ></div>
      <template #footer>
        <div style="display: flex;justify-content: right">
          <n-button type="primary" @click="viewer.open = false">确定</n-button>
        </div>
      </template>
    </n-card>

  </n-modal>

</template>

<style scoped>
.docxDiv{
//background: red;
}
:deep(.docx-wrapper){

}
</style>
