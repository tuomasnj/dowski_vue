// 获取天气预报
import api from './index'
export const getTempForecast = () => {
    return api.post('/lifeservice/temp/forecast')
}
