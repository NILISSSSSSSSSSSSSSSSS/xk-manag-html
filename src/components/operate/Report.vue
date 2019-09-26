<template>
    <div class="person">
        <div class="xk-radius">
                  <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>举报
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
                            <el-form-item label="举报用户UID：" >
                                <el-input :size="$size" v-model="searchForm.uid" placeholder="请输入用户UID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="举报用户名称：" >
                                <el-input :size="$size" v-model="searchForm.userName" placeholder="请输入用户名称"></el-input>
                            </el-form-item>
                        </el-col>
                          <el-col :span="8">
                              <el-form-item label="举报手机号码：">
                                  <el-input :size="$size" v-model="searchForm.phone" placeholder="请输入手机号"></el-input>
                              </el-form-item>
                          </el-col>
                      </el-row>
                      <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="被举报用户UID：" >
                                <el-input :size="$size" v-model="searchForm.rUid" placeholder="请输入用户UID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="被举报用户名称：" >
                                <el-input :size="$size" v-model="searchForm.rUserName" placeholder="请输入用户名称"></el-input>
                            </el-form-item>
                        </el-col>
                          <el-col :span="8">
                              <el-form-item label="被举报手机号码：">
                                  <el-input :size="$size" v-model="searchForm.rPhone" placeholder="请输入手机号"></el-input>
                              </el-form-item>
                          </el-col>
                      </el-row>
                      <el-row :gutter="10">
                          <el-col :span="8">
                              <el-form-item label="反馈日期：">
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
                          <!--<el-button type="primary" :size="$size" @click="batchDelete" :disabled="this.ids.length == 0" v-permission="'feedbackDelete'">批量删除</el-button>-->
                      </div>
                      <div class="vus-bottom"></div>
                  </div>
                  <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading" @selection-change="selectionChange">
                      <!--<el-table-column type="selection" width="55px"></el-table-column>-->
                      <el-table-column  label="举报用户UID" prop="uid"></el-table-column>
                      <el-table-column  label="举报用户名称" prop="userName"></el-table-column>
                      <el-table-column  label="举报用户手机号码" prop="phone"></el-table-column>
                      <el-table-column  label="反馈时间">
                          <template slot-scope="scope">
                              {{scope.row.createdAt | formatTime}}
                          </template>
                      </el-table-column>
                      <el-table-column  label="被举报用户UID" prop="rUid"></el-table-column>
                      <el-table-column  label="被举报用户名称" prop="rUserName"></el-table-column>
                      <el-table-column  label="被举报用户手机号码" prop="rPhone"></el-table-column>
                      <el-table-column  label="反馈来源">
                          <template slot-scope="scope">
                              {{getPlatform(scope.row.app)}}
                          </template>
                      </el-table-column>
                      <el-table-column  label="举报类型">
                          <template slot-scope="scope">
                              {{getObjType(scope.row.objType)}}
                          </template>
                      </el-table-column>
                      <el-table-column  label="举报内容">
                          <template slot-scope="scope">
                              {{getReason(scope.row.reasonTypes)}}
                          </template>
                      </el-table-column>
                      <el-table-column  label="状态">
                          <template slot-scope="scope">
                              <span :class="scope.row.process === 'ACCEPT' ? 'success' : 'warning'">
                                  {{scope.row.process === 'ACCEPT' ? '受理' : '未受理'}}
                              </span>
                          </template>
                      </el-table-column>
                      <el-table-column  label="操作"  fixed="right">
                          <template slot-scope="scope">
                              <el-button :loading="scope.row.loading" type="text" :size="$size" @click="handleDetail(scope.row, scope.row.id)">查看</el-button>
                              <!--<el-button type="text" :size="$size" @click="goodsDelete(scope.row.id, scope.row.goodsName)" v-permission="'feedbackDeleteReport'">删除</el-button>-->
                              <el-button :size="$size" type="text" @click="handleReport(scope.row)" v-if="scope.row.process === 'SUBMIT'">受理</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
                  <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
                  <el-dialog width="800px" :visible.sync="detailDialog" title='举报详情' :before-close="detailClose">
                          <el-row class="info-class">
                              <el-col :span="6">用户名称：</el-col>
                              <el-col :span="18">{{detailData.userName}}</el-col>
                          </el-row>
                          <el-row class="info-class">
                              <el-col :span="6">用户UID：</el-col>
                              <el-col :span="18">{{detailData.uid}}</el-col>
                          </el-row>
                          <el-row class="info-class">
                              <el-col :span="6">手机号码：</el-col>
                              <el-col :span="18">{{detailData.phone}}</el-col>
                          </el-row>
                          <el-row class="info-class">
                              <el-col :span="6">反馈内容：</el-col>
                              <el-col :span="18">
                                用户UID为{{detailData.uid}}的用户{{detailData.rNikeName}}({{detailData.rPhone}})
                                被举报,被举报类型为{{getObjType(detailData.objType)}},被举报描述为{{detailData.describe}}
                              </el-col>
                          </el-row>
                          <el-row class="info-class">
                              <el-col :span="6">反馈时间：</el-col>
                              <el-col :span="18">{{detailData.createdAt | formatTime}}</el-col>
                          </el-row>
                      <div style="text-align: center;margin-top: 10px">
                          <el-button :size="$size" type="plain" @click="detailClose">返回</el-button>
                      </div>
                  </el-dialog>
              </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { ReportReasonType, ReportObjType } from '@/util/publicParams'
export default {
  name: "person",
  props: {
      activeName: ''
  },
  data() {
    return {
      searchForm: {date:["", ""]},
      tableData: [],
      pageData: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      loading: false,
      detailData: [],
      detailDialog: false,
      ids: []
    };
  },
  created() {
    //   this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
      this.getReportList();
  },
  watch: {
      activeName(val) {
          if(val === 'report') {
              this.getReportList();
          }
          console.log('report')
      }
  },
//   computed: {
//       ...mapState({
//         searchData: state => state.operatePlatform.goodsCommit
//       })
//   },
  methods: {
      search() {
          this.pageData.currentPage = 1;
          this.getReportList();
      },
    //   ...mapMutations({
    //     setGoodsCommit: "operatePlatform/setGoodsCommit"
    //   }),
    resetForm() {
        this.searchForm = {date: ["", ""]};
        this.pageData.currentPage = 1;
        this.getReportList();
    },
    getPlatform(val) { // 反馈来源
        switch(val) {
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
    getObjType(val) { // 举报类型
        let name;
        for(let item of ReportObjType) {
            if(item.key === val) {
                name = item.label
                console.log(name)
                break;
            }
        }
        return name
    },
    getReason(val) { // 意见
        let name = '';
        for(let reason of val) {
            for(let item of ReportReasonType) {
                if(item.key === reason) {
                    name = item.label + name
                    break;
                }
            }
        }
        return name
    },
    getReportList() { // 举报列表
        let stime = new Date(this.searchForm.date[0])
        let etime = new Date(this.searchForm.date[1])
        let start = stime.getTime();
        let end = etime.getTime();
      let paramList = {
        limit: this.pageData.pageSize,
        page: this.pageData.currentPage,
        uid: this.searchForm.uid,
        userName: this.searchForm.userName,
        phone: this.searchForm.phone,
        rUid: this.searchForm.rUid,
        rUserName: this.searchForm.rUserName,
        rPhone: this.searchForm.rPhone,
        startTime: start,
        endTime: end
      };
      this.loading = true;
    //   this.setGoodsCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
      this.$http.get(this.$api.reportPage, paramList, true)
            .then(res => {
            console.log(res)
            this.loading = false;
            this.tableData = res.data
            this.pageData.total = res.total
            })
            .catch(err => {
            this.loading = false;
            this.$message.error(err.message);
            });
    },
    changePage(page, pageSize) { // 分页
      [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
      this.getReportList();
    },
    handleDetail(row, id) { // 举报详情
        this.$set(row, 'loading', true);
        this.$http.get(this.$api.reportDetail, {id: id}, true)
        .then(res => {
            this.$set(row, 'loading', false);
            this.detailDialog = true;
            this.detailData = res;
            console.log(res)
        })
        .catch(err => {
            this.$set(row, 'loading', false);
            this.$message.error(err.message)
        })
    },
    detailClose() {
        this.detailDialog = false;
    },
   goodsDelete(id, name) { // 删除
        this.$confirm(`确定删除该举报信息？`, "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            this.$http.get(this.$api.reportBatchDelete, {ids: [id]}, true)
            .then(res => {
                this.$message.success("删除成功")
                this.getReportList();
            })
            .catch(err => {
                this.$message.error(err.message)
               this.getReportList();
            })
        })
        .catch(()=> {
            this.$message.info("已取消删除")
        })
    },
    selectionChange(selection) { //批量选择的值
        this.ids =[];
        console.log(selection)
        for(let item of selection) {
            this.ids.push(item.id)
        }
    },
    batchDelete() { // 批量删除
        this.$confirm(`确定删除这些举报信息？`, "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            this.$http.get(this.$api.reportBatchDelete, {ids: this.ids}, true)
            .then(res => {
                this.$message.success("删除成功")
                this.getReportList();
            })
            .catch(err => {
                this.$message.error(err.message)
                this.getReportList();
            })
        })
        .catch(()=> {
            this.$message.info("已取消删除")
        })
    },
    handleReport(val) {
        this.$confirm("确认受理次用户举报？", '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            this.$http.post(this.$api.reportAccept, {id: val.id}, true)
            .then(res => {
                this.$message.success("受理成功")
                this.getReportList();
            })
            .catch(err => {
                this.$message.error(err.message);
            })
        })
        .catch(() => {
            this.$message.info("已取消")
        })
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
