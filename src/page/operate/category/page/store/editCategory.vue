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
      </el-row>
      <el-row>
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
    name: "editCategory",
    data() {
      return {
        switchValue: 1,
        dialog: false,
        name:'',
        imgData:""
      };
    },
    created(){},
    props: {
      editDialog: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      },
      editData:{}
    },
    components: {
      ImageUpload
    },
    methods: {
      handleCancle() {
        this.dialog = false;
        this.$emit("update:editDialog", false);
      },
      handleSure(){
        if(!this.name){
          this.$message.error('分类名不能为空');
          return
        }
        if(!this.imgData){
          this.$message.error('分类图不能为空');
          return
        }
        this.$http.post(this.$api.industryUpdate, {
            enable:this.switchValue,      //是否启用
            industryId:this.editData.id,
            name:this.name,
            picUrl:this.imgData
        }, true).then((res) => {
            console.log(res)
            this.$emit("update:editDialog", false);
            this.$emit("categoryRefresh");
            this.$message({
                message: '操作成功',
                type: 'success'
            });
        }).catch((err) => {
           console.log(err)
           this.$message.error(err.message);
        });
      }
    },
    watch: {
      editDialog(val) {
        this.dialog = val;
        if(val) {
            this.name = this.editData.name;
            this.imgData = this.editData.picUrl;
            this.switchValue = this.editData.enable
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
