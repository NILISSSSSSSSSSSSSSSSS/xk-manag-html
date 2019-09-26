<template>
    <div class="xk-container specialty-food-detail">
        <div class="xk-body">
            <div class="xk-radius">
                <div class="padding20">
                    
                    <h3>{{ type===1? '申购详情': '购买资格详情' }}</h3>
                    <el-card class="marintop20">
                        <div slot="header">商品信息</div>
                        <el-row class="item-content">
                            <el-col :span="6">商品ID：</el-col>
                            <el-col :span="6">商品名称：</el-col>
                            <el-col :span="6">商品类型：</el-col>
                            <el-col :span="6">商品分类：</el-col>
                            <el-col :span="6">商品规格：</el-col>
                            <el-col :span="6">商品价格：</el-col>
                            <el-col :span="6">商品品牌：</el-col>
                            <el-col :span="6">商品系列：</el-col>
                            <el-col :span="6">商品重量：</el-col>
                            <el-col :span="6">上市时间：</el-col>
                            <el-col :span="24" style="margin-bottom:0">商品图片：</el-col>
                            <el-row>
                                <el-col :span="24">
                                    <div class="left img-list">
                                        <div class="span">
                                            <div class="span-box">
                                                <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3301357945,1129788635&fm=15&gp=0.jpg" alt="" @click="$viewImage(itemImg)">
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-row>
                    </el-card>

                    <el-card class="marintop20">
                        <div slot="header">申购信息</div>
                        <el-row class="item-content">
                            <el-col :span="6">店铺ID：</el-col>
                            <el-col :span="18">店铺名称：</el-col>
                            <el-col :span="24">店铺地址：</el-col>
                            <el-col :span="6">联系人：</el-col>
                            <el-col :span="6">联系电话：</el-col>
                            <el-col :span="24">员工编制：</el-col>
                            <el-col :span="24">用餐规模：</el-col>
                            <el-col :span="24">餐厅介绍：</el-col>
                            <el-col :span="6">
                                <el-col :span="24" class="m-b-0">餐饮营业执照：</el-col>
                                <el-col :span="24">
                                    <div class="left img-list">
                                        <div class="span">
                                            <div class="span-box">
                                                <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3301357945,1129788635&fm=15&gp=0.jpg" alt="" @click="$viewImage(itemImg)">
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-col>
                            <el-col :span="6">
                                <el-col :span="24" class="m-b-0">卫生许可证：</el-col>
                                <el-col :span="24">
                                    <div class="left img-list">
                                        <div class="span">
                                            <div class="span-box">
                                                <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3301357945,1129788635&fm=15&gp=0.jpg" alt="" @click="$viewImage(itemImg)">
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-col>
                            <el-col :span="6">
                                <el-col :span="24" class="m-b-0">消防合格证书：</el-col>
                                <el-col :span="24">
                                    <div class="left img-list">
                                        <div class="span">
                                            <div class="span-box">
                                                <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3301357945,1129788635&fm=15&gp=0.jpg" alt="" @click="$viewImage(itemImg)">
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-col>
                            <el-col :span="24" style="margin-bottom:0">店铺照片：</el-col>
                            <el-row>
                                <el-col :span="24">
                                    <div class="left img-list">
                                        <div class="span">
                                            <div class="span-box">
                                                <img src="https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3301357945,1129788635&fm=15&gp=0.jpg" alt="" @click="$viewImage(itemImg)">
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-row>
                    </el-card>

                    <el-card class="marintop20">
                        <div slot="header">申购审核</div>
                        <el-row class="item-content">
                            <el-col :span="24" class="m-b-0">
                                <el-col style="width: 80px">
                                    审核结果：
                                </el-col>
                                <el-col style="width: 480px; padding-top:2px" class="m-b-0">
                                    <el-col :span="4" class="m-b-0">
                                        <el-radio v-model="result" :label="0">通过</el-radio>
                                    </el-col>
                                    <el-col :span="20" class="m-b-0">
                                        <el-row>
                                            <el-radio v-model="result" :label="1">不通过</el-radio>
                                        </el-row>
                                        <el-row v-if="result===1">
                                            <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 5}" placeholder="请输入不通过原因" resize="none" class="margintop10"></el-input>
                                        </el-row>
                                    </el-col>
                                </el-col>
                                <!-- <el-col style="width: 80px">不通过</el-col> -->
                            </el-col>
                            <el-col :span="24">
                                <span style="display:inline-block;width:80px">审核时间：</span>2019-09-16
                            </el-col>
                            <el-col :span="24">
                                <span style="display:inline-block;width:80px">原因：</span>该店铺未具备相关资质该店铺未具备相关资质该店铺未具备相关资质该店铺未具备相关资质
                            </el-col>
                        </el-row>
                    </el-card>
                </div>
                <div class="btn-group">
                    <el-button :size="$size" type="primary" v-if="type===1">确定</el-button>
                    <el-button :size="$size" v-if="type===2">返回</el-button>
                    <el-button :size="$size" type="primary" v-if="type===2" @click="revoke">撤销资格</el-button>
                </div>
            </div>
            
        </div>
        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                type: 1,   //1招牌菜申购审核详情，2招牌菜管理详情
                result: 0,    //0通过，1通过
            }
        },
        created() {
            this.type = this.$route.query.type;
        },
        methods:{
             //取消资格
            revoke() {
                this.$confirm('确定要撤销该店铺的购买资格吗？', '撤销购买资格确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(()=>{
                    console.log('确认');
                    this.getList();
                })
                .catch(()=>{})
            },
        }
    }
</script>

<style scoped lang="scss">
@import './specialtyFoodDetail.scss'
</style>
