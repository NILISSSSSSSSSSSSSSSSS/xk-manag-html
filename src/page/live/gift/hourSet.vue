<template>
    <div class="xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>上小时排行设置
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :model="formData" ref="formData" :rules="rules">
                <el-form-item label="上小时排行显示数"  prop="number" label-width="300px">
                   <el-input :size="$size" placeholder="请输入显示数" v-model="formData.number"></el-input>
                </el-form-item>
                <div class="content">
                    <el-button :size="$size" type="primary" @click="hourSet" v-permission="hourSetSet">确定</el-button>
                    <el-button :size="$size" type="plain">取消</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'hourSet',
    data() {
        let num = (rule, value, callback) => {
                if(!value) {
                    callback(new Error("不能为空"));
                } else if(!/^[1-9]\d*$/.test(value)) {
                    callback(new Error("请输入非0正整数"))
                } else {
                    callback();
                }
            };
        return {
            formData: {
                number: ''
            },
            rules: {
                number: [{validator: num}]
            }
        }
    },
    created() {
        this.getHourSetDetail();
    },
    methods: {
        getHourSetDetail() { // 上小时排行数
            this.$http.get(this.$api.lastHourRankingDetail, {}, true)
            .then(res => {
                this.formData = res ? res : {number: ''};
            })
            .catch(err => {
                this.$message.error(err.message)
            })
        },
        hourSet() { // 设置上小时排行数
        this.$refs["formData"].validate((val) => {
            if(val) {
                console.log(this.formData.number);
                this.$http.get(this.$api.lastHourRankingSetting, {number: this.formData.number}, true)
                .then(res => {
                    this.$message.success("设置成功");
                    this.getHourSetDetail();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            } else {
                return false;
            }
        })
        }
    }
}
</script>

<style lang="scss" scoped>
    /deep/ .el-input {
        width: 180px;
    }
    .content {
        text-align: center;
    }
</style>
