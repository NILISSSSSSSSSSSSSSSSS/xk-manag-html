<template>
    <div class="pie">
        <div id="echartID" style="width: 90%;height:350px;"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'

    export default {
        props: {
            pieData:{
                type: Array,
                default: ()=> []
            }
        },
        data() {
            return {
                _datas: [],
                data_name: [],
                myChart: '',
                totalAmount: 0
            }
        },
        methods: {
            init() {
                this.formatData(this.pieData);
                this.myChart = echarts.init(document.getElementById("echartID"));
                let option = {
                    title: {
                        text: '交易金额',
                        subtext: `¥ ${this.totalAmount}`,
                        left:"28.5%",
                        top:"32%",
                        right: "center",
                        textAlign: 'center',
                        textStyle: {
                            x: '20%',
                            y: '31%',
                            color: "#727272",
                            fontWeight: 200,
                            fontSize: 14,
                        },
                        subtextStyle: {
                            color: "#4c63b7",
                            fontWeight: 900,
                            fontSize: 28
                        }

                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}"
                    },
                    legend: {
                        icon: 'circle',
                        top: 20,
                        itemWidth: 50,
                        align: 'left',
                        orient: 'vertical',
                        x: 'right',
                        data: this.data_name,
                        formatter: function (name, value) {
                            return name;
                        }
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['52%', '65%'],
                            center: ['29%', '40%'],
                            color: ['#3b9fff', '#37cbca', '#4eca73', '#FAD337', '#FF729C', '#5C5DE6'],
                            itemStyle: {
                                normal : {
                                    label : {
                                        show : false
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                },
                                emphasis : {
                                    label : {
                                        show : true,
                                        position : 'center',
                                        textStyle : {
                                            fontSize : '30',
                                            fontWeight : 'bold'
                                        }
                                    }
                                }
                            },
                            data: this._datas
                        }
                    ]
                }

                this.myChart.setOption(option, true);
            },
            //默认数据
            defaultData(params) {
                if(!params || params.length===0) {
                    this._datas =  [{
                            value: 0,
                            price: 0,
                            name: '其       它：',
                            label: {
                                normal: {
                                    formatter: ''
                                }
                            },
                        }
                    ]
                }
                
                for (let n  in this._datas){
                    this._datas[n]['name'] = this._datas[n]['name'] +' '+this.$math.multip(this.$math.divide(this._datas[n]['value'], this.totalAmount), 100).toFixed(2) +'%' + '    ¥ '+this._datas[n]['price'];
                    this.data_name.push(this._datas[n]['name'])
                }
            },
            //格式化数据
            formatData(params) {
                let arr = [];
                if(params) {
                    params.forEach(item=>{
                        this.totalAmount = this.$math.add(this.totalAmount, this.$math.divide(item.amount, 100));
                        
                        let obj = {
                            value: this.$math.divide(item.amount, 100),
                            name: item.categoryName,
                            price: this.$math.divide(item.amount, 100),
                            label: {
                                normal: {
                                    formatter: ''
                                }
                            }
                        }
                        arr.push(obj);
                    })
                }
                
                this._datas = arr;
                this.defaultData(this._datas);
            }
        },
        destroyed() {
            this.myChart.dispose();
        },
        watch: {
            pieData: {
                handler(val) {
                    if(!val) {
                        this.defaultData();
                    }
                    this.init();
                    console.log(val)
                },
                deep: true
            }
        }
    }
</script>

<style scoped lang="scss">
    .pie{}
</style>
