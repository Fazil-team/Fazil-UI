<script setup lang="ts">
import {useHead} from "unhead";
import {onMounted} from "vue";
useHead({
  title: '致飞网盘｜我的文件',
})

definePageMeta({
  name: `我的文件 `,
  parent: null
});
import Index from "~/pages/user/files/FileViewer.vue";
import {definePageMeta} from "#imports";
</script>

<template>
  <div>
    <index/>
  </div>
</template>

<style scoped>

</style>
