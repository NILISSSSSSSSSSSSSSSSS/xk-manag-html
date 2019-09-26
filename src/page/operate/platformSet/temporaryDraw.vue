<template>
    <div class="xk-container temporary-draw">
        <div class='xk-radius'>
            <div class='xk-title'>
                <div class='vus-title'>
                <span></span>
                    临时抽奖设置
                </div>
                <div class='vus-bottom'></div>
            </div>

            <el-tabs v-model="activeName">
                <el-tab-pane label="模拟奖品设置" name="first">
                    <el-card>
                        <div slot="header">选择模板适用的奖品</div>
                        <el-form label-width="150px">
                            <el-row :gutter="20">
                                <el-col :span="10">
                                    <el-input :size="$size" placeholder="请输入商品ID(福利中奖类型为消费抽奖的奖品)"></el-input>
                                </el-col>
                                <el-col :span="5">
                                    <el-button :size="$size" type="primary">确定选择</el-button>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" class="prize-list">
                                <el-col :span="8" class="prize-list-item" v-for="(item, index) in prizeData" :key="index">
                                    <div>
                                        <div class="header">
                                            <div class="left">{{ item.name }}</div>
                                            <div class="right"><el-button title="删除" type="text" @click="deleteItem(index)"><i class="el-icon-close"></i></el-button></div>
                                        </div>
                                        <div class="section">
                                            <el-form-item label="设置奖品连场次数：">
                                                <el-row>
                                                    <el-col :span="10">
                                                        <el-form-item label-width="0">
                                                            <el-input v-model="item.min" :size="$size"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="2" class="center">-</el-col>
                                                    <el-col :span="10">
                                                        <el-form-item label-width="0">
                                                            <el-input v-model="item.max" :size="$size"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="2" class="center">场</el-col>
                                                </el-row>
                                            </el-form-item>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-card>
                </el-tab-pane>
                <el-tab-pane label="推广抽奖设置" name="second">
                    <el-form label-width="150px" class="spread-set" :model="spredForm" ref="spredForm">
                        <h2>推广抽奖设置</h2>
                        <div class="share-check">
                            <el-row>
                                <el-checkbox></el-checkbox>&nbsp;&nbsp;每日分享店铺奖励抽奖券
                            </el-row>
                            <el-row>
                                <el-checkbox></el-checkbox>&nbsp;&nbsp;每日分享自营商品奖励抽奖券
                            </el-row>
                        </div>

                        <h2>抽奖组件设置</h2>
                        <div class="lottery-set">
                            <el-form-item label="抽奖组件：">
                                <el-select :size="$size" v-model="spredForm.lotteryComponent">
                                    <el-option value="tiger" label="老虎机"></el-option>
                                    <el-option value="turntable" label="大转盘"></el-option>
                                    <el-option value="more" label="更多h5插件"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="选择奖品数量：">
                                <el-select :size="$size" v-model="spredForm.prizeNum" @change="changeNum">
                                    <el-option value="8" label="8"></el-option>
                                    <el-option value="10" label="10"></el-option>
                                    <el-option value="12" label="12"></el-option>
                                </el-select>
                            </el-form-item>

                            <div class="turntable-set">
                                <!-- 第一排 -->
                                <div class="first-line">
                                    <div class="turntable-cell center" v-for="(item, index) in turntableCircle.first" :key="index">
                                        <el-button :size="$size" type="primary" @click="openDialog('first', index)">{{ item.name? item.name: '点击选择奖品'+(index+1) }}</el-button>
                                    </div>
                                </div>
                                <!-- 第二排 -->
                                <div class="second-line">
                                    <div class="turntable-cell center left">
                                        <el-button :size="$size" type="primary" @click="openDialog('second', 0)">{{ turntableCircle.second[0].name? turntableCircle.second[0].name: '点击选择奖品'+spredForm.prizeNum }}</el-button>
                                    </div>
                                    <div class="turntable-cell center right">
                                        <el-button :size="$size" type="primary" @click="openDialog('second', 1)">{{ turntableCircle.second[1].name? turntableCircle.second[1].name: '点击选择奖品'+(turntableCircle.first.length+1) }}</el-button>
                                    </div>
                                </div>
                                <!-- 第三排 -->
                                <div class="third-line" v-if="spredForm.prizeNum!=8">
                                    <div class="turntable-cell center left">
                                        <el-button :size="$size" type="primary" @click="openDialog('third', 0)">{{ turntableCircle.third[0].name? turntableCircle.third[0].name: '点击选择奖品'+(spredForm.prizeNum-1) }}</el-button>
                                    </div>
                                    <div class="turntable-cell center right">
                                        <el-button :size="$size" type="primary" @click="openDialog('third', 1)">{{ turntableCircle.third[1].name? turntableCircle.third[1].name: '点击选择奖品'+(turntableCircle.first.length+2) }}</el-button>
                                    </div>
                                </div>
                                <!-- 第四排 -->
                                <div class="four-line">
                                    <div class="turntable-cell center" v-for="(item, index) in turntableCircle.four" :key="index">
                                        <el-button :size="$size" type="primary" @click="openDialog('four', index)">{{ item.name? item.name: '点击选择奖品'+((turntableCircle.four.length-index) + (spredForm.prizeNum!= 8? turntableCircle.first.length+2: turntableCircle.first.length+1)) }}</el-button>
                                    </div>
                                </div>
                            </div>


                            <!-- 奖品连中设置 -->
                            <h2 class="margintop20">奖品连中设置</h2>
                            <el-form-item label="连中笔数设置：" class="margintop20">
                                <el-row>
                                    <el-col :span="4">
                                        <el-form-item label-width="0">
                                            <el-input :size="$size"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1" class="center">-</el-col>
                                    <el-col :span="4">
                                        <el-form-item label-width="0">
                                            <el-input :size="$size"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="1">&nbsp;&nbsp;笔</el-col>
                                </el-row>
                            </el-form-item>
                        </div>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
        
        <!-- 奖品选择 -->
        <el-dialog title="选择奖品" :visible.sync="dialogVisible" width="400px">
            <el-row class="prize-lists center">
                <el-col :span="24" v-for="(item, index) in prizeData" :key="index">
                    <div @click="setName(item)">{{ item.name }}</div>
                </el-col>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" @click="dialogVisible=false">取消</el-button>
                <el-button :size="$size" type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeName: 'second',
                prizeData: [
                    { name: '小米智能电视', min: '', max: '' },
                    { name: '小米智能台灯', min: '', max: '' },
                    { name: '乐视超级电视', min: '', max: '' },
                    { name: '红包', min: '', max: '' }
                ],
                turntableCircle: {
                    first: [
                        {name: '', value: ''},
                        {name: '', value: ''},
                        {name: '', value: ''}
                    ],
                    second: [
                        {name: '', value: ''},
                        {name: '', value: ''}
                    ],
                    third: [
                        {name: '', value: ''},
                        {name: '', value: ''}
                    ],
                    four: [
                        {name: '', value: ''},
                        {name: '', value: ''},
                        {name: '', value: ''}
                    ]
                },
                spredForm: {
                    prizeNum: 8
                },
                dialogVisible: false,
                current: {}
            }
        },
        methods: {
            deleteItem(index) {
                this.prizeData.splice(index, 1);
            },
            changeNum(val) {
                switch(val*1) {
                    case 12:
                        this.turntableCircle.first.push({name: '', value: ''});
                        this.turntableCircle.four.push({name: '', value: ''});
                    break;
                    default:
                        [this.turntableCircle.first] = [this.turntableCircle.first.slice(0,3)];
                        [this.turntableCircle.four] = [this.turntableCircle.four.slice(0,3)]
                    break;
                }
            },
            openDialog(index, subIndex) {
                this.current = {
                    index: index,
                    subIndex: subIndex
                };
                this.dialogVisible = true;
            },
            /**
             * 设置奖品名称
             */
            setName(item) {
                this.turntableCircle[this.current.index][this.current.subIndex] = {
                    name: item.name,
                    value: ''
                }
                this.turntableCircle=JSON.parse(JSON.stringify(this.turntableCircle));
                this.dialogVisible = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    .temporary-draw{
        .prize-list {
            .prize-list-item{
                &>div{
                    margin-top: 20px;
                    padding: 0 10px;
                    box-shadow: 1px 1px 15px 1px #ccc;
                    border-radius: 5px;
                }
            }
        }
        .header{
            &::after {
                content: "";
                display: block;
                overflow: hidden;
                visibility:hidden;
                height:0;
                clear: both;
            }
            .left{
                float: left;
                padding: 12px 0;
                font-size: 15px;
            }
            .right {
                float: right;
            }
        }
        .section{
            padding-bottom: 1px;
        }
    }

    .spread-set {
        padding: 20px;
        .share-check {
            padding: 20px;
            /deep/ .el-row {
                margin-bottom: 10px;
                font-size: 14px;
                color: #666;
            }
        }
    }
    .turntable-set{
        border-top: 1px solid #ccc;
        border-left: 1px solid #ccc;
        display: inline-block;
        // width: 801px;
        // min-width: 801px;
        font-size: 0;
        .turntable-cell {
            display: inline-block;
            width: 200px;
            padding: 50px 10px;
            box-sizing: border-box;
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
        }
        .right{
            width: 201px;
            float: right;
            border-left: 1px solid #ccc;
        }
        .four-line {
            border-bottom: 1px solid #ccc;
            .turntable-cell {
                border-bottom: none;
                &:not(:first-child):not(:last-child) {
                    border-top: 1px solid #ccc;
                }
            }
            
        }
    }
    .prize-lists {
        /deep/ .el-row {
            padding: 0 20px;
        }
        /deep/ .el-col {
            margin-bottom: 10px;
            background: #f0f0f0;
            padding: 15px 0;
            border-radius: 5px;
        }
        font-size: 15px;
        color: #222;
    }
</style>
