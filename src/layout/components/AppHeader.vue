<template>
  <t-head-menu theme="light" :width="setting.collapsed ? '64px' : '232px'">
    <t-button shape="square" variant="text" size="large" class="-mx-4" @click="changeCollapsed">
      <view-list-icon slot="icon" />
    </t-button>
    
    <template #operations>
      <t-button variant="text" shape="square" size="large" >
        <template #icon><t-icon name="search" /></template>
      </t-button>
      <t-button variant="text" shape="square" size="large" >
        <template #icon><t-icon name="mail" /></template>
      </t-button>
      <t-button variant="text" shape="square" size="large" >
        <template #icon><t-icon name="user" /></template>
      </t-button>
    </template>
  </t-head-menu>
</template>

<script setup>
import { ViewListIcon } from 'tdesign-icons-vue-next'
import { useSettingStore } from '@/store/setting'

const setting = useSettingStore()

const changeCollapsed = () => {
  setting.changeCollapsed()
}
</script>

<style scoped>

</style>