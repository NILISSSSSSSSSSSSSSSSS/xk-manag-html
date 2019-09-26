<template>
    <el-dialog
            :title="dialogTitle"
            :visible.sync="visible"
            width="793px"
            :before-close="handleClose"
    >
        <div class="banner xk-ad-banner-add">
            <el-form ref="form" :model="form" label-width="100px" v-loading="vloading">
                <el-form-item label="所属模块：" required>
                    <el-select v-model="form.modul" placeholder="所属模块">
                        <el-option
                                :label="item.label"
                                :value="item.value"
                                v-for="(item,index) in opations"
                                :key="index"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择模块：" required>
                    <el-select v-model="tempValue" @change="changeTemp" style="margin-bottom:20px">
                        <el-option
                                v-for="(item,index) in tempArr"
                                :key="index"
                                :label="item.label"
                                :value="item.templateName"
                        ></el-option>
                    </el-select>
                    <dynamic-banner :modul="form.modul" :categoryJF="categoryJF" :categorySF="categorySF" v-model="config"></dynamic-banner>
                </el-form-item>
                <el-form-item label="专属区域：" v-if="showAgain" required>
                    <province-cascader :more="true" v-model="form.province" all></province-cascader>
                </el-form-item>
                <el-form-item >
                    <el-button @click="handleClose" :size="$size">取消</el-button>
                    <el-button type="primary" :size="$size" @click="onSubmit" :loading="load">
                        <span v-if="bannerDetail.id">修改</span>
                        <span v-else>添加</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-dialog>
</template>

<script>
    import DynamicBanner from "../../components/DynamicBanner.vue";
    import ProvinceCascader from "../../components/ProvinceCascader.vue";
    import {convertKey} from '../../util/publicMehotds.js'

    export default {
        name: "banner",
        props: {
            bannerDetail: {
                type: Object,
                default: ()=>({})
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            bannerModel: {
                type: String,
                default: "XKSQUARE"
            }
        },
        data() {
            return {
                categoryJF:[],
                categorySF:[],
                visible: this.dialogVisible,
                templateContent: "",
                dialogTitle: "新增轮播图",
                opations: JSON.parse(localStorage.getItem("bannerModule")),
                form: {
                    modul: "",
                    province: []
                },
                tempArr: [
                    {
                        label: "模板一",
                        tempValue: 1,
                        templateName: "TMP_ONE"
                    },
                    // {
                    //     label:'模板二',
                    //     tempValue:2
                    // },
                    {
                        label: "模板二",
                        tempValue: 2,
                        templateName: "TMP_TWO"
                    },
                    {
                        label: "模板三",
                        tempValue: 3,
                        templateName: "TMP_THREE"
                    },
                    {
                        label: "模板四",
                        tempValue: 4,
                        templateName: "TMP_FOUR"
                    },
                    {
                        label: "模板五",
                        tempValue: 5,
                        templateName: "TMP_FIVE"
                    }
                    // {
                    //     label:'模板七',
                    //     tempValue:7
                    // },
                    // {
                    //     label:'模板八',
                    //     tempValue:8
                    // }
                ],
                tempValue: "TMP_ONE",
                vloading: false,
                showAgain: true,
                imgArr: [],
                templateContentDetail: null,
                infoArr: [],
                load: false,
                config: {
                    width: 400,
                    height: 200,
                    x: 2,
                    y: 2,
                    arr: [
                        {
                            gridStart: "0,0",
                            gridEnd: "2,2"
                        }
                    ]
                }
            };
        },
        components: {
            DynamicBanner,
            ProvinceCascader
        },
        created() {
            this.getCategoryJF();
            this.getCategorySF();
        },
        methods: {
            changeTemp(temp) {
                if (this.bannerDetail.template == temp) {
                    this.config = JSON.parse(this.bannerDetail.templateContent);
                    return false;
                }
                let arr = [];
                let config = {
                    width: 400,
                    height: 200,
                    x: 2,
                    y: 2,
                    arr: []
                };
                switch (temp) {
                    case "TMP_ONE":
                        arr = [
                            {
                                gridStart: "0,0",
                                gridEnd: "2,2"
                            }
                        ];
                        break;
                    case "TMP_TWO":
                        arr = [
                            {
                                gridStart: "0,0",
                                gridEnd: "1,1"
                            },
                            {
                                gridStart: "1,0",
                                gridEnd: "2,1"
                            },
                            {
                                gridStart: "0,1",
                                gridEnd: "1,2"
                            },
                            {
                                gridStart: "1,1",
                                gridEnd: "2,2"
                            }
                        ];
                        break;
                    case "TMP_THREE":
                        arr = [
                            {
                                gridStart: "0,0",
                                gridEnd: "2,1"
                            },
                            {
                                gridStart: "0,1",
                                gridEnd: "1,2"
                            },
                            {
                                gridStart: "1,1",
                                gridEnd: "2,2"
                            }
                        ];

                        break;
                    case "TMP_FOUR":
                        arr = [
                            {
                                gridStart: "0,0",
                                gridEnd: "1,1"
                            },
                            {
                                gridStart: "1,0",
                                gridEnd: "2,2"
                            },
                            {
                                gridStart: "0,1",
                                gridEnd: "1,2"
                            }
                        ];

                        break;
                    case "TMP_FIVE":
                        arr = [
                            {
                                gridStart: "0,0",
                                gridEnd: "1,1"
                            },
                            {
                                gridStart: "1,0",
                                gridEnd: "2,1"
                            },
                            {
                                gridStart: "0,1",
                                gridEnd: "2,2"
                            }
                        ];

                        break;
                    case "TMP_SEX":
                        arr = [
                            {
                                gridStart: "0,0",
                                gridEnd: "1,2"
                            },
                            {
                                gridStart: "1,0",
                                gridEnd: "2,1"
                            },
                            {
                                gridStart: "1,1",
                                gridEnd: "2,2"
                            }
                        ];

                        break;
                    case 7:
                        arr = [
                            {
                                gridStart: "0,0",
                                gridEnd: "2,1"
                            },
                            {
                                gridStart: "0,1",
                                gridEnd: "2,2"
                            }
                        ];

                        break;
                    case 8:
                        arr = [
                            {
                                gridStart: "0,0",
                                gridEnd: "1,2"
                            },
                            {
                                gridStart: "1,0",
                                gridEnd: "2,2"
                            }
                        ];

                        break;
                    case 1:
                        console.log(1);

                        break;

                    default:
                        break;
                }
                config.arr = arr;
                this.config = config;
            },
            handleClose() {
                this.visible = false;
                this.$emit("update:dialogVisible", false)
            },
            changePage() {
                this.$emit("closeBanner");
            },
            getCategoryJF() {
                this.$http.get(this.$api.queryJFCategory, {limit: 999, page: 1}, true)
                    .then(res => {
                        // res = convertKey(res,['name','code'],['label','value']);
                        this.categoryJF = res;
                    })
                    .catch(err => {

                    })
            },
            getCategorySF() {
                this.$http.get(this.$api.categoryQueryList, {limit: 999, page: 1}, true)
                    .then(res => {
                        res = convertKey(res,['name','code','children'],['label','value','children']);
                        this.categorySF = res;
                    })
                    .catch(err => {

                    })
            },
            onSubmit() {
                let obj = {
                    templateName: this.tempValue,
                    templateContent: this.config,
                    provinceCode: this.form.province[0],
                    cityCode: this.form.province[0] === "000000" ? "" : this.form.province[1],
                    districtCode: this.form.province[0] === "000000" ? "" : this.form.province[2],
                    bannerModule: this.form.modul
                };
                for (let index = 0; index < obj.templateContent.arr.length; index++) {
                    if (!obj.templateContent.arr[index].src) {
                        this.$message.error("轮播图不能为空");
                        return false;
                    }
                }
                this.load = true;
                if (this.bannerDetail.id) {
                    obj.id = this.bannerDetail.id;
                    this.$http
                        .post(this.$api.bannerUpdate, obj, true)
                        .then(res => {
                            this.load = false;
                            this.$emit("addsuccess");
                            this.$message({
                                message: "修改成功！",
                                type: "success"
                            });
                        })
                        .catch(err => {
                            this.load = false;
                            this.$message.error("修改失败");
                        });
                } else {
                    this.$http.post(this.$api.bannerCreate, obj, true)
                        .then(res => {
                            this.tempValue = "TMP_ONE";
                            this.$emit("addsuccess");
                            this.load = false;
                            this.$message({
                                message: "添加成功！",
                                type: "success"
                            });
                        })
                        .catch(err => {
                            this.load = false;
                            this.$message.error(err.message);
                        });
                }
            },
        },
        watch: {
            bannerModel(val) {
                if (val != 0) {
                } else {
                    this.form.modul = "XKSQUARE";
                }
            },
            dialogVisible(val) {
                this.visible = val;
            },
            bannerDetail(res) {
                if (res.id) {
                    this.config = JSON.parse(res.templateContent);
                    this.config.width = 400;
                    this.config.height = 200;
                    this.form = {
                        modul: res.bannerModule,
                        province: [res.provinceCode, res.cityCode, res.districtCode]
                    };
                    this.tempValue = res.template;
                    this.dialogTitle = "编辑轮播图";
                } else {
                    this.tempValue = "TMP_ONE";
                    this.dialogTitle = "新增轮播图";
                    this.config = {
                        width: 400,
                        height: 200,
                        x: 2,
                        y: 2,
                        arr: [
                            {
                                gridStart: "0,0",
                                gridEnd: "2,2"
                            }
                        ]
                    };
                    this.form = {
                        modul: this.bannerModel != 0 ? this.bannerModel : "XKSQUARE",
                        province: []
                    };
                }
            }
        }
    };
</script>
<style lang="scss">
    .xk-ad-banner-add {
        .province-cascader .el-input {
            width: 400px;
        }
    }
</style>