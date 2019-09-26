<template>
  <el-dialog
    :visible.sync="dialog"
    width="600px"
    :before-close="handleCancle"
    :title="title"
    class="xk-dialog"
  >
    <el-form label-width="120px">
      <el-row>
        <el-col>
          <el-form-item label="分类名称：">
            <el-input :size="$size"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="分类图片：">
            <image-upload :more="false" v-model="imgData">
              <img :src="imgData" class="imgSize" v-if="imgData">
              <div v-else class="avatar">
                <i class="el-icon-plus"></i>
              </div>
            </image-upload>
            <div>(点击上传图片)</div>
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
      <el-button :size="$size" type="primary" @click="handleCancle">确定</el-button>
      <el-button :size="$size" type="plain" @click="handleCancle">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import ImageUpload from "@/components/ImageUpload";
  export default {
    name: "addSecondCategory",
    props: {
      secondDialog: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        data: [],
        switchValue: "false",
        imgData: "",
        dialog: false
      };
    },
    watch: {
      secondDialog(val) {
        this.dialog = val;
      }
    },
    methods: {
      handleCancle() {
        this.dialog = false;
        this.$emit("update:secondDialog", false);
      }
    },
    components: {
      ImageUpload
    }
  };
</script>

<style lang="scss" scoped>
  .avatar {
    width: 320px;
    height: 160px;
    line-height: 160px;
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
