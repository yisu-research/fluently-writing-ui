import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupRouterGuard } from './guard'
import { baseRoutes } from './routes'

const { VITE_BASE_URL } = import.meta.env

export const router = createRouter({
  history: createWebHistory(VITE_BASE_URL),
  routes: baseRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app: App) {
  setupRouterGuard(router)
  app.use(router)
}

export async function resetRouter() {
  const basicRouteNames = getRouteNames(baseRoutes)
  router.getRoutes().forEach((route) => {
    const name = route.name
    if (!basicRouteNames.includes(name)) {
      router.removeRoute(name!)
    }
  })
}

export function getRouteNames(routes: RouteRecordRaw[]) {
  return routes.map((route) => getRouteName(route)).flat(1)
}

function getRouteName(route: RouteRecordRaw) {
  const names = [route.name]
  if (route.children && route.children.length) {
    names.push(...route.children.map((item) => getRouteName(item)).flat(1))
  }
  return names
}
