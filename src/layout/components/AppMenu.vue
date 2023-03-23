<template>
  <t-menu theme="dark" :value="route.meta.menu" :collapsed="setting.collapsed" @change="changeHandler">
    <template #logo>
      <img v-if="setting.collapsed" width="60" class="px-1"  src="@/assets/logo.png" alt="logo" />
      <img v-else height="28" src="@/assets/logo-full.png" alt="logo" />
    </template>

    <t-menu-item value="Dashboard">
      <template #icon>
        <t-icon name="dashboard" />
      </template>
      仪表盘
    </t-menu-item>

    <t-submenu value="Manage">
      <template #icon>
        <t-icon name="cloud-upload" />
      </template>
      <template #title>
        <span>数据接入</span>
      </template>
      <t-menu-item value="Model"> 模型管理 </t-menu-item>
      <t-menu-item value="Product"> 产品管理 </t-menu-item>
      <t-menu-item value="Device"> 设备管理 </t-menu-item>
    </t-submenu>

    <t-menu-item value="Setting">
      <template #icon>
        <t-icon name="setting" />
      </template>
      系统设置
    </t-menu-item>
  </t-menu>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router' 
import { useSettingStore } from '@/store/setting'

const route = useRoute()
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