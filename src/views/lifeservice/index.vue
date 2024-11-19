<template>
    <page-main id="main" v-loading="loading">
        <div style="display: flex; justify-content: center;">
            <div v-if="mode == 'pc'" ref="chartContainer" style="width: 80%; height: 600px;" />
            <div v-else ref="mobilechartContainer" style="width: 100%; height: 300px;" />
        </div>
    </page-main>
</template>

<script>
import * as echarts from 'echarts'
import {getTempForecast} from '@/api/life'
export default {
    name: 'Show',
    data() {
        return {
            mode: this.$store.state.settings.mode,
            chart: null,
            todayIdx: 1,
            dayWeather: [],
            nightWeather: [],
            temperatureUnit: '℃',
            lowTemp: [],
            highTemp: [],
            loading: true,
            xAxis: [],
            curTemp: '',
            curWeather: ''
        }
    },

    mounted() {
        if (this.mode == 'pc') {
            getTempForecast().then(res => {
                if (res.code == 200) {
                    this.$message.success('成功')
                    this.loading = false
                    this.lowTemp = res.data.list.map(item => item.nightTemp)
                    this.highTemp = res.data.list.map(item => item.dayTemp)
                    this.dayWeather = res.data.list.map(item => item.dayWeather)
                    this.nightWeather = res.data.list.map(item => item.nightWeather)
                    this.curTemp = res.data.curData.curTemp
                    this.curWeather = res.data.curData.curWeather
                    const weekdays = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    this.xAxis = res.data.list.map(item => {
                        const dateWithoutYear = item.date.slice(5)
                        const dayOfWeek = weekdays[item.dayOfWeek]
                        return `${dateWithoutYear} ${dayOfWeek}`
                    })
                    // 获取图表容器
                    this.chart = echarts.init(this.$refs.chartContainer)
                    const option = {
                        backgroundColor: '#080b30',
                        title: {
                            text: '近日天气',
                            textStyle: {
                                align: 'center',
                                color: '#fff',
                                fontSize: 20
                            },
                            top: '5%',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'none',
                                lineStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: 'rgba(0, 255, 233,0)'
                                        }, {
                                            offset: 0.5,
                                            color: 'rgba(255, 255, 255,1)'
                                        }, {
                                            offset: 1,
                                            color: 'rgba(0, 255, 233,0)'
                                        }],
                                        global: false
                                    }
                                }
                            }
                        },
                        grid: {
                            top: '15%',
                            left: '10%',
                            right: '10%',
                            bottom: '15%'
                        },
                        xAxis: [{
                            type: 'category',
                            axisLine: {
                                show: true
                            },
                            axisLabel: {
                                color: '#fff',
                                formatter: (value, index) => {
                                    if (index === this.todayIdx) {
                                        return `{a|${value}}` // 定义x轴坐标颜色
                                    }
                                    return value
                                },
                                rich: {
                                    a: {
                                        color: '#FF00FF' // 定义x轴坐标颜色
                                    }
                                }
                            },
                            boundaryGap: false,
                            data: this.xAxis
                        }],
                        yAxis: [{
                            type: 'value',
                            min: 0,
                            splitNumber: 4,
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: 'rgba(255,255,255,0.1)'
                                }
                            },
                            axisLine: {
                                show: false
                            },
                            axisLabel: {
                                show: false,
                                margin: 20,
                                textStyle: {
                                    color: '#d1e6eb'
                                }
                            },
                            axisTick: {
                                show: false
                            }
                        }],
                        series: [{
                            name: '温度',
                            type: 'line',
                            showAllSymbol: true,
                            symbol: 'circle',
                            symbolSize: 25,
                            lineStyle: {
                                normal: {
                                    color: '#FF4500',
                                    shadowColor: 'rgba(0, 0, 0, .3)',
                                    shadowBlur: 0,
                                    shadowOffsetY: 5,
                                    shadowOffsetX: 5
                                }
                            },
                            label: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#FF4500'
                                },
                                formatter: params => {
                                    const weather = this.dayWeather[params.dataIndex % this.dayWeather.length]
                                    return `${params.value} ${this.temperatureUnit}【${weather}】`
                                }
                            },
                            itemStyle: {
                                color: params => {
                                    // 改变特定数据点的颜色
                                    return params.dataIndex === this.todayIdx ? '#FF00FF' : '#FF4500'
                                },
                                borderColor: '#fff',
                                borderWidth: 3,
                                shadowColor: 'rgba(0, 0, 0, .3)',
                                shadowBlur: 0,
                                shadowOffsetY: 2,
                                shadowOffsetX: 2
                            },
                            tooltip: {
                                show: false
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(108,80,243,0.3)'}, {offset: 1, color: 'rgba(108,80,243,0)' }
                                    ], false),
                                    shadowColor: 'rgba(108,80,243, 0.9)',
                                    shadowBlur: 20
                                }
                            },
                            data: this.highTemp
                        }, {
                            name: '温度',
                            type: 'line',
                            showAllSymbol: true,
                            symbol: 'circle',
                            symbolSize: 25,
                            lineStyle: {
                                normal: {
                                    color: '#00FFFF',
                                    shadowColor: 'rgba(0, 0, 0, .3)',
                                    shadowBlur: 0,
                                    shadowOffsetY: 5,
                                    shadowOffsetX: 5
                                }
                            },
                            label: {
                                show: true,
                                position: 'bottom',
                                textStyle: {
                                    color: '#00FFFF'
                                },
                                formatter: params => {
                                    const weather = this.nightWeather[params.dataIndex % this.nightWeather.length]
                                    return `${params.value} ${this.temperatureUnit}【${weather}】`
                                }
                            },
                            itemStyle: {
                                color: params => {
                                    // 改变特定数据点的颜色
                                    return params.dataIndex === this.todayIdx ? '#FF00FF' : '#00FFFF'
                                },
                                borderColor: '#fff',
                                borderWidth: 3,
                                shadowColor: 'rgba(0, 0, 0, .3)',
                                shadowBlur: 0,
                                shadowOffsetY: 2,
                                shadowOffsetX: 2
                            },
                            tooltip: {
                                show: false
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(0,202,149,0.3)'}, {offset: 1, color: 'rgba(0,202,149,0)' }
                                    ], false),
                                    shadowColor: 'rgba(0,202,149,0.9)',
                                    shadowBlur: 20
                                }
                            },
                            data: this.lowTemp
                        }, {
                            name: '当前温度',
                            type: 'scatter',
                            symbol: 'path://M10,0 L13,7 L20,7 L15,11 L17,18 L10,14 L3,18 L5,11 L0,7 L7,7 Z',  // 五角星形状
                            symbolSize: 21,  // 五角星的大小
                            label: {
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: '#ff7f50'
                                },
                                formatter: () => {
                                    const data = this.curTemp
                                    return `${data}℃【${this.curWeather}】`
                                }
                            },
                            itemStyle: {
                                color: '#ff7f50'  // 五角星的颜色
                            },
                            data: [
                                [1, this.curTemp]  // 设置在 x=2 位置的五角星
                            ]
                        }]
                    }
                    this.chart.setOption(option)
                } else {
                    this.loading = false
                    this.$message.error('服务异常')
                }
            }).catch(err => {
                this.loading = false
                console.log('error', err)
                this.$message.error('服务异常')
            })
        }
    },
    created() {
        if (this.mode == 'mobile') {
            getTempForecast().then(res => {
                if (res.code == 200) {
                    this.$message.success('成功')
                    this.loading = false
                    this.lowTemp = res.data.list.map(item => item.nightTemp)
                    this.highTemp = res.data.list.map(item => item.dayTemp)
                    this.dayWeather = res.data.list.map(item => item.dayWeather)
                    this.nightWeather = res.data.list.map(item => item.nightWeather)
                    this.curTemp = res.data.curData.curTemp
                    this.curWeather = res.data.curData.curWeather
                    this.xAxis = res.data.list.map(item => {
                        const dateWithoutYear = item.date.slice(5)
                        return `${dateWithoutYear}`
                    })
                    // 获取图表容器
                    this.chart = echarts.init(this.$refs.mobilechartContainer)
                    const option = {
                        backgroundColor: '#080b30',
                        title: {
                            text: '近日天气',
                            textStyle: {
                                align: 'center',
                                color: '#fff',
                                fontSize: 20
                            },
                            top: '5%',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'none',
                                lineStyle: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: 'rgba(0, 255, 233,0)'
                                        }, {
                                            offset: 0.5,
                                            color: 'rgba(255, 255, 255,1)'
                                        }, {
                                            offset: 1,
                                            color: 'rgba(0, 255, 233,0)'
                                        }],
                                        global: false
                                    }
                                }
                            }
                        },
                        grid: {
                            top: '15%',
                            left: '10%',
                            right: '10%',
                            bottom: '15%'
                        },
                        xAxis: [{
                            type: 'category',
                            axisLine: {
                                show: true
                            },
                            axisLabel: {
                                color: '#fff',
                                formatter: (value, index) => {
                                    if (index === this.todayIdx) {
                                        return `{a|${value}}` // 定义x轴坐标颜色
                                    }
                                    return value
                                },
                                rich: {
                                    a: {
                                        color: '#FF00FF' // 定义x轴坐标颜色
                                    }
                                }
                            },
                            boundaryGap: false,
                            data: this.xAxis
                        }],
                        yAxis: [{
                            type: 'value',
                            min: 0,
                            splitNumber: 4,
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: 'rgba(255,255,255,0.1)'
                                }
                            },
                            axisLine: {
                                show: false
                            },
                            axisLabel: {
                                show: false,
                                margin: 20,
                                textStyle: {
                                    color: '#d1e6eb'
                                }
                            },
                            axisTick: {
                                show: false
                            }
                        }],
                        series: [{
                            name: '温度',
                            type: 'line',
                            showAllSymbol: true,
                            symbol: 'circle',
                            symbolSize: 25,
                            lineStyle: {
                                normal: {
                                    color: '#FF4500',
                                    shadowColor: 'rgba(0, 0, 0, .3)',
                                    shadowBlur: 0,
                                    shadowOffsetY: 5,
                                    shadowOffsetX: 5
                                }
                            },
                            label: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#FF4500'
                                },
                                formatter: params => {
                                    const weather = this.dayWeather[params.dataIndex % this.dayWeather.length]
                                    return `${params.value}【${weather}】`
                                }
                            },
                            itemStyle: {
                                color: params => {
                                    // 改变特定数据点的颜色
                                    return params.dataIndex === this.todayIdx ? '#FF00FF' : '#FF4500'
                                },
                                borderColor: '#fff',
                                borderWidth: 3,
                                shadowColor: 'rgba(0, 0, 0, .3)',
                                shadowBlur: 0,
                                shadowOffsetY: 2,
                                shadowOffsetX: 2
                            },
                            tooltip: {
                                show: false
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(108,80,243,0.3)'}, {offset: 1, color: 'rgba(108,80,243,0)' }
                                    ], false),
                                    shadowColor: 'rgba(108,80,243, 0.9)',
                                    shadowBlur: 20
                                }
                            },
                            data: this.highTemp
                        }, {
                            name: '温度',
                            type: 'line',
                            showAllSymbol: true,
                            symbol: 'circle',
                            symbolSize: 25,
                            lineStyle: {
                                normal: {
                                    color: '#00FFFF',
                                    shadowColor: 'rgba(0, 0, 0, .3)',
                                    shadowBlur: 0,
                                    shadowOffsetY: 5,
                                    shadowOffsetX: 5
                                }
                            },
                            label: {
                                show: true,
                                position: 'bottom',
                                textStyle: {
                                    color: '#00FFFF'
                                },
                                formatter: params => {
                                    const weather = this.nightWeather[params.dataIndex % this.nightWeather.length]
                                    return `${params.value}【${weather}】`
                                }
                            },
                            itemStyle: {
                                color: params => {
                                    // 改变特定数据点的颜色
                                    return params.dataIndex === this.todayIdx ? '#FF00FF' : '#00FFFF'
                                },
                                borderColor: '#fff',
                                borderWidth: 3,
                                shadowColor: 'rgba(0, 0, 0, .3)',
                                shadowBlur: 0,
                                shadowOffsetY: 2,
                                shadowOffsetX: 2
                            },
                            tooltip: {
                                show: false
                            },
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(0,202,149,0.3)'}, {offset: 1, color: 'rgba(0,202,149,0)' }
                                    ], false),
                                    shadowColor: 'rgba(0,202,149,0.9)',
                                    shadowBlur: 20
                                }
                            },
                            data: this.lowTemp
                        }, {
                            name: '当前温度',
                            type: 'scatter',
                            symbol: 'path://M10,0 L13,7 L20,7 L15,11 L17,18 L10,14 L3,18 L5,11 L0,7 L7,7 Z',  // 五角星形状
                            symbolSize: 21,  // 五角星的大小
                            label: {
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: '#ff7f50'
                                },
                                formatter: () => {
                                    const data = this.curTemp
                                    return `${data}℃【${this.curWeather}】`
                                }
                            },
                            itemStyle: {
                                color: '#ff7f50'  // 五角星的颜色
                            },
                            data: [
                                [1, this.curTemp]  // 设置在 x=2 位置的五角星
                            ]
                        }]
                    }
                    this.chart.setOption(option)
                } else {
                    this.loading = false
                    this.$message.error('服务异常')
                }
            }).catch(err => {
                this.loading = false
                console.log('error', err)
                this.$message.error('服务异常')
            })
        }
    },
    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose()
        }
    }
}
</script>

<style lang="scss" scoped>
    #main {
        padding: 0;
        .el-loading-mask {
            z-index: 800;
        }
    }
</style>

