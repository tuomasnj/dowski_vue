<template>
    <page-main v-loading="loading">
        <div style="display: flex; justify-content: left;">
            <div ref="chartContainer" style="width: 60%; height: 550px;" />
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
            chart: null,
            todayIdx: 1,
            dayWeather: [],
            nightWeather: [],
            temperatureUnit: '℃',
            lowTemp: [],
            highTemp: [],
            loading: true,
            xAxis: []
        }
    },

    mounted() {
        getTempForecast().then(res => {
            if (res.code == 200) {
                this.$message.success('成功')
                this.loading = false
                this.lowTemp = res.data.list.map(item => item.nightTemp)
                this.highTemp = res.data.list.map(item => item.dayTemp)
                this.dayWeather = res.data.list.map(item => item.dayWeather)
                this.nightWeather = res.data.list.map(item => item.nightWeather)
                this.xAxis = res.data.list.map(item => item.date.slice(5))
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
                                    color: '#00ca95' // 定义x轴坐标颜色
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
                                color: '#6c50f3',
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
                                color: '#6c50f3'
                            },
                            formatter: params => {
                                const weather = this.dayWeather[params.dataIndex % this.dayWeather.length]
                                return `${params.value} ${this.temperatureUnit} (${weather})`
                            }
                        },
                        itemStyle: {
                            color: params => {
                                // 改变特定数据点的颜色
                                return params.dataIndex === this.todayIdx ? 'red' : '#6c50f3'
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
                                color: '#00ca95',
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
                                color: '#00ca95'
                            },
                            formatter: params => {
                                const weather = this.nightWeather[params.dataIndex % this.nightWeather.length]
                                return `${params.value} ${this.temperatureUnit} (${weather})`
                            }
                        },
                        itemStyle: {
                            color: params => {
                                // 改变特定数据点的颜色
                                return params.dataIndex === this.todayIdx ? 'red' : '#6c50f3'
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

    },
    created() {

    },
    beforeDestroy() {
        if (this.chart) {
            this.chart.dispose()
        }
    }
}
</script>

