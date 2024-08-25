<script setup>
import {ref, reactive, onMounted} from "vue";
import Excel from "assets/icon/colorful/Excel.vue";
import UnKnow from "assets/icon/colorful/UnKnow.vue";
import Word from "assets/icon/colorful/Word.vue";
import Zip from "assets/icon/colorful/Zip.vue";
import Executor from "assets/icon/colorful/Executor.vue";
import Folder from "assets/icon/colorful/Folder.vue";
import Image from "assets/icon/colorful/Imgae.vue"
import {baseURL} from "assets/config/network.js";

const props = defineProps(['row'])
</script>

<template>
  <Excel class="colorful-icon" v-if="props.row.fileType=='excel'"/>
  <UnKnow class="colorful-icon" v-if="props.row.fileType=='unknown'"/>
  <Word class="colorful-icon" v-if="props.row.fileType=='doc'"/>
  <Zip class="colorful-icon" v-if="props.row.fileType=='zip'"/>
  <Executor class="colorful-icon" v-if="props.row.fileType=='exe'"/>
  <Folder class="colorful-icon" v-if="props.row.fileType=='folder'"/>
  <n-image
      style="zoom: .3;"
      v-if="props.row.fileType == 'img'"
      width="100"
      :src="`${baseURL}/stream/download_file?file_id=${props.row.fileId}&type=img`"
  />
</template>

<style scoped>
.colorful-icon{
  zoom: 2;
}
</style>
