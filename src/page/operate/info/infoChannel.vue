<template>
    <div class="xk-container">
        <div class="xk-radius">
       <div class="xk-title">
           <div class="vus-title">
                        <span></span>短信渠道列表
           </div>
           <div class="vus-btn">
                <el-button type="primary" :size="$size" @click="addChannel()" v-permission="'infoChannelAdd'">新增渠道</el-button>
            </div>
            <div class="vus-bottom"></div>
       </div>
       <el-table :data="tableData" v-loading="loading">
            <el-table-column type="index" label="序号" width="55px"></el-table-column>
            <el-table-column label="渠道" prop="channel">
                <template slot-scope="scope">
                    {{getChannel(scope.row.channel)}}
                </template>
            </el-table-column>
            <el-table-column label="域名" prop="domain"></el-table-column>
            <el-table-column label="优先级" prop="index"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span :class="statusColor(scope.row.status)">{{scope.row.status === "active" ? "已启用" : "已禁用"}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" :loading="scope.row.loadingInfo" :size="$size" @click="channelDetail(scope.row)" v-permission="'infoChannelDetail'">查看详情</el-button>
                    <el-button type="text" :size="$size" @click="addChannel(scope.row)" :loading="scope.row.loading" v-permission="'infoChannelEdit'">修改</el-button>
                    <el-button v-if="scope.row.status ==='active'" type="text" :size="$size" @click="checkStatus(scope.row.id, scope.row.status)"
                    v-permission="'infoChannelHandle'">禁用</el-button>
                    <el-button v-else type="text" :size="$size" @click="checkStatus(scope.row.id, scope.row.status)"
                    v-permission="'infoChannelHandle'">启用</el-button>
                </template>
            </el-table-column>
       </el-table>
       <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="pageChange"></pagination>
       <add-info-channel :addDialog.sync="addDialog" :formData="editData" @success="getChannelList"></add-info-channel>
       <info-channel-detail :detailDialog.sync="detailDialog" :detailInfo="detailData"></info-channel-detail>
   </div>
</div>
</template>
    
<script>
import AddInfoChannel from "../../../components/operate/AddInfoChannel";
import InfoChannelDetail from "../../../components/operate/InfoChannelDetail";

export default {
  data() {
    return {
      tableData: [],
      detailData: {},
      pageData: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      detailDialog: false,
      addDialog: false,
      loading: false,
      detailId: "",
      ids: [],
      editData: {}
    };
  },
  created() {
    this.getChannelList();
  },
  methods: {
    getChannel(val) {
      switch (val) {
        case "ALIYUN":
          return "阿里云短信";
        default:
          return "腾讯云短信";
      }
    },
    statusColor(val) {
      switch (val) {
        case "active":
          return "success";
        default:
          return "danger";
      }
    },
    channelDetail(row) {
      this.$set(row, "loadingInfo", true);
      this.$http
        .get(this.$api.smsChannelDetail, { id: row.id }, true)
        .then(res => {
          [this.detailData, this.detailDialog] = [res, true];
          this.$set(row, "loadingInfo", false);
        })
        .catch(err => {
          this.$set(row, "loadingInfo", false);
          this.$message.error(err.message);
        });
    },
    addChannel(val) {
      // 新增/编辑弹框
      this.addDialog = true;
      if (!val) {
        this.editData = {};
        this.addDialog = true;
      } else {
        this.$set(val, "loading", true);
        this.$http
          .get(this.$api.smsChannelDetail, { id: val.id }, true)
          .then(res => {
            this.editData = res;
            this.$set(val, "loading", false);
            this.addDialog = true;
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      }
    },
    getChannelList() {
      // 渠道列表
      let paramList = {
        limit: this.pageData.pageSize,
        page: this.pageData.currentPage
      };
      this.loading = true;
      this.$http
        .get(this.$api.smsChannelPage, paramList, true)
        .then(res => {
          this.loading = false;
          console.log(res);
          this.tableData = res.data;
          this.pageData.total = res.total ? res.total : this.pageData.total;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.message);
        });
    },
    pageChange(page, pageSize) {
      [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
      this.getChannelList();
    },
    checkStatus(id, status) {
      // 启用禁用
      if (status === "active") {
        this.$http
          .get(this.$api.smsChannelDisabled, { id: id }, true)
          .then(res => {
            this.$message.success("禁用成功");
            this.getChannelList();
          })
          .catch(err => {
            this.$message.error(err.message);
            this.getChannelList();
          });
      } else {
        this.$http
          .get(this.$api.smsChannelEnabled, { id: id }, true)
          .then(res => {
            this.$message.success("启用成功");
            this.getChannelList();
          })
          .catch(err => {
            this.$message.error(err.message);
            this.getChannelList();
          });
      }
    }
    // selectionChange(val) { // 删除的集合
    //     this.ids = [];
    //     for(let item of val) {
    //       this.ids.push(item.id);
    //     }
    // },
    // handleDelete() {
    //     if(this.ids.length === 0) {
    //         this.$confirm("请选择要删除的选项", "提示", {
    //             confirmButtonText: '确定',
    //             cancelButtonText: '取消',
    //             type: 'warning'
    //         })
    //         .then(()=>{})
    //         .catch(()=>{})
    //     } else {
    //         this.$confirm("确认删除这些选项吗？", "提示", {
    //             confirmButtonText: '确定',
    //             cancelButtonText: '取消',
    //             type: 'warning'
    //         })
    //         .then(() => {
    //             this.$http.get(this.$api.smsChannelBatchDelete, {ids: this.ids}, true)
    //             .then(res => {
    //                 this.$message.success("删除成功")
    //                 this.getChannelList();
    //             })
    //             .catch(err => {
    //                 this.$message.error(err.message)
    //                 this.getChannelList();
    //             })
    //         })
    //         .catch(()=> {
    //             this.$message.info("已取消删除")
    //         })
    //     }
    // }
  },
  components: {
    AddInfoChannel,
    InfoChannelDetail
  }
};
</script>

<style lang="scss" scoped>
.danger {
  color: #f56c6c;
}
.warning {
  color: #e6a23c;
}
.success {
  color: #67c23a;
}
</style>
