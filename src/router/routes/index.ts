import type { RouteRecordRaw } from 'vue-router'

export const baseRoutes: RouteRecordRaw[] = [
  {
    name: 'root',
    path: '/',
    redirect: '',
    meta: {
      title: '首页',
    },
  },
  {
    name: 'About',
    path: '/about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: '登录页',
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
