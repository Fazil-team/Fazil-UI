<script setup lang="ts">
import WebDAV from "~/pages/user/storage/icon/WebDAV.vue";
import FTP from "~/pages/user/storage/icon/FTP.vue";

const props = defineProps(['type'])
</script>

<template>
  <div>
    <a-tag v-if="props.type == 'webdav'" color="#4177f6">
      <template #icon>
        <WebDAV />
      </template>
      WebDAV
    </a-tag>
    <a-tag v-if="props.type == 'ftp'" color="#395bed">
      <template #icon>
        <FTP />
      </template>
      FTP
    </a-tag>
  </div>
</template>

<style scoped>

</style>