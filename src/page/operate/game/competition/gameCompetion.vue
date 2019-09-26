<template>
    <div class="xk-container game-match">
        <div class="xk-body">
            <div class="xk-radius">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>
                        {{ otherDetail.competitionName }}
                    </div>
                    <div
                        class="vus-title"
                    >比赛状态：{{ otherDetail.competitionStatus | competitionStatus}}</div>
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
                    <el-form :model="searchForm" class="xk-search" label-width="110px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="用户ID：">
                                    <el-input
                                        :size="$size"
                                        placeholder="请输入用户ID"
                                        v-model="searchForm.uid"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="游戏昵称/ID：">
                                    <el-input
                                        :size="$size"
                                        placeholder="请输入游戏昵称/ID"
                                        v-model="searchForm.gameIdentify"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="比赛轮次">
                                    <el-select
                                        :size="$size"
                                        v-model="searchForm.roundIndex"
                                        @change="changeLun"
                                    >
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
                                <el-form-item label="全部房间：">
                                    <el-select :size="$size" v-model="searchForm.roomIndex">
                                        <el-option
                                            :label="item.name"
                                            :value="item.value"
                                            v-for="(item,index) in roomList"
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
                        <el-button v-permission="'gameMatchExcelOut'" type="text" :size="$size" @click="visibleOrder=true">导出到Excel</el-button>
                     </div>
                    <div class="vus-btn" v-if="tableData.length!==0 && otherDetail.competitionStatus!=='CANCEL' && otherDetail.competitionStatus!=='OFF_LINE'">
                        <!-- 只要当前轮次,并且是监测状态才显示 -->
                        <el-button
                            type="primary"
                            :size="$size"
                            v-if="curentLun==searchLun && type=='monitor'"
                            @click="endCompetition"
                        >结束该轮比赛</el-button>
                        <template v-if="curentLun==searchLun && type=='monitor'">
                            <el-button
                                type="primary"
                                :size="$size"
                                @click="ediet=true"
                                v-if="!ediet"
                            >编辑信息</el-button>
                            <template v-else>
                                <el-button type="primary" :size="$size" @click="saveInfo">保存信息</el-button>
                                <el-button type="primary" :size="$size" @click="resetTable">重置信息</el-button>
                            </template>
                        </template>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table
                    :data="tableData"
                    v-loading="loadingTable"
                    @selection-change="handleSelect"
                >
                    <el-table-column label="房间" prop="roomIndex"></el-table-column>
                    <el-table-column label="房间号">
                        <template slot-scope="scope">
                            <span v-if="!ediet">{{scope.row.roomName}}</span>
                            <el-input v-else :size="$size" v-model.trim="scope.row.roomName"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="群id" prop="tid">
                    </el-table-column>

                    <template v-if="otherDetail.userListType !=='cancel'">
                        <el-table-column label="当前排名" key="cancel">
                            <template slot-scope="scope">
                                <span v-if="!ediet">{{scope.row.totalRanking}}</span>
                                <el-input v-else :size="$size" v-model.number="scope.row.totalRanking"></el-input>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="用户ID" prop="uid"></el-table-column>
                    <el-table-column label="用户昵称" prop="userName"></el-table-column>
                    <el-table-column label="游戏昵称/ID">
                        <template slot-scope="scope">
                            <span>{{scope.row.gameIdentify}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="比赛局数">
                        <template slot-scope="scope">
                            <span v-if="!ediet">{{scope.row.inningNum}}</span>
                            <el-input v-else :size="$size" v-model.trim="scope.row.inningNum" type="number" min="1"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="胜局数">
                        <template slot-scope="scope">
                            <span v-if="!ediet">{{scope.row.successNum}}</span>
                            <el-input v-else :size="$size" v-model.trim="scope.row.successNum" type="number" min="0"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="平局数">
                        <template slot-scope="scope">
                            <span v-if="!ediet">{{scope.row.flatNum}}</span>
                            <el-input v-else :size="$size" v-model.trim="scope.row.flatNum" type="number" min="0"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="败局数">
                        <template slot-scope="scope">
                            <span v-if="!ediet">{{scope.row.failNum}}</span>
                            <el-input v-else :size="$size" v-model.trim="scope.row.failNum" type="number" min="0"></el-input>
                        </template>
                    </el-table-column>

                    <template v-if="otherDetail.userListType !=='cancel'">
                        <el-table-column label="获得奖品" key="cancel">
                            <template slot-scope="scope">
                                 <el-button :size="$size" type="text" @click="lookPrizeFun(scope.row)">查看</el-button> 
                            </template>
                        </el-table-column>
                        <el-table-column label="奖品状态" v-if="type=='review'">
                            <template slot-scope="scope">
                                <span>{{ scope.row.prizeStatus | prizeStatus}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="图片" width="230">
                            <template slot-scope="scope">
                                <div v-if="!ediet" class="imgWrapper">
                                    <img
                                        :src="item"
                                        alt
                                        v-for="(item,index) in scope.row.images"
                                        :key="index"
                                        @click="$viewImage(item)"
                                    >
                                </div>
                                <image-upload v-model="scope.row.images" :more="true" v-else></image-upload>
                            </template>
                        </el-table-column>
                    </template>

                    <template v-if="otherDetail.userListType =='cancel'">
                        <el-table-column label="取消资格时间">
                            <template slot-scope="scope">
                                <span>{{ scope.row.cancelTime | formatTime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="取消资格原因">
                            <template slot-scope="scope">
                                <span>{{ scope.row.cancelReason }}</span>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="备注">
                        <template slot-scope="scope">
                            <span v-if="!ediet">{{scope.row.remarks}}</span>
                            <el-input v-else :size="$size" v-model.trim="scope.row.remarks"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="230">
                        <template slot-scope="scope">
                            <el-button
                                :size="$size"
                                type="text"
                                @click="$router.push({path: '/userDetail', query: {id: scope.row.userId}})"
                            >查看用户详情</el-button>
                            <el-button
                                :size="$size"
                                type="text"
                                @click="applyId=scope.row.applyId;cancellationQualificationDia=true"
                                v-if="type=='monitor' && otherDetail.userListType !='cancel'"
                            >取消比赛资格</el-button>
                            <el-button
                                :size="$size"
                                type="text"
                                v-if="otherDetail.userListType =='cancel'"
                                @click="recoveryQualification(scope.row.applyId)"
                            >恢复比赛资格</el-button>
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
        <!-- 取消比赛资格弹框 -->
        <cancellation-qualification
            :cancellationQualificationDia.sync="cancellationQualificationDia"
            :applyId="applyId"
            @cancelQualificationSuccess="getList"
            reasonType="reason1"
        ></cancellation-qualification>

        <!-- 查看获得奖品弹框 -->
        <look-prize :lookPrizeDia.sync="lookPrizeDia" :getPrizeList="getPrizeList"></look-prize>
         <!-- 订单导出 -->
         <order-out :loading="loadingDown" :visible.sync="visibleOrder" @down="downExcel"></order-out>
    </div>
</template>

<script>
const list = [
    { name: "参赛名单", value: "join" },
    { name: "获奖名单", value: "win" },
    { name: "未获奖名单", value: "no_win" },
    { name: "取消资格名单", value: "cancel" }
];

import ImageUpload from "@/components/ImageUpload.vue";
import CancellationQualification from "@/components/operate/game/competition/CancellationQualification.vue";
import LookPrize from "@/components/operate/game/competition/LookPrize.vue";
import OrderOut from "@/components/common/OrderOut.vue";
 import mixins from '@/util/competionMixin.js';
export default {
    name: "游戏类赛事监测",
     mixins: [mixins],
    components: {
        CancellationQualification,
        LookPrize,
        ImageUpload,
        OrderOut
    },
    watch: {
        //监听路由的变化
        '$route' () {
           
                this.curentLun=this.$route.query.curentLun;
                this.type=this.$route.query.type;
                this.searchForm.roundIndex=this.$route.query.curentLun + "";

                  this.getLunList();
                  this.getRoomList();
                  this.getList();
            }
    },
    data() {
        return {
            searchForm: {
                roundIndex: this.$route.query.curentLun + "",
                userListType: "join",
                roomIndex:""
            },
            tableData: [],
            copyTableData: [],
            page: {
                page: 1,
                limit: 10,
                total: 0
            },

            loadingTable: false,
            loadingSearch: false,
            list: list,
            roomList: [],
            lunList: [],
            cancellationQualificationDia: false,
            lookPrizeDia: false,
            ediet: false,
            otherDetail: {},
            RoomCount: "",
            //当前轮次
            curentLun: this.$route.query.curentLun,
            searchLun:"",//搜索轮次
            type: this.$route.query.type,
            competitionId: this.$route.query.competitionId,
            applyId: "",

            //获得奖品数据
            getPrizeList:{},

            loadingDown: false,
            visibleOrder: false
        };
    },
   async mounted() {
        await this.getCompetionInfo();
        this.getLunList();
        this.getRoomList();
        this.getList();
    },
    methods: {
        handleSelect(val) {
            console.log(val);
        },
        search() {
            this.page.page = 1;
            this.getList();
        },
        reset() {
            this.searchForm = {
                roundIndex: this.curentLun+"",
                userListType: "join"
            };
            this.page.page = 1;
            this.getList();
        },
        changePage(page, pageSize) {
            this.page.limit = pageSize;
            this.page.page = page;
            this.getList();
        },
        //获取轮次列表
        getLunList() {
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
        //获取房间列表
        getRoomList() {
            let data = {
                competitionId: this.competitionId,
                roundIndex: Number(this.searchForm.roundIndex)
            };
            this.roomList = [];
            this.searchForm.roomIndex = "";
            this.RoomCount = "";
            this.$http
                .get(this.$api.competitionRoomCount, data, true)
                .then(res => {
                    console.log("房间列表" + JSON.stringify(res));
                    if (res) {
                        this.RoomCount = res.countRoom;
                        this.roomList = [];
                        for (let i = 0; i < Number(this.RoomCount); i++) {
                            this.roomList.push({
                                name: "房间" + (i + 1),
                                value: i + 1 + ""
                            });
                        }
                    }
                })
                .catch(res => {
                    this.$message.error(res.message);
                });
        },
        getList() {
            let data = {
                competitionId: this.competitionId,
                roundIndex: Number(this.searchForm.roundIndex),
                userListType: this.searchForm.userListType,
                roomIndex: Number(this.searchForm.roomIndex),
                uid: this.searchForm.uid,
                gameIdentify: this.searchForm.gameIdentify,
                 page: this.page.page,
                 limit: this.page.limit
            };
            this.loadingTable = true;
            let apiName = "";
            this.$http
                .get(this.$api.gameCompetitionList, data, true)
                .then(res => {
                    console.log("列表" + JSON.stringify(res));
                    if (res) {
                        this.tableData = res.data ? res.data : [];
                        this.otherDetail = {
                            competitionStatus: res.competitionStatus,
                            competitionName: res.competitionName,
                            userListType: res.userListType
                        };
                         this.page.total=res.total;
                         this.searchLun=this.searchForm.roundIndex;
                        this.copyTableData = JSON.parse(
                            JSON.stringify(this.tableData)
                        );

                    } else {
                        [
                            this.tableData,
                            this.copyTableData,
                            this.otherDetail,
                            this.searchLun
                        ] = [[], [], {},''];
                    }
                    this.loadingTable = false;
                    this.ediet=false;
                })
                .catch(res => {
                    this.loadingTable = false;
                    this.searchLun='';
                    this.$message.error(res.message);
                });
        },
        resetTable() {
            this.tableData = JSON.parse(JSON.stringify(this.copyTableData));
        },
        changeLun(val) {
            this.getRoomList();
        },
        checkTable(){
             for (let item of this.tableData) {
                if ( (!item.roomName && item.roomName != 0) || (!item.totalRanking && item.totalRanking != 0) ) {
                    this.$message.error("表格的房间号和当前排名必须填写");
                    return false;
                }
                 if(!/^[1-9]\d*$/.test(item.totalRanking)) {
                    this.$message.error("排名必须为正整数");
                    return false;
                  }
                   if( !/^[1-9]\d*$/.test(item.inningNum)) {
                    this.$message.error("比赛局数必须为正整数");
                    return false;
                  }
                   
            }
            let rankBox=this.tableData.map(val=>val.totalRanking);
            if(Array.from(new Set(rankBox)).length!==rankBox.length){
                this.$message.error("排名不能和其他排名重复");
                  return false;
            } 
             return true;
        },
        //保存编辑的信息
        saveInfo() {
            let data = {};
            if(this.checkTable()){
                 data.gameStatisicsList = JSON.parse(JSON.stringify(this.tableData));
                 data.competitionId=this.competitionId;
                data.roundIndex=Number(this.searchForm.roundIndex);
                this.$http
                    .get(this.$api.updateGameStatisics, data, true)
                    .then(res => {
                        this.$message.success("保存成功");
                        this.ediet = false;
                        this.getList();
                    })
                    .catch(res => {
                        this.$message.error(res.message);
                    });
            }
          
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
        //恢复比赛资格
        recoveryQualification(val) {
            this.$confirm("确认恢复该用户的比赛资格吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let data = {
                    applyId: val
                };
                this.$http
                    .get(this.$api.recoveryQualification, data, true)
                    .then(res => {
                        this.$message.success("恢复成功");
                        this.getList();
                    })
                    .catch(res => {
                        this.$message.error(res.message);
                    });
            });
        },
        //结束该轮比赛
        endCompetition() {
            if(this.ediet){
                  this.$message.error("请先保存编辑的信息");
                  return;
            }
            if(this.checkTable()){
                let data = {
                competitionId: this.competitionId,
                roundIndex:Number(this.searchForm.roundIndex)
            };
            this.$http
                .get(this.$api.settleGameCompetition, data, true)
                .then(res => {
                    this.$message.success("成功");
                    this.getCompetionInfo();
                })
                .catch(res => {
                    this.$message.error(res.message);
                });
            }
           
        },

              downExcel(limit) {
                    let params = {
                             competitionId: this.competitionId,
                            roundIndex: Number(this.searchForm.roundIndex),
                            userListType: this.searchForm.userListType,
                            roomIndex: Number(this.searchForm.roomIndex),
                            uid: this.searchForm.uid,
                            gameIdentify: this.searchForm.gameIdentify,
                            page: this.page.page,
                            limit: limit
                    }
                    this.loadingDown = true;

                    this.$http
                    .downGet(this.$api.gameCompetitionListDown, params, true)
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
        color: #9795e3;
        margin-bottom: 13px;
        a {
            font-size: 15px;
            color: #9795e3;
        }
    }
    img {
        width: 100%;
    }
}

.imgWrapper {
    text-align: center;
    img {
        cursor: pointer;
        margin-right: 5px;
    }
}
/deep/ div .el-upload-list--picture-card .el-upload-list__item,
.imgWrapper img {
    width: 50px;
    height: 50px;
}
/deep/ div .el-upload--picture-card {
    width: 50px;
    height: 50px;
    line-height: 59px;
}
</style>
