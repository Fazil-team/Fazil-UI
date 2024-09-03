<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {baseURL} from "assets/config/network";

const viewer = reactive({
  open: false,
  url: ``,
  show(token){
    viewer.url = `${baseURL}/stream/perview/${token}`
    viewer.open = true
  }
})

defineExpose({
  viewer
})
</script>

<template>
  <n-modal v-model:show="viewer.open">
    <div style="height: 800px;width: 1000px">
      <iframe style="width: 100%;height: 100%;overflow: hidden"
              :src="viewer.url"></iframe>
    </div>
  </n-modal>

</template>

<style scoped>

</style>
