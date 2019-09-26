<template>
    <div class="expensive-prize">
        <el-form label-width="0" :model="searchForm">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="商品来源：" label-width="120px">
                        <el-select :size="$size" style="width: 100%" v-model="searchForm.from">
                            <el-option label="自营商城" value="mall"></el-option>
                            <el-option label="夺奖派对" value="j_mall"></el-option>
                            <el-option label="彩票" value="aa_lottery"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item>
                        <template v-if="searchForm.from != 'aa_lottery'">
                            <el-input max="20" clearable :size="$size" placeholder="请输入商品ID" v-model="searchForm.id"></el-input>
                        </template>
                        <template v-else>
                            <el-select :size="$size" v-model="searchForm.type">
                                <el-option label="AA大乐透" value="super_lotto"></el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item>
                        <el-button v-if="searchForm.from != 'aa_lottery'" :loading="searchLoading" :size="$size" type="primary" @click="selectGoods()">查询</el-button>
                        <el-button v-else :size="$size" type="primary" @click="selectLottery()">确定</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20" id="main_water_fall">
                <template v-for="(item, index) in prizeForm">
                    <el-col :span="12" :key="index">
                        <el-card class="margintop20">
                            <div slot="header">
                                <div class="header">
                                    <div class="prize-name">
                                        <el-button :title="item.name" type="text" @click="openDetail(item.id, item.prizeType, index, item.skuValue);">{{ item.name }}</el-button>
                                    </div>
                                    <el-button class="fr" type="text" icon="el-icon-close" @click="deleteItem(index)"></el-button>
                                </div>
                            </div>
                            <!-- 奖品配置 -->
                            <div class="prize-component">
                                <prize-component :ref="'win_'+index" v-model="item.win" :goodsType="item.prizeType"></prize-component>
                                <div class="">
                                    <el-button :size="$size" type="primary" @click="item.collapse = !item.collapse">收起/打开权重配置</el-button>
                                </div>
                                <el-collapse-transition>
                                    <div v-show="item.collapse">
                                        <order-weight-set :ref="'weight_'+index" v-model="item.order"></order-weight-set>
                                    </div>
                                </el-collapse-transition>
                            </div>
                        </el-card>
                    </el-col>
                    <div v-if="index%2==1&&index!=0" :key="index" style="width:100%;height:1px;float:left"></div>
                </template>
            </el-row>
        </el-form>

        <!-- 商品详情 -->
        <el-dialog :visible.sync="goodsVisible" title="奖品详情" width="800px">
            <div class="info">
                <h3>基本信息</h3>
                <el-row class="margintop20">
                    <el-col :span="24">奖品名称：{{ goodsInfo.name }}</el-col>
                    <el-col :span="12">奖品来源：{{ goodsInfo.fromName }}</el-col>
                    <el-col :span="12">奖品ID：{{ goodsInfo.id }}</el-col>
                    <el-col :span="24">奖品图片：</el-col>
                    <el-col :span="24">
                        <div class="img-box">
                            <div class="img-list" v-for="(item, index) in goodsInfo.pic" :key="index">
                                <img :src="item" alt="" @click="$viewImage(item)">
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="24">
                        奖品详情：
                        <div class="detail" v-html="goodsInfo.detail"></div>
                    </el-col>
                </el-row>
                <h3>规格详情</h3>
                <el-row class="sku-detail margintop20" v-if="goodsInfo.skuAttr">
                    <el-col :span="24" v-for="(item, index) in goodsInfo.skuAttr" :key="index">
                        <el-col :span="1" class="align"><el-radio v-model="goodsInfo.skuValue" :label="index">&nbsp;</el-radio></el-col>
                        <el-col :span="23">
                            <el-col :span="8">规格名称：{{ item.name }}</el-col>
                            <el-col :span="8">零售价：{{ $math.divide(item.b2cPrice, 100) }}元</el-col>
                            <el-col :span="8">批发价：{{ $math.divide(item.b2bPrice, 100) }}元</el-col>
                            <el-col :span="8">重量：{{ item.weight }}g</el-col>
                            <el-col :span="8">
                                <div class="goods"><span>商品图片：&nbsp;&nbsp;</span><img class="goods-pic" :src="item.skuUrl"/></div>
                            </el-col>
                        </el-col>
                    </el-col>
                </el-row>
            </div>
            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="confirm()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import OrderWeightSet from './OrderWeightSet.vue';
    import PrizeComponent from './PrizeComponent.vue';
    const EnumLottery = [
        {key: 'liuhe_lottery', value: '六合彩票'},
        {key: 'double_chromosphere', value: '双色球彩票'},
        {key: 'super_lotto', value: 'AA大乐透'}
    ]

    export default {
        components: {
            PrizeComponent,
            OrderWeightSet
        },
        computed: {
            ...mapState({
                totalNum: state => state.operatePlatform.totalMoney,
                prizeForm: state => state.operatePlatform.prizeForm
            })
        },
        data() {
            const checkNum = (rule, value, call) => {
                if(!value){
                    return call(new Error('不能为空'));
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('必须为数字类型'));
                }
                return call();
            }
            return {
                rules: {
                    everyCycleProvideNum: [{ required: true, validator: checkNum, trigger: 'blur' }],
                    rowStart: [
                        { required: true, validator: (rule, value, call)=>{
                            if(!value) {
                                return call(new Error('不能为空'))
                            }
                            if(!/^[1-9]\d*$/.test(value)) {
                                return call(new Error('必须为数字类型'));
                            }
                            if(this.prizeForm.rowEnd && parseInt(this.prizeForm.rowEnd) <= parseInt(value)) {
                                return call(new Error(`应小于${this.prizeForm.rowEnd}`));
                            }
                            return call();
                        }, trigger: 'blur'}
                    ],
                    rowEnd: [
                        { required: true, validator: (rule, value, call)=>{
                            if(!value) {
                                return call(new Error('不能为空'))
                            }
                            if(!/^[1-9]\d*$/.test(value)) {
                                return call(new Error('必须为数字类型'));
                            }
                            if(this.prizeForm.rowStart && parseInt(this.prizeForm.rowStart) >= parseInt(value)) {
                                return call(new Error(`应大于${this.prizeForm.rowStart}`));
                            }
                            return call();
                        }, trigger: 'blur'}
                    ]
                },
                list: {
                    index: 0,  //判断是修改或删除第几个奖品item
                    isEdit: false,   //判断是修改还是新增商品， false为修改，true为新增
                },
                searchLoading: false,
                searchForm: {
                    from: 'mall'
                },
                goodsInfo: {
                    skuValue: 0
                },
                goodsVisible: false
            }
        },
        methods: {
            selectGoods() {
                this.searchLoading=true;
                this.list.isEdit = true;
                this.goodsInfo.skuValue = 0;
                this.goodsInfo.id= "";
                this.getGoods();
            },
            getGoods(type, id) {
                if(this.searchForm.from === 'mall') {
                    this.$http.get(this.$api.goodsDetail, {id: this.searchForm.id || id}, true).then(res=>{
                        if(res) {
                            this.searchLoading=false;
                            this.goodsInfo = {
                                name: res.goods.base.name,
                                fromName: '自营商城',
                                from: 'mall',
                                id: res.goods.base.id,
                                pic: res.goods.base.showPicUrl,
                                detail: res.goods.base.detail,
                                skuAttr: res.goods.skuAttrValue,
                                skuValue: type? type: 0
                            }
                            this.goodsVisible=true;
                        }else{
                            this.$alert(`当前商品ID：（${this.searchForm.id || id}）不存在，请核对商品ID后再添加！`, '确定', {
                                confirmButtonText: '确定',
                                callback: action => {}
                            })
                        }
                    })
                    .catch(err=>{
                        this.searchLoading=false;
                        this.$message.error(err.message);
                    })
                }else {
                    this.$http.get(this.$api.jfmallGoodsDetail4Manager, {jGoodsId: this.searchForm.id}, true).then(res=>{
                        console.log(res)
                        if(res.usage!='expense') {
                            this.$alert('该商品不是运营专用奖品，不能被添加为奖品！', '确定', {
                                confirmButtonText: '确定',
                                callback: action => {}
                            })
                            return false;
                        }
                        this.searchLoading=false;
                        this.goodsInfo = {
                            name: res.name,
                            fromName: '夺奖派对',
                            from: 'j_mall',
                            id: res.id,
                            pic: res.realAttr&&res.realAttr.showPics?res.realAttr.showPics
                                : res.virtualAttr && res.virtualAttr.mainPic? [res.virtualAttr.mainPic]
                                : '',
                            detail: res.detailPics,
                            microPic: res.microPic,
                            description: res.description
                        }
                        this.goodsVisible=true;
                    })
                    .catch(err=>{
                        this.searchLoading=false;
                        this.$alert('商品ID不正确或服务器异常，请重新添加！', '确定', {
                            confirmButtonText: '确定',
                            callback: action => {}
                        })
                    })
                }
            },
            //添加自营商城商品或者夺奖派对商品
            confirm() {
                let params = {
                    name: this.goodsInfo.name,
                    prizeType: this.goodsInfo.from,
                    id: this.goodsInfo.id,
                    collapse: true,
                    win: {
                        average: '1',
                        winningAssignRules: [{
                            startNum: 1,
                            endNum: '',
                            appearNum: ''
                        }]
                    },
                    order: [{
                        startAmount: '',
                        endAmount: '',
                        proportion: ''
                    }]
                }
                if(this.goodsInfo.from=='mall') {
                    params.name = this.goodsInfo.name+'——'+this.goodsInfo.skuAttr[this.goodsInfo.skuValue].name;
                    params.skuValue = this.goodsInfo.skuValue ?this.goodsInfo.skuValue : this.prizeForm.skuValue;
                    params.skuCode = this.goodsInfo.skuAttr[this.goodsInfo.skuValue].code;
                }else{
                    params.win.microPic = this.goodsInfo.microPic
                    params.win.description = this.goodsInfo.description
                }
                if(this.list.isEdit) {
                    this.prizeForm.push(params);
                }else{
                    this.prizeForm.splice(this.list.index, 1, params);
                }
                //查询ID置空
                this.searchForm.id = '';
                this.goodsVisible = false;
                this.toScrollBottom();
            },
            //彩票选择
            selectLottery() {
                let params = {
                    name: this.getLotteryName(),
                    prizeType: "aa_lottery",
                    collapse: true,
                    type: this.searchForm.type,
                    win: {
                        average: '1',
                        winningAssignRules: [{
                            startNum: 1,
                            endNum: '',
                            appearNum: ''
                        }]
                    },
                    order: [{
                        startAmount: '',
                        endAmount: '',
                        proportion: ''
                    }],
                }
                
                this.prizeForm.push(params);
                this.toScrollBottom();
            },
            //滚动到底部
            toScrollBottom(){
                // 滚动到底部
                this.$nextTick(() => {
                    let num = Number($('.xk-container').scrollTop()) + Number($('#main_water_fall>div:last').offset().top);
                    $('.xk-container').animate(
                        {
                            scrollTop: num - 90
                        },
                        500
                    );
                });
            },
            getLotteryName() {
                return EnumLottery.filter(item=>{
                    return item.key === this.searchForm.type;
                })[0].value;
            },
            openDetail(id, from, index, skuIndex) {
                if(from === 'aa_lottery') {
                    return false;
                }
                this.goodsInfo = {};
                this.list ={
                    isEdit: false,
                    index: index
                }
                this.searchForm = {
                    id: id,
                    from: from
                }
                this.getGoods(skuIndex, id);
            },
            //删除一个模板奖品
            deleteItem(index) {
                this.prizeForm.splice(index, 1);
            },
            /**
             * 奖品验证
             */
            //新增一条分配设置
            addItem() {
                this.prizeForm.winningAssignRules.push({
                    startNum: 1,
                    endAmount: '',
                    appearNum: ''
                })
            },
            //删除一条分配设置
            deleteItemPrize(index) {
                this.prizeForm[index].winningAssignRules.splice(1);
            },

            //保存模板
            saveInfo() {
                return new Promise((resolve, reject) => {
                    let checkArr = [];
                    this.prizeForm.forEach((item, index) => {
                        checkArr.push(this.$refs['win_'+index][0]._validate());
                        checkArr.push(this.$refs['weight_'+index][0]._validate());
                    })
                    Promise.all(checkArr).then(res=>{
                        resolve(true);
                    })
                    .catch(err=>{
                        reject(false);
                    })
                })
                
            },
            //动态添加瀑布图片的功能函数
            waterfall() {
                this.$nextTick(()=>{
                    //取得展示框对象
                    const $boxs = $("#main_water_fall>div" );

                    // 一个块框的宽
                    const w = $boxs.eq(0).outerWidth();

                    //每行中能容纳的展示框个数【窗口宽度除以一个块框宽度】
                    const cols = 2;

                    //用于存储 每列中的所有块框相加的高度。
                    let hArr=[];

                    $boxs.each(function(index, value ){
                        let h = $boxs.eq(index).outerHeight();
                        if( index < cols ){
                            hArr[ index ] = h; //第一行中的num个块框 先添加进数组HArr
                        }else{
                            let minH = Math.min.apply(null, hArr );//数组HArr中的最小值minH
                            let minHIndex = $.inArray(minH, hArr );
                            $(value).css({
                                'position':'absolute','top':minH+'px', 'left':minHIndex*w + 'px'
                            });
                            //数组 最小高元素的高 + 添加上的展示框[i]块框高
                            hArr[ minHIndex ] += $boxs.eq(index).outerHeight();//更新添加了块框后的列高
                        }
                    });
                })
            }
        },
        watch: {
            // prizeForm(val) {
            //     this.waterfall();
            // }
        }
    }
</script>

<style scoped lang="scss">
    $fontSize : 14px;
    $fontColor: #666;
    $lh40: 40px;
    .expensive-prize{
        .header {
            display: flex;
            .fr {
                width: 80px;
            }
        }
        .prize-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .info {
            h3 {
                background-color: #b8d7ff;
                color: #fff;
                padding: 10px;
            }
            .margintop20 {
                padding-left: 20px;
            }
            /deep/ .el-col {
                margin-bottom: 10px;
            }
            .img-box {
                padding: 0 20px;
                .img-list {
                    display: inline-block;
                    width: 100px;
                    height: 100px;
                    overflow: hidden;
                    border: 1px dashed #ccc;
                    img{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .detail {
                padding: 20px 20px 0;
                width: 100%;
                overflow: hidden;
                img{
                    max-width: 100%;
                }
            }
            .sku-detail {
                .align {
                    padding-top: 2px;
                }
                /deep/ .el-col {
                    margin-bottom: 5px;
                }
                .goods {
                    display: table-cell;
                    span{
                        vertical-align: top;
                    }
                    .goods-pic {
                        width: 80px;
                        height: 80px;
                    }
                }
                
            }
        }

        .prize-component {
            /deep/ .el-form-item {
                margin-bottom: 15px;
            }
            .input {
                width: 100px;
            }
            .font-style {
                font-size: $fontSize;
                color: $fontColor
            }
            .line-height{
                line-height: $lh40;
            }
            .m-b-0 {
                margin-bottom: 0;
            }
        }
        
        #main_water_fall {
            position: relative;
            overflow: auto;
        }
    }
</style>