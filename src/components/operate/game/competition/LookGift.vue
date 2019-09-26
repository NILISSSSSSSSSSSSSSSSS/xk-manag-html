<template>
    <el-dialog
        title="礼物列表"
        :visible.sync="giftDia"
        append-to-body
        :before-close="handleClose"
        width="1200px"
        spp
    >
        <div>
            <div class="xk-radius">
                    <div class="vus-btn" style="text-align: right;padding-top: 12px;padding-bottom: 5px">
                        <el-button
                            type="primary"
                            :size="$size"
                            @click="search"
                            :loading="loadingSearch"
                        >查询</el-button>
                        <el-button type="danger" :size="$size" @click="reset">清空</el-button>
                    </div>
                    <el-form :model="searchForm" class="xk-search" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="礼物名称：">
                                    <el-input :size="$size" placeholder="请输入礼物名称" v-model="searchForm.giftName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="礼物ID：">
                                    <el-input :size="$size" placeholder="请输入礼物ID" v-model="searchForm.giftId"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="赠送人ID：">
                                    <el-input :size="$size" placeholder="请输入赠送人ID" v-model="searchForm.givingUserId"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="赠送日期：">
                                    <el-date-picker
                                        v-model="searchForm.timeBox"
                                        type="daterange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :size="$size"
                                        style="width: 100%"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-col>
                         
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="xk-radius margintop20">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table
                    :data="tableData"
                    v-loading="loadingTable"
                >
                    <el-table-column label="礼物名称" prop="giftName"></el-table-column>
                    <el-table-column label="礼物ID" prop="giftId"></el-table-column>
                    <el-table-column label="赠送时间" >
                         <template slot-scope="scope">
                            <span  style="display: block;cursor: pointer;">{{ scope.row.createdAt | formatTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="赠送数量" prop="giftNum"></el-table-column>
                    <el-table-column label="价值（晓可币）" >
                         <template slot-scope="scope">
                            <span  style="display: block;cursor: pointer;">{{  $math.divide(scope.row.giftPrice, 100)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="赠送人ID" prop="givingUserId"></el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination
                    :currentPage="page.page"
                    :pageSize="page.limit"
                    :total="page.total"
                    @change="changePage"
                ></pagination>
                  <p class="text" style="marin-top:25px">礼物总数量：{{ otherDetail.totalNum }}</p>
                <p class="text">礼物总价值：{{  $math.divide(otherDetail.totalPrice, 100)}} 晓可币</p>
            </div>
    </el-dialog>
</template>
<script>
export default {
    name: "查看礼物列表",
    components: {},
    props: {
        giftDia: {
            type: Boolean,
            default: false
        },
        receivingUserId:{
            default:""
        }
    },
    watch:{
        giftDia(val){
          if(val){
                this.searchForm = {
                  timeBox: [],
               };
              this.getList()
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
            otherDetail:{},
            loadingTable: false,
            searchForm: {
                timeBox: [],
                
            },
        };
    },
    methods: {
        handleClose() {
            this.$emit("update:giftDia", false);
        },
        changePage(page, pageSize) {
            this.page.limit = pageSize;
            this.page.page = page;
            this.getList();
        },
         search() {
            this.getList();
        },
        reset() {
            this.searchForm = {
               timeBox: [],
            };
            this.getList();
        },
         getList(){
            let data={
                receivingUserId:this.receivingUserId,
                giftScene:'video ',
                startTime:this.searchForm.timeBox && this.searchForm.timeBox[0] ?  this.searchForm.timeBox[0]/1000 : "",
                endTime:this.searchForm.timeBox && this.searchForm.timeBox[1] ?  this.searchForm.timeBox[1]/1000 : "",
                // sceneId:this.searchForm.sceneId,
                 giftName:this.searchForm.giftName,
                 giftId:this.searchForm.giftId,
                 givingUserId:this.searchForm.givingUserId,
                 page:this.page.page,
                 limit:this.page.limit,
            }
             this.loadingTable = true;
             this.$http.get(this.$api.giftOrderInGameQPage, data, true) .then(res => {
                    console.log("礼物列表" + JSON.stringify(res));
                     if( res && res.data){
                        this.tableData=res.data;
                        this.page.total=res.total;
                        this.otherDetail={
                            totalPrice:res.totalPrice,
                            totalNum:res.totalNum
                        }
                    }
                    else{
                        [this.tableData,this.otherDetail,this.page.total]=[[],{},0]
                    }
                    this.loadingTable = false;
                })
                .catch(res => {
                    this.loadingTable = false;
                     [this.tableData,this.otherDetail,this.page.total]=[[],{},0]
                    this.$message.error(res.message);
                });
        },
    }
};
</script>
<style scoped lang="scss">
    .text{
        line-height: 2;
        font-size: 15px;
    }
</style>