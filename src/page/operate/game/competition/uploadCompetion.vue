<template>
    <div class="xk-container game-match">
        <div class="xk-body">
            <div class="xk-radius">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>{{ otherDetail.competitionName }}
                    </div>
                      <div class="vus-title">
                            比赛状态：{{ otherDetail.competitionStatus | competitionStatus}}
                    </div>
                <div class="vus-btn">
                        <el-button
                            type="primary"
                            :size="$size"
                            @click="search"
                            :loading="loadingSearch"
                        >查询</el-button>
                        <el-button type="danger" :size="$size" @click="reset">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :model="searchForm" class="xk-search" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="比赛轮次">
                                 <el-select :size="$size" v-model="searchForm.roundIndex">
                                         <el-option
                                            :label="item.name"
                                            :value="item.value"
                                            v-for="(item,index) in lunList"
                                            :key="index"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="类型：">
                                   <el-select :size="$size" v-model="searchForm.userListType">
                                        <el-option
                                            :label="item.name"
                                            :value="item.value"
                                            v-for="(item,index) in list"
                                            :key="index"
                                        ></el-option>
                                    </el-select>
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
                 <div class="vus-btn" v-if="tableData.length!==0">
                        <el-button type="text" :size="$size" @click="visibleOrder=true">导出到Excel</el-button>
                     </div>
                </div>
                <el-table :data="tableData" v-loading="loadingTable" @selection-change="handleSelect">
                    <!-- <el-table-column type="selection" width="45" v-if="isSelect"></el-table-column> -->
                    <el-table-column label="当前排名" prop="rank"></el-table-column>
                    <el-table-column label="当前积分" prop="totalRanking"></el-table-column>
                    <el-table-column label="用户iD" prop="userId"></el-table-column>
                    <el-table-column label="用户昵称" prop="userName"></el-table-column>
                    <el-table-column label="点击数" prop="clickViewNum"></el-table-column>
                    <el-table-column label="点赞数" prop="likeNum"></el-table-column>
                    <el-table-column label="评论数" prop="commentNum"></el-table-column>
                    <el-table-column label="分享数" prop="shareNum"></el-table-column>
                    <el-table-column label="礼物价值" prop="giftNum"></el-table-column>
                    <el-table-column label="获得奖品"  v-if="otherDetail.userListType !=='cancel'" key='cancel'>
                        <template slot-scope="scope">
                             <el-button :size="$size" type="text" @click="lookPrizeFun(scope.row)">查看</el-button> 
                        </template>
                    </el-table-column>
                     <el-table-column label="奖品状态" v-if="type=='review'">
                        <template slot-scope="scope">
                            <span  style="display: block;cursor: pointer;">{{ scope.row.prizeStatus | prizeStatus}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="260">
                        <template slot-scope="scope">
                             <el-button :size="$size" type="text" @click="$router.push({path: '/userDetail', query: {id:scope.row.userId}})">查看用户详情</el-button>
                               <template v-if="otherDetail.userListType !=='cancel'">
                                  <el-button :size="$size" type="text"  @click="receivingUserId=scope.row.userId;giftDia=true">查看礼物列表</el-button>
                                   <el-button :size="$size" type="text"  v-if="scope.row.businessId" @click="videoId=scope.row.businessId; commentDia=true">查看评论</el-button>
                               </template>
                               <template v-else>
                                    <el-button :size="$size" type="text" @click="recoveryQualification(scope.row.applyId)">恢复比赛资格</el-button>
                               </template>
                              
                                <el-button :size="$size" type="text"  :reParent="getList" @click="videoData={roundIndex:scope.row.currentRound,applyId:scope.row.applyId,rid:scope.row.userId};lookVideoDia=true;">查看视频</el-button>
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
          
            </div>
        </div>
       <!-- 查看获得奖品弹框 -->
       <look-prize :lookPrizeDia.sync='lookPrizeDia' :getPrizeList="getPrizeList"></look-prize>
        <!-- 查看视频弹框 -->
       <look-video :lookVideoDia.sync='lookVideoDia' :videoData="videoData"></look-video>
       <!-- 查看礼物弹框 -->
       <look-gift :giftDia.sync='giftDia' :receivingUserId="receivingUserId"></look-gift>
        <!-- 查看评价弹框 -->
       <look-comment :commentDia.sync='commentDia' :videoId="videoId"></look-comment>
         <!-- 订单导出 -->
         <order-out :loading="loadingDown" :visible.sync="visibleOrder" @down="downExcel"></order-out>
    </div>
</template>

<script>


const list = [
    { name: "参赛名单", value: "join" },
    { name: "获奖名单", value: "win" },
    { name: "未获奖名单", value: "no_win" },
     { name: "取消资格名单", value: "cancel" },
];
import  LookPrize from "@/components/operate/game/competition/LookPrize.vue" 
import  LookVideo from "@/components/operate/game/competition/LookVideo.vue" 
import  LookGift from "@/components/operate/game/competition/LookGift.vue" 
import  LookComment from "@/components/operate/game/competition/LookComment.vue" 
import OrderOut from "@/components/common/OrderOut.vue";
 import mixins from '@/util/competionMixin.js';
export default {
     mixins: [mixins],
    components:{
        LookPrize,
       LookVideo,
       LookGift,
       LookComment,
       OrderOut
    },
     watch: {
        '$route' () {
                this.searchForm.roundIndex=this.$route.query.curentLun+"";
                this.curentLun=this.$route.query.curentLun;
                this.type=this.$route.query.type;
                this.competitionId=this.$route.query.competitionId;
                this.isSelect=this.$route.query.type=='review' ? true : false;
                 this.getLunList();
                 this.getList();
            }
    },
    data() {
        return {
            searchForm: {roundIndex:this.$route.query.curentLun+"",userListType:"join"},
            tableData: [{}],
              page: {
                page: 1,
                limit: 10,
                total: 0
            },
            loadingTable: false,
            loadingSearch: false,
              list:list,
             lunList:[],
           lookPrizeDia:false,
           getPrizeList:{},

           lookVideoDia:false,
          giftDia:false,
          commentDia:false,
            
            otherDetail:{},
             //当前轮次
           curentLun:this.$route.query.curentLun,
           type:this.$route.query.type,
           competitionId:this.$route.query.competitionId,
           isSelect:this.$route.query.type=='review' ? true : false,

           videoData:{
               roundIndex:"",
               rid:"",
               applyId:""
           },
           receivingUserId:"",
           videoId:"",

            loadingDown: false,
            visibleOrder: false
        };
    },
    async mounted() {
        await this.getCompetionInfo();
          this.getLunList();
          this.getList();
        },
    methods: {
        handleSelect(val){
           console.log(val);
        },
         search() {
            this.page.page = 1;
            this.getList();
        },
        reset() {
            this.searchForm = {
                roundIndex:this.curentLun+"",userListType:"join"
            };
            this.getList();
        },
         changePage(page, pageSize) {
            this.page.limit = pageSize;
            this.page.page = page;
            this.getList();
        },

        //查看奖品
           lookPrizeFun(row) {
            this.getPrizeList={
                competitionId:this.competitionId,
                roundIndex:row.currentRound,
                applyId:row.applyId,
                uid:row.uid,
                userName:row.userName,
            }
            this.lookPrizeDia = true;
        },
        //获取轮次列表
         getLunList(){
             let arr = [
                "一","二","三","四","五","六","七","八","九","十","十一","十二",
            ]
             this.lunList=[];
              for(let i=0;i<Number(this.curentLun);i++){
                this.lunList.push({
                    name:"第"+arr[i]+"轮",
                    value:(i+1)+''
                })
            }
        },
          getList(){
            let data={
                competitionId:this.competitionId,
                roundIndex:Number(this.searchForm.roundIndex),
                userListType:this.searchForm.userListType,
                 page: this.page.page,
                 limit: this.page.limit
            }
             this.loadingTable = true;
             this.$http.get(this.$api.uploadCompetitionList, data, true) .then(res => {
                    console.log("列表" + JSON.stringify(res));
                     if(res){
                        this.tableData=res.data ? res.data : [];
                        this.page.total=res.total;
                        this.otherDetail={
                            competitionStatus:res.competitionStatus,
                            competitionName:res.competitionName,
                            userListType:res.userListType
                        }

                    }
                    else{
                        [this.tableData,this.otherDetail,this.page.total]=[[],{},0]
                    }
                    this.loadingTable = false;

                    
                })
                .catch(res => {
                     [this.tableData,this.otherDetail,this.page.total]=[[],{},0]
                    this.loadingTable = false;
                    this.$message.error(res.message);
                });
           },
           //恢复比赛资格
           recoveryQualification(val){
                  this.$confirm("确认恢复该用户的比赛资格吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                   let data={
                        applyId:val,
                      }
                    this.$http.get(this.$api.recoveryQualification, data, true) .then(res => {
                           this.$message.success("恢复成功");
                            this.getList();
                        })
                        .catch(res => {
                            this.$message.error(res.message);
                        });
            });
           },

                   downExcel(limit) {
                    let params = {
                              competitionId:this.competitionId,
                                roundIndex:Number(this.searchForm.roundIndex),
                                userListType:this.searchForm.userListType,
                                page: this.page.page,
                                limit: limit
                    }
                    this.loadingDown = true;

                    this.$http
                    .downGet(this.$api.uploadCompetitionListDown, params, true)
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

<style scoped lang="scss">
.propagandaWrapper {
    p {
        font-size: 15px;
        color: #9795E3;
        margin-bottom: 13px;
        a {
            font-size: 15px;
            color: #9795E3;
        }
    }
    img {
        width: 100%;
    }
}
</style>
