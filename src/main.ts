import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets } from './plugins'
import { setupStore } from './store'
import { setupRouter } from '@/router'

async function bootstrap() {
  const app = createApp(App)

  // setup plugins
  setupAssets()

  // setup store
  setupStore(app)

  // setup store
  setupI18n(app)

  // setup router
  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
