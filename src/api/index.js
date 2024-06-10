import axios from 'axios'
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
            if (request.data instanceof FormData) {
                if (localStorage.getItem('apiToken')) {
                    // 如果是 FormData 类型（上传图片）
                    // request.data.append('token', store.state.user.token)
                    request.headers['token'] = localStorage.getItem('apiToken')
                }
            } else {
                if (localStorage.getItem('apiToken')) {
                    request.headers['Content-Type'] = 'application/json'
                    request.headers['token'] = localStorage.getItem('apiToken')
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
        return Promise.resolve(response.data)
    },
    error => {
        return Promise.reject(error)
    }
)

export default api
