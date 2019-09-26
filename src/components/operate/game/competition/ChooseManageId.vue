<template>
    <el-dialog
        title="管理群主ID"
        append-to-body
        :visible.sync="chooseManageIdDia"
        top="130px"
        :before-close="handleClose"
        width="1100px"
    >
        <!--搜索头-->
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>会员列表
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="searchList">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <!--搜索栏-->
            <el-form
                :label-position="labelPosition"
                label-width="120px"
                :model="searchForm"
                class="xk-search"
                ref="searchForm"
            >
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-form-item label="用户Id：">
                            <el-input :size="$size" v-model="searchForm.id"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="UID：">
                            <el-input :size="$size" v-model="searchForm.uid"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用户手机号：">
                            <el-input :size="$size" v-model="searchForm.phone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item
                            label="用户所在城市："
                            prop="districtCode"
                            :rules="searchForm.districtCode ? rules.city:rules.notValid"
                        >
                            <province-cascader v-model="searchForm.districtCode"></province-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <!--table-->
        <div class="xk-radius margintop20">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table
                :data="tableData"
                width="100%"
                stripe
                class="margintop20"
                v-loading="loading" >
                <el-table-column label="用户ID" prop="id"></el-table-column>
                <el-table-column label="UID" prop="uid"></el-table-column>
                <el-table-column label="用户名称" prop="nickname"></el-table-column>
                <el-table-column label="所在城市" prop="districtCode">
                    <template slot-scope="scope">{{getPorvinceInfo(scope.row.districtCode)}}</template>
                </el-table-column>
                <el-table-column label="手机号" prop="phone"></el-table-column>
                <el-table-column label="用户等级" prop="level"></el-table-column>
                <el-table-column label="开启橱窗" prop="isShoWindow">
                    <template slot-scope="scope">
                        <span
                            :class="scope.row.isShopWindow == 1 ? 'success' : 'danger'"
                        >{{scope.row.isShopWindow == 1 ? '开启' : '关闭'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="开启长视频" prop="islongVideo">
                    <template slot-scope="scope">
                        <span
                            :class="scope.row.isLongVideo == 1 ? 'success' : 'danger'"
                        >{{scope.row.isLongVideo == 1 ? '开启' : '关闭'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="平台内推" prop>
                    <template slot-scope="scope">{{scope.row.isRecommend == 0 ? '否' : '是'}}</template>
                </el-table-column>
                <el-table-column label="实名认证" prop="authStatus">
                    <template slot-scope="scope">{{getAuthStatus(scope.row.authStatus)}}</template>
                </el-table-column>
                <el-table-column label="推荐人安全码" prop="mrCode"></el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">
                        <!-- <el-button type="text" :size="$size" @click="editOpen(scope.row.id)">编辑</el-button> -->
                        <!-- <el-button type="text" :size="$size" @click="handleDelete(scope.row.id)">删除</el-button> -->
                        <el-button
                            type="text"
                            :size="$size"
                            @click="handChoose(scope.row)"
                        >选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                :currentPage="pageData.currentPage"
                :pageSize="pageData.pageSize"
                :total="pageData.total"
                @change="changePage"
            ></pagination>
           
        </div>
    </el-dialog>
</template>
<script>
import ImageUpload from "@/components/ImageUpload";
import ProvinceCascader from "@/components/ProvinceCascader";
import { getPorvinceInfo } from "@/util/publicMehotds";
import { mapMutations, mapState } from "vuex";
export default {
    name: "管理群主id弹框",
    components: {
        ImageUpload,
        ProvinceCascader
    },
    computed: {
      
    },
    props: {
        chooseManageIdDia: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        chooseManageIdDia(val) {
            if (val) {
                this.searchForm={districtCode: ""}
                this.getMembersList();
            }
        }
    },
    data() {
        let validatePhone = (rule, value, callback) => {
            console.log(value);
            if (!value) {
                return callback(new Error("电话不能为空"));
            } else if (
                !/^((1[3][0-9])|(14[5|7])|(15([0-3]|[5-9]))|(16([6]|[0]|[4]|[7]))|(18[0-9])|(17[0-8])|(19[8,9]))\d{8}$/g.test(
                    value
                )
            ) {
                callback(new Error("格式不对"));
            } else {
                callback();
            }
        };
        let city = (rule, value, callback) => {
            if (value && value.length != 3) {
                return callback(new Error("所在城市需选择到区县一级"));
            } else {
                callback();
            }
        };
        let notValid = (rule, value, callback) => {
            callback();
        };
        return {
            getPorvinceInfo,
            labelPosition: "right",
            searchForm: {
                districtCode: ""
            },
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            tableData: [],
            ids: [], // 勾选的Id集合
            detailData: [],
            editMembers: [],
            btnLoading: false,
            activeLoading: false,
            batchLoading: false,
            loading: false,
            radio: 0,
            rules: {
                phone: [{ validator: validatePhone, trigger: "blur" }],
                city: [{ validator: city, trigger: "blur" }]
            }
        };
    },
    methods: {
        handleClose() {
            this.$emit("update:chooseManageIdDia", false);
        },
     
        searchList() {
            this.pageData.currentPage = 1;
            this.$refs["searchForm"].validate(valid => {
                if (valid) {
                    this.getMembersList();
                } else {
                    return;
                }
            });
        },
        resetForm() {
            this.searchForm = {};
            this.pageData.currentPage = 1;
            this.getMembersList();
        },
     
        getSex(val) {
            switch (val) {
                case "male":
                    return "男";
                case "female":
                    return "女";
                case "unknown":
                    return "保密";
            }
        },
        getAuthStatus(val) {
            // 实名认证状态
            switch (val) {
                case "SUCCESS":
                    return "认证成功";
                case "SUBMIT":
                    return "提交认证";
                case "FAILED":
                    return "认证失败";
                default:
                    return "未实名";
            }
        },
        getTimeStamp(data) {
            // 时间转时间戳
            let date = new Date(data);
            return date.getTime();
        },
   
        editClose() {
            // 关闭编辑框
            this.editDialog = false;
        },
        changePage(page, pageSize) {
            // 分页
            [this.pageData.currentPage, this.pageData.pageSize] = [
                page,
                pageSize
            ];
            this.getMembersList();
        },
      
        getMembersList() {
            // 会员列表
            let paramList = {
                limit: this.pageData.pageSize,
                page: this.pageData.currentPage,
                id: this.searchForm.id,
                uid: this.searchForm.uid,
                phone: this.searchForm.phone,
                districtCode: this.searchForm.districtCode
                    ? this.searchForm.districtCode[2]
                    : this.searchForm.districtCode
            };
            console.log(paramList);
            this.loading = true;
            this.$http
                .get(this.$api.xkUserPage, paramList, true)
                .then(res => {
                    this.tableData = res? res.data: [];
                    this.loading = false;
                    this.pageData.total = res? res.total : 0;
                    console.log(this.tableData);
                })
                .catch(err => {
                    this.loading = false;
                    this.$message.error(err.message);
                });
        },
        handChoose(row){
           this.$emit("tellPar",{id:row.id,nickname:row.nickname});
           this.handleClose();
        }
    }
};
</script>
<style lang="scss" scoped>
.imgSize {
  display: inline-block;
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
.success {
  color: #67C23A;
}
.danger {
  color: #F56C6C;
}
/deep/ .el-dialog{
        max-height: 83vh;overflow: auto;
}
</style>