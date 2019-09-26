<template>
    <el-dialog title="短信渠道配置" :visible.sync="dialogVisible" :before-close="handleClose" width="600px">
        <el-form :rules="rules" ref="channelForm" label-width="80px" label-position="right" :model="channelForm">
            <el-form-item label="渠道：" prop="channel">
                <el-row>
                    <el-col :span="20">
                        <el-select v-model="channelForm.channel" prop="channel" :size="$size" style="width: 100%">
                            <el-option v-for="(item,index) in type" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="产品：" prop="product">
                <el-row>
                    <el-col :span="20">
                        <el-input :size="$size" v-model="channelForm.product"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
             <el-form-item label="域名：" prop="domain">
                <el-row>
                    <el-col :span="20">
                        <el-input :size="$size" v-model="channelForm.domain"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="APPid：" prop="appId">
                <el-row>
                    <el-col :span="20">
                        <el-input :size="$size" v-model="channelForm.appId"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="密钥：" prop="secret">
                <el-row>
                    <el-col :span="20">
                        <el-input :size="$size" v-model="channelForm.secret"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="占位符：">
                <el-row>
                    <el-col :span="10">
                        <el-form-item label="前:" prop="placeholderPrefix" label-width="40px">
                            <el-col :span="24">
                                <el-input :size="$size" v-model="channelForm.placeholderPrefix" placeholder="${"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                     <el-col :span="10">
                        <el-form-item label="后:" prop="placeholderSuffix" label-width="40px">
                            <el-col :span="24">
                                <el-input :size="$size" v-model="channelForm.placeholderSuffix" placeholder="}"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="优先级：" prop="index">
                <el-row>
                    <el-col :span="20">
                        <el-input :size="$size" v-model="channelForm.index"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <div class="content">
                <el-button :size="$size" type="primary" @click="handleSubmit" :loading="loading">保存</el-button>
                <el-button :size="$size" type="plain" @click="handleClose">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
  name: "AddInfoChannel",
  props: {
    addDialog: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: ()=>({})
    }
  },

  data() {
    return {
      dialogVisible: false,
      channelForm: {
          channel: "",
          product: "",
          domain: "",
          appId: "",
          secret: "",
          placeholderPrefix: "",
          placeholderSuffix: "",
          index: ""
      },
      type: [
        {
          label: " 阿里云短信",
          value: "ALIYUN"
        },
        {
          label: "腾讯云短信",
          value: "TENCENT"
        }
      ],
      loading: false,
      rules: {
        channel: [{ required: true, message: "请选择渠道", trigger: "blur" }],
        product: [{ required: true, message: "不能为空", trigger: "blur" }],
        domain: [{ required: true, message: "不能为空", trigger: "blur" }],
        appId: [{ required: true, message: "不能为空", trigger: "blur" }],
        secret: [{ required: true, message: "不能为空", trigger: "blur" }],
        placeholderPrefix: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        placeholderSuffix: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        index: [{ required: true, message: "不能为空", trigger: "blur" }]
      }
    };
  },
  watch: {
    addDialog(val) {
      this.dialogVisible = val;
    },
    formData(val) {
      this.channelForm = val;
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$emit("update:addDialog", false);
      this.$refs["channelForm"].resetFields(); // 清空验证规则
    },
    handleSubmit() {
      this.$refs["channelForm"].validate(valid => {
        if (valid) {
          if (this.channelForm.id) {
            this.loading = true;
            console.log(this.channelForm);
            this.$http.get(this.$api.smsChannelUpdate, this.channelForm, true)
              .then(res => {
                this.loading = false;
                this.dialogVisible = false;
                this.$emit("update:addDialog", false);
                this.$emit("success");
                this.$message.success("编辑成功");
              })
              .catch(err => {
                this.loading = false;
                this.dialogVisible = false;
                this.loading = false;
                this.$emit("update:addDialog", false);
                this.$emit("success");
                this.$message.error(err.message);
              });
          } else {
            let paramList = {
              channel: this.channelForm.channel,
              product: this.channelForm.product,
              domain: this.channelForm.domain,
              appId: this.channelForm.appId,
              secret: this.channelForm.secret,
              placeholderPrefix: this.channelForm.placeholderPrefix,
              placeholderSuffix: this.channelForm.placeholderSuffix,
              index: this.channelForm.index
            };
            this.$http
              .get(this.$api.smsChannelCreate, paramList, true)
              .then(res => {
                this.dialogVisible = false;
                this.$emit("update:addDialog", false);
                this.$emit("success");
                this.$message.success("创建成功");
              })
              .catch(err => {
                this.dialogVisible = false;
                this.$emit("update:addDialog", false);
                this.$emit("success");
                this.$message.error(err.message);
              });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  text-align: center;
}
</style>
