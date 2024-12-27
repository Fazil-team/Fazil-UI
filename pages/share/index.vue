<script setup lang="ts">
import {ref, onMounted} from 'vue'

import {useLayoutStore} from "~/store/UseLayoutStore";
import {storeToRefs} from "pinia";
const layout = storeToRefs(useLayoutStore()).layout

onMounted(()=>{
  layout.value = 'share';
})
</script>

<template>

</template>

<style scoped>

</style>