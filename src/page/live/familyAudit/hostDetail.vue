<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>主播详情
                </div>
                <div class="vus-bottom"></div>
            </div>
            <div v-loading="loading">
            <el-card>
                <div>基本信息</div>
                <el-row>
                    <el-col :span="18">
                        <div class="content">
                            <div>主播名称：{{detailData.nickName}}</div>
                            <div>主播安全码：{{detailData.securityCode}}</div>
                            <div>入驻时间：{{detailData.createdAt | formatTime}}</div>
                            <div>当前家族：{{detailData.currentFamilyName}}</div>
                            <div>原始家族：{{detailData.originalFamilyName}}</div>
                            <div>主播状态：{{detailData.bizStatus === 'enable' ? '激活': '禁用'}}</div>
                            <div>平台推荐：
                                <el-radio-group v-model="detailData.recommendLevel" style="margin-right: 20px">s
                                    <el-radio label="A">A级平台推荐</el-radio>
                                    <el-radio label="B">B级平台推荐</el-radio>
                                    <el-radio label="C">C级平台推荐</el-radio>
                                    <el-radio label="NO">不推荐</el-radio>
                                </el-radio-group>
                                <el-button type="primary" :size="$size" @click="saveSetting">保存推荐</el-button>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="6" style="text-align:right">
                       <div class="btnClass">
                           <el-button :size="$size" type="primary" @click="goBusiness">查看联盟商详情页</el-button>
                       </div>
                       <div class="btnClass">
                           <el-button :size="$size" type="primary" @click="openPsw">输入密码更改考核条件</el-button>
                       </div>
                       <!-- <div class="btnClass">
                           <el-button :size="$size" type="primary">输入密码更改考核条件</el-button>
                       </div>
                       <div class="btnClass">
                           <el-button :size="$size" type="primary">设为不参与考核</el-button>
                       </div>
                       <div class="btnClass">
                           <el-button :size="$size" type="primary">更改家族</el-button>
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
            <!-- <el-card>
                <div>业绩信息</div>
                <div class="content">
                    <div>总贡献：{{detailData.totalContribution}}元</div>
                    <div>本月贡献：{{detailData.monthContribution}}元</div>
                    <div>本月直播时长：{{detailData.monthDuration}}小时</div>
                    <div>本月小视频数量：{{detailData.monthVideoNum}}个</div>
                    <div>累计小视频数量：{{detailData.totalVideoNum}}个</div>
                </div>
            </el-card> -->
            <el-card>
                <div>提现设置</div>
                <div class="content">
                    <div>主播提现周期：{{detailData.timeCycle}}天</div>
                    <!-- <div>家族代管比例：{{detailData.escrowRatio}}‰</div> -->
                     <el-form :model="conditionForm" label-width="140px" ref="conditionForm">
                        <el-form-item label="家族代管比例：" prop="escrowRatio" :rules="rules.familyPersent">
                            <el-input :size="$size" style="width: 80px;margin-right: 5px" 
                            :disabled="isCanNotEdit" v-model.number="conditionForm.escrowRatio"></el-input>%
                            <span style='display: inline-block; color: #E6A23C;margin-left: 20px;'>(最大比例为{{this.maxNum ? this.maxNum : 0}}%)</span>
                        </el-form-item>
                    </el-form>
                </div>
            </el-card>
            </div>
            <div class="back-class">
                <el-button :size="$size" type="primary" :disabled="isCanNotEdit" :loading="saveLoading" @click="saveCondition">保存更改</el-button>
                <el-button :size="$size" type="plain" @click="goBack">返回</el-button>
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
    name:'hostDetail',
    data() {
        let persent = (rule, value, call) => { // 比例
                if(!value) {
                    return call(new Error(value===0?'不能为0':'不能为空'))
                }
                if(value==100) {
                    return call(new Error('不能超过100'))
                }
                if(!/^(\d|[1-9]\d)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('比例格式设置不正确'))
                }
                return call();
            }
            // let familyPersent = (rule, value, call) => { // 比例
            //     if(!value) {
            //         if(value === 0) {
            //             return call();
            //         } else {
            //             return call(new Error('不能为空'))
            //         }
            //     }
            //     if(value > 90) {
            //         return call(new Error('不能超过90'))
            //     }
            //     if(!/^(\d|[1-9]\d)(\.\d{1,2})?$/.test(value)) {
            //         return call(new Error('比例格式设置不正确'))
            //     }
            //     return call();
            // }
        return {
            detailData: {},
            loading: false,
            isCanNotEdit: true,
            conditionForm: {},
            rules: {
                persent: [{validator: persent, trigger: 'blur'}],
                familyPersent: [{validator: this.familyPersent, trigger: 'blur'}]
            },
            saveLoading: false,
            pswDialog: false,
            pswForm: {},
            pswLoading: false,
            maxNum: 0
        }
    },
    created() {
        this.getHostDetail();
    },
    methods: {
        familyPersent(rule, value, call) { // 比例
                if(!value) {
                    if(value === 0) {
                        return call();
                    } else {
                        return call(new Error('不能为空'))
                    }
                }
                if(value > this.maxNum) {
                    return call(new Error(`不能超过${this.maxNum}`))
                }
                if(value === 100) {
                    return call();
                }
                if(!/^(\d|[1-9]\d)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('比例格式设置不正确'))
                }
                return call();
            },
        getFineName(val) { // 转换处罚名字
            let name = '';
            for(let item of FineSources) {
                if(val == item.key) {
                    name = item.label;
                    break;
                }
            }
            return name;
        },
        getHostDetail() { // 主播详情
            this.loading = true
            this.$http.get(this.$api.familyL1ManageAnchorDetail, {merchantId: this.$route.query.id}, true)
            .then(res => {
                this.detailData = res;
                console.log(this.detailData)
                this.conditionForm.escrowRatio = this.detailData.escrowRatio
                this.maxNum = this.detailData.familyEscrowRatio ? this.detailData.familyEscrowRatio : 0
                this.loading = false;
            })
            .catch(err => {
                this.$message.error(err.message)
                this.loading = false;
            })
        },
        goBack() {
            this.$router.go(-1);
        },
        goBusiness() {
            this.$router.push({path: 'businessDetail', query: {id: this.$route.query.id}})
        },
        saveSetting() {
            let paramList = {
                merchantId: this.$route.query.id,
                recommendLevel: this.detailData.recommendLevel
            }
            this.$http.get(this.$api.platformRecommendSetting, paramList, true)
            .then(res => {
                this.$message.success('保存成功');
                this.getHostDetail();
            })
            .catch(err => {
                this.$message.error(err.message);
            })
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
                    let paramList = {
                        merchantId: this.$route.query.id,
                        escrowRatio: this.conditionForm.escrowRatio
                    }
                    this.saveLoading = true
                    console.log(paramList)
                    this.$http.get(this.$api.familyL1ManageAnchorWithdrawalSave, paramList, true)
                    .then(res => {
                        this.$message.success('保存成功');
                        this.saveLoading = false
                        this.getHostDetail();
                        this.isCanNotEdit = true
                    })
                    .catch(err => {
                        this.$message.error(err.message);
                        this.saveLoading = false
                    })
                } else {
                    return false;
                }
            })
            
        },
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
    .back-class {
        margin-top: 20px;
        text-align: center;
    }
</style>
