<template>
    <div>
         <div class="xk-title">
                <div class='vus-title'>
                 <span></span>
                        列表
                </div>
                 <div class='vus-btn'>
                    <el-button type='primary' :size='$size' @click="addUserLevel" v-permission="'userLevelAdd'">新增用户等级</el-button>
                </div>
           </div>
        <div class='vus-bottom'></div>
        <el-table :data="tableData" width="100%" stripe v-loading="loading">
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column label="等级名称" prop="name"></el-table-column>
            <el-table-column label="等级图标">
                <template slot-scope="scope">
                    <img :src="scope.row.icon" style="height: 45px"/>
                </template>
            </el-table-column>
            <el-table-column label="等级积分设置">
                 <template slot-scope="scope">
                    {{scope.row.minScore}} -- {{scope.row.maxScore}}
                </template>
            </el-table-column>
            <el-table-column label="等级颜色" prop="color"></el-table-column>
            <el-table-column label="等级描述" prop="remark"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button :size="$size" type="primary" @click="handleEdit(scope.row)" :loading="scope.row.loading" v-permission="'userLevelEdit'">编辑</el-button>
                    <!-- <el-button :size="$size" type="danger">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        <level-set :dialogVisible.sync="setDialog" :detailData="detailData" @success="getUserlevelList"></level-set>
    </div>
</template>

<script>
import LevelSet from "@/components/operate/LevelSet";
export default {
    name: 'userLevelList',
    props: {
        name: {
            type: String,
            default: 'first'
        }
    },
    data() {
        return {
            tableData: [],
            loading: false,
            setDialog: false,
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            detailData: {}
        }
    },
    watch: {
        name(val) {
            if(val === 'first') {
                this.getUserlevelList();
            }
        }
    },
    created() {
        this.getUserlevelList();
    },
    methods: {
        handleEdit(val) {
           this.$set(val, "loading", true)
           this.$http.get(this.$api.xkUserLevelDetail, {id: val.id}, true)
           .then(res => {
               this.$set(val, "loading", false);
               this.detailData = res
               this.setDialog = true
           })
           .catch(err => {
               this.$set(val, "loading", false);
               this.$message.error(err.message)
           })
        },
        addUserLevel() {
            this.detailData = [];
            this.setDialog = true;
        },
        getUserlevelList() {
            let paramList = {
                page: this.pageData.currentPage,
                limit: this.pageData.pageSize
            }
            this.loading = true;
            this.$http.get(this.$api.xkUserLevelPage, paramList, true)
            .then(res => {
                this.loading = false;
                console.log(res)
                this.tableData = res .data;
                this.pageData.total = res.total ? res.total : this.pageData.total
            })
            .catch(err => {
                this.loading = false;
                this.$message.error(err.message)
            })
        },
        changePage(page, pageSize) { // 分页
          [this.pageData.currentPage, this.pageData.pageSize] = [page, pageSize];
          this.getUserlevelList();
        }
    },
    components: {
        LevelSet
    }
}
</script>

<style>

</style>
