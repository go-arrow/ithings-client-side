<template>
  <t-layout class="h-screen">
  <t-aside :width="setting.collapsed ? '64px' : '232px'">
    <AppMenu/>
  </t-aside>
  <t-layout>
    <t-header>
      <AppHeader/>
    </t-header>
    <t-content>
      <router-view/>
    </t-content>
  </t-layout>
</t-layout>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppMenu from './components/AppMenu.vue'
import { useSettingStore } from '@/store/setting'

const setting = useSettingStore()
</script>

<style scoped>

</style>