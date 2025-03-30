import HomeView from './pages/index.vue'
import Module from './pages/Module.vue'

export default  [
  { path: '/', component: HomeView },
  { path: '/module/:name', component: Module }
]
