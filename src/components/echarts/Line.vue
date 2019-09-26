<template>
    <div class="line">
        <div :id="echartID" style="width: 100%;height: 350px"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        props: {
            datas: {
                default: ()=>({}),
                type: Object
            },
            grid: {
                default: ()=> ({}),
                type: Object
            }
        },
        data() {
            return {
                myChart: '',
                echartID: 'line'+parseInt(Math.random()*1000),
                xData: ['01月', '02月', '03月', '04月', '05月'],
                yData: [200, 145, 325, 185, 400],
                // options: {
                //     tooltip: {
                //         trigger: 'axis'
                //     },
                //     calculable: true,
                //     xAxis: [
                //         {
                //             type: 'category',
                //             boundaryGap: false,
                //             data: ['01月', '02月', '03月', '04月', '05月']
                //         }
                //     ],
                //     yAxis: [
                //         {
                //             type: 'value',
                //             position: 'left'
                //         }
                //     ],
                //     series: [
                //         {
                //             name: '搜索引擎',
                //             type: 'line',
                //             stack: '总量',
                //             smooth: true,
                //             // yAxisIndex: 0,  //设置参考坐标
                //             itemStyle: {normal: {areaStyle: {type: 'default'}, lineStyle: {color: '#78b7ff'}}},
                //             data: [],
                //             // data: [820, 100, 1200, 500, 1290],
                //             color: [new echarts.graphic.LinearGradient(
                //                 0, 0, 0, 1,
                //                 [
                //                     {offset: 0, color: 'rgb(54, 138, 181)'},
                //                     {offset: 1, color: 'rgba(229,241,255, .5)'}
                //                 ])
                //             ],
                //         }
                //     ]
                // },
            }
        },
        // mounted() {
        //     this.init();
        // },
        methods: {
            init() {
                // this.$nextTick(()=>{
                    this.myChart = echarts.init(document.getElementById(this.echartID));
                    this.options = {
                        tooltip: {
                            trigger: 'axis',
                        },
                        //直角坐标系内绘图网格
                        grid: {
                            show: true,
                            top: '35px',
                            left: '60px',
                            right: '60px',
                            bottom: '50px',
                            containLabel: false,
                            borderWidth: 0,
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: false,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#b9c4d6'
                                }
                            },
                            axisLabel: {
                                interval:0,  
                                // rotate: 20
                            },
                            nameTextStyle: {
                                fontSize: 10
                            },
                            data: this.xData
                        },
                        yAxis: {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}'
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: '#b9c4d6'
                                }
                            },
                            axisTick: {
                                show: false,
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dashed',
                                    color: '#e8e6f1',
                                }
                            },
                        },
                        backgroundColor: '#ffffff',
                        series: [
                            {
                                name: '下单数量',
                                type: 'line',
                                data: this.yData,
                                smooth: true,
                                symbolSize: 40,
                                symbol: 'image://data:image/png;base64,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',
                                // 区域填充样式。
                                areaStyle: {
                                    normal: {
                                        color: {
                                            type: 'linear',
                                            x: 1,
                                            y: 0,
                                            x2: 0,
                                            y2: 0,
                                            colorStops: [{
                                                offset: 1, color: '#8E78FF' // 0% 处的颜色
                                            }, {
                                                offset: 0, color: 'rgba(74,144,250,1)' // 100% 处的颜色
                                            }],
                                            globalCoord: false // 缺省为 false
                                        }
                                    }
                                },
                                lineStyle: {
                                    normal: {
                                        color: '#1ca1fe',
                                        width: 1,
                                    },
                                },
                                itemStyle: {
                                    "normal": {
                                        "color": "#1ca1fe",
                                        "borderColor": "#1ca1fe",
                                        "borderWidth": 4
                                    }
                                },

                            }
                        ]
                    };
                    this.myChart.setOption(this.options, true);
                // })
            }
        },
        destroyed() {
            this.myChart.dispose();
        },
        watch: {
            datas: {
                handler(val) {
                    this.xData = val.xData;
                    this.yData = val.yData;
                    console.log(val);
                    this.init();
                },
                deep: true
            }
        }
    }
</script>