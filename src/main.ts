import { createApp } from 'vue'
import './assets/index.css'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import routes from './routes'

const router = createRouter({
  history: createMemoryHistory(),
  routes
});

createApp(App)
  .use(router)
  .mount('#app')
  .$nextTick(() => {
  // Use contextBridge
  // window.api.on('main-process-message', (_event, message) => {
  //   console.log(message)
  // })
})
