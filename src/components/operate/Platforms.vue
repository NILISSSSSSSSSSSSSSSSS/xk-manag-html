<template>
    <div class="person">
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>平台
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="150px" :model="searchForm" class="xk-search">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="投诉用户UID：">
                            <el-input :size="$size" v-model="searchForm.uid" placeholder="请输入投诉用户UID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="受理状态：">
                            <el-select :size="$size" v-model="searchForm.acceptType">
                                <el-option label="未受理" value="NO_ACCEPT">未受理</el-option>
                                <el-option label="转需求" value="REQUIRE">转需求</el-option>
                                <el-option label="转缺陷" value="DEFECT">转缺陷</el-option>
                                <el-option label="设计如此" value="DESIGN">设计如此</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="投诉用户昵称：">
                            <el-input :size="$size" v-model="searchForm.userName" placeholder="请输入投诉用户昵称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="投诉平台：">
                            <el-select :size="$size" v-model="searchForm.feedbackPlatform">
                                <el-option label="用户app" value="ua">用户app</el-option>
                                <el-option label="商户app" value="ma">商户app</el-option>
                                <el-option label="商户web" value="mam">商户web</el-option>
                                <el-option label="直播" value="zb">直播</el-option>
                                <el-option label="小可运营后台" value="om">小可运营后台</el-option>
                                <el-option label="骑手APP" value="da">骑手APP</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="受理人：">
                            <el-input :size="$size" v-model="searchForm.acceptUsername" placeholder="请输入受理人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="平台版本：">
                            <el-input :size="$size" v-model="searchForm.feedbackVersion"
                                      placeholder="请输入平台版本"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="投诉时间段：">
                            <el-date-picker v-model="searchForm.date" type="daterange" start-placeholder="开始日期"
                                            end-placeholder="结束日期" :size="$size" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius margintop20">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading"
                      >
                <!--<el-table-column type="selection" width="55px"></el-table-column>-->
                <el-table-column label="投诉ID" prop="id"></el-table-column>
                <el-table-column label="投诉用户UID">
                    <template slot-scope="scope">
                        <span v-if="scope.row.uid">
                           {{scope.row.uid}}
                        </span>
                        <span v-else>/</span>
                    </template>

                </el-table-column>
                <el-table-column label="投诉用户昵称" prop="userName"></el-table-column>
                <el-table-column label="联系号码" prop="userPhone"></el-table-column>
                <el-table-column label="投诉描述">
                    <template slot-scope="scope">
                        <span class="moreHidden">{{scope.row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="投诉时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="受理时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.accept.acceptTime">
                            {{scope.row.accept.acceptTime | formatTime}}
                        </span>
                        <span v-else> / </span>
                    </template>
                </el-table-column>
                <el-table-column label="投诉附件" width="250px">
                    <template slot-scope="scope">
                        <template v-for="(item,index) of scope.row.videos" v-if="item.pic || item.video">
                            <image-list  :size="{width: '50px',height: '50px'}" :key="index" :url="item.pic?item.pic:''" :type="item.video? 'video': 'image'"
                                         :videoUrl="item.video?item.video:''"></image-list>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column label="投诉平台">
                    <template slot-scope="scope" v-if="scope.row.app">
                        {{scope.row.app | platformStatus}}
                    </template>
                    <template v-else>
                        /
                    </template>
                </el-table-column>
                <el-table-column label="版本" prop="clientVersion"></el-table-column>
                <el-table-column label="受理状态">
                    <template slot-scope="scope">
                        {{scope.row.accept.acceptType | acceptanceStatus}}
                    </template>
                </el-table-column>
                <el-table-column label="受理人">
                    <template slot-scope="scope">
                        <span v-if="scope.row.accept.acceptUsername">
                            {{scope.row.accept.acceptUsername}}
                        </span>
                        <span v-else> / </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button :loading="scope.row.loading" type="text" :size="$size"
                                   @click="handleDetail(scope.row, scope.row.id,'chakan')" v-permission="'feedbackDetail'">查看
                        </el-button>
                        <el-button :size="$size" :loading="scope.row.loading2" type="text" @click="handleDetail(scope.row, scope.row.id,'shouli')"
                        v-permission="'feedbackPlateform'">受理
                        </el-button>
                        <!--v-if="scope.row.process === 'SUBMIT'"-->
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total"
                        @change="changePage"></pagination>

            <!--平台详情-->
            <el-dialog width="800px" :visible.sync="detailDialog" title='投诉信息' :before-close="detailClose"
                       >
                <div class="platformDetail">
                    <el-row class="info-class">
                        <el-col :span="3">投诉ID：</el-col>
                        <el-col :span="18">{{detailData.id?detailData.id:'无'}}</el-col>
                    </el-row>
                    <el-row class="info-class">
                        <el-col :span="3">投诉平台：</el-col>
                        <el-col :span="18">{{detailData.app | platformStatus}}</el-col>
                    </el-row>
                    <el-row class="info-class">
                        <el-col :span="3">用户ID：</el-col>
                        <el-col :span="18">{{detailData.uid?detailData.uid:'无'}}</el-col>
                    </el-row>
                    <el-row class="info-class">
                        <el-col :span="3">用户昵称：</el-col>
                        <el-col :span="18">{{detailData.userName?detailData.userName:'无'}}</el-col>
                    </el-row>
                    <el-row class="info-class">
                        <el-col :span="3">平台版本：</el-col>
                        <el-col :span="18">{{detailData.clientVersion?detailData.clientVersion:'无'}}</el-col>
                    </el-row>
                    <el-row class="info-class">
                        <el-col :span="3">投诉时间：</el-col>
                        <el-col :span="18">{{detailData.createdAt | formatTime}}</el-col>
                    </el-row>
                    <el-row class="info-class">
                        <el-col :span="3">联系方式：</el-col>
                        <el-col :span="18">{{detailData.userPhone?detailData.userPhone:'无'}}</el-col>
                    </el-row>
                    <el-row class="info-class">
                        <el-col :span="3">投诉附件：</el-col>
                        <el-col :span="20">
                            <span v-if="!detailData.videos || detailData.videos.length == 0">无</span>
                            <span v-else>
                                    <template v-for="(item,index) in detailData.videos">
                                        <template v-if="item.pic || item.video">
                                            <image-list :key="index" :url="item.pic?item.pic:''" :type="item.video? 'video': 'image'"
                                                        :videoUrl="item.video?item.video:''"></image-list>
                                        </template>
                                    </template>
                                </span>
                        </el-col>
                    </el-row>
                    <el-row class="info-class">
                        <el-col :span="3">投诉内容：</el-col>
                        <el-col :span="18">
                            <el-input style="margin-top: 11px;" type="textarea" v-model="detailData.content" :size="$size"
                                      disabled></el-input>
                        </el-col>
                    </el-row>

                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>受理记录：</span>
                        </div>
                        <div class="text item" v-if="detailData.accepts&&detailData.accepts.length>0">
                            <div v-for="(value,index) of detailData.accepts" :key="index">
                                <el-card class="box-card">
                                    <div class="text item">
                                        <el-row>
                                            <el-col :span="12">受理方式：{{value.acceptType | acceptanceStatus}}</el-col>
                                            <el-col :span="12" v-if="value.acceptType!='NO_ACCEPT'">需求ID：{{value.acceptId}}</el-col>
                                        </el-row>
                                        <el-row v-if="value.acceptType!='NO_ACCEPT'">
                                            <el-col :span="12">受理人：{{value.acceptUsername}}</el-col>
                                            <el-col :span="12">受理时间：{{value.acceptTime | formatTime}}</el-col>
                                        </el-row>
                                        <el-row v-if="value.acceptType!='NO_ACCEPT'">
                                            <el-col :span="3">受理描述：
                                            </el-col>
                                            <el-col :span="19">
                                                <el-input style="margin-top: 11px;" type="textarea"
                                                          v-model="value.describe"
                                                          :size="$size" disabled></el-input>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-card>
                            </div>
                        </div>
                        <div v-else>暂无</div>
                    </el-card>
                </div>
                <div style="text-align: center;margin-top: 10px">
                    <el-button :size="$size" type="primary" @click="detailClose">返回</el-button>
                </div>
            </el-dialog>
            <!--受理-->
            <el-dialog width="800px" :visible.sync="detailDialog2" title='投诉信息' :before-close="detailClose2"
                       class="acceptDetail">
                <el-row class="info-class">
                    <el-col :span="3">投诉ID：</el-col>
                    <el-col :span="18">{{detailData2.id}}</el-col>
                </el-row>
                <el-row class="info-class">
                    <el-col :span="3">投诉平台：</el-col>
                    <el-col :span="18">{{detailData2.app | platformStatus}}</el-col>
                </el-row>
                <el-row class="info-class">
                    <el-col :span="3">用户ID：</el-col>
                    <el-col :span="18">{{detailData2.uid}}</el-col>
                </el-row>
                <el-row class="info-class">
                    <el-col :span="3">用户昵称：</el-col>
                    <el-col :span="18">{{detailData2.userName}}</el-col>
                </el-row>
                <el-row class="info-class">
                    <el-col :span="3">平台版本：</el-col>
                    <el-col :span="18">{{detailData2.clientVersion}}</el-col>
                </el-row>
                <el-row class="info-class">
                    <el-col :span="3">投诉时间：</el-col>
                    <el-col :span="18">{{detailData2.createdAt | formatTime}}</el-col>
                    <!-- | formatTime-->
                </el-row>
                <el-row class="info-class">
                    <el-col :span="3">联系方式：</el-col>
                    <el-col :span="18">{{detailData2.userPhone}}</el-col>
                </el-row>
                <el-row class="info-class">
                    <el-col :span="3">投诉附件：</el-col>
                    <el-col :span="20">
                        <span v-if="!detailData2.videos || detailData2.videos.length == 0">无</span>
                        <span v-else>
                                    <template v-for="(item,index) in detailData2.videos">
                                        <template v-if="item.pic || item.video">
                                            <image-list :key="index" :url="item.pic?item.pic:''" :type="item.video? 'video': 'image'"
                                                        :videoUrl="item.video?item.video:''"></image-list>
                                        </template>
                                    </template>
                                </span>
                    </el-col>
                </el-row>
                <el-row class="info-class">
                    <el-col :span="3">投诉内容：</el-col>
                    <el-col :span="18">
                        <el-input style="margin-top: 11px;" type="textarea" v-model="detailData2.content" :size="$size"
                                  disabled></el-input>
                    </el-col>
                </el-row>
                <div class="solidbottom1px margintop20" style="padding-bottom: 10px;font-size: 18px;">受理</div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" label-width="100px">
                    <el-form-item prop="resource">
                        <!--{{ruleForm.resource}}-->
                        <el-radio-group v-model="ruleForm.resource" :size="$size">
                            <el-radio label="REQUIRE">转需求</el-radio>
                            <el-radio label="DEFECT">转缺陷</el-radio>
                            <el-radio label="DESIGN">设计如此</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="需求ID：" prop="needsID" style="width: 80%;" v-if="ruleForm.resource=='REQUIRE'||ruleForm.resource=='DEFECT'">
                        <el-input v-model="ruleForm.needsID" :size="$size" placeholder="请输入需求ID"></el-input>
                    </el-form-item>
                    <el-form-item label="受理描述：" prop="describe" style="width: 80%;">
                        <el-input type="textarea" v-model="ruleForm.describe" placeholder="请输入受理描述(300字以内)"
                                  :size="$size"></el-input>
                    </el-form-item>
                </el-form>
                <div style="text-align: center;margin-top: 10px">
                    <el-button :size="$size" @click="detailClose2">返回</el-button>
                    <el-button :size="$size" type="primary" @click="submitInfo('ruleForm')">提交</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapState} from 'vuex'
    import {ReportReasonType, ReportObjType} from '@/util/publicParams'
    import ImageList from '../../components/common/ImageList.vue'
    import {acceptanceStatus,platformStatus} from '../../util/filters'
    import  moment from 'moment'

    export default {
        name: "person",
        props: {
            activeName: ''
        },
        components: {
            ImageList
        }
        ,
        data() {
            return {
                searchForm: {date: ["", ""]},
                tableData: [],
                pageData: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                loading: false,
                detailData: {accept: {}},
                detailData2: {accept: {}},
                acceptId:'',       //个人反馈ID（受理）
                detailDialog: false,
                detailDialog2: false,
                ids: [],
                ruleForm: {},
                rules: {
                    resource: [
                        {required: true, message: '请选择一个', trigger: 'change'}
                    ],
                    needsID: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    describe: [
                        {required: true, message: '请填写', trigger: 'blur'},
                        { min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur' }
                    ]
                }
            };
        },
        created() {
            this.getReportList();
        },
        watch: {
            activeName(val) {
                if (val === 'platforms') {
                    this.getReportList();
                }
                console.log('platforms')
            }
        },
        methods: {
            search() {
                this.pageData.currentPage = 1;
                this.getReportList();
            },
            resetForm() {
                this.searchForm = {date: ["", ""]};
                this.pageData.currentPage = 1;
                this.getReportList();
            },
            // 反馈来源
            getPlatform(val) {
                switch (val) {
                    case "ua":
                        return "用户APP";
                    case "ma":
                        return "商户APP";
                    case "mam":
                        return "商户Web";
                    case "zb":
                        return "直播";
                    case "om":
                        return "小可运营后台";
                    default:
                        return val
                }
            },
            // 平台类型
            getObjType(val) {
                let name;
                for (let item of ReportObjType) {
                    if (item.key === val) {
                        name = item.label
                        console.log(name)
                        break;
                    }
                }
                return name
            },
            // 意见
            getReason(val) {
                let name = '';
                for (let reason of val) {
                    for (let item of ReportReasonType) {
                        if (item.key === reason) {
                            name = item.label + name
                            break;
                        }
                    }
                }
                return name
            },
            // 平台列表
            getReportList() {
                let data = {
                    limit: this.pageData.pageSize,
                    page: this.pageData.currentPage,
                    uid: this.searchForm.uid,
                    userId: this.searchForm.userId,
                    userPhone: this.searchForm.userPhone,
                    userName: this.searchForm.userName,
                    startTime: this.searchForm.date[0]?moment(this.searchForm.date[0]).format('X'):'',
                    endTime: this.searchForm.date[1]?moment(this.searchForm.date[1]).format('X'):'',
                    lastUpdatedAt: this.searchForm.lastUpdatedAt,
                    acceptUsername: this.searchForm.acceptUsername,
                    acceptType: this.searchForm.acceptType,
                    feedbackPlatform: this.searchForm.feedbackPlatform,
                    feedbackVersion: this.searchForm.feedbackVersion,
                };
                console.log('获取列表数据传值',data);
                this.loading = true;
                this.$http.get(this.$api.personalFeedbackPage, data, true)
                    .then(res => {
                        console.log('列表参数====》', res);
                        this.loading = false;
                        this.tableData = res.data;
                        this.pageData.total = res.total;
                    })
                    .catch(err => {
                        this.loading = false;
                        this.$message.error(err.message);
                    });
            },
            // 分页
            changePage(page, pageSize) {
                [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
                this.getReportList();
            },
            // 平台详情/受理详情
            handleDetail(row, id,tag) {
                if(tag=='chakan'){
                    this.$set(row, 'loading', true);
                }
                if(tag=='shouli'){
                    this.acceptId=id;
                    this.$set(row, 'loading2', true);
                }
                this.$http.get(this.$api.personalFeedbackDetail, {id: id}, true)
                .then(res => {
                    this.$set(row, 'loading', false);
                    this.$set(row, 'loading2', false);
                    if(tag=='chakan'){
                        this.detailDialog = true;
                        this.detailData = res;
                        console.log('平台详情', res);
                    }
                    if(tag=='shouli'){
                        this.detailDialog2 = true;
                        this.detailData2 = res;
                        console.log('受理详情', res);
                    }

                })
                .catch(err => {
                    this.$set(row, 'loading', false);
                    this.$set(row, 'loading2', false);
                    this.$message.error(err.message)
                })
            },
            detailClose() {
                this.detailDialog = false;
            },
            //受理
            // handleReport(row, id) {
            //     this.$set(row, 'loading', true);
            //     console.log('row===',row);
            //
            // },
            detailClose2() {
                this.$refs['ruleForm'].clearValidate();
                this.ruleForm = {};
                this.detailDialog2 = false;
            },
            //提交
            submitInfo(ruleForm) {
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        let data={
                            id:this.acceptId,
                            acceptType:this.ruleForm.resource,
                            describe:this.ruleForm.describe,
                            acceptId:this.ruleForm.needsID,
                        };
                        this.$http.get(this.$api.personalFeedbackUpdate, data, true)
                            .then(res => {
                                this.detailDialog2 = false;
                                this.$refs['ruleForm'].clearValidate();
                                this.ruleForm = {};
                                this.getReportList();
                            })
                            .catch(err => {
                                this.$message.error(err.message)
                            })
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    /deep/ .el-card.is-always-shadow {
        margin-top: 10px;
    }

    .imgSize {
        height: 100px;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .videoSize {
        height: 100px;
        width: 100px;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .content {
        margin-top: 20px;
        text-align: center;
    }

    .success {
        color: #67C23A
    }

    .warning {
        color: #E6A23C
    }

    .danger {
        color: #F56C6C;
    }

    .info-class {
        margin-left: 50px;
        line-height: 30px;
    }
    .moreHidden {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    /deep/[data-v-f44705d6] .el-card.is-always-shadow {
        margin-top: 30px;
        margin-right: 20px;
    }
    .platformDetail {
        height: 600px;
        overflow-y: scroll;
    }

    /*.acceptDetail {*/

    /*}*/
</style>
