<script setup>
import {ref, reactive, onMounted} from "vue";
import Excel from "assets/icon/colorful/Excel.vue";
import UnKnow from "assets/icon/colorful/UnKnow.vue";
import Word from "assets/icon/colorful/Word.vue";
import Zip from "assets/icon/colorful/Zip.vue";
import Executor from "assets/icon/colorful/Executor.vue";
import Folder from "assets/icon/colorful/Folder.vue";
import Image from "assets/icon/colorful/Imgae.vue"
import Video from "assets/icon/colorful/Video.vue"
import {baseURL} from "assets/config/network.js";
import PDF from "assets/icon/colorful/PDF.vue";
import Txt from "assets/icon/colorful/Txt.vue";
import D3 from '@/assets/icon/colorful/3D.vue';

const props = defineProps(['row'])
</script>

<template>
  <Excel class="colorful-icon" v-if="props.row.fileType=='excel'"/>
  <UnKnow class="colorful-icon" v-if="props.row.fileType=='unknown'"/>
  <Word class="colorful-icon" v-if="props.row.fileType=='doc'"/>
  <Zip class="colorful-icon" v-if="props.row.fileType=='zip'"/>
  <Executor class="colorful-icon" v-if="props.row.fileType=='exe'"/>
  <Folder class="colorful-icon" v-if="props.row.fileType=='folder'"/>
  <PDF class="colorful-icon" v-if="props.row.fileType=='pdf'"/>
  <Txt class="colorful-icon" v-if="props.row.fileType=='txt'"/>
  <Video class="colorful-icon" v-if="props.row.fileType=='media' && props.row.fileAvatar == null"/>
  <D3 class="colorful-icon" v-if="props.row.fileType=='3d'"/>
  <n-image
      style="zoom: .5;"
      v-if="props.row.fileId == -1 && props.row.fileAvatar != null && props.row.fileType == 'img'"
      width="100"
      :src="`${baseURL}/stream/ex/download?fileAbsPath=${encodeURIComponent(props.row.fileAbsPath)}&filePath=${encodeURIComponent(props.row.filePath)}`"
  />

  <n-image
      style="zoom: .5;"
      v-else-if="props.row.fileType == 'media' && props.row.fileAvatar != null"
      width="100"
      :src="`${baseURL}/stream/video/avatar/${props.row.fileId}`"
  />
  <n-image
      style="zoom: .3;"
      v-else-if="props.row.fileType == 'img'"
      width="100"
      :src="`${baseURL}/stream/download_file?file_id=${props.row.fileId}`"
  />
</template>

<style scoped>
.colorful-icon{
  zoom: 2;
}
</style>
