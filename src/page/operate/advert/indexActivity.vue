<template>
    <div class = 'index-activity xk-container'>
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>首页活动管理
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" :loading="searchLoading" @click="fnSearch">查询</el-button>
                    <el-button type="danger" :size="$size" @click="fnClear">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form label-width="120px" :inline="true" :model="searchData" class="demo-form-inline" :size="$size">
                    <el-form-item label="活动ID：">
                        <el-input v-model="searchData.id" placeholder="请输入活动ID"></el-input>
                    </el-form-item>
                    <el-form-item label="用户组名称：">
                        <el-input v-model="searchData.groupName" placeholder="请输入用户组名称"></el-input>
                    </el-form-item>
                    <el-form-item label="用户组ID：">
                        <el-input v-model="searchData.groupId" placeholder="请输入用户组ID"></el-input>
                    </el-form-item>
                    <el-form-item label="活动时间：">
                        <el-date-picker
                            v-model="searchData.time"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="活动状态：">
                        <el-select v-model="searchData.newStatus">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="待开始" value="待开始"></el-option>
                            <el-option label="进行中" value="进行中"></el-option>
                            <el-option label="已完成" value="已完成"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="marintop20 xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" v-permission="'indexActivityAdd'" :size="$size" @click="fnAddActivity">新增活动</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-table
                :data="tableData"
                border
                stripe
                v-loading="tableLoading"
                style="width: 100%">
                    <el-table-column
                        prop="id"
                        label="活动ID">
                    </el-table-column>
                    <el-table-column
                        label="用户组ID">
                        <template slot-scope="scope">
                            <p v-for="item in scope.row.userGroups" :key="item.groupId">{{ item.groupId }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="用户组名称">
                        <template slot-scope="scope">
                            <el-tag type='success' v-for="item in scope.row.userGroups" :key="item.groupId">{{ item.groupName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="activityDescribe"
                        label="活动描述">
                        <template slot-scope="scope">
                            <div class="activityDescribe">
                                {{scope.row.activityDescribe}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="activityGroupCards"
                        label="赠送卡券数量">
                        <template slot-scope="scope">
                            {{scope.row.activityGroupCards ? scope.row.activityGroupCards.length : 0}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="validTime"
                        label="开始时间">
                        <template slot-scope="scope">
                            {{scope.row.validTime | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="invalidTime"
                        label="截止时间">
                        <template slot-scope="scope">
                            {{scope.row.invalidTime | formatTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="newStatus"
                        label="活动状态">
                        <template slot-scope="scope">
                            {{scope.row.newStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="120">
                        <template slot-scope="scope">
                            <el-button v-permission="'indexActivityDetail'" type="primary" :size="$size" @click="fnLookDetail(scope)">查看详情</el-button>
                            <!-- <el-button type="text" :size="$size" @click="fnStartActivity(scope)">立即开始</el-button> -->
                            <el-button v-permission="'indexActivityDown'" type="danger" v-if="scope.row.newStatus=='进行中'" :size="$size" @click="fnCloseActivity(scope,scope.$index)">下架活动</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
            </div>
        </div>
        <el-dialog
            title="新增活动"
            :visible.sync="dialogVisible"
            width="900px">
            <el-form ref="formAdd" :rules="rules" :model="form"  v-loading="dialogLoading">
                <el-form-item label="请选择活动对应用户组：" prop="groupId">
                    <el-select v-model="form.groupId" placeholder="请选择用户组" multiple :size="$size">
                        <el-option v-for="(item,index) in arrGroup" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请输入活动描述：" prop="activityDescribe">
                    <el-input type="textarea" v-model="form.activityDescribe" :autosize="{ minRows: 4}"></el-input>
                </el-form-item>
                <el-form-item label="请输入活动开始截至时间：" prop="time">
                    <el-date-picker
                        v-model="form.time"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        :size="$size">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="请选择赠送的卡券:">
                    <el-cascader :size="$size" :options="EnumCardCoupon" v-model="cardValue" @change="selectCoupon"></el-cascader>
                </el-form-item>
                <el-form-item label="已添加卡券：" prop="dynamicTags">
                    <el-tag
                        v-for="(tag,index) in form.dynamicTags"
                        :key="index"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)">
                    {{tag.name}}
                    </el-tag>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" :size="$size">取 消</el-button>
                <el-button type="primary" @click="fnAddIndexActive" :size="$size" :loading="addActLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="查看活动"
            :visible.sync="lookDialogVisible"
            width="900px">
            <el-form ref="form" :model="lookData" v-loading="dialogLoading">
                <el-form-item label="活动对应用户组：">
                    <template v-if="lookData.userGroups">
                        <el-tag v-for="item in lookData.userGroups" :key="item.groupId">{{ item.groupName }}</el-tag>
                    </template>
                </el-form-item>
                <el-form-item label="活动描述：">
                    {{lookData.activityDescribe}}
                </el-form-item>
                <el-form-item label="活动开始时间：">
                    {{lookData.validTime | formatTime}}
                </el-form-item>
                <el-form-item label="活动截至时间：">
                    {{lookData.invalidTime | formatTime}}
                </el-form-item>
                <el-form-item label="赠送的卡券:">
                    <template v-if="lookData.activityGroupCards">
                        <el-tag
                            v-for="(tag,index) in lookData.activityGroupCards"
                            :key="index"
                            :disable-transitions="false">
                        {{tag.name}}
                        </el-tag>
                    </template>
                </el-form-item>
            </el-form>
        </el-dialog>

        <coupon-list :visible.sync="couponVisible" :type="couponType" @on-success="saveCoupon"></coupon-list>
        <card-list :visible.sync="cardVisible" :type="cardType" @on-success="saveCard"></card-list>
    </div>
</template>
<script>
import moment from 'moment';
import CouponList from '@/components/operate/advert/CouponList.vue';
import CardList from '@/components/operate/advert/CardList.vue'
const EnumType = {};
export default {
    name:'indexActivity',
    components: {
        CouponList,
        CardList
    },
    data () {
        let groupId = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请选择用户组'));
            } else {
                callback();
            }
        };
        let activityDescribe = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('活动描述不能为空'));
            } else {
                callback();
            }
        };
        let time = (rule, value, callback) => {
            // console.log(value)
            switch (value.length) {
                case 0:
                    callback(new Error('请选择活动时间'));
                    break;
                case 1:
                    callback(new Error('请选择活动截至时间'));
                    break;
                case 2:
                    callback();
                    break;
            
                default:
                    callback();
                    break;
            }
        };
        let dynamicTags = (rule, value, callback) => {
            console.log(value)
            if (value.length==0) {
                callback(new Error('赠送卡券不能为空'));
            } else {
                callback();
            }
        };
        return {
            searchData:{},
            tableData:[],
            dialogVisible:false,
            form:{
                groupId:"",
                activityDescribe:"",
                time:[],
                dynamicTags: [],
            },
            currentPage:1,
            pageSize:10,
            total:0,
            searchLoading:false,
            tableLoading:false,
            dialogLoading:false,
            lookDialogVisible:false,
            lookData:{},
            arrGroup:[],//用户分组
            rules:{
                groupId: [
                    { required: true, validator:groupId, trigger: 'change' }
                ],
                activityDescribe: [
                    { required: true, validator:activityDescribe, trigger: 'blur' }
                ],
                time: [
                    { type: 'array',required: true, validator:time, trigger: 'blur' }
                ],
                dynamicTags: [
                    { type: 'array',required: true, validator:dynamicTags, trigger: 'blur' }
                ],
            },
            cardValue: [],
            addActLoading:false,

            //样式修改
            couponVisible: false,
            couponType: 'mall',
            cardVisible: false,
            cardType: 'mall',
            EnumCardCoupon: [
                { value: 'mall_card', label: '自营商城会员卡'},
                { value: 'shop_card', label: '商圈会员卡'},
                { value: 'mall_coupon', label: '自营商城优惠券'},
                { value: 'shop_coupon', label: '商圈优惠券'}
            ],
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() < new Date(new Date().setHours(0, 0, 0, 0));
                },
            }
        };
    },
    props: {},
    computed: {},
    created() {
        this.fnGetPage();
        this.xkUserGroupPage();
    },
    methods: {
        fnpagechange(currentPage,pageSize){
            this.currentPage = currentPage ;
            this.pageSize = pageSize ;
            this.fnGetPage();
        },
        fnAddActivity(){
            this.dialogVisible = true ;
            this.$nextTick(()=>{
                this.$refs.formAdd.resetFields();
            })
        },
        fnLookDetail(target){
            this.lookDialogVisible = true ;
            this.homePageActivityDetail(target.row.id);
        },
        homePageActivityDetail(id){
            this.dialogLoading = true ;
            this.lookData = {} ;
            this.$http.get(this.$api.homePageActivityDetail, {id}, true).then((res) => {
                console.log(res)
                this.lookData = res;
                this.dialogLoading = false ;
            }).catch((err) => {
                console.log(err);
                this.dialogLoading = false ;
                this.$message.error(err.message);
            });
        },
        fnCloseActivity(target,index){
            console.log({id:target.row.id})
            this.$confirm('是否确认下架？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.get(this.$api.homePageActivityDown,{id:target.row.id} , true).then((res) => {
                    console.log(res)
                    this.$message({
                        type: 'success',
                        message: '下架成功!'
                    });
                    console.log(index)
                    this.tableData[index].newStatus = "已完成";
                    this.tableData.push()
                }).catch((err) => {
                    console.log(err);
                    this.$message.error(err.message);
                });
                
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });          
            });
            
        },
        handleClose(tag) {//删除标签
            this.form.dynamicTags.splice(this.form.dynamicTags.indexOf(tag), 1);
        },
        // fnAddID(){
        //     let obj = {
        //             cardId:this.form.cardId,
        //             discountType:this.cardValue
        //         }
        //         console.log(obj)
        //     this.cardLoading = true ;
        //     this.$http.get(this.$api.homePageActivityConfirm,obj , true).then((res) => {
        //         console.log(res)
        //         if(!res.cardId){
        //             this.$message.error('查无此卡券');
        //         }else{
        //             let isHas = this.form.dynamicTags.some(item => {
        //                 return res.cardId == item.cardId
        //             });
        //             if(isHas){
        //                 this.$message.error('已存在，请选择其他卡券');
        //             }else{
        //                 this.form.dynamicTags.push({
        //                     cardId:res.cardId,
        //                     discountType:res.discountType,
        //                     name:res.name
        //                 })
        //                 this.form.cardId = '';
        //             }
        //         }
        //         this.cardLoading = false ;
        //     }).catch((err) => {
        //         console.log(err);
        //         this.cardLoading = false ;
        //         this.$message.error(err.message);
        //     });
            
        // },
        fnAddIndexActive(){
            console.log(this.form.groupId)
            this.$refs['formAdd'].validate(valid => {
                if (valid) {
                    let obj = {
                        activityDescribe: this.form.activityDescribe,
                        userGroups: this.arrGroup.filter(item=> this.form.groupId.includes(item.id)).map(item=>{ return {groupName: item.name, groupId: item.id} }),
                        validTime: moment(this.form.time[0]).format('X'),
                        invalidTime: moment(this.form.time[1]).format('X')
                    };
                    
                    let set = new Set() ;
                    let arr = [] ;
                    this.form.dynamicTags.forEach(item => {
                        set.add(JSON.stringify(item))
                    });
                    set.forEach(item => {
                        arr.push(JSON.parse(item))
                    });
                    obj.activityGroupCards = arr ;
                    this.addActLoading = true ;
                    this.$http.get(this.$api.homePageActivityCreate,{homePageActivity:obj} , true).then((res) => {
                        console.log(res)
                        this.addActLoading = false ;
                        this.dialogVisible = false ;
                        this.fnGetPage();
                    }).catch((err) => {
                        console.log(err);
                        this.addActLoading = false ;
                        this.$message.error(err.message);
                    });
                } else {
                    return false;
                }
            });
        },
        fnGetPage(obj={}){
            let param = {
                ...obj,
                page:this.currentPage,
                limit:this.pageSize
            }
            this.tableLoading = true ;
            this.$http.get(this.$api.homePageActivityPage,param , true).then((res) => {
                this.tableData = [] ;
                if(res){
                    this.tableData = res.data ;
                }
                this.total = res.total ;
                this.searchLoading = false ;
                this.tableLoading = false ;
            }).catch((err) => {
                console.log(err);
                this.tableData = [] ;
                this.$message.error(err.message);
                this.searchLoading = false ;
                this.tableLoading = false ;
            });
        },
        fnSearch(){
            this.searchLoading = true ;
            let obj = {};
            for (const key in this.searchData) {
                if (key === 'time') {
                    if(this.searchData.time[0]){
                        obj.validTime = this.searchData.time[0].getTime()/1000;
                    }
                    if(this.searchData.time[1]){
                        obj.invalidTime = this.searchData.time[1].getTime()/1000;
                    }
                }else{
                    obj[key] = this.searchData[key]
                }
            }
            this.fnGetPage(obj);
        },
        fnClear(){
            this.searchData = {};
            this.fnGetPage();
        },
        xkUserGroupPage(){//获得所有用户分组
            this.$http.get(this.$api.xkUserGroupPage,{limit:0,page:1} , true).then((res) => {
                this.arrGroup = [];
                if(res){
                    this.arrGroup = res.data;
                }
            }).catch((err) => {
                console.log(err);
                this.arrGroup = [];
                this.$message.error(err.message);
            });
        },
        //刘峰
        selectCoupon(val) {
            switch(val[0]) {
                case 'mall_card':
                    this.cardVisible = true;
                    this.cardType = 'mall'
                break;
                case 'shop_card':
                    this.cardVisible = true;
                    this.cardType = 'shop'
                break;
                case 'mall_coupon':
                    this.couponVisible = true;
                    this.couponType = 'mall'
                break;
                case 'shop_coupon':
                    this.couponVisible = true;
                    this.couponType = 'shop'
                break;
            }
        },
        saveCoupon(val) {
            this.updateTags(val, 'COUPON');
        },
        saveCard(val) {
            this.updateTags(val, 'MEMBER_CARD');
        },
        updateTags(val, type) {
            let arr = [];
            val.forEach(item=>{
                let isPush = true;
                this.form.dynamicTags.forEach(_item=>{
                    if(item.id== _item.cardId && _item.discountType==type) {
                        isPush = false;
                        return;
                    }
                })
                if(isPush) {
                    arr.push({
                        cardId: item.id,
                        discountType: type,
                        name: item.name
                    })
                }
            })
            this.form.dynamicTags = this.form.dynamicTags.concat(arr);
        },
    },
    watch: {}
}
</script>
<style scoped lang="scss">
.el-button{
    margin-bottom: 5px;
}
/deep/ .el-button + .el-button{
    margin-left: 0
}
.el-tag{
    margin-right: 10px
}
.activityDescribe{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>