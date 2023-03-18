import type { Router } from 'vue-router'
import { createPageLoadingGuard } from './page-loading-guard'
import { createPageTitleGuard } from './page-title-guard'

export function setupRouterGuard(router: Router) {
  createPageLoadingGuard(router)
  createPageTitleGuard(router)
}
