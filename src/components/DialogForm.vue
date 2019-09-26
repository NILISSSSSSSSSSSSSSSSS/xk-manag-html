<template>
    <div>
        <el-dialog title="商品基本信息：" :visible.sync="visible" width="70%" top="30px" @close="close">
            <el-form :label-position="labelPosition" :label-width="formLabelWidth" :model="ruleForm" :rules="rules1"
                     ref="ruleForm">
                <el-form-item label="商品类型：" prop="resource">
                    <el-radio-group v-model="ruleForm.resource">
                        <el-radio label="全新"></el-radio>
                        <el-radio label="二手"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="商品标题：" prop="title">
                    <el-input size="small" v-model.trim="ruleForm.title" placeholder="请输入商品标题"></el-input>
                </el-form-item>
                <el-form-item label="商品分类：" prop="types">
                    <el-cascader
                        placeholder="试试搜索：服装"
                        :options="options"
                        filterable
                    ></el-cascader>
                </el-form-item>

                <el-form-item label="商品品牌：" prop="brand">
                    <el-select v-model="ruleForm.brand" placeholder="请选择商品品牌" style="width: 100%">
                        <el-option label="一" value="1"></el-option>
                        <el-option label="二" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品属性：">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>模块A</span>
                        </div>
                        <el-form-item label="系列：" prop="series">
                            <el-select v-model="ruleForm.series" placeholder="请选择商品系列" style="width: 100%">
                                <el-option label="一" value="1"></el-option>
                                <el-option label="二" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="上市时间：" prop="time">
                            <el-date-picker
                                v-model="ruleForm.time"
                                type="date"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="商品重量：" prop="weight">
                            <el-input size="small" v-model.trim="ruleForm.weight" placeholder="请输入商品重量"></el-input>
                        </el-form-item>
                    </el-card>
                </el-form-item>
                <el-form-item label="商品图片：">
                    <image-upload :isShow="isShow"></image-upload>
                    <span>商品主图大小不能超过3MB</span>
                </el-form-item>
                <el-form-item label="规格设置：">
                    <el-card class="box-card">
                        <goods-set v-model="ruleForm.spec" action="http:www.baidu.com"></goods-set>
                    </el-card>
                </el-form-item>
                <el-form-item label="商品详情：">
                    <image-upload :isShow="isShow"></image-upload>
                    <span>商品详情目前只支持图片上传，目前不支持文本编辑</span>
                </el-form-item>
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="运费设置：" prop="set">
                            <el-radio-group v-model="ruleForm.set">
                                <el-radio label="包邮"></el-radio>
                                <el-radio label="运费模板"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="template">
                            <el-select v-model="ruleForm.template" placeholder="请选择运费模板" style="width: 100%">
                                <el-option label="一" value="1"></el-option>
                                <el-option label="二" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="marginleft20" type="primary"
                                   @click="templateVisible=true">新建运费模板
                        </el-button>
                    </el-col>
                </el-row>
                <el-form-item label="赠送消费券： " prop="voucher">
                    <el-input size="small" v-model.trim="ruleForm.voucher" placeholder="请输入赠送的消费券"></el-input>
                </el-form-item>
                <el-form-item label="库存计数：" prop="count">
                    <el-radio-group v-model="ruleForm.count">
                        <el-radio label="买家拍下减库存"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上架设置：" prop="ground">
                    <el-radio-group v-model="ruleForm.ground">
                        <el-radio label="立即上架"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <!--新建运费模板弹框-->
            <el-dialog title="新建运费模板：" :visible.sync="templateVisible" width="70%" top="30px"  append-to-body>
                <el-form :label-position="labelPosition" :label-width="formLabelWidth" :model="freighForm" :rules="rules2"
                         ref="freighForm">
                    <el-form-item label="模板名称：" prop="templateName">
                        <el-input size="small" v-model.trim="freighForm.templateName" placeholder="请输入运费模板名称"></el-input>
                    </el-form-item>
                    <el-form-item label="商品地址：" prop="region">
                        <el-cascader
                            placeholder="请选择"
                            :options="options"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="发货时间：" prop="deliveryTime">
                        <el-select v-model="freighForm.deliveryTime" placeholder="请选择发货时间" style="width: 100%">
                            <el-option label="4小时之后" value="1"></el-option>
                            <el-option label="6小时之后" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="计价方式：" prop="way">
                        <el-radio-group v-model="freighForm.way">
                            <el-radio label="按件数"></el-radio>
                            <el-radio label="按重量"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="运送方式：" prop="way">
                        <el-checkbox v-model="freighForm.way">快递</el-checkbox>
                        <el-card class="box-card">
                            <div class="trans-way line">
                                默认运费&nbsp;&nbsp;<el-input class="num" size="small"></el-input>
                                &nbsp;&nbsp;件内&nbsp;&nbsp;<el-input class="price" size="small"></el-input>
                                &nbsp;&nbsp;元，每增加&nbsp;&nbsp;<el-input class="num" size="small"></el-input>
                                &nbsp;&nbsp;件，增加运费&nbsp;&nbsp;<el-input class="price" size="small"></el-input>&nbsp;&nbsp;元。
                            </div>
                            <div class="line">
                                <el-button size="small">全部删除</el-button>
                                <el-button size="small">新增</el-button>
                            </div>
                            <div>
                                <el-table
                                    ref="multipleTable"
                                    :data="tableData3"
                                    tooltip-effect="dark"
                                    style="width: 100%"
                                    @selection-change="handleSelectionChange">
                                    <el-table-column
                                        type="selection"
                                        width="55">
                                    </el-table-column>
                                    <el-table-column
                                        label="运送到"
                                        width="120">
                                        <template slot-scope="scope">
                                            {{ scope.row.date }}
                                            <el-button type="text">编辑</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="name"
                                        label="首件数（件）"
                                        width="120">
                                    </el-table-column>
                                    <el-table-column
                                        prop="address"
                                        label="首费（元）"
                                        show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                        prop="address"
                                        label="续件数（件）"
                                        show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                        prop="address"
                                        label="续费（元）"
                                        show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column
                                        prop="address"
                                        label="续费（元）"
                                        show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            <el-button
                                            type="text"
                                            size="small">
                                            删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-card>
                        <el-checkbox v-model="freighForm.way">晓可自营物流</el-checkbox>
                        <el-card class="box-card">
                        </el-card>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="submitFreigh('freighForm')">提交</el-button>
                    <el-button type="primary" @click="templateVisible=false">返回</el-button>
                </div>
            </el-dialog>

            <div slot="footer" class="dialog-footer">
                <el-button type="danger"  @click="submitForm('ruleForm')">确认提交</el-button>
                <el-button type="primary" @click="close">返回列表</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ImageUpload from "./ImageUpload.vue"
    import GoodsSet from '@/components/goods/GoodsInfo.vue'

    export default {
        name: "dialogformtest",
        props: {
            dialogFormVisible: {
                type: Boolean,
                default: false,
            },
            value: {},
        },
        components: {
            ImageUpload,
            GoodsSet
        },
        data() {
            return {
                showClassify: false,
                visible: this.dialogFormVisible, //主表单弹框组件
                isShow: true,                       //图片上传组件
                templateVisible:false,            //新建模板弹框
                // labelPosition: 'left',
                formLabelWidth: '150px',
                ruleForm: {          //主弹框表单
                    resource: '',
                    title: '',
                    types: '',
                    brand: '',
                    series: '',
                    time: '',
                    weight: '',
                    spec: '',
                    specName: '',
                    set: '',
                    template: '',
                    voucher: '',
                    count: '',
                    ground: '',
                    base: {
                        brandId: '',
                        categories: {

                        }
                    },
                    goodsAttrs: {},
                    skuAttr: {},
                    skuAttrValue: {}
                },

                freighForm:{           //运费模板表单
                    templateName:'',
                    province:'',
                    city:'',
                    region:'',
                    deliveryTime:'',
                    way:'',
                },

                rules1: {
                    resource: [
                        {required: true, message: '请选择商品类型', trigger: 'change'}
                    ],
                    title: [
                        {required: true, message: '请输入商品标题', trigger: 'blur'},
                        {max: 50, message: '请输入商品标题，50字以内', trigger: 'blur'}
                    ],
                    types: [
                        {required: true, message: '请选择', trigger: 'change'}
                    ],
                    brand: [
                        {required: true, message: '请选择商品品牌', trigger: 'change'}
                    ],
                    series: [
                        {required: true, message: '请选择商品系列', trigger: 'change'}
                    ],
                    time: [
                        {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
                    ],
                    weight: [
                        {required: true, message: '请输入商品重量', trigger: 'blur'},
                        // {max: 50, message: '请输入商品标题，50字以内', trigger: 'blur'}
                    ],
                    spec: [
                        {type: 'array', required: true, message: '请至少选择一个规格', trigger: 'change'}
                    ],
                    specName: [
                        {required: true, message: '请输入规格名字', trigger: 'blur'},
                        // {max: 50, message: '请输入商品标题，50字以内', trigger: 'blur'}
                    ],
                    set: [
                        {required: true, message: '请选择运费设置', trigger: 'change'}
                    ],
                    template: [
                        {required: true, message: '请选择运费模板', trigger: 'change'}
                    ],
                    voucher: [
                        {required: true, message: '请输入赠送的消费券', trigger: 'blur'},
                        // {max: 50, message: '请输入商品标题，50字以内', trigger: 'blur'}
                    ],
                },
                rules2: {
                    templateName: [
                        {required: true, message: '请输入运费模板名称', trigger: 'blur'},
                        // {max: 50, message: '请输入商品标题，50字以内', trigger: 'blur'}
                    ],
                    region: [
                        // {required: true, vala: , trigger: 'change'}
                    ],
                    deliveryTime: [
                        {required: true, message: '请选择发货时间', trigger: 'change'}
                    ],
                    way: [
                        {required: true, validator: checkWay, trigger: 'change'}
                    ],
                },
                options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }],
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-08',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-06',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }, {
            date: '2016-05-07',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
            }],
            multipleSelection: []
            }
        },
        watch: {
            dialogFormVisible(val) {
                this.visible = val;
            }
            
        },
        mounted() {
            console.log(this.$api)
            this.$http.post(this.$api.queryList, {}).then(res => {
                console.log(res)
            })
        },
        methods: {
            //提交主表单
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$message({
                            type: 'success',
                            message: '已提交!',
                        });
                        this.close();
                    } else {
                        // console.log('error submit!!');
                        return false;
                    }
                });
            },
            //提交运费模板表单
            submitFreigh(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$message({
                            type: 'success',
                            message: '已提交!',
                        });
                        this.templateVisible=false;
                    } else {
                        // console.log('error submit!!');
                        return false;
                    }
                });
            },
            //点击蒙层关闭表单
            close() {
                this.$emit('update:dialogFormVisible', false);
                // this.$emit('input', this.ruleForm);//将input中数据导出
            }
        }
    }
</script>

<style scoped>
    .el-form-item {
        margin-bottom: 20px;
    }
    a{
        text-decoration: none;
    }
    .el-cascader {
        width: 100%;
    }
</style>
<style lang="scss">
    .trans-way .num{
        width: 30px
    }
    .trans-way .price{
        width: 70px
    }
    .line{
        border-bottom: 1px solid #dcdfe6;
    }
</style>


