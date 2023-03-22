<template>
  <t-menu theme="dark" default-value="dashboard" :collapsed="setting.collapsed" @change="changeHandler">
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
    <t-submenu value="manage">
      <template #icon>
        <t-icon name="cloud-upload" />
      </template>
      <template #title>
        <span>数据接入</span>
      </template>
      <t-menu-item value="model"> 模型管理 </t-menu-item>
      <t-menu-item value="product"> 产品管理 </t-menu-item>
      <t-menu-item value="device"> 设备管理 </t-menu-item>
    </t-submenu>
    <t-menu-item value="setting">
      <template #icon>
        <t-icon name="setting" />
      </template>
      系统设置
    </t-menu-item>
  </t-menu>
</template>

<script setup>
import { useSettingStore } from '@/store/setting'
import { useRouter } from 'vue-router'

const router = useRouter()

const setting = useSettingStore()

const changeHandler = (value) => {
  router.push({
    name: value
  })
}
</script>

<style scoped>

</style>