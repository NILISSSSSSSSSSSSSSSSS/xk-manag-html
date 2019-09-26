<template>
    <div class="xk-container">
        <!--标题-->
        <div class="xk-radius">
            <div class='xk-title'>
                <div class="vus-title">
                    <span></span>请选择添加奖品的方式
                </div>
                <div class="vus-btn"></div>
                <div class="vus-bottom"></div>
            </div>
            <div class="marintop20">
                <el-row type="flex" justify="center" >
                    <el-col style="margin-right: 300px" :span="6" v-permission="'prizesAddWelfare'">
                        <div @click="goPrizesAddList">
                            <el-card class="box-card list">
                                新增奖品
                            </el-card>
                        </div>
                    </el-col>
                    <el-col :span="6" v-permission="'prizesAddMall'">
                        <div @click="goPrizesSelf">
                            <el-card class="box-card list">
                                从自营商城选择奖品
                            </el-card>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: "prize",
        components: {
        },
        data(){
            return{

            }
        },
        methods:{
            //去新增奖品列表
            goPrizesAddList(){
                this.$router.push('prizesAddList');
            },
            //去选择自营奖品
            goPrizesSelf(){
                this.$router.push('prizesSelf');
            }
        }
    }
</script>

<style lang='scss' scoped>
    .list{
        width: 400px;
        height: 400px;
        line-height: 400px;
        text-align: center;
        color: #20A0FF;
        font-size: 18px;
        margin-bottom: 100px;
        &:hover{
            cursor: pointer;
        }
    }
</style>
