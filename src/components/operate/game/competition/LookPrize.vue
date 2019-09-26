<template>
        <el-dialog  :visible.sync="lookPrizeDia"  append-to-body :before-close="handleClose"  width="800px" spp>
            <div >
                 <el-row style="margin-top: 10px;">
                    用户ID：{{ getPrizeList.uid}}   昵称：{{ getPrizeList.userName}}
                </el-row>
                 <el-table :data="tableData" v-loading="loadingTable" style="margin:20px 0">
                    <el-table-column label="奖品ID" prop="prizeId"></el-table-column>
                    <el-table-column label="奖品来源" >
                           <template slot-scope="scope">
                                <span
                                >{{ scope.row.prizeSource | prizeSource}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column label="发放方式" >
                          <template slot-scope="scope">
                                <span
                                >{{ scope.row.terrain | terrain}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column label="奖品名称" prop="prizeName"></el-table-column>
                    <el-table-column label="数量" prop="pieceNum"></el-table-column>
                    <el-table-column label="发放状态">
                           <template slot-scope="scope">
                                <span
                                >{{ scope.row.prizeSendStatus | prizeSendStatus}}</span>
                            </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" >
                        <template slot-scope="scope">
                            <el-button :size="$size" type="text" v-if="['unsend','sendfail'].includes(scope.row.prizeSendStatus)" @click="reSend(scope.row)">重新发放</el-button>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
</template>
<script>
    export default {
        name:"查看获得奖品",
        components:{
        },
        props:{
             lookPrizeDia: {
                type: Boolean,
                default: false
            },
            getPrizeList:{
                default: ()=>({})
            }
        },
        watch:{
         lookPrizeDia(val){
             if(val){
                this.getList();
             }
         }
        },
        data(){
          return{
             tableData:[{}],
             loadingTable:false,
            
             
          }
        },
        methods:{
            getList(){
                    let data = {
                        competitionId: this.getPrizeList.competitionId,
                        roundIndex: Number(this.getPrizeList.roundIndex),
                        applyId: this.getPrizeList.applyId,
                 };
            this.loadingTable = true;
            this.$http
                .get(this.$api.userPrizeRecord, data, true)
                .then(res => {
                    console.log("列表" + JSON.stringify(res));
                    if (res) {
                        this.tableData = res.data ? res.data : [];
                    } else {
                       this.tableData=[];
                    }
                    this.loadingTable = false;
                })
                .catch(res => {
                    this.tableData=[];
                    this.loadingTable = false;
                    this.$message.error(res.message);
                });
            },
            //重新发放
            reSend(row){
                      let data = {
                        id: Number(row.id),
                      };
                    this.loadingTable = true;
                    this.$http
                        .get(this.$api.anewAwardUserPrize, data, true)
                        .then(res => {
                           this.loadingTable = false;
                           this.$message.success("发放成功");
                           this.getList();
                        })
                        .catch(res => {
                            this.loadingTable = false;
                            this.$message.error(res.message);
                        });
            },
           handleClose(){
                this.$emit("update:lookPrizeDia", false)
           },
        
        }
    }
</script>
<style scoped lang="scss">
   /deep/ .el-dialog__body{
            max-height: 77vh;
            overflow: auto;
    }

</style>