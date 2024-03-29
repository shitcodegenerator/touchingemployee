import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import './index.css'
import './main.scss'
import vant from 'vant'

import { createPinia } from 'pinia'
import 'vant/lib/index.css' // 全局vant樣式
const pinia = createPinia()
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
})

updateSW()

createApp(App).use(router).use(vant).use(pinia).mount('#app')