<template>
    <div class="xk-container game-match">
        <div class="xk-body">
            <div class="xk-radius">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>查询
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
                                <el-form-item label="比赛ID：" >
                                    <el-input
                                        :size="$size"
                                        v-model="searchForm.competitionId"
                                        placeholder="请输入比赛ID"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="比赛名称：">
                                    <el-input
                                        :size="$size"
                                        v-model="searchForm.name"
                                        placeholder="请输入比赛名称"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="比赛状态：">
                                    <el-select :size="$size" v-model="searchForm.competitionStatus">
                                        <el-option
                                            :label="item.name"
                                            :value="item.value"
                                            v-for="(item,index) in completeList"
                                            :key="index"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="轮次状态：">
                                    <el-select :size="$size" v-model="searchForm.roundStatus">
                                        <el-option
                                            :label="item.name"
                                            :value="item.value"
                                            v-for="(item,index) in lunciList"
                                            :key="index"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="比赛项目：">
                                    <el-row :gutter="10">
                                        <el-col :span="7">
                                            <el-select
                                                :size="$size"
                                                v-model="searchForm.competitionType"
                                                @change="getSecondList"
                                            >
                                                <el-option value="GAME" label="游戏类"></el-option>
                                                <el-option value="UPLOAD" label="上传类"></el-option>
                                            </el-select>
                                        </el-col>
                                        <!-- 二级 -->
                                        <el-col :span="7">
                                            <el-select
                                                :size="$size"
                                                v-model="searchForm.subCode"
                                                @change="getThreeList"
                                            >
                                                <el-option
                                                    v-for="(item,index) in secondList"
                                                    :label="item.label"
                                                    :value="item.value"
                                                    :key="index"
                                                ></el-option>
                                            </el-select>
                                        </el-col>
                                        <!-- 三级 -->
                                        <el-col :span="7">
                                            <el-select :size="$size" v-model="searchForm.threeCode">
                                                <el-option
                                                    v-for="(item,index) in threeList"
                                                    :label="item.name"
                                                    :value="item.id"
                                                    :key="index"
                                                ></el-option>
                                            </el-select>
                                        </el-col>
                                    </el-row>
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
                    <div class="vus-btn">
                        <el-button v-permission="'addGameMatch'" type="primary" :size="$size" @click="addMatch()">新增比赛</el-button>
                        <el-button v-permission="'managePricePoll'" type="primary" :size="$size" @click='$router.push("/gamePrizePool")'>管理奖品池</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table :data="tableData" v-loading="loadingTable">
                    <el-table-column label="比赛ID" prop="competitionId" width="280"></el-table-column>
                    <el-table-column label="比赛名称" prop="name"  width="180"></el-table-column>
                    <el-table-column label="一级分类">
                        <template slot-scope="scope">
                            <span>{{scope.row.competitionType | competitionType}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="二级分类" prop="subclass.name"></el-table-column>
                    <el-table-column label="比赛项目" prop="event.eventName"></el-table-column>
                    <el-table-column label="比赛状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.competitionStatus | competitionStatus}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="总轮次">
                        <template slot-scope="scope">
                            <span>{{scope.row.totalRound }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前轮次">
                        <template slot-scope="scope">
                            <span>{{scope.row.currentRoundIndex }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="轮次状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.roundStatus | roundStatus}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建人" prop="operator.userName"></el-table-column>
                    <el-table-column label="创建时间" width="150">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | formatTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="H5" prop="name">
                        <template slot-scope="scope">
                            <el-button v-permission="'gameMacthH5'" :size="$size" type="text" @click="seeH5(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" prop="name" width="200">
                        <template slot-scope="scope">
                            <el-button
                                v-permission="'gameMatchDetail'"
                                :size="$size"
                                type="text"
                                @click="competitionId=scope.row.competitionId;competitionDetailDia=true;"
                            >查看比赛</el-button>
                                <div style="display:inline-block" v-if="!(scope.row.competitionStatus=='PREPARE' || (scope.row.competitionStatus=='COMPETITIONED' && scope.row.roundStatus=='SETTLED'))">
                                    <el-button v-permission="'gameRegistList'"
                                        :size="$size"
                                        type="text"
                                        @click="type=scope.row.competitionType;competitionId=scope.row.competitionId;roundIndex=scope.row.currentRoundIndex;registrationDialog=true;"
                                    >报名名单</el-button>
                                </div>
                                <div style="display:inline-block" v-if="['PREPARE','APPLY','AWAIT_BEGIN'].includes(scope.row.competitionStatus)">
                                    <el-button
                                        v-permission="'cancleGame'"
                                        :size="$size"
                                        type="text"
                                        @click="cancel(scope.row)"
                                    >取消比赛</el-button>
                                </div>
                                <div style="display:inline-block" v-if="scope.row.competitionStatus=='COMPETITIONED' && scope.row.roundStatus!=='bSETTLED'">
                                    <el-button v-permission="'gameMatchWatch'"
                                        :size="$size"
                                        type="text"
                                        @click="routeJudge(scope.row,'monitor')"
                                    >赛事监测</el-button>
                                </div>
                                <div style="display:inline-block" v-if="scope.row.competitionStatus=='OFF_LINE'">
                                    <el-button v-permission="'gameReview'"
                                        :size="$size"
                                        type="text"
                                        @click="routeJudge(scope.row,'review')"
                                    >赛事回顾</el-button>
                                </div>
                                <div style="display:inline-block" v-if="scope.row.competitionStatus=='AWAIT_BEGIN' && scope.row.competitionType=='GAME'">
                                    <el-button :disabled="buildDisable" v-permission="'gameMatchOneKey'"
                                        :size="$size"
                                        type="text"
                                        @click="buildinGroup(scope.row)"
                                    >一键建群</el-button>
                                </div>
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
        <!-- 查看比赛 -->
        <competition-detail
            :competitionDetailDia.sync="competitionDetailDia"
            :competitionId="competitionId"
        ></competition-detail>
        <!-- 报名名单相关 -->
        <registration-list
            :registrationDialog.sync="registrationDialog"
            :competitionId="competitionId"
            :roundIndex="roundIndex"
            :type="type"
        ></registration-list>
        <!-- 取消比赛弹框 -->
        <el-dialog title="取消比赛" :visible.sync="cancelDialog" width="500px">
            <div>
                <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label-width="120px" label="取消原因：" prop="reason">
                        <el-input
                            :size="$size"
                            v-model="ruleForm.reason"
                            type="textarea"
                            class="xk-input"
                            :autosize="{ minRows: 5, maxRows: 5 }"
                            resize="none"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="sub-btn" style="text-align:center">
                <el-button :size="$size" @click="cancelDialog=false">取 消</el-button>
                <el-button
                    v-if="!disable"
                    :size="$size"
                    type="primary"
                    @click="cancelCompetition('ruleForm')"
                >确 定</el-button>
            </div>
        </el-dialog>
        <!-- 查看宣传页 -->
        <el-dialog title="xx比赛宣传页h5" :visible.sync="propagandaDialog" width="550px" class="imgWRa" top="50px">
            <p>
                    H5链接:{{ url }}
                </p>
            <div class="propagandaWrapper">
                
                <iframe :src="url" frameborder="0" width="100%" height="100%"></iframe>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const checkReason = (rule, value, callback) => {
    if (!value) {
        callback(new Error("请输入原因"));
    } else if (value.length < 10 || value.length > 80) {
        callback(new Error("原因限制为10-80个字"));
    } else {
        callback();
    }
};
const completeList = [
    { name: "准备中", value: "PREPARE" },
    { name: "报名中", value: "APPLY" },
    { name: "待开赛", value: "AWAIT_BEGIN" },
    { name: "比赛中", value: "COMPETITIONED" },
    { name: "已下线", value: "OFF_LINE" },
    { name: "已取消", value: "CANCEL" }
];
const lunciList = [
    { name: "未开始", value: "AWAIT_BEGIN" },
    { name: "进行中", value: "COMPETITIONED" },
    { name: "已结束", value: "SETTLED" }
];
import RegistrationList from "@/components/operate/game/competition/RegistrationList.vue";
import CompetitionDetail from "@/components/operate/game/competition/CompetitionDetail.vue";
export default {
    components: {
        RegistrationList,
        CompetitionDetail
    },
    data() {
        return {
            secondList: [],
            threeList: [],
            searchForm: {
                subCode: "",
                threeCode: ""
            },
            tableData: [{}],
            loadingTable: false,
            loadingSearch: false,
            completeList: completeList,
            lunciList: lunciList,
            page: {
                page: 1,
                limit: 10,
                total: 0
            },

            cancelDialog: false, //取消竞赛弹框
            ruleForm: {
                reason: ""
            },
            rules: {
                reason: [
                    {
                        required: true,
                        validator: checkReason,
                        trigger: "blur"
                    }
                ]
            },
            //宣传页
            propagandaDialog: false,
            registrationDialog: false, //报名名单相关
            type: "",

            competitionDetailDia: false,
            competitionId: "",
            roundIndex: "",
            url: "" ,//h5URL
            buildDisable:false,
        };
    },
    mounted() {
        this.getList();
    },

    methods: {
        seeH5(row) {
            this.url = `${location.origin}/activity/#/${
                row.competitionType == "GAME"
                    ? "gameMatchDetail"
                    : "mediaMatchDetail"
            }?competitionId=${row.competitionId}`;
            this.propagandaDialog = true;
        },
        search() {
            this.page.page = 1;
            this.getList();
        },
        reset() {
            this.searchForm = {
                subCode: "",
                threeCode: ""
            };
            this.getList();
        },
        //列表显示
        getList() {
            let data = {
                competitionId: this.searchForm.competitionId,
                name: this.searchForm.name,
                competitionStatus: this.searchForm.competitionStatus,
                roundStatus: this.searchForm.roundStatus,
                competitionType: this.searchForm.competitionType,
                code: this.searchForm.subCode,
                eventId: this.searchForm.threeCode,
                page: this.page.page,
                limit: this.page.limit
            };

            this.loadingTable = true;
            this.$http
                .get(this.$api.queryCompetition, data, true)
                .then(res => {
                    console.log("竞赛列表" + JSON.stringify(res));
                    res
                        ? ([this.tableData, this.page.total] = [
                              res.data,
                              res.total
                          ])
                        : [[], 0];
                    this.loadingTable = false;
                })
                .catch(res => {
                    this.loadingTable = false;
                    this.$message.error(res.message);
                });
        },
        changePage(page, pageSize) {
            this.page.limit = pageSize;
            this.page.page = page;
            this.getList();
        },
        cancel(row) {
            this.competitionId = row.competitionId;
            this.$refs["ruleForm"] ? this.$refs["ruleForm"].resetFields() : "";
            this.ruleForm.reason = "";
            this.cancelDialog = true;
        },
        //取消比赛
        cancelCompetition(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        competitionId: this.competitionId,
                        cancelReason: this.ruleForm.reason
                    };
                    this.$http
                        .get(this.$api.competitionCancel, data, true)
                        .then(res => {
                            this.$message.success("取消成功");
                            this.cancelDialog = false;
                            this.getList();
                        })
                        .catch(res => {
                            this.$message.error(res.message);
                        });
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },

        addMatch() {
            this.$router.push("/gameMatchAdd");
        },
        routeJudge(row, stype) {
            row.competitionType == "GAME"
                ? this.$router.push({
                      path: "/gameCompetion",
                      query: {
                          type: stype,
                          competitionId: row.competitionId,
                          curentLun: row.currentRoundIndex,
                          isTurnPage:true,
                      }
                  })
                : this.$router.push({
                      path: "/uploadCompetion",
                      query: {
                          type: stype,
                          competitionId: row.competitionId,
                          curentLun: row.currentRoundIndex,
                          isTurnPage:true,
                      }
                  });
        },
        //获取二级列表
        getSecondList(val) {
            let data = { competitionType: val };
            console.log("data", data);
            this.secondList = [];
            this.threeList = [];
            this.searchForm.subCode = "";
            this.searchForm.threeCode = "";
            this.$http
                .get(this.$api.competitionSubclasses, data, true)
                .then(res => {
                    console.log("二级列表：" + JSON.stringify(res));
                    if (res && res.length !== 0) {
                        this.secondList = [];
                        res.forEach((item, index) => {
                            let key = Object.keys(item)[0];
                            this.secondList.push({
                                value: key,
                                label: item[key]
                            });
                        });
                        console.log(
                            "二级列表：" + JSON.stringify(this.secondList)
                        );
                    } else {
                        this.secondList = [];
                    }
                })
                .catch(res => {
                    this.secondList = [];
                    this.$message.error(res.message);
                });
        },
        getThreeList(val) {
            let data = {
                competitionType: this.searchForm.competitionType,
                subclassCode: this.searchForm.subCode
            };
            this.threeList = [];
            this.searchForm.threeCode = "";
            this.$http
                .get(this.$api.competitionEvnets, data, true)
                .then(res => {
                    console.log("三级列表：" + JSON.stringify(res));
                    if (res && res.length !== 0) {
                        this.threeList = res;
                    } else {
                        this.threeList = [];
                    }
                })
                .catch(res => {
                    this.threeList = [];
                    this.$message.error(res.message);
                });
        },
        //一奖建群
        buildinGroup(row) {
            this.buildDisable=true;
            let data = {
                competitionId: row.competitionId,
                roundIndex: row.currentRoundIndex
            };
            this.$http
                .get(this.$api.competitionTeamCreate, data, true)
                .then(res => {
                    this.$message.success("建群成功");
                    this.getList();
                })
                .catch(res => {
                    this.buildDisable=false;
                    this.$message.error(res.message);
                });
        }
    }
};
</script>

<style scoped lang="scss">
.propagandaWrapper {
    width: 100%;
    height: 100%;
    p {
        font-size: 15px;
        margin-bottom: 13px;
       
    }
    /deep/ .el-dialog__body {
        height: 80vh;
    }
}
.imgWRa {
    /deep/ .el-dialog__body {
        height: 80vh;
    }
    p{
        height: 8%;
    }
    iframe {
        height: 92%;
    }
}
</style>
