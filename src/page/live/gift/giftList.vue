<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class='xk-title'>
            <div class="vus-title">
                <span></span>所有礼物
            </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="searchList">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
             <el-form label-width="120px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="礼物ID：" >
                        <el-input :size="$size" v-model="searchForm.id"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="礼物名称：" >
                        <el-input :size="$size" v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="连送：" >
                      <el-select v-model="searchForm.allowContinuity" :size="$size" style="width: 100%">
                        <el-option v-for="(item, index) in allowType" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                  <el-form-item label="状态：">
                      <el-select v-model="searchForm.status" :size="$size" style="width: 100%">
                        <el-option v-for="(item, index) in statusType" :key="index" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                  </el-form-item>
              </el-col>
            </el-row>
        </el-form>
        </div>
        <div class="xk-radius margintop20">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="handleAdd" v-permission="'giftListAdd'">新增</el-button>
                    <el-button type="danger" :size="$size" @click="batchDelete" v-permission="'giftListDelete'">批量删除</el-button>
                </div>
            <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" width="100%" stripe  v-loading="loading" @selection-change="handleSelection">
                 <el-table-column  type="selection"></el-table-column>
                 <el-table-column  label="序号" prop="index"></el-table-column>
                 <el-table-column  label="礼物ID" prop="id"></el-table-column>
                 <el-table-column  label="礼物名称" prop="name"></el-table-column>
                 <el-table-column  label="价格">
                     <template slot-scope="scope">
                         {{ $math.divide(scope.row.price, 100) }}
                     </template>
                 </el-table-column>
                 <el-table-column  label="礼物类型" prop="giftSize">
                     <template slot-scope="scope">
                         {{getGiftType(scope.row.giftSize)}}
                     </template>
                 </el-table-column>
                 <el-table-column  label="动画key" prop="giftKey"></el-table-column>
                 <el-table-column  label="小图">
                     <template slot-scope="scope">
                         <img  :src="scope.row.smallPicture" class="imgSize"/>
                     </template>
                 </el-table-column>
                 <el-table-column  label="连送">
                     <template slot-scope="scope">
                         {{scope.row.allowContinuity == 1 ? "是": "否"}}
                     </template>
                 </el-table-column>
                 <el-table-column  label="连送时间" prop="continuityTime"></el-table-column>
                 <el-table-column  label="送出确认">
                      <template slot-scope="scope">
                         {{scope.row.confirm == 1 ? "是": "否"}}
                     </template>
                 </el-table-column>
                 <el-table-column  label="启用">
                     <template slot-scope="scope">
                         <el-switch v-model="status[scope.$index]" @change="changeStatus(scope.row.id, $event)"></el-switch>
                     </template>
                 </el-table-column>
                 <!-- <el-table-column  label="移动" prop="category">
                     <template slot-scope="scope">
                         <el-button :size="$size" :disbled="$index === 0" type="primary">
                             <i class="iconfont icon-shang"></i>
                         </el-button>
                         <el-button :size="$size" type="primary">
                              <i class="iconfont icon-xia"></i>
                         </el-button>
                     </template>
                 </el-table-column> -->
                 <el-table-column  label="操作" width="200">
                     <template slot-scope="scope">
                         <el-button type="text" :size="$size" @click="handleDetail(scope.row)" :loading="scope.row.detailLoading"
                         v-permission="'giftListDetail'">查看详情</el-button>
                         <el-button type="text" :size="$size" @click="handleEdit(scope.row)" :loading="scope.row.loading"
                         v-permission="'giftListEdit'">修改</el-button>
                         <el-button type="text" :size="$size" @click="handleDelete(scope.row.id, scope.row.name)"
                         v-permission="'giftListDelete'">删除</el-button>
                     </template>
                 </el-table-column>
            </el-table>
            <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
            <add-gift :dialogVisible.sync="addDialog" :title="title" :detailData="detailData" @success="getGiftList"></add-gift>
        </div>
    </div>
</template>

<script>
import AddGift from "@/components/live/AddGift"
import { mapMutations, mapState } from 'vuex'
export default {
    name: 'giftList',
    data() {
        return {
            searchForm: {},
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            loading: false,
            allowType: [
                {
                    label: '全部',
                    value: ''
                }, {
                    label: '是',
                    value: 1
                }, {
                    label: "否",
                    value: 0
                }
            ],
            statusType: [
                {
                    label: '全部',
                    value: ''
                }, {
                    label: '已启用',
                    value: 'active'
                }, {
                    label: '已禁用',
                    value: 'disabled'
                }
            ],
            giftType: [
                {label: '大', value: 1},
                {label: '中', value: 2},
                {label: '小', value: 3},
            ],
            tableData: [],
            status: [],
            addDialog: false,
            title: '',
            detailData: {},
            selectionData: [],
            ids: []
        }
    },
    created() {
        this.searchData ? (this.pageData = this.searchData.pageData, this.searchForm = this.searchData.searchForm) : null;
        this.getGiftList();
    },
    computed: {
        ...mapState({
          searchData: state => state.liveGift.giftCommit
      })
    },
    methods: {
        ...mapMutations({
            setGiftCommit: "liveGift/setGiftCommit"
        }),
        getGiftType(val) {
            let name = ""
            for(let item of this.giftType) {
                if(val == item.value) {
                    name = item.label
                    break;
                }
            }
            return name;
        },
        searchList() {
            this.pageData.currentPage = 1;
            this.getGiftList();
        },
        resetForm() {
            this.setGiftCommit(null);
            this.searchForm = {
                status: '',
                allowContinuity: ''
            }
            this.pageData.currentPage = 1;
            this.getGiftList();
        },
        changeStatus(id, val) {
            if(val) { // 启用礼物
                console.log(id)
                this.$http.get(this.$api.giftEnable, {id: id}, true)
                .then(res => {
                    this.$message.success("启用成功");
                    this.getGiftList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                    this.getGiftList();
                })
            } else { // 禁用礼物
                console.log(id)
                this.$http.get(this.$api.giftDisable, {id: id}, true)
                .then(res => {
                    this.$message.warning("禁用成功");
                    this.getGiftList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                    this.getGiftList();
                })
            }
        },
        handleSelection(selection) { // 获取选择项
            this.selectionData = selection
            console.log(this.selectionData)
      },
        batchDelete() { // 批量删除
            this.$confirm(`确认删除所选的礼物吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                for(let item of this.selectionData) {
                    this.ids.push(item.id)
                }
                this.$http.get(this.$api.giftDelete, {ids: this.ids}, true)
                .then(res => {
                    this.$message.success("删除成功")
                    this.getGiftList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(()=> {
                this.$message("已取消删除")
            })
        },
        handleDelete(id, name) { // 删除礼物
            this.$confirm(`确认删除名为-${name}-的礼物吗？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                this.$http.get(this.$api.giftDelete, {ids: [id]}, true)
                .then(res => {
                    this.$message.success("删除成功")
                    this.getGiftList();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            })
            .catch(()=> {
                this.$message("已取消删除")
            })
        },
        handleDetail(val) {
            this.title="礼物详情"; // 这里的title要用作为判断，不要随意修改
            this.$set(val, 'detailLoading', true)
            this.$http.get(this.$api.giftDetail, {id: val.id}, true)
            .then(res => {
                this.detailData = res;
                this.detailData.allowSelectNumber = this.detailData.allowSelectNumber == 1 ? true : false;
                this.detailData.allowContinuity = this.detailData.allowContinuity == 1? true: false;
                this.detailData.confirm = this.detailData.confirm == 1? true: false;
                this.detailData.status = this.detailData.status === "active" ? true : false;
                this.detailData.price = this.detailData.price / 100;
                console.log(this.detailData)
                this.$set(val, 'detailLoading', false);
                this.addDialog = true;
            })
            .catch(err => {
                this.$set(val, 'loading', false)
                this.$message.error(err.message)
            })
        },
        handleAdd() {
            this.title = "新增礼物";
            this.detailData =[];
            this.addDialog = true;
        },
        handleEdit(val) {
            this.title = "编辑礼物";
            this.$set(val, 'loading', true)
            this.$http.get(this.$api.giftDetail, {id: val.id}, true)
            .then(res => {
                this.detailData = res;
                this.detailData.allowSelectNumber = this.detailData.allowSelectNumber == 1 ? true : false;
                this.detailData.allowContinuity = this.detailData.allowContinuity == 1? true: false;
                this.detailData.confirm = this.detailData.confirm == 1? true: false;
                this.detailData.status = this.detailData.status === "active" ? true : false;
                this.detailData.price = this.detailData.price / 100;
                console.log(this.detailData)
                this.$set(val, 'loading', false);
                this.addDialog = true;
            })
            .catch(err => {
                this.$set(val, 'loading', false)
                this.$message.error(err.message)
            })
        },
        getGiftList() { // 礼物列表
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                id: this.searchForm.id,
                name: this.searchForm.name,
                allowContinuity: this.searchForm.allowContinuity,
                status: this.searchForm.status
            }
            console.log(paramList)
            this.setGiftCommit(Object.assign({searchForm: this.searchForm}, {pageData: this.pageData}));
            this.loading = true;
            this.$http.get(this.$api.giftPage, paramList, true)
            .then(res => {
                this.tableData = res.data
                console.log(this.tableData)
                this.status = [];
                if(!this.tableData) {
                    return;
                } else {
                    for(let item of this.tableData) {
                        this.status.push(item.status === "active" ? true :false);
                    }
                }
                this.pageData.total = res.total
                this.loading = false;
            })
            .catch(err => {
                this.$message.error(err.message);
                this.loading = false;
            })
        },
        changePage(page, pageSize) {
            [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
            this.getGiftList();
        }
    },
    components: {
        AddGift
    }
}
</script>

<style lang='scss' scpoed>
 @import "./icon/iconfont.css";
.icon-shang, .icon-xia {
    color: #fff;
}
.imgSize {
    height: 50px;
}
</style>
