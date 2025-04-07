<script setup lang="ts">
import {useSettingStore} from "~/store/UseSettingStore";
import {storeToRefs} from "pinia";

const set = storeToRefs(useSettingStore())?.setting

const jump = ()=>{
  window.open("https://beian.miit.gov.cn/#/Integrated/index")
}

const props = defineProps([
    'color'
])
</script>

<template>
  <div v-if="set.icp" class="icp">
    <n-button @click="jump" quaternary :style="{'font-weight': 800, color: props.color}">
      备案号：{{set?.icp}}
    </n-button>
  </div>
</template>

<style scoped>

</style>