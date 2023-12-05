import type { Router } from 'vue-router'

export function createPageLoadingGuard(router: Router) {
  router.beforeEach(() => {
    window.$loadingBar?.start()
  })

  router.afterEach((to, from, failure) => {
    setTimeout(() => {
      window.$loadingBar?.finish()
    }, 200)
    if (!failure) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error.
        HSStaticMethods.autoInit()
      }, 100)
    }
  })

  router.onError(() => {
    window.$loadingBar?.error()
  })
}
