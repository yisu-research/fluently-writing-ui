import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const baseRoutes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '一粟写作助手',
    },
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/system/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    name: 'register',
    path: '/register',
    component: () => import('@/views/system/register/index.vue'),
    meta: {
      title: '注册',
    },
  },
  {
    name: 'chat',
    path: '/chat',
    component: Layout,
    redirect: '/chat/index',
    children: [
      {
        name: 'chatIndex',
        path: 'index',
        component: () => import('@/views/chat/index.vue'),
        meta: {
          title: '聊天',
        },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/404',
  },
]
