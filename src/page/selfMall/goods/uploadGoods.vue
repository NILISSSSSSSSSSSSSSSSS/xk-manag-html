<template>
    <div class="xk-container">
        <div class="xk-body xk-radius">
            <div class="container-header listInfo">上传商品--选择类目</div>
            <el-form :model="ruleForm" ref="ruleForm" label-width="200px"
                     class=" demo-ruleForm pubBackground">
                <el-row>
                    <el-form-item label="添加你经常使用的类目：">
                    <el-col :span="12">
                        <el-select v-model="ruleForm.types" placeholder="请添加" style="width: 100%;" :size="$size" @change="selectCatUsea">
                            <el-option v-for="cat in usualCategory" :label="cat.name" :value="cat.allCode" :key="cat.code"></el-option>
                        </el-select>
                    </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="所有类目：">
                        <el-col :span="12">
                            <el-cascader
                                style="width:100%"
                                :size="$size"
                                :options="options"
                                v-model="ruleForm.categroy"
                                @change="selectCategroy"
                                placeholder="所有类目"
                                :props="props"
                                filterable
                            >
                            </el-cascader>
                        </el-col>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="你当前的选择是：">
                            <span v-for="(curr,index) in currSelect" :key="index"> {{ index===currSelect.length-1?curr.name: curr.name+'&gt;' }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center">
                    <el-col :span="5">
                        <el-button type="primary" :size="$size"
                                   @click="submitForm">我已阅读商品发布规则，现在发布商品
                        </el-button>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" class="marintop20">
                    <el-col :span="5">
                        <!-- <el-checkbox v-model="checked">阅读并同意</el-checkbox>
                        <a class="goods-rules" style="font-size:14px;color:blue" href="javascript: void(0);">《晓可商城商品发布规则》</a> -->
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "uploadGoods",
        data() {
            return {
                checked: true, //复选框状态
                ruleForm: {
                    categroy: [],
                    types: []
                },
                currSelect: [],
                options: [],
                props: {
                    value: 'code',
                    label: 'name',
                    disabled: 'enable'
                },
                usualCategory: []
            }
        },
        created() {
            this.getMallCategoryQueryList();
            this.usualCategory = localStorage.getItem('xk-usualCategory')? JSON.parse(localStorage.getItem('xk-usualCategory')): [];
        },
        methods: {
             getMallCategoryQueryList() {
                this.$http.get(this.$api.categoryQueryList, {isManager: 1}, true)
                    .then(res => {
                        res.forEach(item => {
                            this.options.push(item);
                        })
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                    })
            },
            submitForm() {
                if(this.checked){
                    if(this.ruleForm.categroy.length!==0){
                        let result = this.getCascaderObj(this.ruleForm.categroy, this.options);
                        let len = result.length;
                        let usualCategory = localStorage.getItem('xk-usualCategory')? JSON.parse(localStorage.getItem('xk-usualCategory')): [];
                        if(usualCategory) {
                            let isPush = false;
                            for(let i=0,lenI = usualCategory.length; i< lenI; i++) {
                                if(usualCategory[i].code === result[len-1].code){
                                    isPush = true;
                                    break;
                                }
                            }
                            if(!isPush) {
                                usualCategory.unshift({
                                    name: result[len-1].name,
                                    code: result[len-1].code,
                                    disabled: result[len-1].enable,
                                    allCode: this.ruleForm.categroy
                                });
                                usualCategory.length>10? usualCategory.pop(): ''
                            }
                        }else{
                            usualCategory.push({
                                name: result[len-1].name,
                                code: result[len-1].code,
                                disabled: result[len-1].enable,
                                allCode: this.ruleForm.categroy
                            });
                        }
                        this.usualCategory = usualCategory;
                        localStorage.setItem('xk-usualCategory', JSON.stringify(usualCategory));
                        let params = this.ruleForm.categroy
                        this.$router.push({ path: 'goodsInfo', query: {cat: params} })
                    }else if(this.ruleForm.types.length!==0){
                        let params = this.ruleForm.types
                        this.$router.push({ path: 'goodsInfo',  query: {cat: params} })
                    }else{
                        this.$router.push({ path: 'goodsInfo' })
                    }
                    
                }else {
                    this.$message({
                        message: '请先勾选是否同意晓可商城商品发布规则',
                        type: 'warning'
                    });
                }
            },
            selectCatUsea(val) {
                this.currSelect = this.getCascaderObj(val, this.options);
                this.ruleForm.categroy = [];
            },
            selectCategroy(val) {
                this.currSelect = [];
                this.currSelect = this.getCascaderObj(val, this.options)
                this.ruleForm.types = [];
            },
            //获取名字
            getCascaderObj(val, opt) {
                return val.map(function (value, index, array) {
                    for (var item of opt) {
                        if (item.code == value) { 
                            opt = item.children; 
                            return {
                                name: item.name,
                                code: item.code,
                                enable: item.enable
                            }; 
                        }
                    }
                    return null;
                });
            }
        }
    }
</script>

<style lang="scss" scoped src="./uploadGoods.scss"></style>
