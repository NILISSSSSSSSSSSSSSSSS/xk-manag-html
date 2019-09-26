<template>
    <div class="xk-container group-management-list">
        <div class="xk-body">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" v-permission="'groupManagementListAdd'" :size="$size" @click="bNewGroup = true">新建运营群</el-button>
                        <el-button type="success" :size="$size" @click="fnSearch" :loading="searchLoading">搜索</el-button>
                        <el-button type="danger" :size="$size" @click="fnClear">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-form label-width="120px" :model="searchForm" class="xk-search" label-position="left">
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="群ID：">
                                <el-input :size="$size" placeholder="群ID" v-model="searchForm.tid"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="群名称：">
                                <el-input :size="$size" placeholder="群名称" v-model="searchForm.teamName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属区域：">
                                <province-cascader v-model="searchForm.region" placeholder="所属区域"></province-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属身份：">
                                <el-select v-model="searchForm.merchantType" placeholder="所属身份" :size='$size'>
                                    <el-option
                                        v-for="item in AllianceMerchantType"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>

        <div class="pubBackground marintop20 solidtop xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" v-loading="tableLoading" stripe border>
                <el-table-column label="群ID" prop="tid"></el-table-column>
                <el-table-column label="群名称" prop="teamName"></el-table-column>
                <el-table-column label="所属区域" prop="cityCode">
                    <template slot-scope="scope">
                        {{scope.row.provinceCode}}/{{scope.row.cityCode}}/{{scope.row.districtCode}}
                    </template>
                </el-table-column>
                <el-table-column label="联盟商身份">
                    <template slot-scope="scope">
                        {{scope.row.merchantType | AllianceMerchantType}}
                    </template>
                </el-table-column>
                <el-table-column label="创建日期">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="群主" prop="ownerName"></el-table-column>
                <el-table-column label="管理员人数" prop="managerNum"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button v-permission="'groupManagementListLook'" :size="$size" type="primary" @click="viewDetail(scope.row)" :loading="scope.row.lookLoading">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </div>

        <el-dialog
            title="新建运营群"
            :visible.sync="bNewGroup"
            width="693px">
            <el-form ref="oNewGroup" :model="oNewGroup" label-width="120px" :rules='rules' status-icon>
                <el-form-item label="群名称：" prop="teamName">
                    <el-input v-model="oNewGroup.teamName" placeholder="群名称"></el-input>
                </el-form-item>
                <el-form-item label="群头像：" prop="teamAvatar">
                    <image-upload v-model="oNewGroup.teamAvatar" uploadType="1">
                        <img v-if="oNewGroup.teamAvatar" :src="oNewGroup.teamAvatar" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </image-upload>
                </el-form-item>
                <el-form-item label="地区选择：" prop="region">
                    <province-cascader v-model="oNewGroup.region" placeholder="地区选择"></province-cascader>
                </el-form-item>
                <el-form-item label="联盟商身份：" prop="merchantType">
                    <el-select v-model="oNewGroup.merchantType" placeholder="联盟商身份">
                        <el-option
                            v-for="item in AllianceMerchantType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="bNewGroup = false" :size="$size">取 消</el-button>
                <el-button type="primary" :size="$size" @click="fnCreatNewGroup('oNewGroup')" :loading='bCreatLoading'>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ProvinceCascader from "@/components/ProvinceCascader.vue";
    import ImageUpload from '@/components/ImageUpload.vue';
    export default {
        data() {
            let regionRule = (rule, value, callback)=>{
                //创建新群正则
                switch (value.length) {
                    case 0:
                        return callback(new Error('省级地区必须选择'));
                        break;
                    case 1:
                        return callback(new Error('市级地区必须选择'));
                        break;
                    case 2:
                        return callback(new Error('县级地区必须选择'));
                        break;
                    default:
                        callback()
                        break;
                }
            }
            return {
                searchForm: {//搜索项
                    tid:"",
                    teamName:"",
                    region:[],
                    merchantType:""
                },
                oNewGroup:{//创建新群
                    teamName:"",
                    teamAvatar:"",
                    region:[],
                    merchantType:""
                },
                tableData: [],//群列表
                tableLoading: false,
                searchLoading:false,
                bCreatLoading:false,
                page: {
                    page: 1,
                    total: 0,
                    limit: 10
                },
                AllianceMerchantType:JSON.parse(localStorage.getItem('AllianceMerchantType')),
                bNewGroup:false,
                rules:{
                    teamName:[
                        {  required: true, message: '请输入群名称', trigger: 'blur' }
                    ],
                    teamAvatar:[
                        {  required: true, message: '请上传群头像', trigger: 'blur' }
                    ],
                    region:[
                        { type:'array', validator:regionRule, required: true, trigger: 'change' }
                    ],
                    merchantType:[
                        { required: true, message: '必须选择联盟商身份', trigger: 'change' }
                    ]
                }
            }
        },
        created() {
            this.getList();
        },
        components:{
            ProvinceCascader,
            ImageUpload
        },
        watch:{
            oNewGroup:{
                handler(val){
                    if(val.teamAvatar){
                        this.$refs.oNewGroup.validateField('teamAvatar');
                    }
                },
                deep:true
            }
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            getList(params={page:this.page.page,limit:this.page.limit}) {
                this.tableLoading = true;
                this.searchLoading = true ;
                this.$http.get(this.$api.teamList, params, true)
                    .then(res=>{
                        console.log(res)
                        if(res){
                            this.tableData = res.data;
                            this.page.total = res.total;
                        }else{
                            this.tableData=[]
                        }
                        this.tableLoading = false;
                        this.searchLoading = false;
                    })
                    .catch(err=>{
                        err.code===409? this.tableData=[]: null;
                        this.$message.error(err.message);
                        this.tableLoading = false;
                        this.searchLoading = false;
                    })
            },
            fnSearch(){
                console.log(this.searchForm);
                let params = {
                        page:this.page.page,
                        limit:this.page.limit
                    };
                for (const key in this.searchForm) {
                    if(key === 'region'){
                        [params.provinceCode,params.cityCode,params.districtCode] = [this.searchForm.region[0],this.searchForm.region[1],this.searchForm.region[2]];
                    }else{
                        if(this.searchForm[key]){
                            params[key] = this.searchForm[key]
                        }
                    }
                }
                console.log(params)
                this.getList(params);
            },
            fnClear(){
                this.searchForm = {
                    tid:"",
                    teamName:"",
                    region:[],
                    merchantType:""
                }
                this.getList();
            },
            fnCreatNewGroup(oNewGroup){
                console.log(this.oNewGroup);
                this.$refs[oNewGroup].validate((valid) => {
                    if (valid) {
                        this.bCreatLoading = true ;
                        this.$http.post(this.$api.trainTeamCreate, {
                            teamName:this.oNewGroup.teamName,
                            teamAvatar:this.oNewGroup.teamAvatar,
                            provinceCode:this.oNewGroup.region[0],
                            cityCode:this.oNewGroup.region[1],
                            districtCode:this.oNewGroup.region[2],
                            merchantType:this.oNewGroup.merchantType,
                        }, true).then((res) => {
                           console.log(res)
                           this.bCreatLoading = false ;
                           this.bNewGroup = false ;
                           this.$refs['oNewGroup'].resetFields();
                           this.getList();
                        }).catch((err) => {
                           this.$message.error(err.message);
                           setTimeout(() => {
                               this.bCreatLoading = false ;
                               this.bNewGroup = false ;
                           }, 1000);
                        });
                    } else {
                        return false;
                    }
                });
            },
            viewDetail(row) {
                row.lookLoading = true ;
                this.tableData.splice(0,0);//set hack
                this.$http.get(this.$api.userTeamAuth,{tid:row.tid} , true).then((res) => {
                   row.lookLoading = false ;
                   this.tableData.splice(0,0);
                   console.log(res)
                   if(res.isAuth){
                        localStorage.setItem("allMute",row.allMute);
                        this.$store.commit("service/setTeamName",row.teamName);
                        this.$store.commit("service/setIsMeCreate",row.isMeCreate);
                        this.$store.commit("service/setGroupTid",row.tid)
                        this.$router.push({
                            path:"/groupManagement",
                            query:{
                                allMute:row.allMute
                            }
                        });
                   }else{
                       this.$message.error("登录用户未在该群，没有查看权限！");
                   }
                }).catch((err) => {
                   console.log(err);
                   this.$message.error(err.message);
                   row.lookLoading = false ;
                   this.tableData.splice(0,0);
                });
                
            }
        }
    }
</script>

<style scoped lang="scss">
/deep/ .avatar-uploader {
    .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 138px;
        height: 138px;
        line-height: 138px;
        text-align: center;
    }

    .avatar {
        width: 138px;
        height: 138px;
        display: block;
    }
}


</style>
