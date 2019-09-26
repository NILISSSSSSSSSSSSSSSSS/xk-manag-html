<template>
    <div class="groom-merchant-regulation-detail">
        <el-dialog title="店铺管理详情" :visible.sync="visible" width="800px" top="50px">
                <el-form :model="detailForm" label-width="120px">
                    <el-form-item label="店铺编号：">{{ detailForm.mrCode }}</el-form-item>
                    <el-form-item label="上级店铺：">{{ detailForm.masterName?detailForm.masterName: '无' }}</el-form-item>
                    <el-form-item label="状态：">{{ detailForm.detail.status==='active'? '正常': '下架' }}</el-form-item>
                    <el-form-item label="店铺分类：">{{ detailForm.detail.industry | getShopName }}</el-form-item>
                    <el-form-item label="店铺名称：">{{ detailForm.detail.name }}</el-form-item>
                    <el-form-item label="店铺地址：">{{ detailForm.detail | getRigion }}</el-form-item>
                    <el-form-item label="联系电话：">
                        <div v-if="!detailForm.detail.contactPhones || detailForm.detail.contactPhones.length===0">无</div>
                        <div v-else v-for="(phone,index) in detailForm.detail.contactPhones" :key="index">{{ phone }}</div>
                    </el-form-item>
                    <el-form-item label="营业时间：">
                        <el-col :span="24" v-if="detailForm.detail.newBusinessTime">{{ detailForm.detail.newBusinessTime.startAt }} - {{ detailForm.detail.newBusinessTime.endAt }}</el-col>
                    </el-form-item>
                    <el-form-item label="人均消费：">{{ detailForm.detail.avgConsumption?detailForm.detail.avgConsumption: 0 }}</el-form-item>
                    <el-form-item label="当前是否接单：">{{ detailForm.detail.automatic=='0'? '不接单': '接单' }}</el-form-item>
                    <el-form-item label="店铺介绍：">{{ detailForm.detail.description?detailForm.detail.description: '无' }}</el-form-item>
                    <el-form-item label="图片：">
                        <div class="img-list">
                            <div class="cover list" v-if="detailForm.detail.cover">
                                <img :src="detailForm.detail.cover" alt="" @click="viewPic(detailForm.detail.cover)">
                                <span>封面</span>
                            </div>
                            <div class="list">
                                <img v-for="item in detailForm.detail.pictures" :key="item" :src="item" alt="" @click="viewPic(item)">
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="btn-group">
                    <el-button :size="$size" type="primary" @click="visible=false">确定</el-button>
                </div>
                <!-- 图片查看 -->
                <el-dialog :visible.sync="dialogPic" title="预览图片" width="600px" class="prviewPic" append-to-body>
                    <img :src="picUrl" alt="" class="preview-pic">
                </el-dialog>
        </el-dialog>
    </div>
</template>
<script>
    let province = new Map(JSON.parse(localStorage.getItem('xk-province')));
    let city = new Map(JSON.parse(localStorage.getItem('xk-city')));
    let district = new Map(JSON.parse(localStorage.getItem('xk-district')));

    export default {
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            detailForm: {
                type: Object,
                default: ()=>({})
            }
        },
        data() {
            return {
                industryAllQList: '',     //行业分类
                dialogPic: false,
                picUrl: "",
            }
        },
        methods: {
            //预览图片
            viewPic(url) {
                this.picUrl = url;
                this.dialogPic = true;
            }
        },
        filters: {
            getShopName(val) {
                let str = '';
                let Qlist = JSON.parse(localStorage.getItem('industryAllQList'));
                for(let i in val[0]) {
                    if(i==='levelOneCode') {
                        let res =  (code=>{
                            for(let j in Qlist.oneLevel) {
                                if(Qlist.oneLevel[j].code == code) {
                                    return Qlist.oneLevel[j].name
                                }
                            }
                        })(val[0][i]);
                        
                        str = res? res: '';
                    }else if(i === 'levelTwoCode') {
                        let res = (code=>{
                            for(let j in Qlist.twoLevel) {
                                if(Qlist.twoLevel[j].code == code) {
                                    return Qlist.twoLevel[j].name
                                }
                            }
                        })(val[0][i]);
                        str += res? ' / ' + res: '';
                    }
                }
                return str? str: '无';
            },
            getRigion(row) {
                if(row) {
                    let pro = province.get(row.provinceCode)? province.get(row.provinceCode).name: row.provinceCode;
                    let _city = city.get(row.cityCode)? city.get(row.cityCode).name: row.cityCode;
                    let dis = district.get(row.districtCode)? district.get(row.districtCode).name: row.districtCode;
                    return pro+_city + dis + '\n' + row.address;
                }
            }
        },
        watch: {
            visible(val, oldVal) {
                !val? this.$emit('update:visible', false):"";
            }
        }
    }
</script>
<style scoped lang="scss">
    .groom-merchant-regulation-detail {
        /deep/ .el-dialog__body{
            padding: 10px 20px 30px;
        }
        /deep/ .el-form-item{
            margin-bottom: 0;
            .img-list {
                .list {
                    width: 220px;
                    height: 130px;
                    display: inline-block;
                    overflow: hidden;
                }
                .cover {
                    position: relative;
                    span {
                        padding: 5px 10px;
                        line-height: 16px;
                        position: absolute;
                        bottom: 10px;
                        right: 10px;
                        z-index: 10;
                        border: 1px solid #ccc;
                        cursor: default;
                    }
                }
                img {
                   width: 100%;
                   max-height: 100%;
                }
            }
        }
        
    }
    .prviewPic {
        text-align: center;
        img {
            max-width: 100%;
        }
    }
</style>
