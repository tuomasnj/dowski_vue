import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import api from './api'
Vue.prototype.$api = api

import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

import auth from './util/auth'
Vue.use(auth)

import cookies from 'vue-cookies'
Vue.use(cookies)

import VueMeta from 'vue-meta'
Vue.use(VueMeta)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import 'vant/lib/index.css'
import { Dialog } from 'vant'
Vue.use(Dialog)

import waterfall from 'vue-waterfall2'
Vue.use(waterfall)

import hotkeys from 'hotkeys-js'
Vue.prototype.$hotkeys = hotkeys

// 全局组件自动注册
import './components/autoRegister'

// 自动加载 svg 图标
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

import './assets/styles/reset.scss'
import { Message } from 'element-ui'
Vue.prototype.$message = Message

import './mock'

Vue.directive('long-press', {
    bind(el, binding) {
        let pressTimer
        let isLongPress = false

        const start = event => {
            isLongPress = false
            pressTimer = setTimeout(() => {
                isLongPress = true
                binding.value(event)
            }, 1000) // 长按1秒触发
        }

        const cancel = event => {
            clearTimeout(pressTimer)
            if (isLongPress) {
                event.preventDefault() // 阻止后续的单击事件
                event.stopPropagation() // 阻止事件传播
            }
        }

        const handleClick = event => {
            if (isLongPress) {
                event.preventDefault() // 阻止 click 事件
                event.stopImmediatePropagation() // 阻止立即传播
            }
        }

        el.addEventListener('mousedown', start)
        el.addEventListener('touchstart', start)
        el.addEventListener('mouseup', cancel)
        el.addEventListener('touchend', cancel)
        el.addEventListener('mouseleave', cancel)
        el.addEventListener('click', handleClick) // 添加 click 事件处理
    }
})

Vue.config.productionTip = false
Vue.config.devtools = false

Vue.prototype.$eventBus = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

export const vueApp = Vue.prototype.$eventBus
