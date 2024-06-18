import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

export const baseRoutes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '一粟科研AI平台',
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
    name: 'Signup',
    path: '/signup',
    component: () => import('@/views/system/register/index.vue'),
    meta: {
      title: '注册',
    },
  },
  {
    name: 'chat',
    path: '/',
    component: Layout,
    redirect: '/chat',
    children: [
      {
        name: 'chat',
        path: 'chat',
        component: () => import('@/views/chat/welcome-chat.vue'),
        meta: {
          title: '欢迎页',
        },
      },
      {
        name: 'History',
        path: '/history',
        component: () => import('@/views/chat-history/index.vue'),
        meta: {
          title: '历史记录',
        },
      },
      {
        name: 'chat-id',
        path: 'chat/:id',
        component: () => import('@/views/chat/index.vue'),
        meta: {
          title: '聊天详情',
        },
      },
      {
        name: 'user-center',
        path: 'user-center',
        component: () => import('@/views/user-center/index.vue'),
        meta: {
          title: '个人中心',
        },
      },
      {
        name: 'cost-center',
        path: 'cost-center',
        component: () => import('@/views/cost-center/index.vue'),
        meta: {
          title: '消费中心',
        },
      },
      {
        name: 'example-center',
        path: 'example-center',
        component: () => import('@/views/example-center/index.vue'),
        meta: {
          title: '示例中心',
        },
      },
      {
        name: 'invite-user',
        path: 'invite-user',
        component: () => import('@/views/invite-user/index.vue'),
        meta: {
          title: '邀请用户',
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
