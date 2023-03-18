import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupAssets } from './plugins'

import App from './App.vue'
// import router from './router'
import { setupRouter } from '@/router'

import './assets/main.css'

async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  app.use(createPinia())

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
