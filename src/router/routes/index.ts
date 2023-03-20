import type { RouteRecordRaw } from 'vue-router'

export const baseRoutes: RouteRecordRaw[] = [
  {
    name: 'root',
    path: '/',
    component: () => import('@/views/home/index.vue'),
    meta: {
      title: '首页',
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
]

export const NOT_FOUND_ROUTE = {
  name: 'NotFound',
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  isHidden: true,
}

export const EMPTY_ROUTE = {
  name: 'Empty',
  path: '/:pathMatch(.*)*',
  component: null,
}
