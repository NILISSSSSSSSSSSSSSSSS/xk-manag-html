<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>海淘实名搜索
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form label-width="140px" :model="searchForm" class="xk-search">
            <el-row :gutter="10">
                <el-col :span="6">
                    <el-form-item label="订购人电话：" >
                        <el-input :size="$size" v-model="searchForm.code"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="收件人电话：" >
                        <el-input :size="$size" v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="收件人姓名：" >
                      <el-input :size="$size" v-model="searchForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="收件人身份证号：" >
                        <el-input :size="$size" v-model="searchForm.phone"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="审核状态：" label-width="150px">
                       <el-select v-model="searchForm.status" :size="$size">
                           <el-option v-for="(item, index) in authStatus" :key="index" :label="item.label" :value="item.value"></el-option>
                       </el-select>
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
                    <el-button type="primary" :size="$size" @click="search">批量删除</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" stripe>
                <el-table-column label="订购人电话" prop=""></el-table-column>
                <el-table-column label="收件人姓名" prop="name"></el-table-column>
                <el-table-column label="收件人电话" prop=""></el-table-column>
                <el-table-column label="收件人身份证号" prop=""></el-table-column>
                <el-table-column label="身份证照片正面" prop="img1">
                    <template slot-scope="scope">
                       <img style="max-height: 30px" :src="scope.row.img1" alt="" @click="$viewImage(scope.row.img1)">
                    </template>
                </el-table-column>
                <el-table-column label="身份证照片反面" prop=""></el-table-column>
                <el-table-column label="审核状态" prop=""></el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="text" @click="openDetail(scope.row)">查看</el-button>
                        <el-button :size="$size" type="text" @click="openDetail(scope.row)">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <pagination :currentPage="pageData.currentPage" :pageSize="pageData.pageSize" :total="pageData.total" @change="changePage"></pagination>
        </div>
        <el-dialog width="400px" :visible.sync="dialogVisible" :before-close="handleClose">
            <div class="row-center">
                <div>已通过</div>
            </div>
            <div class="row-title row-content">收件人实名信息</div>
            <div class="row-content">
                收件人信息： 迪丽热巴
            </div>
            <div class="row-content">
                收件人电话： 1788814188
            </div>
            <div class="row-content">
                收件人身份证号： 25465546546451321354465
            </div>
            <div class="row-content">
                收件人身份证照片:
            </div>
             <div class="row-content">
                <el-row>正面</el-row>
                <el-row><img alt="" class="img-size" /></el-row>
            </div>
            <div class="row-content">
                <el-row>反面</el-row>
                <el-row><img alt="" class="img-size" /></el-row>
            </div>
            <div class="row-content">
                <span>审核：</span>
                <el-radio-group v-model="authValue">
                    <el-radio label="success">通过</el-radio>
                    <el-radio label="failed">不通过</el-radio>
                </el-radio-group>
            </div>
            <div style="margin-top: 30px;text-align: center">
                <el-button :size="$size" type="primary" @click="handleClose">确定</el-button>
                <el-button :size="$size" type="plain" @click="handleClose">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'haitaoAuth',
    data() {
        return {
            searchForm: {},
            tableData: [
                {
                    name: 'hahaha',
                    img1: 'https://gc.xksquare.com/1543481868662'
                }
            ],
            pageData: {
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            authStatus: [
                {label: '全部', value: 0},
                {label: '待审核', value: 1},
                {label: '已通过', value: 2},
                {label: '未通过', value: 3},
            ],
            dialogVisible: false,
            detail: {},
            authValue: ''
        }
    },
    methods: {
        search() {

        },
        resetForm() {
            this.searchForm = {}
        },
        changePage(page,size) {
            this.pageData.pageSize = size;
            this.pageData.currentPage = page;
      },
      openDetail(val) {
          this.dialogVisible = true
          this.detail = val ? val : {}
      },
      handleClose() {
          this.dialogVisible = false
      }
    },
}
</script>

<style lang="scss" scoped>
    .row-content {
        margin: 25px 0 25px 25px;
    }
    .row-center {
        text-align: center;
    }
    .row-title {
        font-size: 16px;
        font-weight: 700;
    }
    .img-size {
        width: 200px;
    }
</style>