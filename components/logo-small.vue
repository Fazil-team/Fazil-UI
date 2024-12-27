<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";
import {baseURL} from "assets/config/network";

const settings = storeToRefs(useSettingStore())?.setting
</script>

<template>
  <img :src="`${baseURL}/common/resource/sys?user_id=3`" width="25" alt="">
</template>

<style scoped>

</style>