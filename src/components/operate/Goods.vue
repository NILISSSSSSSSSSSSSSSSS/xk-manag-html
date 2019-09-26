<template>
    <div class="person">
        <div class="xk-radius">
                  <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>商品
                    </div>
                      <div class="vus-btn">
                          <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                          <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                      </div>
                      <div class="vus-bottom"></div>
                  </div>
                  <el-form label-width="120px" :model="searchForm" class="xk-search">
                      <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="用户UID：" >
                                <el-input :size="$size" v-model="searchForm.uid" placeholder="请输入用户UID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="用户名称：" >
                                <el-input :size="$size" v-model="searchForm.userName" placeholder="请输入用户名称"></el-input>
                            </el-form-item>
                        </el-col>
                          <el-col :span="8">
                              <el-form-item label="手机号码：">
                                  <el-input :size="$size" v-model="searchForm.userPhone" placeholder="请输入手机号"></el-input>
                              </el-form-item>
                          </el-col>
                      </el-row>
                      <el-row :gutter="10">
                          <el-col :span="8">
                            <el-form-item label="用户ID：" >
                                <el-input :size="$size" v-model="searchForm.xkUserId" placeholder="请输入用户ID"></el-input>
                            </el-form-item>
                        </el-col>
                          <el-col :span="8">
                            <el-form-item label="商品ID：" >
                                <el-input :size="$size" v-model="searchForm.goodsId" placeholder="请输入商品ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品名称：" >
                                <el-input :size="$size" v-model="searchForm.goodsName" placeholder="请输入用户ID"></el-input>
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
                          <!--<el-button type="primary" :size="$size" @click="batchDelete" v-permission="'feedbackDelete'">批量删除</el-button>-->
                      </div>
                      <div class="vus-bottom"></div>
                  </div>
                  <el-table :data="tableData" width="100%" stripe class="margintop20" v-loading="loading" @selection-change="selectionChange">
                      <!--<el-table-column type="selection" width="55px"></el-table-column>-->
                      <el-table-column  label="商品ID" prop="goodsId"></el-table-column>
                      <el-table-column  label="商品名称" prop="goodsName"></el-table-column>
                      <el-table-column  label="用户UID">
                          <template slot-scope="scope">
                              {{scope.row.uid ? scope.row.uid : '/'}}
                          </template>
                      </el-table-column>
                      <el-table-column  label="用户ID" prop="userId"></el-table-column>
                      <el-table-column  label="用户名称" prop="userName"></el-table-column>
                      <el-table-column  label="手机号码" prop="userPhone"></el-table-column>
                      <el-table-column  label="反馈时间">
                          <template slot-scope="scope">
                              {{scope.row.createdAt | formatTime}}
                          </template>
                      </el-table-column>
                      <el-table-column  label="反馈来源" prop="app">
                          <template slot-scope="scope">
                              {{getPlatform(scope.row.app)}}
                          </template>
                      </el-table-column>
                      <el-table-column  label="意见">
                          <template slot-scope="scope">
                              <span class="moreHidden">{{scope.row.content}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column  label="操作"  fixed="right">
                          <template slot-scope="scope">
                              <el-button :loading="scope.row.loading" type="text" :size="$size" @click="handleDetail(scope.row, scope.row.id)">查看</el-button>
                              <!-- <el-button type="text" :size="$size" @click="goodsDelete(scope.row.id, scope.row.goodsName)" v-permission="'feedbackDeleteGoods'">删除</el-button> -->
                          </template>
                      </el-table-column>
                  </el-table>
                  <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
                  <el-dialog title="商品反馈详情" width="800px" :visible.sync="detailDialog" :before-close="detailClose">
                        <el-row type="flex" justify="space-between" :gutter="20" class="paddtop20">
                                <el-col>商品名称： {{detailData.goodsName}}</el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between" :gutter="20" class="paddtop20">
                                <el-col>商品ID：{{detailData.goodsId}}</el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between" :gutter="20" class="paddtop20">
                            <el-col>用户名称： {{detailData.userName}}</el-col>
                            <el-col>用户ID: {{detailData.userId}}</el-col>
                            <el-col>手机号码： {{detailData.userPhone}}</el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between" :gutter="20" class="paddtop20">
                            <el-col>用户UID: {{detailData.uid ? detailData.uid : '/'}}</el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between" :gutter="20" class="paddtop20">
                            <el-col>反馈内容： {{detailData.content}}</el-col>
                        </el-row>
                        <el-row :gutter="20" class="paddtop20">
                            <el-col :span="4">反馈图片/视频：</el-col>
                            <el-col :span="20">
                                <span v-if="!detailData.videos || detailData.videos.length == 0">无</span>
                                <span v-else>
                                    <template v-for="item in detailData.videos">
                                        <template v-if="item.pic || item.video">
                                            <image-list :key="item" :url="item.pic" :type="item.video? 'video': 'image'" :videoUrl="item.video"></image-list>
                                        </template>
                                    </template>
                                </span>
                            </el-col>
                        </el-row>
                        <el-row type="flex" justify="space-between" :gutter="20" class="paddtop20">
                            <el-col>反馈时间： {{detailData.createdAt | formatTime}}</el-col>
                        </el-row>
                        <div class="content">
                            <el-button type="primary" :size="$size" @click="detailClose">返回</el-button>
                        </div>
                  </el-dialog>
              </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import ImageList from '@/components/common/ImageList.vue'
export default {
  name: "person",
  components: {
      ImageList
  },
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
      this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
      this.getGoodsList();
  },
  watch: {
      activeName(val) {
          if(val === 'goods') {
              this.getGoodsList();
          }
      }
  },
  computed: {
      ...mapState({
        searchData: state => state.operatePlatform.goodsCommit
      })
  },
  methods: {
      ...mapMutations({
        setGoodsCommit: "operatePlatform/setGoodsCommit"
      }),
    resetForm() {
        this.setGoodsCommit(null);
        this.searchForm = {date: ["", ""]};
        this.pageData.currentPage = 1;
        this.getGoodsList();
    },
    getPlatform(val) {
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
    search() {
        // if(!/^\d*$/.test(this.searchForm.uid)) {
        //     this.$message.warning("用户UID必须为数字")
        //     return
        // }
        this.pageData.currentPage = 1;
        this.getGoodsList();
    },
    getGoodsList() { // 商品反馈列表
        let stime = new Date(this.searchForm.date[0])
        let etime = new Date(this.searchForm.date[1])
        let start = stime.getTime();
        let end = etime.getTime();
      let paramList = {
        limit: this.pageData.pageSize,
        page: this.pageData.currentPage,
        uid: this.searchForm.uid,
        userName: this.searchForm.userName,
        userPhone: this.searchForm.userPhone,
        goodsId: this.searchForm.goodsId,
        goodsName: this.searchForm.goodsName,
        startTime: start/100,
        endTime: end/100,
        xkUserId: this.searchForm.xkUserId
      };
      this.loading = true;
      this.setGoodsCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
      this.$http.get(this.$api.goodsFeedbackPage, paramList, true)
            .then(res => {
            console.log(res)
            this.loading = false;
            this.tableData = res.data
            this.pageData.total = res.total ? res.total : this.pageData.total
            })
            .catch(err => {
            this.loading = false;
            this.$message.error(err.message);
            });
    },
    changePage(page, pageSize) { // 分页
      [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
      this.getGoodsList();
    },
    handleDetail(row, id) { // 商品反馈详情
        this.$set(row, 'loading', true);
        this.$http.get(this.$api.goodsFeedbackDetail, {id: id}, true)
        .then(res => {
            this.$set(row, 'loading', false);
            if(res.videos&&Array.isArray(res.videos)) {
                res.videos = res.videos.filter(item=>{
                    return item.pic || item.video
                })
            }
            this.detailData = res;
            this.detailDialog = true;
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
        this.$confirm(`确定删除商品${name}的信息？`, "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            this.$http.get(this.$api.goodsFeedbackDelete, {ids: [id]}, true)
            .then(res => {
                this.$message.success("删除成功")
                this.getGoodsList();
            })
            .catch(err => {
                this.$message.error(err.message)
                this.getGoodsList();
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
        this.$confirm(`确定删除这${this.ids.length}条信息？`, "提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        .then(() => {
            this.$http.get(this.$api.goodsFeedbackDelete, {ids: this.ids}, true)
            .then(res => {
                this.$message.success("删除成功")
                this.getGoodsList();
            })
            .catch(err => {
                this.$message.error(err.message)
                this.getGoodsList();
            })
        })
        .catch(()=> {
            this.$message.info("已取消删除")
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
.moreHidden {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
