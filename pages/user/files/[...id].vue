<script setup lang="ts">
import {useHead} from "unhead";
import {onMounted, onUnmounted, type Ref} from "vue";
import {type Setting, useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";
const sys_setting: Ref<Setting | any> = storeToRefs(useSettingStore()).setting

let interval = setInterval(()=>{
  useHead({
    title: `${sys_setting.value.title}｜我的文件`,
  })},100)


definePageMeta({
  name: `我的文件 `,
  parent: null
});
import Index from "~/pages/user/files/FileViewer.vue";
import {definePageMeta} from "#imports";

onUnmounted(()=>{
  clearInterval(interval)
})
</script>

<template>
  <div>
    <index/>
  </div>
</template>

<style scoped>

</style>
