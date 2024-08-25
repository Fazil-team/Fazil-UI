<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import { useThemeVars } from 'naive-ui'
import {useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";

const set = storeToRefs(useSettingStore())?.setting
const dark = ref(false)
onMounted(()=>{
  const theme = useThemeVars()
  setInterval(()=>{
   if(theme.value.baseColor == '#FFF'){
     dark.value = false
   }else {
     dark.value = true
   }
  },100)
})
</script>

<template>
  <img v-if="!dark" :src="set.logoTextBlack" width="50" style="margin-left: .5rem" alt="">
  <img v-else :src="set.logoTextWhite" width="50" style="margin-left: .5rem"  alt="">
</template>

<style scoped>

</style>