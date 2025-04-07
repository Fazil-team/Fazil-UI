<script setup>
import {onMounted, reactive, ref} from "vue";
import {baseURL} from "assets/config/network.js";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const playerRef = ref(null);



const viewer = reactive({
  open: false,
  url: ``,
  show: async (file) => {
    console.log('file', file)
    viewer.url = `${baseURL}/stream/video/preview/${file.fileId}/index.m3u8`
    console.log('playerRef', playerRef.value)
    setTimeout(()=>{
      if (playerRef.value) {
        videojs(playerRef.value, {
          controls: true,
          autoplay: false,
          preload: 'auto',
          sources: [{ src: viewer.url, type: 'application/x-mpegURL' }]
        }).play();
      }
    },1000)
    console.log('URL' ,viewer.url)
    viewer.open = true
  }
})

defineExpose({
  viewer
})



</script>

<template>
  <n-modal v-model:show="viewer.open">
    <n-card
        style="width: 80%"
        title="视频预览-无法播放可能为正在转码中或者未开启转码功能"
        :bordered="true"
        role="dialog"
        aria-modal="true"
    >
      <div style="width: 100%;height: 100%">
        <video ref="playerRef" class="video-js vjs-default-skin" controls style="width: 100%;height: 600px"></video>
      </div>
      <template #footer>
        <div style="  display: flex;justify-content: right">
          <n-button type="primary" @click="viewer.open = false">确定</n-button>
        </div>
      </template>
    </n-card>

  </n-modal>
</template>


<style scoped lang="scss">
.excel-bar {
  :deep(table) {
    border-collapse: collapse;

    td {
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
    }

    tr:first-child td {
      border-top: 1px solid #000;
    }

    tr td:first-child {
      border-left: 1px solid #000;
    }
  }
}

.excel-bar{
  background: var(--n-color);
  padding: 1rem;
  text-align: center;
}
</style>
