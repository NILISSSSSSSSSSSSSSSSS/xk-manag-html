<template>
    <el-dialog
        title="查看报名名单"
        :visible.sync="registrationDialog"
        append-to-body
        :before-close="handleClose"
        width="1200px"
        spp
    >
        <div>
             <div class="vus-btn" v-if="tableData.length!==0">
                    <el-button type="text" :size="$size" @click="visibleOrder=true">导出到Excel</el-button>
                </div>
            <el-table :data="tableData" v-loading="loadingTable" style="margin:20px 0">
                <el-table-column label="房间" prop="roomName" v-if="type=='GAME'"></el-table-column>
                <el-table-column label="群ID" prop="tid" v-if="type=='GAME'"></el-table-column>
                <el-table-column label="用户ID" prop="userId" width="280"></el-table-column>
                <el-table-column label="用户昵称" prop="nickName"></el-table-column>
                <el-table-column label="报名时间" width="200">
                      <template slot-scope="scope">
                            <span> {{ scope.row.applyTime | formatTime }} </span>
                        </template>
                </el-table-column>
                <el-table-column label="游戏昵称/ID" prop="gameIdentify"></el-table-column>
                <el-table-column label="状态">
                                 <template slot-scope="scope">
                                   <span> {{ scope.row.qualification==1 ? "正常" : "无资格"}} </span>
                               </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="220">
                    <template slot-scope="scope">
                        <el-button
                            :size="$size"
                            type="text"
                            @click="$router.push({path: '/userDetail', query: {id: scope.row.userId}})"
                        >查看用户详情</el-button>
                        <el-button v-if="scope.row.qualification==1"
                            :size="$size"
                            type="text"
                            @click="applyId=scope.row.applyId;cancellationQualificationDia=true"
                        >取消比赛资格</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <!--分页组件-->
                <pagination
                    :currentPage="page.page"
                    :pageSize="page.limit"
                    :total="page.total"
                    @change="changePage"
                ></pagination>
            <p>总人数：{{ total }}</p>
            <div class="sub-btn" style="text-align:center">
                <el-button :size="$size" @click="handleClose" type="primary">取 消</el-button>
            </div>
        </div>
        <!-- 取消比赛资格弹框 -->
        <cancellation-qualification
            :cancellationQualificationDia.sync="cancellationQualificationDia"  :applyId="applyId" @cancelQualificationSuccess="cancelQualificationSuccess"  reasonType="reason1"
        ></cancellation-qualification>

        <!-- 添加用户 -->
        <el-dialog title="添加用户" :visible.sync="addUserDia" width="500px" append-to-body>
            <div>
                <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label-width="120px" label="用户ID:" prop="id">
                        <el-input :size="$size" v-model="ruleForm.id" class="xk-input"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="sub-btn" style="text-align:center">
                <el-button :size="$size" @click="addUserDia=false">取 消</el-button>
                <el-button :size="$size" type="primary" @click="addUserFun('ruleForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 订单导出 -->
         <order-out :loading="loadingDown" :visible.sync="visibleOrder" @down="downExcel"></order-out>
    </el-dialog>
</template>
<script>
import CancellationQualification from "@/components/operate/game/competition/CancellationQualification.vue";
import OrderOut from "@/components/common/OrderOut.vue";
export default {
    name: "报名名单",
    components: {
        CancellationQualification,
        OrderOut
    },
    props: {
        registrationDialog: {
            type: Boolean,
            default: false
        },
        type: {
            default: ""
        },
        competitionId:{
             default: ""
        },
        roundIndex:{
             default: ""
        },
    },
    watch:{
      registrationDialog(val){
          if(val){
              this.getList();
          }
      }
    },
    data() {
        return {
               page: {
                page: 1,
                limit: 10,
                total: 0
            },
            tableData: [{}],
            loadingTable: false,
            cancellationQualificationDia: false,
            addUserDia: false,
            applyId:"",

            ruleForm: {
                id: ""
            },
            rules: {
                id: [
                    {
                        required: true,
                        message: "请填写用户ID",
                        trigger: "blur"
                    }
                ]
            },
            total:"",
             loadingDown: false,
            visibleOrder: false
        };
    },
    methods: {
        handleClose() {
            this.$emit("update:registrationDialog", false);
        },
        changePage(page, pageSize) {
            this.page.limit = pageSize;
            this.page.page = page;
            this.getList();
        },
        getList(){
           let data={
                competitionId:this.competitionId,
                roundIndex:Number(this.roundIndex),
                page:this.page.page,
                limit:this.page.limit,
            }
             this.loadingTable = true;
             this.$http.get(this.$api.queryRegustration, data, true) .then(res => {
                    console.log("报名名单" + JSON.stringify(res));
                     if( res && res.data){
                        this.tableData=res.data;
                        this.total=res.total;
                        this.page.total=res.total;
                    }
                    else{
                        [this.tableData,this.total]=[[],'']
                    }
                    this.loadingTable = false;

                    
                })
                .catch(res => {
                    this.loadingTable = false;
                    [this.tableData,this.total]=[[],'']
                    this.$message.error(res.message);
                });
        },
        cancelQualificationSuccess(){
           this.getList();
        },
        downExcel(limit) {
                    let params = {
                        competitionId:this.competitionId,
                        roundIndex:Number(this.roundIndex),
                         page: this.page.page,
                        limit: limit
                    }
                    this.loadingDown = true;

                    this.$http
                    .downGet(this.$api.queryRegustrationDown, params, true)
                    .then(res=>{
                        this.loadingDown = false;
                        this.$message.success(res.message);
                    })
                    .catch(err=>{
                        this.loadingDown = false;
                        this.$message.error(err.message)
                    })
                }
      
    }
};
</script>