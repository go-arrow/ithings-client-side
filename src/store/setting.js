import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
  state: () => {
    return {
      collapsed: false,
    }
  },
  actions: {
    changeCollapsed() {
      this.collapsed = !this.collapsed
    }
  }
})