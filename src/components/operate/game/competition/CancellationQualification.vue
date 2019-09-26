<template>
        <el-dialog title="取消比赛资格"   append-to-body  :visible.sync="cancellationQualificationDia"  top="130px" :before-close="handleClose"  width="500px">
          <div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
                    <el-form-item label-width="120px" label="取消原因：" prop="cancelReason">
                        <el-select :size="$size" v-model="ruleForm.cancelReason" placeholder="请选择">
                                    <el-option
                                    v-for="(item,index) in reasonList"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="sub-btn" style="text-align:center">
                <el-button :size="$size" @click="handleClose">取 消</el-button>
                <el-button @click="cancel('ruleForm')" :size="$size">确 定</el-button>
            </div>
        </el-dialog>
</template>
<script>
const reasonList1 = [
    { name: "违反晓可平台比赛规则", value: "违反晓可平台比赛规则" },
    { name: "上传违规作品", value: "上传违规作品" },
    { name: "违规操作比赛成绩", value: "违规操作比赛成绩" },
];
const reasonList2 = [
    { name: "涉及敏感内容", value: "涉及敏感内容" },
    { name: "内容不符合比赛规格", value: "内容不符合比赛规格" },
    { name: "涉嫌恶劣刷分", value: "涉嫌恶劣刷分" },
];
    export default {
        name:"取消比赛资格",
        props:{
            cancellationQualificationDia: {
                type: Boolean,
                default: false
            },
            reasonType:{
                default:""
            },
            applyId:{
                default:""
            }
        },
        data(){
          return{
            reasonList:this.reasonType=='reason2' ? reasonList2 : reasonList1, //如果是上传类竞赛页面，则用原因2
           ruleForm: {
                cancelReason: ""
            },
            rules: {
                cancelReason: [
                    {
                        required: true,
                        message: "请选择原因",
                        trigger: "change"
                    }
                ]
            },
          }
        },
        methods:{
           handleClose(){
                this.$emit("update:cancellationQualificationDia", false)
           },
           cancel(formName){
                 this.$refs[formName].validate(valid => {
                    if (valid) {
                           let data = { applyId: this.applyId,cancelReason:this.ruleForm.cancelReason };
                           console.log(data);
                            this.$http
                                .get(this.$api.disqualification, data, true)
                                .then(res => {
                                    this.$message.success("取消成功");
                                    this.$emit("cancelQualificationSuccess");
                                    this.handleClose();
                                })
                                .catch(res => {
                                    this.$message.error(res.message);
                                });
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
           }
        }
    }
</script>