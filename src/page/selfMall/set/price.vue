<template>
    <div class="xk-container">
        <div class="selfmall-set-price">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn">
                        <el-button v-permission="'priceModalAdd'" type="primary" size="small" @click="newTemplate">新建运费模板</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table
                    v-loading="tableLoading"
                    ref="multipleTable"
                    :data="tableData"
                    width="100%">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div v-for="(item,index) in props.row.destFees" :key="index" >
                                <el-form label-position="right" class="demo-table-expand" label-width="100px" v-if="index!==0">
                                    <el-row>
                                        <el-col :span="24">
                                            <el-form-item label="运送到：" style="text-align:left;margin-bottom: 0">
                                                <span>{{ item.showName }}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="首件：" style="text-align:left">
                                                <span>{{ props.row.valuateType === EnumValueType[0]? item.defaultNum: $math.divide(item.defaultNum, 1000) }}{{ props.row.valuateType === EnumValueType[0]?" 件": " KG"}}</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="运费：" style="text-align:left">
                                                <span>{{ $math.divide(item.defaultFee, 100) }}元</span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="续件：" style="text-align:left">
                                                <span>
                                                    {{ props.row.valuateType === EnumValueType[0]? item.increNum: $math.divide(item.increNum, 1000) }}
                                                    {{ props.row.valuateType === EnumValueType[0]?" 件": " KG"}}
                                                </span>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="运费：" style="text-align:left">
                                                <span>{{ $math.divide(item.increFee, 100) }}元</span>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <div style="width:100%;height: 1px;background: #ccc" ></div>
                                </el-form>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="模板名称">
                    </el-table-column>
                    <el-table-column
                        label="运送到">
                        <template slot-scope="scope">
                            {{ scope.row.destFees[0].showName }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="首件/KG">
                        <template slot-scope="scope">
                            {{ scope.row.valuateType === EnumValueType[0]? scope.row.destFees[0].defaultNum: $math.divide(scope.row.destFees[0].defaultNum, 1000) }}
                            {{ scope.row.valuateType == EnumValueType[0]?" 件": " KG" }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="运费">
                        <template slot-scope="scope">
                            {{ $math.divide(scope.row.destFees[0].defaultFee, 100)+'元' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="续件/KG">
                        <template slot-scope="scope">
                            {{ scope.row.valuateType === EnumValueType[0]? scope.row.destFees[0].increNum : $math.divide(scope.row.destFees[0].increNum, 1000) }}
                            {{ scope.row.valuateType === EnumValueType[0]?" 件": " KG" }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="运费">
                        <template slot-scope="scope">
                            {{ $math.divide(scope.row.destFees[0].increFee, 100)+'元' }}
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        width="150"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button v-permission="'priceModalModify'" :loading="scope.row.loading" :size="$size" type="text" @click="editData(scope.row.id,scope.row)">编辑</el-button>
                            <el-button v-permission="'priceModalDelete'" :size="$size" type="text" @click="deleteData(scope.row.id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :total="page.total" :pageSize="page.limit" :currentPage="page.page" @change="changePage"></pagination>
            </div>
            <trans-price :templateData="templateData" :visibleDialog.sync="templateVisible" v-if="templateVisible" @update="updateTable"></trans-price>
        </div>
    </div>
</template>
<script>
    const EnumValueType = ["BY_NUMBER", "BY_WEIGHT"]
    import TransPrice from '@/components/TransPrice.vue'
    
    export default {
        components: {
            TransPrice
        },
        data() {
            return {
                templateVisible: false,
                EnumValueType: EnumValueType,
                tableData: [],
                originData: '',
                page: {
                    limit: 10,
                    page: 1,
                    total: 0
                },
                templateData: '',
                tableLoading: false
            }
        },
        created() {
            this.getPostfeeQPage();
        },
        methods: {
            updateTable() {
                this.getPostfeeQPage();
            },
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getPostfeeQPage();
            },
            //获取运费模板列表
            getPostfeeQPage() {
                this.tableLoading = true;
                this.$http.get(this.$api.postfeeQPage, this.page, true).then(res => {
                    this.tableLoading = false;
                    console.log(res.data)
                    // this.tableData = this.handleTableData(res.data);
                    this.tableData = res.data;
                    this.originData = res.data;
                    this.page.total = res.total
                }).catch(err=> {
                    this.$message.error(err.message)
                    this.tableLoading = false;
                })
            },
            //处理表格数据结构
            handleTableData(value) {
                let result = [];
                for(let i =0, len = value.length; i< len ;i++) {
                    for(let j =0, lenJ = value[i].destFees.length; j< lenJ; j++){
                        let obj = {
                            id: value[i].id,   //模板ID
                            name: value[i].name,   //模板名称
                            defaultFee: this.$math.divide(value[i].destFees[j].defaultFee, 100),   //首价
                            defaultNum: value[i].destFees[j].defaultNum,   //首数
                            increFee: this.$math.divide(value[i].destFees[j].increFee, 100),  //增加费用
                            increNum: value[i].destFees[j].increNum,  //增加数量
                            showName: value[i].destFees[j].showName,  //运送到
                            valuateType: value[i].valuateType
                        }
                        result.push(obj)
                    }
                }
                return result;
            },
            //新建运费模板
            newTemplate() {
                this.templateData = "";
                this.templateVisible = true
            },
            //编辑
            editData(id,row) {
                this.$set(row,"loading",true);
                this.$http.get(this.$api.postfeeDetail, {id: id}, true).then(res=> {
                    this.$set(row,"loading",false);
                    this.templateData = res
                    this.templateVisible=true
                }).catch(err=>{
                    this.$message.error("获取模板失败")
                    this.$set(row,"loading",false);
                })
            },
            //删除
            deleteData(id) {
                this.$confirm('是否删除当前运费模板，删除后不可恢复？','提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.$http.post(this.$api.postfeeDelete, {id, id}, true).then(res=>{
                        this.$message.success('删除成功');
                        this.getPostfeeQPage();
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                    })
                }).catch(()=>{});
            },
            formatterDefault(row) {
                return row.defaultNum + (row.valuateType === EnumValueType[0]?" 件": " KG");
            }
        }
    }
</script>
<style lang="scss" src="./price.scss"></style>
