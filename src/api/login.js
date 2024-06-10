import api from './index'

// 用户登录
export const userLogin = data => {
    return api.post('/user/login', data)
}
