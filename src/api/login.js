import api from './index'

// 用户登录
export const userLogin = data => {
    return api.post('/user/login', data)
}

// 获取用户权限
export const getPermissions = () => {
    return api.post('/user/permission')
}
