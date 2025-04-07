<script setup>
import {onMounted, ref} from "vue";
import {theme} from '~/assets/config/theme'
import {NConfigProvider, useMessage} from "naive-ui";
import {useLayoutStore} from "~/store/UseLayoutStore";
import {storeToRefs} from "pinia";
import {useSettingStore} from "~/store/UseSettingStore";
import {load_setting} from "assets/api/sys_setting_api";

const setting = storeToRefs(useSettingStore()).setting
const layout = storeToRefs(useLayoutStore()).layout;
const themeOverrides = theme



onMounted(()=>{
  layout.value = 'default'
  load_setting().then(res=>{
    setting.value = res.data.data
  })
})
</script>

<template>
  <div>
<!--    <a-watermark content="请注册">-->
      <!--    <FullLoading v-if="isFullLoading" />-->
      <n-config-provider :theme-overrides="themeOverrides">
        <n-notification-provider>
          <n-dialog-provider>
            <n-message-provider>
              <n-loading-bar-provider>
                <NuxtLayout :name="layout">
                </NuxtLayout>
              </n-loading-bar-provider>
            </n-message-provider>
          </n-dialog-provider>
        </n-notification-provider>
      </n-config-provider>
<!--    </a-watermark>-->

  </div>

</template>

<style>
.page-enter-active,
.page-leave-active {
  opacity: 1;
  transform: translate(0) scale(1);
  transition: all .3s;
}

.page-enter-from,
.page-leave-to {
  filter: blur(8px);
  transform: translateY(-20px) scale(.9);
  opacity: 0;
  //filter: blur(.6rem);
}
</style>
