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
            <p><span class="xk-danger">*  </span>建议尺寸：180*240px 图片大小2M以内  建议白底图片</p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="是否启用：">
            <el-switch v-model="switchValue"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="content">
      <el-button :size="$size" type="plain" @click="handleCancle">取消</el-button>
      <el-button :size="$size" type="primary" @click="handleSure" :loading="saveLoading" :disabled="saveLoading">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import ImageUpload from "@/components/ImageUpload";
  export default {
    name: "addSecondCategory",
    data() {
      return {
        data: [],
        switchValue: false,
        imgData: "",
        dialog: false,
        name:'',
        saveLoading: false
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
      },
      lastSort:{
        type:Number,
        default:1
      }
    },
    components: {
      ImageUpload
    },
    methods: {
      dataInit(){
        this.switchValue = false ;
        this.imgData = '';
        this.name = ''
      },
      handleCancle() {
        this.dialog = false;
        this.$emit("update:firstDialog", false);
      },
      handleSure(){
          if(!this.name){
            this.$message.error('分类名称不能为空！');
            return ;
          }
          if(!this.imgData){
            this.$message.error('分类图片不能为空！');
            return ;
          }
          let obj = {
                      categoryCreateDTO:{
                          category:{
                              picUrl:this.imgData,
                              enable:this.switchValue ? 1 : 0,
                              name:this.name,
                              sort:this.lastSort + 1,
                              level:1,
                              pCode:0
                          }
                      }
                    }
            this.saveLoading = true;
          this.$http.post(this.$api.categoryCreate, obj, true).then((res) => {
             this.dialog = false;
             this.saveLoading = false;
             this.$emit("update:firstDialog", false);
             this.$emit('categoryRefresh');
             this.$message({
                message: '添加成功！',
                type: 'success'
              });
          }).catch((err) => {
             this.saveLoading = false;
             this.$message.error(err.message)
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
