<template>
  <div class = 'look-welfare'>
      <div class="xk-list">
            <el-form ref="form" :model="form" label-width="140px">
                <el-form-item label="商品所属区域：">
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
                        <p v-for="(item,index) in addressArr" :key="index">
                            {{ getPorvinceInfo(item.slice(-1)) }}
                        </p>
                    </template>
                </el-form-item>
                <el-form-item label="排列顺序：" required>
                    <template v-if="!type">
                        <div class="goods-list" v-for="(item,index) in target" :key="index">商品{{ index+1 }}&nbsp;&nbsp;
                            <el-input v-model.trim.number="form.goodsId[item]" style="display:inline-block; width: 300px" :size="$size"></el-input>
                        </div>
                    </template>
                    <template v-else>
                        {{ details.index }}
                    </template>
                </el-form-item>
                <div class="confirm-btn" v-if="!type">
                    <el-button :size="$size" type="primary" @click.stop='fnSure' :loading='load'>保存</el-button>
                </div>

                 <!-- 商品列表 -->
                <div class="goods-detail-tab">
                    <el-tabs v-model="activeTab" @tab-click="handleClick">
                        <el-tab-pane v-for="(item,index) in target" :key="index" :name="'tab'+index" :label="'商品'+(index+1)"></el-tab-pane>
                    </el-tabs>
                </div>

                <div class="goods-detail" v-loading="loadingDetail">
                    <div class="xk-list-title">基本信息</div>
                    <el-form-item label="商品ID：">
                        {{goodsDetail.goodsId}}
                    </el-form-item>
                    <el-form-item label="商品名称：">
                        {{goodsDetail.goodsName}}
                    </el-form-item>
                    <el-form-item label="奖品用途：">
                        {{goodsDetail.usage == "expense" ? "运营专用奖品" : "福利抽奖"}}
                    </el-form-item>
                    <el-form-item label="奖品类型：">
                        {{goodsDetail.type == "virtual" ? "虚拟" : "实物"}}
                    </el-form-item>
                    <el-form-item label="商品类别：">
                        {{goodsDetail.category}}
                    </el-form-item>
                    <el-form-item label="品牌名称：">
                        {{goodsDetail.brandName}}
                    </el-form-item>
                    <el-form-item label="消费券价格：">
                        {{ $math.divide(goodsDetail.price, 100) }}
                    </el-form-item>
                    <el-form-item label="主要图片：">
                        <image-list :url="goodsDetail.mainPic"></image-list>
                    </el-form-item>
                </div>
            </el-form>
      </div>
  </div>
</template>
<script>
    import ProvinceCascader from "@/components/ProvinceCascader.vue";
    import { getPorvinceInfo } from '@/util/publicMehotds.js';
    import ImageList from '@/components/common/ImageList.vue';
    export default {
        name:'lookSelf',
        data () {
            return {
                activeTab: 'tab0',
                loadingDetail: false,
                getPorvinceInfo,
                form:{
                    goodsId: []
                },
                load:false,
                addressArr:[],
                addressNum:1,
                goodsDetail: {},  //奖品详情
                details: {}    //填写的详情
            };
        },
        props: {
            innerVisible:{
                type: Boolean,
                default: false
            },
            target:{
                type: Array,
                default: ()=>[]
            },
            type: String             //判断是查看详情还是 新增
        },
        components: {
            ProvinceCascader,
            ImageList
        },
        methods: {
            fnAddAddress(){
                this.addressNum++
            },
            fnDelAddress(i){
                this.addressArr.splice(i,1);
                if(this.addressNum<=1){
                    this.$message.error('地区不能为空')
                }else{
                    this.addressNum--;
                }
                
            },
            fnCancel(){
                this.$emit("update:innerVisible", false);
            },
            fnSure(){
                if(this.type) {
                    this.fnCancel();
                    return false;
                }
                /**
                 * 判断商品排序序号是否是整数
                 */
                let recommendGoods = [];
                for(let item in this.form.goodsId) {
                    if(!/^\d*$/g.test(this.form.goodsId[item])){
                        this.$message.error('排列顺序必须为整数')
                        return false;
                    }
                    recommendGoods.push({
                        jGoodsId: item,
                        index: this.form.goodsId[item]
                    })
                }

                let bAddress = false ;
                let arr1 = [];
                for (const item of this.addressArr) {
                    if(item){
                        bAddress = true ;
                        arr1.push(item[item.length - 1 ])
                    }
                }
                if(!this.doArr(arr1)){
                    return false
                }
                arr1 = this.doArr(arr1);//去重
                if(!bAddress){
                    this.$message.error('地区不能为空');
                }else{
                    this.load = true ;
                    let params = {
                        jSequenceRecommendDto: {
                            addresses: arr1,
                            recommendGoods
                        }
                    }
                    this.$http.post(this.$api.jfmallSaveRecommendJGoods4ManagerList, params, true).then((res) => {
                        console.log(res)
                        this.$message({
                            message: '增加成功',
                            type: 'success'
                        });
                        this.load = false
                        this.$emit('addSucessNow');
                        this.$emit("update:innerVisible", false);
                    }).catch((err) => {
                        console.log(err)
                        this.load = false ;
                        this.$message.error(err.message)
                    });
                }
            },
            getDetail(goodsId){
                let params = {
                    goodsId
                }
                console.log(params)
                this.loadingDetail = true;
                this.$http.get(this.$api.jfmallRecommendGoodsDetail4Manager, params, true).then(res => {
                    this.loadingDetail = false;
                    this.goodsDetail= res;
                    if(this.type) {
                        this.details = res;
                    }
                    console.log(res)
                    res.address = res.address ? res.address : [] ;
                    this.addressNum = res.address.length ? res.address.length : 1;
                    this.addressArr = [];
                    res.address.forEach((item,index) => {
                        this.addressArr[index] = []
                        if(item.provideCode){
                            this.addressArr[index].push(item.provideCode)
                        }
                        if(item.cityCode){
                            this.addressArr[index].push(item.cityCode)
                        }
                        if(item.districtCode){
                            this.addressArr[index].push(item.districtCode)
                        }
                        if(item.code=='000000'){
                            this.addressArr = [['000000']]
                        }
                    });
                }).catch((err) => {
                    this.loadingDetail = false;
                    this.$message.error(err.message);
                });
            },
            doArr(arr){
                let [length1,length2] = [arr.length,1];
                arr = [...new Set(arr)];
                length2 = arr.length;
                if(length1 !== length2){
                    this.$message.error("有重复地区")
                    return false
                }
                let nation = false ;
                arr.forEach((item,index)=>{
                    if(parseInt(item)==0){
                        nation = true
                    }
                })
                if(nation&&length2>1){
                    this.$message.error("已选择全国")
                    return false;
                }
                let provinceArr = [] ;
                arr.forEach((item,index)=>{
                    if(item%10000==0){
                        provinceArr.push(item);
                        delete arr[index];
                    }
                })
                let provinceOnce = null ;
                arr = arr.filter((value,index) => {
                    let candel = provinceArr.find((item)=>{
                        if(parseInt(item/10000) == parseInt(value/10000)){
                            provinceOnce = item ;
                        }
                        return parseInt(item/10000) == parseInt(value/10000)
                    })
                    return !candel
                });
                if(provinceOnce){
                    this.$message.error(`已有全${this.codeToName(provinceOnce,1)}`);
                    return false
                }
                let cityArr = [] ;
                arr.forEach((item,index)=>{
                    if(item%100==0){
                        cityArr.push(item);
                        delete arr[index];
                    }
                })
                let cityOnce = null ;
                arr = arr.filter((value,index) => {
                    let candel = cityArr.find((item)=>{
                        if(parseInt(item/100) == parseInt(value/100)){
                            cityOnce = item ;
                        }
                        return parseInt(item/100) == parseInt(value/100)
                    })
                    return !candel
                });
                if(cityOnce){
                    this.$message.error(`已有全${this.codeToName(cityOnce,2)}`)
                    return false
                }
                arr = [...arr,...provinceArr,...cityArr];
                return arr ;
            },
            codeToName(code,type){
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
                    if(val){
                        /**初始化数据 ----start---- */
                        this.form={
                            goodsId: []
                        };
                        this.activeTab = "tab0";
                        /**初始化数据 ----end---- */
                        this.getDetail(this.target[0])
                    }
                },
                immediate: true
            }
        }
    }
</script>
<style lang='scss' scoped>
.look-welfare{
    .xk-list{
        padding-left: 10px;
        .xk-list-title{
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px
        }
        .good-pic{
            height: 100px;
            margin: 0 10px
        }
        .confirm-btn {
            text-align: right;
            margin-right: 50px;
        }
    }
    .goods-detail {
        /deep/ .el-form-item{
            margin-bottom: 0;
        }
    }
}
</style>