<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";
import {baseURL} from "assets/config/network";

const settings = storeToRefs(useSettingStore())?.setting
</script>

<template>
  <div style="width: 100%;height: 100%;display: flex;justify-content: center;align-items: center">
    <img :src="`${baseURL}/common/resource/sys?user_id=3`" width="25" alt="">
  </div>
</template>

<style scoped>

</style>