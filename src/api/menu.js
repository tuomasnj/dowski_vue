import api from './index'

// 获取备忘录
export const getMenus = data => {
    return api.post('/memo/lists', data)
}

// 添加备忘录
export const addMenus = data => {
    return api.post('/memo/addnew', data)
}

// 修改备忘录
export const alterMenu = data => {
    return api.post('/memo/edit', data)
}

// 删除备忘录
export const deleteMenu = data => {
    return api.post('/memo/delete', data)
}
