import type { Router } from 'vue-router'
import { getToken } from '@/store/modules/auth/helper'

const whiteList = ['/login', '/signup', '/']

export function createLoginGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const token = getToken()
    if (token) {
      next()
    } else {
      if (whiteList.includes(to.path)) {
        next()
        return
      }
      next('/login')
    }
  })
}
