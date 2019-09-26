<template>
    <div class = 'lottery-operation-info'>
        <div class='xk-title'>
            
            <div class='xk-radius' v-loading="pageLoad">
                <div class='xk-title'>
                    <div class='vus-title'>
                    <span></span>
                        运营彩票信息修改记录
                    </div>
                    <div class='vus-btn'>
                        <el-button v-permission="'lotteryInfoEdit'" type='primary' :size='$size' @click="fnAdd">修改</el-button>
                    </div>
                    <div class='vus-bottom'></div>
                    <el-table
                    :data="tableData"
                    border
                    stripe
                    style="width: 100%">
                        <el-table-column
                            prop="name"
                            label="运营彩票名称">
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            label="彩票单注价格">
                            <template slot-scope="scope">
                                {{scope.row.price | Division}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="maxPrice"
                            label="小额兑奖最大值">
                            <template slot-scope="scope">
                                {{scope.row.maxPrice | Division | NumThree}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="autoSelectTime"
                            label="彩票自动选号时间">
                            <template slot-scope="scope">
                                {{scope.row.autoSelectTime/60/60}} 小时
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="autoExpiryTime"
                            label="小额自动兑奖时间">
                            <template slot-scope="scope">
                                {{scope.row.autoExpiryTime/60}} 分钟
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="lotteryCycles"
                            label="彩票开奖周期">
                            <template slot-scope="scope">
                                <span v-for="(item,index) in scope.row.lotteryCycles" :key="index">
                                    每周{{item.severalweeks}}<span>{{item.severalweeks==6?' '+fnToPersonTime(item.winningTime)+' ':"、"}}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="deadlineEvery"
                            label="每期选号截止时间">
                            <template slot-scope="scope">
                                {{fnToPersonTime(scope.row.deadlineEvery)}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="operatorName"
                            label="操作管理员姓名">
                        </el-table-column>
                        <el-table-column
                            prop="useTime"
                            label="使用时间">
                            <template slot-scope="scope">
                                <span>
                                    {{scope.row.useTime.start|formatTime}}<br/>
                                    ~<br>
                                    <span v-if="scope.row.useTime.end==-1">一直有效</span>
                                    <span v-else>{{scope.row.useTime.end|formatTime}}</span>
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            width="800px"
            :size="$size"
            class="lottery-edit"
            :before-close="handleClose">
            <el-form ref="lotteryRef" 
                :model="lotteryData" 
                label-width="180px" 
                :rules="rules"
                v-loading="addLoading"
                :size="$size">
                <el-form-item label="彩票类型：">
                    体彩——超级大乐透
                </el-form-item>
                <el-form-item label="运营彩票名称：" prop="name">
                    <el-input v-model="lotteryData.name"></el-input>
                </el-form-item>
                <el-form-item label="彩票单注价格：" prop="price">
                    <el-input v-model.number="lotteryData.price"></el-input>
                </el-form-item>
                <el-form-item label="小额兑奖最大值：" prop="maxPrice">
                    <el-input v-model.number="lotteryData.maxPrice"></el-input>
                </el-form-item>
                <el-form-item label="彩票自动选号时间：" prop="autoSelectTime">
                    <el-input v-model.number="lotteryData.autoSelectTime"></el-input>
                    <span>小时</span>
                </el-form-item>
                <el-form-item label="小额自动兑奖时间：" prop="autoExpiryTime">
                    <el-input v-model.number="lotteryData.autoExpiryTime"></el-input>
                    <span>分钟</span>
                </el-form-item>
                <el-form-item label="彩票图片：" prop="pic">
                    <image-upload v-model="lotteryData.pic" size="2">
                        <img v-if="lotteryData.pic" :src="lotteryData.pic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </image-upload>
                    <p><span class="xk-danger">*  </span>上传说明：logo图片建议1:1尺寸150*150px（图片大小2M以内）</p>
                </el-form-item>
                <el-form-item label="彩票开奖周期：">
                    <span v-for="(item,index) in lotteryData.lotteryCycles" :key="index">
                        每周{{item.severalweeks}}<span>{{item.severalweeks==6?' '+fnToPersonTime(item.winningTime):"、"}}</span>
                    </span>
                </el-form-item>
                <el-form-item label="每期选号截止时间：" prop="deadlineEvery">
                    <el-time-select
                        v-if="showAgain"
                        v-model="lotteryData.deadlineEvery"
                        :picker-options="{
                            start: '00:00',
                            step: '00:15',
                            end: '18:00'
                        }"
                        placeholder="选择时间">
                    </el-time-select>
                    <span style="color:#f44336">说明：截止时间后的选号，自动沦为下一期</span>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleClose" :size="$size">关 闭</el-button>
                    <el-button type="primary" @click="onSubmit" :size="$size">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog
            title="再次确认"
            :visible.sync="dialogVisibleAgain"
            :size="$size"
            width="600px"
            :before-close="handleAgainClose">
            <el-form label-width="160px">
                <el-form-item label="运营彩票名称：">
                    <h3>{{lotteryData.name}}</h3>
                </el-form-item>
                <el-form-item label="彩票单注价格：">
                    <h3>
                        {{lotteryData.price}}
                        <span>元</span>
                    </h3> 
                </el-form-item>
                <el-form-item label="小额兑奖标准：">
                   <h3>
                       {{lotteryData.maxPrice}}
                       <span>元</span>
                    </h3>
                </el-form-item>
                <el-form-item label="彩票自动选号时间：">
                    <h3>
                        {{lotteryData.autoSelectTime}}
                        <span>小时</span>
                    </h3>
                </el-form-item>
                <el-form-item label="小额自动兑奖时间：">
                    <h3>
                        {{lotteryData.autoExpiryTime}}
                        <span>分钟</span>
                    </h3> 
                </el-form-item>
                <el-form-item label="彩票开奖周期：">
                    <h3>
                        <span v-for="(item,index) in lotteryData.lotteryCycles" :key="index">
                            每周{{item.severalweeks}}<span>{{item.severalweeks==6?' '+fnToPersonTime(item.winningTime):"、"}}</span>
                        </span>
                    </h3>
                </el-form-item>
                <el-form-item label="彩票前台LOGO：">
                    <img :src="lotteryData.pic" width="100" alt="">
                </el-form-item>
                <el-form-item label="每期选号截止时间：">
                    <h3>
                        <strong style="color:#f44336">{{lotteryData.deadlineEvery}}</strong>
                        后的选号沦为下一期
                    </h3>
                </el-form-item>
            </el-form>
            <h2 style="color:#f44336">
                注意：点击确定，则下一期使用该彩票运营信息，需要谨慎编辑
            </h2>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleAgainClose" :size="$size">返回修改</el-button>
                <el-button type="primary" @click="fnAgainSure" :size="$size" :loading="editLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import ImageUpload from '@/components/ImageUpload.vue'
export default {
    name:'lotteryOperationInfo',
    data () {
        let price = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('彩票单注价格不能为空'));
            }
            if (typeof value != 'number') {
                callback(new Error('请输入数字值'));
            } 
            if ( String(value).length > 6) {
                callback(new Error('数值最多6位，其中包括小数点及后2位'));
            } 
            callback();
        };
        let maxPrice = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('小额兑奖最大值不能为空'));
            }
            if (typeof value != 'number') {
                callback(new Error('请输入数字值'));
            } 
            if ( value < 1 || value > 10000) {
                callback(new Error('小额数值为1元~10000元'));
            } 
            callback();
        };
        let autoSelectTime = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('彩票自动选号时间不能为空'));
            }
            if (typeof value != 'number') {
                callback(new Error('请输入数字值'));
            }
            if(value<=0 || value > 48){
                callback(new Error('时间范围为0~48'));
            }
            callback();
        };
        let autoExpiryTime = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('小额自动兑奖时间不能为空'));
            }
            if (typeof value != 'number') {
                callback(new Error('请输入数字值'));
            }
            if(value<=0 || value > 3600){
                callback(new Error('时间范围为0~3600'));
            }
            callback();
        };
        return {
            rules: {
                name: [
                    { required: true, message: '请输入运营彩票名称', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                price: [
                    { required: true,validator: price, trigger: 'blur' },
                ],
                maxPrice: [
                    { required: true,validator: maxPrice, trigger: 'blur' },
                ],
                autoSelectTime: [
                    { required: true,validator: autoSelectTime, trigger: 'blur' },
                ],
                autoExpiryTime: [
                    { required: true,validator: autoExpiryTime, trigger: 'blur' },
                ],
                pic: [
                    { required: true, message: '请上传彩票图片', trigger: 'blur' },
                ],
                deadlineEvery: [
                    { required: true, message: '请选择每期选号截止时间', trigger: 'blur' },
                ],
            },
            currentPage:1,
            pageSize:10,
            total:0,
            tableData:[],
            lotteryData:{
                aaLotteryType:"super_lotto",//大乐透
                name:"",//彩票名称
                price:"",//彩票单注价格
                maxPrice:"",//小额兑奖最大值
                autoSelectTime:"24",//彩票自动选号时间
                autoExpiryTime:"120",//小额自动兑奖时间
                pic:"",//彩票图片
                lotteryCycles:"",//彩票自动选号时间
                deadlineEvery:"17:00",//每期选号截止时间
                expiryOverTime:"",//兑奖超时时间
                awardsSettings:"",//奖项设置
            },
            value: '',
            dialogVisible:false,
            dialogVisibleAgain:false,
            pageLoad:false,
            addLoading:false,
            editLoading:false,
            showAgain:true
        };
    },
    props: {},
    components: {
        ImageUpload
    },
    computed: {},
    created() {
        this.fnGetPage();
    },
    mounted() {},
    methods: {
        fnToPersonTime(time){
            let h = parseInt(time/3600) < 10 ? "0" + parseInt(time/3600) : parseInt(time/3600);
            let s = time%3600
            let min = s/60 < 10 ? "0" + s/60 : s/60;
            return ''+h+':'+min;
        },
        fnpagechange(currentPage,pageSize){
            this.currentPage = currentPage ;
            this.pageSize = pageSize ;
            this.fnGetPage();
        },
        handleClose(){
            this.dialogVisible = false ;
        },
        fnAdd(){
            this.dialogVisible = true ;
            this.$nextTick(()=>{
                this.$refs.lotteryRef.resetFields();
                this.addLoading = true ;
                this.$http.get(this.$api.typeDetail, {type:"super_lotto"}, true).then((res) => {
                    console.log(res)
                    this.addLoading = false ;
                    // {
                    //     aaLotteryType:"super_lotto",//大乐透
                    //     name:"",//彩票名称
                    //     price:"",//彩票单注价格
                    //     maxPrice:"",//小额兑奖最大值
                    //     autoSelectTime:"24",//彩票自动选号时间
                    //     autoExpiryTime:"120",//小额自动兑奖时间
                    //     pic:"",//彩票图片
                    //     lotteryCycles:"",//彩票自动选号时间
                    //     deadlineEvery:"17:00",//每期选号截止时间
                    //     expiryOverTime:"",//兑奖超时时间
                    //     awardsSettings:"",//奖项设置
                    // }
                    if(res){
                        for (const key in res) {
                            if (key==='autoSelectTime') {
                                this.lotteryData[key] = res[key]/3600
                            }else if(key==='price'){
                                this.lotteryData[key] = this.$math.divide(res[key], 100)
                            }else if(key==='maxPrice'){
                                this.lotteryData[key] = this.$math.divide(res[key], 100)
                            }else if(key==='autoExpiryTime'){
                                this.lotteryData[key] = res[key]/60
                            }else if(key==='deadlineEvery'){
                                this.lotteryData[key] = this.fnToPersonTime(res[key]);
                                this.showAgain = false ;
                                setTimeout(() => {
                                    this.showAgain = true ;
                                }, 0);
                            }else{
                                this.lotteryData[key] = res[key]
                            }
                        }
                    }
                    
                }).catch((err) => {
                    console.log(err);
                    this.addLoading = false ;
                    this.$message.error(err.message);
                });
            })
        },
        handleAgainClose(){
            this.dialogVisibleAgain = false ;
        },
        onSubmit(){
            console.log(this.lotteryData)
            this.$refs.lotteryRef.validate((valid) => {
                if (valid) {
                    this.dialogVisibleAgain = true ;
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        fnAgainSure(){
            let obj = {
                aaLotteryTypeSetting:{}
            }
            for (const key in this.lotteryData) {
                if (key==='autoSelectTime') {
                    obj.aaLotteryTypeSetting[key] = this.lotteryData[key]*3600
                }else if(key==='price'){
                    obj.aaLotteryTypeSetting[key] = this.$math.multip(this.lotteryData[key], 100)
                }else if(key==='maxPrice'){
                    obj.aaLotteryTypeSetting[key] = this.$math.multip(this.lotteryData[key], 100)
                }else if(key==='autoExpiryTime'){
                    obj.aaLotteryTypeSetting[key] = this.lotteryData[key]*60
                }else if(key==='deadlineEvery'){
                    let arr = this.lotteryData[key].split(':');
                    let num = parseInt(arr[0])*3600 + parseInt(arr[1])*60
                    obj.aaLotteryTypeSetting[key] = num ;
                }else{
                    obj.aaLotteryTypeSetting[key] = this.lotteryData[key]
                }
            }
            console.log(obj)
            this.editLoading = true ;
            this.$http.get(this.$api.updateLotteryType,obj , true).then((res) => {
                this.fnGetPage();
                this.dialogVisible = false ;
                this.dialogVisibleAgain = false ;
                this.editLoading = false ;
            }).catch((err) => {
                this.dialogVisible = false ;
                this.dialogVisibleAgain = false ;
                this.editLoading = false ;
                this.$message.error(err.message);
            });
            
        },
        fnGetPage(param={}){
            let obj = {
                ...param,
                limit:this.pageSize,
                page:this.currentPage,
                type:'super_lotto'
            }
            this.pageLoad = true ;
            this.$http.get(this.$api.typeHistoryList, obj, true).then((res) => {
                console.log(res)
                this.tableData = res? res.data: [];
                this.total = res? res.total: 0;
                this.pageLoad = false ;
            }).catch((err) => {
                this.pageLoad = false ;
                this.tableData = [];
                this.$message.error(err.message);
            });
        }
    },
    watch: {
        lotteryData(val){
            console.log(val)
        }
    }
}
</script>
<style scoped lang="scss">
.lottery-operation-info{
    .lottery-edit{
        /deep/ .el-input{
            width: 200px
        }
    }
}
/deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover{
        border-color: #409EFF;
    }
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
h3{
    color: #000;
    font-size: 18px;
    font-weight: 600
}
h2{
    font-size: 20px;
    span{
        font-size: 14px;
        font-weight: normal;
        color: #333
    }
}
</style>