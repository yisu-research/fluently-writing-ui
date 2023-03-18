import type { Router } from 'vue-router'
const baseTitle = import.meta.env.VITE_TITLE

export function createPageTitleGuard(router: Router) {
  router.afterEach((to) => {
    const pageTitle = to.meta?.title
    pageTitle ? (document.title = `${pageTitle} | ${baseTitle}`) : (document.title = baseTitle)
  })
}
