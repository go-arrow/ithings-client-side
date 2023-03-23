<template>
  <t-layout class="h-screen">
  <t-aside :width="setting.collapsed ? '64px' : '232px'">
    <AppMenu/>
  </t-aside>
  <t-layout>
    <t-header>
      <AppHeader/>
    </t-header>
    <t-content class="p-2 max-h-screen overflow-y-auto">
      <t-breadcrumb class="px-2 py-3">
        <template #default>
          <t-breadcrumbItem>数据接入</t-breadcrumbItem>
          <t-breadcrumbItem>模型管理</t-breadcrumbItem>
          <t-breadcrumbItem>新建模型</t-breadcrumbItem>
        </template>
        <template #separator> / </template>
      </t-breadcrumb>
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

<style>
.t-table__header > tr {
  background-color: #e5eef7;
}

.t-table__th-cell-inner {
  color: black;
  font-weight: bolder;
}
</style>