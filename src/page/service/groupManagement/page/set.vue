<template>
    <div class="training-set">
        <el-transfer style="text-align: left; display: inline-block" v-model="aAdminMerchants" :data="aNormalMerchants" filterable
            filter-placeholder="输入联盟商ID或者联盟商名搜索" :left-default-checked="[2, 3]" :right-default-checked="[1]" :titles="['联盟商普通成员', '联盟商管理员']"
            :button-texts="['降为普通成员', '设为管理员']" :format="{
                noChecked: '${total}',
                hasChecked: '${checked}/${total}'
            }" @change="handleChange" :render-content="renderFunc" v-loading="transferLoading">
        </el-transfer>
        <div></div>
        <el-form :inline="true" class="demo-form-inline" :size="$size">
            <el-form-item label="群名称：">
                <el-input v-model="sGroupName" placeholder="群名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :size="$size" @click="betachUpdateTeamManager" :loading="setLoading">保存</el-button>
                <el-button type="danger" :size="$size" @click="fnRemoveTeam">解散群</el-button>
                <el-button type="warning" :size="$size" @click="bChangeTrainingOwner = true">更换群主</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="选择新群主" :visible.sync="bChangeTrainingOwner" width="600px" :before-close="handleClose">
            <el-form>
                <el-form-item>
                    <!-- <el-radio v-model="newOwner" 
                        :label="item.userId" 
                        v-for="item in aMembers" 
                        :key="item"
                        v-if="item.userIdentity != 'owner'"
                        >{{item.username}}</el-radio> -->
                    <el-radio v-model="newOwner" :label="item.userId" v-for="item in aMembers" :key="item" :disabled="item.userIdentity == 'owner'?true:false">
                        {{item.username}}</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="bChangeTrainingOwner = false" :size="$size">取 消</el-button>
                <el-button type="primary" @click="changeTeamOwner" :size="$size" :loading="bSetNewOwnerLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: '',
    data() {
        return {
            aMembers: [], //所有人
            aNormalMerchants: [], //普通联盟商
            aAdminMerchants: [], //联盟商管理员
            renderFunc(h, option) {
                return <div>{option.merchantName}</div>;
            },
            sGroupName: '', //群名称
            setLoading: false,
            transferLoading: false,
            bChangeTrainingOwner: false, //更换群主弹框
            newOwner: '',
            bSetNewOwnerLoading: false
        };
    },
    props: {
        tid: {}
    },
    components: {},
    computed: {},
    created() {
        this.fnGetTrainingTeamInfo();
    },
    mounted() {},
    methods: {
        handleChange(value, direction, movedKeys) {
            // console.log(value, direction, movedKeys);
        },
        fnGetTrainingTeamInfo() {
            this.transferLoading = true;
            this.$http
                .get(this.$api.teamInfo, { tid: this.tid }, true)
                .then(res => {
                    console.log(res);
                    this.$store.commit('service/setTeamName', res.teamName); //更新群昵称
                    this.aNormalMerchants = [];
                    this.transferLoading = false;
                    res.members.forEach((item, index) => {
                        if (item.isAdmin) {
                            this.aNormalMerchants.push({
                                key: item.userId,
                                label: item.username + item.userId,
                                merchantName: item.username,
                                userIdentity: item.userIdentity,
                                disabled: item.userIdentity == 'owner' //群主不可降为普通成员
                            });
                            if (item.userIdentity == 'manager') {
                                this.aAdminMerchants.push(item.userId);
                            }
                            if (item.userIdentity == 'owner') {
                                this.aAdminMerchants.push(item.userId);
                            }
                        }
                    });
                    this.aMembers = res.members;
                    if (res.members.length) {
                        this.newOwner = this.aMembers[0].userId;
                    }
                })
                .catch(err => {
                    this.aNormalMerchants = [];
                    this.$message.error('' + err.message);
                    this.transferLoading = false;
                });
        },
        betachUpdateTeamManager() {
            this.setLoading = true;
            let obj = {
                tid: this.tid,
                userIds: JSON.parse(JSON.stringify(this.aAdminMerchants))
            };
            if (this.sGroupName) {
                obj.teamName = this.sGroupName;
            }
            console.log(obj);
            this.$http
                .post(this.$api.betachUpdateTeamManager, obj, true)
                .then(res => {
                    this.setLoading = false;
                    this.fnGetTrainingTeamInfo();
                    this.sGroupName = '';
                })
                .catch(err => {
                    //  console.log(err);
                    this.setLoading = false;
                    this.$message.error(err.message);
                });
        },
        changeTeamOwner() {
            let obj = {
                tid: this.tid,
                newOwner: this.newOwner
            };
            console.log(obj);
            this.bSetNewOwnerLoading = true;
            this.$http
                .get(this.$api.changeTeamOwner, obj, true)
                .then(res => {
                    this.bSetNewOwnerLoading = false; //设置按钮
                    this.bChangeTrainingOwner = false; //弹框
                    this.$store.commit('service/setIsMeCreate', 0);
                })
                .catch(err => {
                    //   console.log(err)
                    this.$message.error(err.message);
                    this.bSetNewOwnerLoading = false;
                    this.bChangeTrainingOwner = false;
                });
        },
        fnRemoveTeam() {
            this.$confirm('此操作将永久解散群, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http
                        .get(this.$api.teamRemove1, { tid: this.tid }, true)
                        .then(res => {
                            console.log(res);
                            this.$message({
                                type: 'success',
                                message: '群解散成功!'
                            });
                            this.$store.commit('service/setGroupTid', null);
                        })
                        .catch(err => {
                            console.log(err);
                            this.$message.error(err.message);
                        });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        }
    },
    watch: {}
};
</script>
<style lang='scss'>
// 设置
@import '../scss/set/set.scss';
</style>