<template>
  <t-menu theme="dark" default-value="dashboard" :collapsed="setting.collapsed">
    <template #logo>
      <img v-if="setting.collapsed" width="60" class="px-1"  src="@/assets/logo.png" alt="logo" />
      <img v-else height="28" src="@/assets/logo-full.png" alt="logo" />
    </template>
    
    <t-menu-item value="dashboard">
      <template #icon>
        <t-icon name="dashboard" />
      </template>
      仪表盘
    </t-menu-item>
    <t-menu-item value="resource">
      <template #icon>
        <t-icon name="server" />
      </template>
      资源列表
    </t-menu-item>
    <t-menu-item value="root">
      <template #icon>
        <t-icon name="root-list" />
      </template>
      根目录
    </t-menu-item>
    <t-menu-item value="control-platform">
      <template #icon>
        <t-icon name="control-platform" />
      </template>
      调度平台
    </t-menu-item>
  </t-menu>
</template>

<script setup>
import { useSettingStore } from '@/store/setting'

const setting = useSettingStore()

</script>

<style scoped>

</style>