import { createRouter, createWebHashHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '', // 默认子路由
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        meta: {
          menu: 'Dashboard'
        }
      },
      {
        path: '/model',
        name: 'Model',
        component: () => import('@/pages/manage/model/index.vue'),
        meta: {
          menu: 'Model'
        }
      },
      {
        path: '/model/create',
        name: 'CreateModel',
        component: () => import('@/pages/manage/model/create/index.vue'),
        meta: {
          menu: 'Model'
        }
      },
      {
        path: '/product',
        name: 'Product',
        component: () => import('@/pages/manage/product/index.vue'),
        meta: {
          menu: 'Product'
        }
      },
      {
        path: '/device',
        name: 'Device',
        component: () => import('@/pages/manage/device/index.vue'),
        meta: {
          menu: 'Device'
        }
      },
      {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/pages/setting/index.vue'),
        meta: {
          menu: 'Setting'
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
