<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useLayoutStore} from "~/store/UseLayoutStore";

const layout = storeToRefs(useLayoutStore()).layout;

const jump_to_notify = ()=>{
  layout.value = 'notify'
}
</script>

<template>
  <div @click="jump_to_notify" style="display: flex;justify-content: left;align-items: start" class="notify-card">
    <div style="margin-right: 1rem;display: flex;justify-content: center;align-items: center;padding: 0 0 0 1rem">
      <img src="http://127.0.0.1:8080/stream/download_file?file_id=1904766012488749056" alt="" width="120px" height="80px">
    </div>
    <div style="display: flex;flex-direction: column">
      <div style="font-size: 1.2rem;font-weight: 800;">标题</div>
      <div style="font-size: .8rem">介绍</div>
    </div>
  </div>
<!--  <n-divider class="divider" dashed />-->
</template>

<style scoped>
.notify-card{
  padding: 1rem 0;
  transition: all .2s;
  cursor: pointer;
}

.notify-card:hover{
  background: #2a2a2b1A;
}

:deep(.n-divider:not(.n-divider--vertical)){
  margin-top: 0;
  margin-bottom: 0;
}
</style>