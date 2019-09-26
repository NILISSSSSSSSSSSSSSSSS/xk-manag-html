<template>
    <div class="xk-container home-icon">
        <div class="xk-body">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>首页ICON管理
                    </div>
                    <div class="vus-btn">
                        <!-- <el-button type="primary" size="small" @click="addData('addForm')">新增</el-button> -->
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="广场首页ICON管理" name="1" v-permission="'homeIconSquareSearch'">
                        <home-icon-table :dataTable="homeTable" :index="activeName" :loading="homeTableLoading">
                            <template slot-scope="scope">
                                <el-button slot="handle" v-permission="'homeIconSquareEdit'" :size="$size" type="primary" :loading="scope.row.loading" @click="editData(scope.row.id, scope.row)">编辑</el-button>
                            </template>
                            <template slot="move" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.moveEnable"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row)">
                                </el-switch>
                            </template>
                            <template slot="ios" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.iosHide"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row, 'ios')">
                                </el-switch>
                            </template>
                            <template slot="android" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.androidHide"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row, 'android')">
                                </el-switch>
                            </template>
                        </home-icon-table>
                    </el-tab-pane>
                    <el-tab-pane label="夺奖派对首页ICON管理" name="2" v-permission="'homeIconWelfareSearch'">
                        <home-icon-table :dataTable="homeWelfareTable" :index="activeName" :loading="homeWelfareTableLoading">
                            <template slot-scope="scope">
                                <el-button :size="$size" v-permission="'homeIconWelfareEdit'" type="primary" :loading="scope.row.loading" @click="editData(scope.row.id, scope.row)">编辑</el-button>
                            </template>
                            <template slot="move" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.moveEnable"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row)">
                                </el-switch>
                            </template>
                            <!-- <template slot="ios" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.iosHide"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row, 'ios')">
                                </el-switch>
                            </template>
                            <template slot="android" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.androidHide"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row, 'android')">
                                </el-switch>
                            </template> -->
                        </home-icon-table>
                    </el-tab-pane>
                    <el-tab-pane label="自营商城ICON管理" name="3" v-permission="'homeIconMallSearch'">
                        <home-icon-table :dataTable="homeMallTable" :index="activeName" :loading="homeMallTableLoading">
                            <template slot-scope="scope">
                                <el-button :size="$size" v-permission="'homeIconMallEdit'" type="primary" :loading="scope.row.loading" @click="editData(scope.row.id, scope.row)">编辑</el-button>
                            </template>
                            <template slot="move" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.moveEnable"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row)">
                                </el-switch>
                            </template>
                            <template slot="ios" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.iosHide"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row, 'ios')">
                                </el-switch>
                            </template>
                            <template slot="android" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.androidHide"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row, 'android')">
                                </el-switch>
                            </template>
                        </home-icon-table>
                    </el-tab-pane>
                    <el-tab-pane label="商圈首页ICON管理" name="4" v-permission="'homeIconShSearch'">
                        <home-icon-table :dataTable="homeTradeTable" :index="activeName" :loading="homeTradeTableLoading">
                            <template slot-scope="scope">
                                <el-button :size="$size" v-permission="'homeIconShEdit'" type="primary" :loading="scope.row.loading" @click="editData(scope.row.id, scope.row)">编辑</el-button>
                            </template>
                            <template slot="move" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.moveEnable"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row)">
                                </el-switch>
                            </template>
                            <template slot="ios" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.iosHide"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row, 'ios')">
                                </el-switch>
                            </template>
                            <template slot="android" slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.androidHide"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-color="#13ce66"
                                    @change="changeMove($event, scope.row.id, scope.row, 'android')">
                                </el-switch>
                            </template>
                        </home-icon-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <el-dialog :title="title?'新增': '编辑'" :visible.sync="dialogVisible" width="600px">
                <el-form label-width="150px" :model="addForm" ref="addForm" :rules="addFormRules">
                    <el-form-item label="ICON名称：" prop="name">
                        <el-input :size="$size" v-model="addForm.name" placeholder="请输入ICON名称"></el-input>
                    </el-form-item>
                    <el-form-item label="ICON图片：" prop="icon" class="upload-img" ref="clearPicUrls">
                        <image-upload v-model="addForm.icon" :more="false">
                            <img v-if="addForm.icon" :src="addForm.icon" alt="">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </image-upload>
                    </el-form-item>
                    <el-form-item v-if="activeName==1" label="能否移动：" prop="moveEnable" class="upload-img" ref="clearPicUrls">
                        <el-radio-group v-model="addForm.moveEnable">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="IOS是否隐藏：" prop="iosHide" class="upload-img" ref="clearPicUrls">
                        <el-radio-group v-model="addForm.iosHide">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="Android是否隐藏：" prop="androidHide" class="upload-img" ref="clearPicUrls">
                        <el-radio-group v-model="addForm.androidHide">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div class="btn-group">
                    <el-button :size="$size" type="primary" @click="submitIcon('addForm')" :loading="submitLoading">确定</el-button>
                    <el-button :size="$size" @click="dialogVisible=false">取消</el-button>
                </div>
            </el-dialog>
            
        </div>
    </div>
</template>

<script>
    import ImageUpload from  '@/components/ImageUpload.vue';
    import HomeIconTable from '@/components/operate/HomeIconTable.vue';

    export default {
        name: 'homeIcon',
        components: {
            ImageUpload,
            HomeIconTable
        },
        data() {
            const checkPics = (rule, value, call)=>{
                if(!value || value.length===0) {
                    call(new Error('请上传图片'))
                }else{
                    call()
                }
            }
            return {
                dialogVisible: false,
                title: true,
                submitLoading: false,
                loadingTable: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                dataTable: [{id: 1, name: 'icon1', move: false, pics: 'http://upload.qqbodys.com/allimg/1710/10323RN0-0.jpg'}],
                addForm: {
                    iosHide: true,
                    androidHide: true,
                    moveEnable: true
                },
                addFormRules: {
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    icon: [
                        { required: true, validator: checkPics, trigger: 'blur'}
                    ]
                },
                activeName: '1',
                homeTable: [], //广场首页
                homeWelfareTable: [],  // 夺奖派对首页
                homeMallTable: [],  //自营商城首页
                homeTradeTable: [], //商圈首页
                homeTableLoading: false, //广场首页
                homeWelfareTableLoading: false,  // 夺奖派对首页
                homeMallTableLoading: false,  //自营商城首页
                homeTradeTableLoading: false, //商圈首页
            }
        },
        created() {
            this.getListHome();
        },
        methods: {
            //翻页
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
            },
            //新增、修改
            submitIcon(formName) {
                this.$refs[formName].validate(v=>{
                    if(v) {
                        this.submitLoading = true;
                        let url = ''
                        switch(this.activeName) {
                            case '1':
                                url = 'homeIconUpdate'
                            break;
                            case '2':
                                url = 'jcategoryUpdate'
                            break;
                            case '3':
                                url = 'scategoryUpdate'
                            break;
                            case '4':
                                url = 'industryIconUpdate'
                            break;
                        }
                        let params = {
                            id: this.addForm.id,
                            name: this.addForm.name,
                            icon: this.addForm.icon
                        }
                        this.activeName=='1'? (
                            params.moveEnable = this.addForm.moveEnable? 1: 0, 
                            params.iosHide = this.addForm.iosHide? 1: 0, 
                            params.androidHide = this.addForm.androidHide? 1: 0
                        ): null;
                        this.$http.post(this.$api[url], params, true).then(res=>{
                            this.submitLoading = false;
                            this.dialogVisible = false;
                            this.handleClick({name: this.activeName})
                        })
                        .catch(err=>{
                            this.submitLoading = false;
                            this.$message.error(err.message)
                        })
                    }else{
                        return false;
                    }
                })
                
            },
            //是否允许移动
            changeMove(status, id, row, type) {
                switch(this.activeName) {
                    case '1': //  广场首页
                        if(type==='ios') {
                            this.$http.post(status? this.$api.homeIconIosIsHide: this.$api.homeIconIosNotHide, {id:  id}, true).then(res=>{
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                })
                            })
                            .catch(err=>{
                                this.$message.error(err.message);
                                this.getListHome();
                            })
                        }else if(type==='android') {
                            this.$http.post(status? this.$api.homeIconAndroidIsHide: this.$api.homeIconAndroidNotHide, {id:  id}, true).then(res=>{
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                })
                            })
                            .catch(err=>{
                                this.$message.error(err.message);
                                this.getListHome();
                            })
                        }else{
                            this.$http.post(status? this.$api.homeIconIsMove: this.$api.homeIconNotMove, {id:  id}, true).then(res=>{
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                })
                            })
                            .catch(err=>{
                                this.$message.error(err.message);
                                this.getListHome();
                            })
                        }
                        
                    break;
                    case '2': // 夺奖派对首页
                        this.$http.post(status? this.$api.jcategoryIsMove: this.$api.jcategoryNotMove, {id:  id}, true).then(res=>{
                            this.$message({
                                message: '操作成功',
                                type: 'success'
                            })
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                            this.getListWelf();
                        })
                    break;
                    case '3': // 自营商城
                        if(type === 'ios') {
                            this.$http.post(this.$api.scategoryIosHide, {id: id, isHide: row.iosHide}, true)
                            .then(res => {
                                this.$message.success("操作成功")
                                this.getListWelf();
                            })
                            .catch(err => {
                                this.$message.error(err.message)
                                this.getListWelf();
                            })
                        } else if(type === 'android') {
                            this.$http.post(this.$api.scategoryAndroidHide, {id: id, isHide: row.androidHide}, true)
                            .then(res => {
                                this.$message.success("操作成功")
                                this.getListWelf();
                            })
                            .catch(err => {
                                this.$message.error(err.message)
                                this.getListWelf();
                            })
                        } else {
                            this.$http.post(status? this.$api.scategoryIsMove: this.$api.scategoryNotMove, {id:  id}, true).then(res=>{
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                })
                            })
                            .catch(err=>{
                                this.$message.error(err.message);
                                this.getListMall();
                            })
                        }
                    break;
                    case '4': // 商圈首页
                    if(type === 'ios') {
                            this.$http.post(this.$api.industryIosHide, {id: id, isHide: row.iosHide}, true)
                            .then(res => {
                                this.$message.success("操作成功")
                                this.getListShop();
                            })
                            .catch(err => {
                                this.$message.error(err.message)
                                this.getListShop();
                            })
                        } else if(type === 'android') {
                            this.$http.post(this.$api.industryAndroidHide, {id: id, isHide: row.androidHide}, true)
                            .then(res => {
                                this.$message.success("操作成功")
                                this.getListShop();
                            })
                            .catch(err => {
                                this.$message.error(err.message)
                                this.getListShop();
                            })
                        } else {
                            this.$http.post(status? this.$api.industryIsMove: this.$api.industryNotMove, {id:  id}, true).then(res=>{
                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                })
                            })
                            .catch(err=>{
                                this.$message.error(err.message);
                                this.getListShop();
                            })
                        }
                    break;
                }
            },
            //新增弹框
            addData(formName) {
                this.$refs[formName]? this.$refs[formName].resetFields():"";
                this.title = true;
                this.dialogVisible = true;
            },
            //编辑弹框
            editData(id, row) {
                this.addForm = JSON.parse(JSON.stringify(row));
                if(this.activeName==1) {
                    this.addForm.iosHide = this.addForm.iosHide==1? true: false;
                    this.addForm.androidHide = this.addForm.androidHide==1? true: false;
                    this.addForm.moveEnable = this.addForm.moveEnable==1? true: false;
                }

                this.$refs['addForm']? this.$refs['addForm'].resetFields():"";
                this.title = false;
                this.dialogVisible = true;
            },
            //获取广场首页ICON
            getListHome() {
                this.homeTableLoading = true;
                this.$http.get(this.$api.homeIconQList, {}, true).then(res=>{
                    this.homeTable = res;
                    this.homeTableLoading = false;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.homeTableLoading = false;
                })
            },
            //获取夺奖派对首页ICON
            getListWelf() {
                this.homeWelfareTableLoading = true;
                this.$http.get(this.$api.jcategoryQList, {}, true).then(res=>{
                    this.homeWelfareTable = res;
                    this.homeWelfareTableLoading = false;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.homeWelfareTableLoading = false;
                })
            },
            //获取自营商城ICON管理
            getListMall() {
                this.homeMallTableLoading = true;
                this.$http.get(this.$api.scategoryQList, {}, true).then(res=>{
                    this.homeMallTable = res;
                    this.homeMallTableLoading = false;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.homeMallTableLoading = false;
                })
            },
            //获取商圈首页ICON管理
            getListShop() {
                this.homeTradeTableLoading = true;
                this.$http.get(this.$api.industryQList, {}, true).then(res=>{
                    this.homeTradeTable = res;
                    this.homeTradeTableLoading = false;
                })
                .catch(err=>{
                    this.$message.error(err.message);
                    this.homeTradeTableLoading = false;
                })
            },
            //切换选择
            handleClick(tab, event) {
                switch(tab.name) {
                    case '1':
                        this.getListHome();
                    break;
                    case '2':
                        this.getListWelf();
                    break;
                    case '3':
                        this.getListMall();
                    break;
                    case '4':
                        this.getListShop();
                    break;
                }
            },
            // IOS是否隐藏
            changeIOS() {

            },
            // Android是否隐藏
            changeAndroid() {}
        },
        watch: {
            "addForm.picUrls": {
                handler(val, oldVal) {
                    this.$refs['clearPicUrls'].clearValidate();
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "./homeIcon.scss"
</style>
