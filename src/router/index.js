import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '', // 默认子路由
        name: 'dashboard',
        component: () => import('@/pages/dashboard/index.vue')
      },
      {
        path: 'manage',
        children: [
          {
            path: '', // 默认子路由
            name: 'model',
            component: () => import('@/pages/manage/model/index.vue')
          },
          {
            path: 'product',
            name: 'product',
            component: () => import('@/pages/manage/product/index.vue')
          },
          {
            path: 'device',
            name: 'device',
            component: () => import('@/pages/manage/device/index.vue')
          },
        ]
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import('@/pages/setting/index.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
