import axios from 'axios'
import store from '@/store/index'
import router from '@/router/index'
// import Qs from 'qs'
// import router from '@/router/index'

// const toLogin = () => {
//     router.push({
//         path: '/login',
//         query: {
//             redirect: router.currentRoute.fullPath
//         }
//     })
// }

const api = axios.create({
    baseURL: process.env.VUE_APP_API_ROOT,
    timeout: 10000,
    responseType: 'json'
    // withCredentials: true
})

api.interceptors.request.use(
    request => {
        if (request.method == 'post') {
            console.log(request)
            if (request.data instanceof FormData) {
                if (localStorage.getItem('token')) {
                    // 如果是 FormData 类型（上传图片）
                    // request.data.append('token', store.state.user.token)
                    request.headers['token'] = localStorage.getItem('token')
                }
            } else {
                if (localStorage.getItem('token') && !request.url.includes('login')) {
                    request.headers['Content-Type'] = 'application/json'
                    request.headers['token'] = localStorage.getItem('token')
                }
            }
        }
        return request
    }
)

api.interceptors.response.use(
    response => {
        // 如果响应头存在token
        if (response.headers['apitoken'] && response.headers['apitoken'] != undefined) {
            const token = response.headers['apitoken']
            localStorage.setItem('token', token)
        }
        if (response.data.code != 200) {
            console.log(response.data)
            // 退出登录
            store.dispatch('user/logout').then(() => {
                router.push({
                    name: 'login'
                })
            })
            // 清空用户权限
            store.commit('user/setPermissions', [])
        //    alert(store.state.menu.isGenerate)
        //    alert('permissions' + store.state.user.permissions)
        }
        return Promise.resolve(response.data)
    },
    error => {
        return Promise.reject(error)
    }
)

export default api
