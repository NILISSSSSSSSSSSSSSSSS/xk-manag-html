<template>
  <el-dialog
    :visible.sync="dialog"
    width="600px"
    :before-close="handleCancle"
    :title="title"
  >
    <el-form label-width="120px">
      <el-row>
        <el-col>
          <el-form-item label="分类名称：" required>
            <el-input :size="$size" v-model="name"></el-input>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="分类图片：" required>
            <image-upload :more="false" v-model="imgData">
              <img style="width: 50px;height: 50px" :src="imgData" class="imgSize" v-if="imgData">
              <div v-else class="avatar">
                <i class="el-icon-plus"></i>
              </div>
            </image-upload>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="是否启用：">
              <el-switch v-model="switchValue" :active-value="1" :inactive-value="0"></el-switch>
              <p style="line-height: 1.2"><span class="xk-danger">*  </span>打开启用，该分类将可以关联商品，可以显示在首页icon管理和前台分类列表中</p>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="content">
      <el-button :size="$size" type="plain" @click="handleCancle">取消</el-button>
      <el-button :size="$size" type="primary" @click="handleSure">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import ImageUpload from "@/components/ImageUpload";
  export default {
    name: "addSecondCategory",
    data() {
      return {
        switchValue: 1,
        data: [],
        dialog: false,
        name:'',
        imgData:''
      };
    },
    props: {
      firstDialog: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      }
    },
    components: {
      ImageUpload
    },
    methods: {
      dataInit(){
        this.name = '',
        this.imgData = ''
      },
      handleCancle() {
        this.dialog = false;
        this.$emit("update:firstDialog", false);
      },
      handleSure(){
        console.log(this.imgData)
          if(!this.name){
            this.$message.error('分类名称不能为空！');
            return ;
          }
          if(!this.imgData){
            this.$message.error('分类图片不能为空！');
            return ;
          }
          this.$http.post(this.$api.industryOneCreate,{name:this.name,picUrl:this.imgData, enable: this.switchValue} , true).then((res) => {
            console.log(res)
            this.$emit("update:firstDialog", false);
            this.$emit("categoryRefresh");
            this.$message({
              message: '操作成功',
              type: 'success'
            });
          }).catch((err) => {
            console.log(err)
            this.$emit("update:firstDialog", false);
            this.$message.error(err.message);
          });
      }
    },
    watch: {
      firstDialog(val) {
        this.dialog = val;
        if(this.firstDialog){
          this.dataInit()
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .avatar {
    width: 50px;
    height: 50px;
    line-height: 60px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }
  .avatar:hover {
    border: 1px dashed #4c63b7;
  }
  .el-icon-plus {
    font-size: 28px;
    color: #8c939d;
  }
  .imgSize {
    width: 320px;
    height: 160px;
  }
  .content {
    margin: 0 auto;
    text-align: center;
  }
</style>
