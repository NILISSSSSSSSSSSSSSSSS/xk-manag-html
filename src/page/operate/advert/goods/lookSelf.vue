<template>
    <div class='look-self'>
        <div class="xk-list">
            <el-form ref="form" :model="form" label-width="130px">
                <el-form-item label="推荐说明：">
                    <template v-if="!type">
                        <el-input :size="$size" v-model="form.recommendMessage" placeholder="推荐说明"></el-input>
                    </template>
                    <template v-else>
                        {{ details.recommendMessage }}
                    </template>
                </el-form-item>
                <el-form-item label="商品所属区域：" required>
                    <template v-if="!type">
                        <el-row v-for="(item,index) in addressNum" :key='item'>
                            <el-col :span="22">
                                <province-cascader v-model="addressArr[index]" all></province-cascader>
                            </el-col>
                            <el-col :span="2">
                                <el-button type="text" @click.stop='fnDelAddress(index)'>删除</el-button>
                            </el-col>
                        </el-row>
                        <el-button type="primary" :size='$size' @click.stop='fnAddAddress'>新增地区</el-button>
                    </template>
                    <template v-else>
                        <p v-for="(item,index) in details.addressArr" :key="index">
                            {{ getPorvinceInfo(item) }}
                        </p>
                    </template>
                </el-form-item>
                <el-form-item label="排列顺序：" required>
                    <template v-if="!type">
                        <div class="goods-list" v-for="(item,index) in target" :key="index">商品{{ index+1 }}&nbsp;&nbsp;
                            <el-input v-model.trim="form.goodsId[item]" style="display:inline-block; width: 300px" :size="$size"></el-input>
                        </div>
                    </template>
                    <template v-else>
                        {{ details.index }}
                    </template>
                </el-form-item>
                <template v-if="!type">
                    <div class="confirm-btn">
                        <el-button :size="$size" type="primary" @click.stop='fnSure' :loading='load'>保存</el-button>
                    </div>
                    <!-- 商品列表 -->
                    <div class="goods-detail-tab">
                        <el-tabs v-model="activeTab" @tab-click="handleClick">
                            <el-tab-pane v-for="(item,index) in target" :key="index" :name="index+'tab'" :label="'商品'+(index+1)"></el-tab-pane>
                        </el-tabs>
                    </div>
                </template>

                <!-- 奖品显示信息 -->
                <div class="goods-detail-content" v-loading="loadingDetail">
                    <div class="xk-list-title">基本信息</div>
                    <div class="basic">
                        <el-row>
                            <el-col :span="24">
                                商品名称：{{ goodsDetail.base.name }}
                            </el-col>
                            <el-col :span="12">
                                商品ID：{{ goodsDetail.base.id }}
                            </el-col>
                            <el-col :span="12">
                                商品类型：{{ goodsDetail.base.type==='NEW'?"全新":"二手" }}
                            </el-col>
                            <el-col :span="12">
                                商品分类：{{ goodsDetail.category }}
                            </el-col>
                            <el-col :span="12" v-if="goodsDetail.base.brandName">
                                奖品品牌：{{ goodsDetail.base.brandName }}
                            </el-col>
                            <el-col :span="12">
                                邮寄方式：{{ goodsDetail.base.isFreeShipping?"包邮":"不包邮" }}
                            </el-col>
                            <el-col :span="24" v-if="goodsDetail.base.showPicUrl">
                                <span class="fl name">商品图片：</span>
                                <div class="fl pic">
                                    <image-list v-for="(item,index) in goodsDetail.base.showPicUrl" :key='index' :url="item"></image-list>
                                </div>
                            </el-col>
                        </el-row>
                    </div>

                    <div class="xk-list-title" v-show="goodsDetail.goodsAttrs.attrList.length">商品属性</div>
                    <div v-for="item in goodsDetail.goodsAttrs.attrList" :key='item' >
                        <template v-if="goodsDetail.goodsAttrs.attrList.length">
                            <el-form-item label="所属模块：">
                                {{item.name}}
                            </el-form-item>
                            <el-form-item :label="list.name+'：'" v-for="list in item.columns" :key='list'>
                                {{list.value}}
                            </el-form-item>
                        </template>
                    </div>
                    
                    <div class="xk-list-title">商品规格</div>
                    <el-form-item label="规格详情：">
                        <el-table
                                :size="$size"
                                :data="tableData"
                                style="width: 100%">
                            <el-table-column v-for="(item,index) in goodsDetail.skuAttr.attrList" :key="index" :label='item.name'>
                                <template slot-scope="scope">
                                    {{ scope.row.code.split("|")[index] | codeToSkuName}}
                                </template>
                            </el-table-column>
                            <el-table-column label="销售价（元）">
                                <template slot-scope="scope">
                                    <span v-if="goodsType==='square'">
                                        {{ $math.divide(scope.row.b2cPrice, 100) }}
                                    </span>
                                    <span v-else>
                                        {{ $math.divide(scope.row.b2bPrice, 100) }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="重量">
                                <template slot-scope="scope">
                                    {{ parseInt(scope.row.weight/1000) ?scope.row.weight/1000+'kg' :scope.row.weight+"g"}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="商品图片">
                                <template slot-scope="scope">
                                    <img :src="scope.row.skuUrl" width="50">
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-form-item label="商品详情：">
                        <div class="ue-detail" style="width:100%">
                            <div v-html="goodsDetail.base.detail"></div>
                        </div>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import ProvinceCascader from "@/components/ProvinceCascader.vue";
    import { getPorvinceInfo,enumFormatter } from '@/util/publicMehotds.js';
    import ImageList from '@/components/common/ImageList.vue';

    let tableEnum = []
    export default {
        name: 'lookSelf',
        data() {
            return {
                getPorvinceInfo,
                form: {
                    goodsId: {}
                },
                activeTab: "0tab",
                goodsDetail: {
                    base: {},
                    goodsAttrs: {
                        attrList: []
                    },
                    defaultSku: {},
                    skuAttr: {
                        attrList: []
                    }
                },
                tableData: [],
                load: false,
                addressArr: [],
                addressNum: 1,
                loadingDetail: false,
                details: {}
            };
        },
        props: {
            innerVisible: {
                type: Boolean,
                default: false
            },
            target: {
                type: Array,
                default: ()=> []
            },
            type: String,       //判断是详情还是新增
            goodsType: String      /**参数接收分别为 精选square 商户 merchant*/
        },
        components: {
            ProvinceCascader,
            ImageList
        },
        methods: {
            fnAddAddress() {
                this.addressNum++
            },
            fnDelAddress(i) {
                this.addressArr.splice(i, 1);
                if (this.addressNum <= 1) {
                    this.$message.error('地区不能为空')
                } else {
                    this.addressNum--;
                }

            },
            fnCancel() {
                this.$emit("update:innerVisible", false);
            },
            fnSure() {
                if(this.type) {
                    this.fnCancel();
                    return false;
                }
                /**
                 * 判断商品排序序号是否是整数
                 */
                
                let goodsIndexDtos = [],
                    isContinue = true; //

                this.target.forEach((item, index) => {
                    if(this.form.goodsId[item]) {
                        if(!/^\d*$/g.test(this.form.goodsId[item])) {
                            this.$message.error('排列顺序必须为整数');
                            isContinue = false;
                            return false;
                        }
                        goodsIndexDtos.push({
                            goodsId: item,
                            index: this.form.goodsId[item]
                        })
                    }else{
                        goodsIndexDtos.push({
                            goodsId: item
                        })
                    }
                })

                if(!isContinue) return;
                
                let bAddress = false;
                let arr1 = [];
                for (const item of this.addressArr) {
                    if (item) {
                        bAddress = true;
                        arr1.push(item[item.length - 1])
                    }
                }
                if (!this.doArr(arr1)) {
                    return false
                }
                arr1 = this.doArr(arr1);//去重
                // if (!this.form.recommendMessage) { // 非必填
                //     this.$message.error('推荐说明不能为空');
                //     return false;
                // }
                if (!bAddress) {
                    this.$message.error('地区不能为空');
                } else {
                    let params = {
                        recommendSGoodsDto: {
                            type: this.goodsType,
                            recommendMessage: this.form.recommendMessage,
                            districtCodes: arr1,
                            goodsIndexDtos
                        }
                    }
                    console.log(params);
                    this.load = true;
                    this.$http.post(this.$api.mallCreateRecommend, params, true).then(res => {
                        this.$message({
                            message: '增加成功',
                            type: 'success'
                        });
                        this.load = false
                        this.$emit('addSucessNow');
                        this.$emit("update:innerVisible", false);
                    }).catch((err) => {
                        this.$message.error(err.message)
                        this.load = false;
                    });
                }
            },
            getDetail(id) {
                if(!id) return ;
                this.tableData = [];
                this.loadingDetail = true;
                this.$http.get(this.$api.goodsDetail, {
                    recommendTargetType: this.goodsType,
                    id: id
                }, true).then((res) => {
                    tableEnum = [];
                    this.loadingDetail = false;
                    this.tableData = res.goods.skuAttrValue;
                    for (let i = 0, len = res.goods.skuAttr.attrList.length; i < len; i++) {
                        for (let j = 0, lenJ = res.goods.skuAttr.attrList[i].attrValues.length; j < lenJ; j++) {
                            tableEnum.push(res.goods.skuAttr.attrList[i].attrValues[j])
                        }
                    }

                    res.goods.address = res.goods.address ? res.goods.address : [];
                    this.goodsDetail = res.goods;
                    //详情
                    if(this.type) {
                        this.details = {
                            addressArr: this.goodsType==='square'? res.goods.base.squareRecomendContent.districtCodes: res.goods.base.merchantRecomendContent.districtCodes,
                            index: this.goodsType==='square'? res.goods.base.squareRecomendContent.index: res.goods.base.merchantRecomendContent.index,
                            recommendMessage: this.goodsType==='square'? res.goods.base.squareRecomendContent.recommendMessage: res.goods.base.merchantRecomendContent.recommendMessage
                        }
                    }
                }).catch((err) => {
                    this.loadingDetail = false;
                    this.$message.error(err.message)
                });
            },
            doArr(arr) {
                let [length1, length2] = [arr.length, 1];
                arr = [...new Set(arr)];
                length2 = arr.length;
                if (length1 !== length2) {
                    this.$message.error("有重复地区")
                    return false
                }
                let nation = false;
                arr.forEach((item, index) => {
                    if (parseInt(item) == 0) {
                        nation = true
                    }
                })
                if (nation && length2 > 1) {
                    this.$message.error("已选择全国")
                    return false;
                }
                let provinceArr = [];
                arr.forEach((item, index) => {
                    if (item % 10000 == 0) {
                        provinceArr.push(item);
                        delete arr[index];
                    }
                })
                let provinceOnce = null;
                arr = arr.filter((value, index) => {
                    let candel = provinceArr.find((item) => {
                        if (parseInt(item / 10000) == parseInt(value / 10000)) {
                            provinceOnce = item;
                        }
                        return parseInt(item / 10000) == parseInt(value / 10000)
                    })
                    return !candel
                });
                if (provinceOnce) {
                    this.$message.error(`已经选择了整个${this.codeToName(provinceOnce, 1)}`);
                    return false
                }
                let cityArr = [];
                arr.forEach((item, index) => {
                    if (item % 100 == 0) {
                        cityArr.push(item);
                        delete arr[index];
                    }
                })
                let cityOnce = null;
                arr = arr.filter((value, index) => {
                    let candel = cityArr.find((item) => {
                        if (parseInt(item / 100) == parseInt(value / 100)) {
                            cityOnce = item;
                        }
                        return parseInt(item / 100) == parseInt(value / 100)
                    })
                    return !candel
                });
                if (cityOnce) {
                    this.$message.error(`已经选择了整个${this.codeToName(cityOnce, 2)}`)
                    return false
                }
                arr = [...arr, ...provinceArr, ...cityArr];
                return arr;
            },
            codeToName(code, type) {
                let province = new Map(JSON.parse(localStorage.getItem("xk-province")));
                let city = new Map(JSON.parse(localStorage.getItem("xk-city")));
                return type === 1 ? province.get(code) ? province.get(code).name : "" : city.get(code) ? city.get(code).name : "";
            },
            /** 
             * 获取详情
            */
            handleClick(e) {
                this.getDetail(this.target[e.index])
            }
        },
        watch: {
            innerVisible: {
                handler(val) {
                    /**初始化数据 ----start---- */
                    this.form={
                        goodsId: {}
                    };
                    
                    this.addressArr=[];
                    this.activeTab = "0tab";
                    /**初始化数据 ----end---- */

                    val? this.getDetail(this.target[0]): null;
                },
                immediate: true
            }
        },
        filters: {
            codeToSkuName(val) {
                return enumFormatter(val, tableEnum, {key: 'code', value: 'name'});
            }
        }
    }
</script>
<style lang='scss' scoped>
    .look-self {
        .xk-list {
            padding-left: 10px;
            /deep/ .el-form-item{
                margin-bottom: 15px;
            }
            .xk-list-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px
            }
            .good-pic {
                height: 100px;
                margin: 0 10px
            }
            .confirm-btn {
                text-align: right;
                margin-right: 50px;
            }
        }
        .goods-detail-content {
            .basic {
                .fl{
                    float: left;
                }
                .name{
                    width: 70px;
                }
                .pic{
                    width: 90%;
                }
                padding-left: 50px;
                /deep/ .el-col {
                    margin-bottom: 15px;
                }
                .goods-pic {
                    padding-left: 20px;
                }
            }
        }
    }
    

    .look-self-center {
        display: flex;
        justify-content: center
    }

    .ue-detail {
        max-height: 500px;
        overflow: auto;
        div{
            max-width: 100%;
        }
        img {
            max-width: 600px;
        }
    }
</style>