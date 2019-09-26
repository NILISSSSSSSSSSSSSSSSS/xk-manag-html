<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>家族详情
                </div>
                <div class="vus-bottom"></div>
            </div>
            <div v-loading="detailLoading">
            <el-card>
                <div>基本信息</div>
                <el-row>
                    <el-col :span="18">
                        <div class="content">
                            {{detailData.id}}
                            <div>家族名称：{{detailData.familyName}}</div>
                            <div>家族简介：{{detailData.familyDec}}</div>
                            <div>家族封面：
                                <span v-if="detailData.isFamilyPhoto == 1">
                                    <img :src="detailData.familyPhoto" class="imgSize"/>
                                </span>
                                <span v-else class="imgSize">封面已取消</span>
                                <el-button :size="$size" type="primary" v-if="detailData.isFamilyPhoto == 1" @click="showPhoto">取消封面</el-button>
                                <el-button :size="$size" type="primary" v-if="detailData.isFamilyPhoto == 0" @click="showPhoto">显示封面</el-button>
                            </div>
                            <div>家族状态：{{detailData.bizStatus === 'enable' ? '激活': '禁用'}}</div>
                            <div>家族安全码： {{detailData.securityCode}}</div>
                        </div>
                    </el-col>
                    <el-col :span="6" style="text-align: right">
                       <div class="btnClass">
                           <el-button :size="$size" type="primary" @click="goHostList">查看旗下主播列表</el-button>
                       </div>
                       <div class="btnClass">
                           <el-button :size="$size" type="primary" @click="goFamilyList" v-if="this.$route.query.type==='diamond'">查看旗下家族列表</el-button>
                       </div>
                       <div class="btnClass">
                           <el-button :size="$size" type="primary" @click="goBusiness">查看联盟商详情页</el-button>
                       </div>
                       <div class="btnClass">
                           <el-button :size="$size" type="primary" @click="openPsw">输入密码更改考核条件</el-button>
                       </div>
                       <!-- <div class="btnClass">
                           <el-button :size="$size" type="primary">设为不参与考核</el-button>
                       </div>
                       <div class="btnClass">
                           <el-button :size="$size" type="primary">输入密码修改提现条件</el-button>
                       </div> -->
                    </el-col>
                </el-row>
            </el-card>
            <el-card>
                <div>考核规则</div>
                <div class="content">
                    <div>考核周期：{{detailData.timeCycle}}天</div>
                    <div>考核条件：
                        <el-col v-for="(item, index) in detailData.rules" :key="index" style="margin-left: 80px">
                            {{getFineName(item.ruleName)}}{{item.rule === 'gt' ? '&gt;' : item.rule === 'le' ? '&lt;' : '='}}{{item.value}}{{item.unit}}
                        </el-col>
                    </div>
                </div>
            </el-card>
            <el-card>
                <div>提现条件</div>
                <div class="content">
                    <!-- <div>提现周期：{{detailData.timeCycle}}天</div>
                    <div>平台代管比例：
                        %</div>
                    <div>是否能控制主播提现：
                        <el-radio v-model="detailData.controlAnchor" :label="1" disabled>是</el-radio>
                        <el-radio v-model="detailData.controlAnchor" :label="0" disabled>否</el-radio>
                    </div>
                    <div>主播提现周期：{{detailData.anchorCycle}}天</div>
                    <div>家族代管比例：{{detailData.escrowRatio / 10}}%</div> -->
                    <el-form :model="conditionForm" label-width="140px" ref="conditionForm">
                        <el-form-item label="提现周期：">
                            {{detailData.timeCycle}}天
                        </el-form-item>
                        <el-form-item label="平台代管比例：" prop="platformRatio" :rules="rules.persent">
                            <el-input :size="$size" style="width: 80px;margin-right: 5px" 
                            :disabled="isCanNotEdit" v-model.number="conditionForm.platformRatio"></el-input>%
                        </el-form-item>
                        <el-form-item label="是否能控制主播提现">
                            <el-radio v-model="conditionForm.controlAnchor" :label="1" :disabled="isCanNotEdit">是</el-radio>
                            <el-radio v-model="conditionForm.controlAnchor" :label="0" :disabled="isCanNotEdit">否</el-radio>
                        </el-form-item>
                        <el-form-item label="主播提现周期：" prop="anchorCycle" :rules="rules.integerDay">
                            <el-input :size="$size" style="width: 80px;margin-right: 5px" 
                            :disabled="isCanNotEdit || conditionForm.controlAnchor == 0" v-model.number="conditionForm.anchorCycle"></el-input>天
                        </el-form-item>
                        <el-form-item label="家族代管比例：" prop="escrowRatio" :rules="rules.familyPersent">
                            <el-input :size="$size" style="width: 80px;margin-right: 5px" 
                            :disabled="isCanNotEdit || conditionForm.controlAnchor == 0" v-model.number="conditionForm.escrowRatio"></el-input>%
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            <div class="back-class">
                <el-button :size="$size" type="primary" :disabled="isCanNotEdit" :loading="saveLoading" @click="saveCondition">保存更改</el-button>
                <el-button :size='$size' type="plain" @click="goBack">返回</el-button>
            </div>
        </div>
        </div>
        <el-dialog width="500px" :visible.sync="pswDialog" title="输入密码修改考核条件" :before-close="closePsw">
            <el-form :model="pswForm">
                <el-form-item label="密码：" label-width="80px">
                    <el-input :size="$size" placeholder="请输入密码" v-model="pswForm.psw"></el-input>
                </el-form-item>
                <div style='text-align: center'>
                    <el-button :size="$size" type="primary" @click="validPsw" :loading="pswLoading">确定</el-button>
                    <el-button :size="$size" type="plain" @click="closePsw">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {FineSources} from '@/util/publicParams'
export default {
    name: 'familyDetail',
    data() {
        let persent = (rule, value, call) => { // 比例,可以为0
                if(!value) {
                    if(value === 0) {
                        return call();
                    } else {
                        return call(new Error('不能为空'))
                    }
                }
                if(value > 100) {
                    return call(new Error('不能超过100'))
                }
                if(value === 100) {
                    return call();
                }
                if(!/^(\d|[1-9]\d)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('比例格式设置不正确'))
                }
                return call();
            }
            let familyPersent = (rule, value, call) => { // 比例
                if(!value) {
                    if(value === 0) {
                        return call();
                    } else {
                        return call(new Error('不能为空'))
                    }
                }
                if(value > 100) {
                    return call(new Error('不能超过100'))
                }
                if(value === 100) {
                    return call();
                }
                if(!/^(\d|[1-9]\d)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('比例格式设置不正确'))
                }
                return call();
            }
        let money = (rule, value, call) => { // 金额
                if(!value) {
                    return call(new Error(value=='0' || value===0? '不能为0':'不能为空'))
                }
                if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
                    return call(new Error('格式不正确'));
                }
                call();
            }
        let  integer = (rule, value, call) => { // 正整数
                if(!value) {
                    return call(new Error(value===0? '不能为0':'不能为空'))
                }
                
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请输入正整数'))
                }
                return call();
            }
        let  integerDay = (rule, value, call) => { // 正整数
                if(!value) {
                    return call(new Error(value===0? '不能为0':'不能为空'))
                }
                
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请输入正整数'))
                } 

                if(value > 28) {
                    return call(new Error("提现周期不能超过28天"))
                }
                return call();
            }
        return {
            detailData: [],
            type: '',
            detailLoading: false,
            pswDialog: false,
            pswForm: {},
            conditionForm: {controlAnchor: ''},
            isCanNotEdit: true, // 是否能编辑提现设置，默认不能
            rules: {
                persent: [{validator: persent, trigger: 'blur'}],
                familyPersent: [{validator: familyPersent, trigger: 'blur'}],
                money: [{validator: money, trigger: 'blur'}],
                integer: [{validator: integer, trigger: 'blur'}],
                integerDay: [{validator: integerDay, trigger: 'blur'}]
            },
            saveLoading: false,
            pswLoading: false,
            pswDialog: false
        }
    },
    created() {
        this.getFamilyDetail();
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        goBusiness() {
            this.$router.push({path: '/businessDetail', query: {id: this.$route.query.id}})
        }, 
        getFineName(val) {
            let name = '';
            for(let item of FineSources) {
                if(val == item.key) {
                    name = item.label;
                    break;
                }
            }
            return name;
        },
        getFamilyDetail() {
            if(this.$route.query.type === 'normal') {
                // 普通家族详情
                this.detailLoading = true
                this.$http.get(this.$api.familyL1ManageDetail, {merchantId: this.$route.query.id}, true)
                .then(res => {
                    this.detailData = res
                    console.log(this.detailData)
                    this.conditionForm.escrowRatio = this.detailData.escrowRatio,
                    this.conditionForm.controlAnchor = this.detailData.controlAnchor
                    this.conditionForm.anchorCycle = this.detailData.anchorCycle
                    this.conditionForm.platformRatio = this.detailData.platformRatio
                    this.detailLoading = false
                })
                .catch(err => {
                    this.$message.error(err.message)
                    this.detailLoading = false;
                })
            }
            else {
                // 钻石家族详情
                this.detailLoading = true
                this.$http.get(this.$api.familyL2ManageDetail, {merchantId: this.$route.query.id}, true)
                .then(res => {
                    this.detailLoading = false;
                    this.detailData = res
                    this.conditionForm.escrowRatio = this.detailData.escrowRatio,
                    this.conditionForm.controlAnchor = this.detailData.controlAnchor
                    this.conditionForm.anchorCycle = this.detailData.anchorCycle
                    this.conditionForm.platformRatio = this.detailData.platformRatio
                    console.log(this.detailData)
                })
                .catch(err => {
                    this.detailLoading = false;
                    this.$message.error(err.message)
                })
            }
        },
        goHostList() { // 家族下面的主播
            this.className = sessionStorage.removeItem('className');
            this.clickIndex= sessionStorage.removeItem('subIndex');
           this.$router.push({path: '/hostList', query: {id: this.$route.query.id}})
        },
        goFamilyList() { // 钻石家族旗下家族列表
            this.className = sessionStorage.removeItem('className');
            this.clickIndex= sessionStorage.removeItem('subIndex');
            this.$router.push({path: '/normalFamily', query: {familyL2Id: this.$route.query.id}})
        },
        showPhoto() { // 取消/显示封面
            let paramList = {
                merchantId: this.$route.query.id,
                // merchantType: this.$route.query.type === 'normal' ? 'familyL1' : 'familyL2',
                // isShowPhoto: this.detailData.isShowPhoto == 0 ? 1 : 0
            }
            console.log(paramList)
            if(this.$route.query.type === 'normal') { // 普通家族
                if(this.detailData.isFamilyPhoto == 1) { // 取消显示
                    this.$http.post(this.$api.familyL1ManageCancelFamilyPhoto, paramList, true)
                    .then(res => {
                        this.$message.success('取消封面成功')
                        this.getFamilyDetail();
                    })
                    .catch(err => {
                        this.$message.error(err.message)
                    })
                } else {
                    this.$http.post(this.$api.familyL1ManageShowFamilyPhoto, paramList, true)
                    .then(res => {
                        this.$message.success('展示封面成功')
                        this.getFamilyDetail();
                    })
                    .catch(err => {
                        this.$message.error(err.message)
                    })
                }
            } else {
                if(this.detailData.isFamilyPhoto == 1) { // 取消显示
                    this.$http.post(this.$api.familyL2ManageCancelFamilyPhoto, paramList, true)
                    .then(res => {
                        this.$message.success('取消封面成功')
                        this.getFamilyDetail();
                    })
                    .catch(err => {
                        this.$message.error(err.message)
                    })
                } else {
                    this.$http.post(this.$api.familyL2ManageShowFamilyPhoto, paramList, true)
                    .then(res => {
                        this.$message.success('展示封面成功')
                        this.getFamilyDetail();
                    })
                    .catch(err => {
                        this.$message.error(err.message)
                    })
                }
            }
        },
        setControl() { // 设置主播提现
            let paramList = {
                    merchantId: this.$route.query.id,
                    isControlAnchor: this.detailData.controlAnchor
                }
            if(this.$route.query.type === 'diamond') {
                this.$http.get(this.$api.familyL2ManageControlAnchor, paramList, true)
                .then(res => {
                    this.$message.success('设置成功');
                    this.getFamilyDetail();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            } else {
                this.$http.get(this.$api.familyL1ManageControlAnchor, paramList, true)
                .then(res => {
                    this.$message.success('设置成功')
                    this.getFamilyDetail();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            }
        },
        openPsw() {
            this.pswForm = {}
            this.pswDialog = true
        },
        closePsw() {
            this.pswDialog = false
        },
        validPsw() { // 输入正确密码编辑
            this.pswLoading = true
            console.log(this.pswForm.psw)
            this.$http.post(this.$api.authPassword, {password: this.pswForm.psw}, true)
            .then(res => {
                this.$message.success("密码正确，可以修改提现条件")
                this.isCanNotEdit = false
                this.pswLoading = false
                this.pswDialog = false
            })
            .catch(err => {
                 this.$message.error(err.message);
                 this.isCanNotEdit = true;
                 this.pswLoading = false;
                 this.pswDialog = false
            })
        },
        saveCondition() {
            this.$refs["conditionForm"].validate(valid => {
                if(valid) {
                    this.saveLoading = true
                    let paramList = {
                        merchantId: this.$route.query.id,
                        escrowRatio: this.conditionForm.escrowRatio,
                        controlAnchor: this.conditionForm.controlAnchor,
                        anchorCycle: this.conditionForm.anchorCycle,
                        platformRatio: this.conditionForm.platformRatio
                    }
                    if(this.$route.query.type === 'normal') {
                        this.$http.post(this.$api.familyL1ManageWithdrawalSave, {familyL1: paramList}, true)
                        .then(res => {
                            this.$message.success("保存成功")
                            this.saveLoading = false
                            this.getFamilyDetail();
                            this.isCanNotEdit = true
                        })
                        .catch(err => {
                            this.$message.error(err.message);
                            this.saveLoading = false;
                        })
                    } else {
                        console.log(paramList)
                        this.$http.post(this.$api.familyL2ManageWithdrawalSave, {familyL2: paramList}, true)
                        .then(res => {
                            this.$message.success("保存成功")
                            this.saveLoading = false
                            this.getFamilyDetail();
                            this.isCanNotEdit = true
                        })
                        .catch(err => {
                            this.$message.error(err.message);
                            this.saveLoading = false;
                        })
                    }
                    console.log(this.conditionForm)
                } else {
                    return false
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
/deep/ .el-card {
    margin-bottom: 10px;
}
    .content {
        margin-left: 100px;
        font-size: 14px;
        line-height: 40px;
    }
    .btnClass {
        margin-bottom: 10px;
    }
    .imgSize {
        height: 60px;
        margin-right: 20px;
    }
    .back-class {
        margin-top: 20px;
        text-align: center;
    }
</style>
