import api from '@/api/index'

// 上传图片
export function uploadImgs(files) {
    const formData = new FormData()
    files.forEach(file => {
        formData.append('files', file.raw)
    })
    return api.post('/file/upload', formData)
}
