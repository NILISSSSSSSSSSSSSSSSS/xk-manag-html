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
            <image-upload :more="false" v-model="imgData">
              <img style="width: 50px;height: 50px" :src="imgData" class="imgSize" v-if="imgData">
              <div v-else class="avatar">
                <i class="el-icon-plus"></i>
              </div>
            </image-upload>
            <!--<div>(点击上传图片)</div>-->
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
        data: [],
        switchValue: false,
        imgData: "",
        dialog: false,
        name:''
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
                      jfCategory:{
                          picUrl:this.imgData,
                          enable:this.switchValue ? 1 : 0,
                          name:this.name,
                          sort:this.lastSort + 1
                      }
                    }
          this.$http.post(this.$api.createJFCategory, obj, true).then((res) => {
             this.dialog = false;
             this.$emit("update:firstDialog", false);
             this.$emit('categoryRefresh');
             this.$message({
                message: '添加成功！',
                type: 'success'
              });
          }).catch((err) => {
             console.log(obj)
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
