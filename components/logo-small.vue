<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import {useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";
const settings = storeToRefs(useSettingStore())?.setting
</script>

<template>
  <img :src="settings?.logoSmall" width="25" alt="">
</template>

<style scoped>

</style>