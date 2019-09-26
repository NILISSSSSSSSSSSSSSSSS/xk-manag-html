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
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="分类图片：" required>
            <image-upload :more="false" v-model="imgData" size="2">
              <img style="width: 50px;height: 50px" :src="imgData" class="imgSize" v-if="imgData">
              <div v-else class="avatar">
                <i class="el-icon-plus"></i>
              </div>
            </image-upload>
            <p><span class="xk-danger">*  </span>建议尺寸：180*240px 图片大小2M以内 建议白底图片</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="是否启用：">
            <el-switch v-model="switchValue"></el-switch>
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
        switchValue: true,
        dialog: false,
        imgData:'',
        name:''
      };
    },
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
      dataInit(){
        this.switchValue=this.editData.enable?true:false;
        this.imgData=this.editData.picUrl,
        this.name=this.editData.name;
      },
      handleCancle() {
        this.dialog = false;
        this.$emit("update:editDialog", false);
      },
      handleSure(){
        let obj = {
                    category:{
                      picUrl:this.imgData,
                      enable:this.switchValue ? 1 : 0,
                      name:this.name,
                      sort:this.editData.sort,
                      level:this.editData.level,
                      pCode:this.editData.pCode,
                      code:this.editData.code
                    }
                }
        this.$http.post(this.$api.categoryUpdate, obj, true).then((res) => {
            this.dialog = false;
            this.$emit("update:editDialog", false);
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.$emit('categoryRefresh');
        }).catch((err) => {
           console.log(err,obj);
           this.$message.error(err.message)
        });
      }
    },
    watch: {
      editDialog(val) {
        this.dialog = val;
        console.log(this.editData);
        this.dataInit()
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
