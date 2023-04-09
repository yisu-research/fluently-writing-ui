import type { RouteRecordRaw } from 'vue-router'

export const baseRoutes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: 'Pixel Art',
    },
  },
  {
    name: 'drawing-board',
    path: '/drawing-board',
    component: () => import('@/views/drawing-board/index.vue'),
    meta: {
      title: '像素画板',
    },
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
