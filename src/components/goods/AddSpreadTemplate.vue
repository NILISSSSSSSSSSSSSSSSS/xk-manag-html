<template>
<!-- 新增推广模板 -->
    <div class="add-spread-template">
        <el-dialog 
                :visible.sync="visible" 
                :title="spreadForm.id?'更新推广模板': '新增推广模板'" 
                width="800px" 
                :before-close="updateVisible"
                class="goods-info-dialog" 
                :close-on-click-modal="false">
            <el-form :model="spreadForm" label-width="120px" :rules="spreadFormRules" ref="spreadForm">
                <el-form-item label="名称：" prop="name">
                    <el-input 
                        :size="$size" 
                        v-model.trim="spreadForm.name"
                        placeholder="请输入模板名称"></el-input>
                </el-form-item>
                <el-form-item label="关联商品：" prop="goodsId" v-if="add">
                    <el-input v-model="spreadForm.goodsId" style="display:none"></el-input>
                    <el-button :size="$size" type="primary" @click="selectForm={};dialogVisible=true;">{{spreadForm.goodsId?'重新关联':'去关联'}}</el-button>
                    <span v-if="spreadForm.goodsId" style="margin-left:50px">已关联商品：{{ goodsName }}</span>
                </el-form-item>
                <el-form-item label="类型：" prop="templateType">
                    <el-select :size="$size" v-model="spreadForm.templateType" class="full">
                        <el-option v-for="(item,index) in EnumTemplateType" v-if="item.key" :key="index" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效时间：" prop="rangeTime">
                    <el-date-picker 
                        class="full"
                        :editable="false"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="生效时间"
                        end-placeholder="失效时间"
                        :size="$size" 
                        v-model="spreadForm.rangeTime"
                        placeholder="设置模板生效时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="模板描述：" prop="info">
                    <u-e v-model="spreadForm.info"></u-e>
                    <!-- <el-input 
                        type="textarea" 
                        :autosize="{ minRows: 10, maxRows: 10}"
                        v-model="spreadForm.info"
                        resize="none"></el-input> -->
                </el-form-item>
                <el-form-item label="添加H5地址：" prop="h5Url">
                    <el-row>
                        <el-col :span="21">
                            <el-input 
                                :size="$size"
                                placeholder="http://www.xksquare.com"
                                v-model.trim="spreadForm.h5Url"></el-input>
                        </el-col>
                        <el-col :span="3" style="text-align:right">
                            <el-button :size="$size" @click="previewH5(spreadForm.h5Url)">预览</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" type="primary" @click="submitSpreadForm('spreadForm')" :loading="searchLoadingConfirm">确定</el-button>
                <el-button :size="$size" @click="updateVisible()">取消</el-button>
            </div>
        </el-dialog>
        <!-- 关联商品 -->
        <el-dialog v-if="add" title="选择自营商品" width="1000px" :visible.sync="dialogVisible" append-to-body top="50px">
            <el-form :model="selectForm" label-width="100px" class="xk-search">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="商品价格：">
                            <el-row>
                                <el-col :span="11">
                                    <el-input v-model="selectForm.minPrice" :size="$size" placeholder="0"></el-input>
                                </el-col>
                                <el-col :span="2" style="text-align: center">-</el-col>
                                <el-col :span="11">
                                    <el-input v-model="selectForm.maxPrice" :size="$size" placeholder="10"></el-input>
                                </el-col>
                            </el-row>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品名称：">
                            <el-input v-model="selectForm.name" :size="$size" placeholder="请输入商品名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品ID：">
                            <el-input v-model="selectForm.id" :size="$size" placeholder="请输入商品ID"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="商品分类：">
                            <el-cascader
                                    v-model="selectForm.category"
                                    size="small"
                                    :options="options"
                                    :props="props"
                                    change-on-select
                                    placeholder="全部分类"
                                    style="width: 100%;"
                                >
                                </el-cascader>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="16" style="text-align:right;">
                        <el-form-item>
                            <el-button :size="$size" type="primary" @click="search" :loading="searchLoading">查询</el-button>
                            <el-button :size="$size" type="danger" @click="clearInput">清空</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table :data="unionData" v-loading="tableLoading">
                <el-table-column label="商品ID" prop="id" width="250px"></el-table-column>
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column label="商品分类" prop="categories" :formatter="formatterCat"></el-table-column>
                <el-table-column label="商品品牌" prop="brandName"></el-table-column>
                <el-table-column label="商品价格（元）">
                    <template slot-scope="scope">{{ $math.divide(scope.row.b2cPrice, 100) }}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button :size="$size" type="primary" @click="selectGoods(scope.row)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
        </el-dialog>
        <!-- 预览推广模板 -->
        <el-dialog title="预览推广模板" :visible.sync="previewSpredTemplateVisible" width="415px" append-to-body>
            <div class="iframWebPage">
                <iframe :src="spredTemplateUrl" frameborder="0" style="width: 375px;height: 667px"></iframe>
            </div>
        </el-dialog>

        <el-dialog title="预览推广模板" :visible.sync="previewSpredTemplateVisible2" width="620px" append-to-body>
            <div class="visible-text" v-html="spreadForm.info"></div>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import { h5BaseUrl } from '@/util/publicParams.js';
    const categoriesKey = ['cc_fri', 'cc_sec', 'cc_thr']  //枚举商品分类
    //枚举模板类型
    const EnumTemplateType = [{key: "", value: "全部"},{key: "topic", value: "专题"},{key: "activity", value: "活动"}];
    import UE from '@/components/UE.vue';
    export default {
        components: {
            UE
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            add: {
                type: Boolean,
                default: false
            },
            editData: {
                type: [Object, String],
                default: ()=>({})
            }
        },
        data() {
            const checkWebsite = (rules, value, call) => {
                // if(!value) {
                //     call(new Error('网址不能为空'))
                // }
                if(value && !/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+.*/.test(value)){
                    call(new Error("网址格式不正确"))
                }
                else{
                    call();
                }
            }
            return {
                EnumTemplateType: EnumTemplateType,
                spreadFormRules: {
                    name: [
                        { required: true, message: '不能为空', trigger: "blur" }
                    ],
                    goodsId: [
                        { required: true, message: '不能为空', trigger: "change"}
                    ],
                    templateType: [
                        { required: true, message: '请选择关联商品', trigger: "change"}
                    ],
                    templateType:[
                        { required: true, message: '请选择类型', trigger: 'change'}
                    ],
                    rangeTime: [
                        { required: true, message: '不能为空', trigger: "blur"}
                    ],
                    info: [
                        { required: true, message: '不能为空', trigger: "blur"}
                    ],
                    h5Url: [
                        { required: true, validator: checkWebsite, trigger: "blur"}
                    ]
                },
                spreadForm: {
                    templateType: ''
                },
                goodsCategroy: [],
                dialogVisible: false,
                previewSpredTemplateVisible: false,
                previewSpredTemplateVisible2: false,
                searchLoading: false,
                tableLoading: false,
                searchLoadingConfirm: false,
                selectForm: {},
                props: {
                    value: 'code',
                    label: 'name'
                },
                options: [],
                unionData: [],
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                spredTemplateUrl: "",
                goodsName: ""
            }
        },
        methods: {
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getMallList();
            },
            //关闭
            updateVisible() {
                this.$emit('update:visible', false)
            },
            submitSpreadForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        if(this.add) {
                            let params = {
                                template: {
                                    templateType: this.spreadForm.templateType,
                                    h5Url: this.spreadForm.h5Url,
                                    goodsId: this.spreadForm.goodsId,
                                    name: this.spreadForm.name,
                                    startTime: moment(new Date(this.spreadForm.rangeTime[0])).format('X'),
                                    endTime: moment(new Date(this.spreadForm.rangeTime[1])).format('X'),
                                    info:this.spreadForm.info 
                                }
                            }
                            this.spreadForm.id?params.template.id = this.spreadForm.id: ""
                            this.searchLoadingConfirm = true;
                            this.$http.post(this.spreadForm.id? this.$api.promotionTemplateUpdate : this.$api.promotionTemplateCreate, params, true).then(res=>{
                                this.searchLoadingConfirm = false;
                                this.$emit('on-update', true)
                                this.updateVisible()
                            })
                            .catch(err=>{
                                this.searchLoadingConfirm = false;
                                this.$message.error(err.message)
                            })
                        }else{
                            this.$emit('on-success', this.spreadForm)
                            this.updateVisible()
                        }
                    }else{
                        return false;
                    }
                })
            },
            //获取所有分类
            getQueryList() {
                this.$http.get(this.$api.queryList, {}, true).then(res=> {
                    this.options = res;
                    this.goodsCategroy = this.flatten(res)
                }).catch(err=> {
                    this.$message.error(err.message)
                })
            },
            //扁平化数组
            flatten(arr){
                var res = [];
                for(var i=0;i<arr.length;i++){
                    if(Array.isArray(arr[i].children)){
                        res = res.concat(this.flatten(arr[i].children));
                    }else{
                        res.push(arr[i]);
                    }
                }
                return res;
            },
            formatterCat(row) {
                let code = row.categories.cc_thr?row.categories.cc_thr:row.categories.cc_sec?row.categories.cc_sec:row.categories.cc_fri
                let result = this.goodsCategroy.filter(item=>{
                    return item.code==code
                })
                return result.length>0?result[0].name:""
            },
            //获取自营商城列表
            getMallList() {
                let params = {
                    condition: {
                        id: this.selectForm.id?this.selectForm.id:"",
                        name: this.selectForm.name? this.selectForm.name: '',
                        category: this.selectForm.category? this.selectForm.category[this.selectForm.category.length-1]: '',
                        minPrice: this.selectForm.minPrice? this.selectForm.minPrice: '',
                        maxPrice: this.selectForm.maxPrice? this.selectForm.maxPrice: '',
                        minSaleQ: this.selectForm.minSaleQ? this.selectForm.minSaleQ: '',
                        maxSaleQ: this.selectForm.maxSaleQ? this.selectForm.maxSaleQ: ''
                    },
                    page: this.page.page,
                    limit: this.page.limit
                }
                this.tableLoading = true;
                this.$http.get(this.$api.goodsOnSaleQPage, params, true).then(res=> {
                    this.unionData = res? res.data: [];
                    this.page.total = res? res.total: 0
                    this.searchLoading = false;
                    this.tableLoading = false;
                })
                .catch(err=>{
                    this.$message.error(err.message)
                    this.searchLoading = false;
                    this.tableLoading = false;
                })
            },
            selectGoods(row) {
                this.spreadForm.goodsId = row.id;
                this.goodsName = row.name;
                this.dialogVisible = false;
            },
             // H5预览
            previewH5(url) {
                // this.previewSpredTemplateVisible2 = true;
                if(url){
                    this.previewSpredTemplateVisible = true
                    this.spredTemplateUrl = url;
                }
                else{
                    this.previewSpredTemplateVisible2 = true;
                    this.$message(
                        {
                            message: '请输入H5网址',
                            type: 'warning'
                        }
                    )
                }
            },
            //查询列表
            search() {
                this.searchLoading = true;
                this.getMallList()
            },
            clearInput() {
                this.selectForm = {};
                this.getMallList()
            }
        },
        watch: {
            visible(val, oldVal) {
                if(val){
                    this.$refs['spreadForm']?this.$refs['spreadForm'].resetFields(): ""
                }
                if(this.add) {
                    //组装参数
                    let params = {
                        templateType: this.editData.templateType,
                        h5Url: this.editData.h5Url,
                        goodsId: this.editData.goodsId,
                        name: this.editData.name,
                        rangeTime: [Number(this.editData.startTime+'000'), Number(this.editData.endTime+'000')],
                        info:this.editData.info,
                        id: this.editData.id 
                    }
                    
                    if(val) {
                        this.spreadForm = params;
                        this.goodsName = this.editData.goodsName
                    }else{
                        this.spreadForm = {};
                    }
                }
            },
            dialogVisible(val, oldVal) {
                if(val){
                    this.getQueryList();
                    this.getMallList()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .add-spread-template{
        .iframWebPage {
            height: 655px;
            iframe {
                width: 375px;
                height: 667px;
            }
        }
        /deep/ .el-select,
        .el-date-editor {
            width: 100%
        }
    }

</style>
