<template>
    <div class="turntable-component">
        <div class="turntable-ceil" :style="{height : heightStyle}">
            <div class="cell" 
                    v-for="(item,index) in turntableCircle" 
                    :key="index" 
                    :style="{ 
                        left: turntableStyle[index].x*200 +'px',
                        top: turntableStyle[index].y*130 +'px',
                        borderRight:  turntableStyle[index].right,
                        borderBottom:  turntableStyle[index].bottom,
                        borderTop:  turntableStyle[index].top,
                        borderLeft:  turntableStyle[index].left
                    }"
                    >
                <el-button type="primary" :title="item.name" :size="$size" @click="openDialog(index)">{{ item.name? item.name: `点击选择奖品${index+1}` }}</el-button>
            </div>
        </div>

        <!-- 推广抽奖不存在AA卡，免单卡 -->
        <el-dialog title="选择奖品" :visible.sync="dialogVisible" width="400px">
            <el-row class="prize-lists">
                <template v-for="(item, index) in prizeData">
                    <template v-if="lotteryType==3">
                        <el-col v-if="item.prizeType !=='aa_lottery'" :span="24" :key="index">
                            <div @click="setName(item)">{{ item.name }}</div>
                        </el-col>
                    </template>
                    <template v-else>
                        <el-col :span="24" :key="index">
                            <div @click="setName(item)">{{ item.name }}</div>
                        </el-col>
                    </template>
                </template>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" @click="dialogVisible=false">取消</el-button>
                <el-button :size="$size" type="primary">确定</el-button>
            </div>
        </el-dialog>

        <!-- 红包选择 -->
        <el-dialog title="选择红包梯次" :visible.sync="dialogVisibleBag" width="400px">
            <el-row class="prize-lists">
                <el-checkbox-group v-model="selectedBagData">
                    <el-col :span="24">
                        <el-checkbox :label="defaultBag.id" disabled>{{ defaultBag.name }}</el-checkbox>
                    </el-col>
                    <el-col :span="24" v-for="(item, index) in bagData" :key="index">
                        <el-checkbox :label="item.id">{{ item.name }}</el-checkbox>
                    </el-col>
                </el-checkbox-group>
            </el-row>
            <div class="btn-group">
                <el-button :size="$size" @click="dialogVisibleBag=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="selectBag()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    const borderStyle = "1px solid #ccc";

    export default {
        props: {
            lotteryNum: {
                type: [Number,String],
                default: 8
            },
            max: {
                default: 1,
                type: [String, Number]
            },
            detail: {
                default: ""
            },
            rules: {
                type: String,
                default: 'spread'
            }
        },
        data() {
            return {
                num: 4,
                turntableCircle: [],
                dialogVisibleBag: false,
                dialogVisible: false,
                prizeData: [],
                bagData: [],
                selectedBagData: [], //保存选中的红包类型
                defaultBag: {},   //，默认红包
                selectIndex: 0,       //保存选中第几个奖品的索引
            }
        },
        computed: {
            ...mapState({
                lotteryPrizeList: state => state.operatePlatform.lotteryPrizeList,
                lotteryType: state => state.operatePlatform.lotteryType
            }),
            turntableStyle() {
                let style= [];
                switch(Number(this.lotteryNum)) {
                    case 4:
                        style= [
                            {x: 0,y:0, left: borderStyle, top: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 1,y:0, right: borderStyle, top: borderStyle, bottom: borderStyle},
                            {x: 1,y:1, bottom: borderStyle, right: borderStyle},
                            {x: 0,y:1, left: borderStyle, bottom: borderStyle, right: borderStyle}
                        ]
                    break;
                    case 6:
                        style= [
                            {x: 0,y:0, left: borderStyle, top: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 1,y:0, top: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 2,y:0, top: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 2,y:1, right: borderStyle, bottom: borderStyle},
                            {x: 1,y:1, right: borderStyle, bottom: borderStyle},
                            {x: 0,y:1, left: borderStyle, right: borderStyle, bottom: borderStyle}
                        ]
                    break;
                    case 8:
                        style= [
                            {x: 0,y:0, left: borderStyle, top: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 1,y:0, top: borderStyle, bottom: borderStyle},
                            {x: 2,y:0, left: borderStyle, top: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 2,y:1, left: borderStyle, right: borderStyle},
                            {x: 2,y:2, left: borderStyle, right: borderStyle, bottom: borderStyle, top: borderStyle},
                            {x: 1,y:2, top: borderStyle, bottom: borderStyle},
                            {x: 0,y:2, left: borderStyle, right: borderStyle, bottom: borderStyle, top: borderStyle},
                            {x: 0,y:1, left: borderStyle, right: borderStyle}
                        ]
                    break;
                    case 10:
                        style= [
                            {x: 0,y:0, left: borderStyle, top: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 1,y:0, top: borderStyle, bottom: borderStyle},
                            {x: 2,y:0, left: borderStyle, top: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 2,y:1, left: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 2,y:2, left: borderStyle, right: borderStyle},
                            {x: 2,y:3, top: borderStyle, bottom: borderStyle, right: borderStyle, left: borderStyle},
                            {x: 1,y:3, top: borderStyle, bottom: borderStyle},
                            {x: 0,y:3, left: borderStyle, bottom: borderStyle, right: borderStyle, top: borderStyle},
                            {x: 0,y:2, left: borderStyle, right: borderStyle},
                            {x: 0,y:1, left: borderStyle, bottom: borderStyle, right: borderStyle}
                        ]
                    break;
                    case 12:
                        style= [
                            {x: 0,y:0, left: borderStyle, top: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 1,y:0, top: borderStyle, bottom: borderStyle, right: borderStyle},
                            {x: 2,y:0, top: borderStyle, bottom: borderStyle},
                            {x: 3,y:0, left: borderStyle, top: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 3,y:1, left: borderStyle, right: borderStyle, bottom: borderStyle},
                            {x: 3,y:2, left: borderStyle, right: borderStyle},
                            {x: 3,y:3, left: borderStyle, bottom: borderStyle, right: borderStyle, top: borderStyle},
                            {x: 2,y:3, top: borderStyle, bottom: borderStyle},
                            {x: 1,y:3, top: borderStyle, bottom: borderStyle, right: borderStyle},
                            {x: 0,y:3, left: borderStyle, bottom: borderStyle, right: borderStyle, top: borderStyle},
                            {x: 0,y:2, left: borderStyle, right: borderStyle},
                            {x: 0,y:1, left: borderStyle, bottom: borderStyle, right: borderStyle}
                        ]
                    break;
                }
                return style;
            },
            heightStyle() {
                return (this.lotteryNum<8? 2 : this.lotteryNum==8? 3: 4)*130  + 'px'
            }
        },
        created() {
            this.initTurntableData();
        },
        methods: {
            initTurntableData() {
                this.turntableCircle = [];
                for(let i=0; i< this.lotteryNum; i++) {
                    this.turntableCircle.push({
                        name: '',
                        value: "",
                        position: i+1
                    })
                }
                console.log(this.turntableCircle)
            },
            /**
             * 设置奖品名称，每次设置红包的时候都要把默认红包带上
             */
            setName(item) {
                if(item.positionType==='red_packet') {
                    if(item.bag_content.length>0) {
                        this.bagData = item.bag_content;
                        this.defaultBag = {
                            id: item.bag_default_content[0].id,
                            name: item.bag_default_content[0].name
                        }
                        this.selectedBagData = [item.bag_default_content[0].id];
                        this.dialogVisibleBag = true;
                    }else{
                        this.$alert('请先前往运营基础设置中配置非默认红包！', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning',
                            callback: action => {}
                        });
                        return false;
                    }
                }else{
                    let obj = {
                        name: item.name,
                        positionType: item.positionType? item.positionType: 'prize',
                    }
                    if(item.positionType!=='consecutive') {
                        obj.prizeIds = [item.id];
                    }
                    this.turntableCircle[this.selectIndex] = obj;

                    this.turntableCircle=JSON.parse(JSON.stringify(this.turntableCircle));
                    this.dialogVisible = false;
                }
            },
            /**
             * 处理选择红包
             */
            selectBag() {
                if(!this.selectedBagData || this.selectedBagData.length<2) {
                    this.$message.error('请至少选择一个非默认红包！');
                    return false;
                }
                this.dialogVisible = false;
                this.turntableCircle[this.selectIndex] = {
                    name: '红包',
                    positionType: 'red_packet',
                    prizeIds: this.selectedBagData,
                    position: this.selectIndex
                }
                this.turntableCircle=JSON.parse(JSON.stringify(this.turntableCircle));
                this.dialogVisible = false;
                this.dialogVisibleBag = false;
            },
            openDialog(index) {
                this.prizeData = JSON.parse(JSON.stringify(this.lotteryPrizeList));
                if(this.rules=='spread') {
                    this.prizeData = this.prizeData.filter(item=>{
                        return item.virtualType!='aa_card' && item.virtualType != 'free_card ';
                    })
                }
                this.selectIndex = index;
                if(this.max!=1) {
                    this.prizeData.push({ name: '连抽', positionType: 'consecutive' })
                }
                this.dialogVisible = true;
            },
            //保存转盘
            saveLottery() {
                this.$emit('on-save', this.handlePrizeData());
                this.$emit('on-pos', this.turntableCircle);
            },
            //处理转盘奖品
            handlePrizeData() {
                let prizeData = [],
                    tmpPrizeIds = [],
                    prizeIds = [];
                for(let item of this.turntableCircle) {
                    if(item.prizeIds&&item.prizeIds.length>0){
                        tmpPrizeIds.push(...item.prizeIds)
                    }
                }
                prizeIds = Array.from(new Set(tmpPrizeIds));
                //去除默认红包ID
                if(!this.defaultBag.id) {
                    //初始化的时候，默认第一个为红包数据
                    this.defaultBag.id = this.lotteryPrizeList[0].bag_default_content[0].id;
                }
                prizeIds = prizeIds.filter(item=>{
                    return item!=this.defaultBag.id;
                })
                prizeData = prizeIds.map(id=>{
                    return {
                        id: id,
                        name: this.getPrizeName(id)
                    }
                })
                return prizeData;
            },
            //获取奖品名称
            getPrizeName(id) {
                let prizeName = '';
                let prize = this.lotteryPrizeList;
                for(let i=0,len = prize.length; i< len; i++) {
                    if(prize[i].positionType=='red_packet') {
                        prize[i].bag_content.forEach(item=>{
                            if(item.id==id){
                                prizeName = item.name;
                            }
                        })
                        if(prizeName) {
                            return prizeName;
                        }
                    }
                    if(id==prize[i].id){
                        return prize[i].name;
                    }
                }
                return prizeName;
            },
            /**
             * 判断奖品是否配置完成
             */
            checkPrizeSet() {
                let bool = true;
                this.turntableCircle.forEach(item=>{
                    if(!item.prizeIds && item.positionType != 'consecutive'){
                        bool=false;
                        return false;
                    }
                })
                bool?this.saveLottery(): null;
            }
        },
        watch: {
            lotteryNum(val) {
                if(val) {
                    this.initTurntableData();
                } 
            },
            detail: {
                handler(val) {
                    val? (this.turntableCircle = val): this.initTurntableData();
                },
                deep: true
            },
            dialogVisible(val) {
                //过滤AA卡、免单卡
                if(val) {
                    if(this.rules == 'spread') {
                        this.prizeData = this.prizeData.filter(item=>{
                            return item.virtualType != "free_card" && item.virtualType != "aa_card"
                        })
                    }
                }
                !val? this.checkPrizeSet(): null;
            }
        }
    }
</script>

<style scoped lang="scss">
    .turntable-component{
        position: relative;
        .turntable-ceil {
            position: relative;
            margin: 10px 50px;
            width: 100%;
        }
        .cell {
            position: absolute;
            z-index: 10;
            box-sizing: border-box;
            width: 200px;
            height: 130px;
            line-height: 130px;
            text-align: center;
            /deep/ .el-button {
                max-width: 120px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        //弹框样式
        .prize-lists {
            text-align: center;
            /deep/ .el-row {
                padding: 0 20px;
            }
            /deep/ .el-col {
                margin-bottom: 10px;
                background: #f0f0f0;
                padding: 15px 0;
                border-radius: 5px;
                cursor: pointer;
            }
            font-size: 15px;
            color: #222;
        }
    }
</style>
