<template>
  <div class="xk-container">
    <div class="xk-radius">
      <div class="xk-title">
        <div class="vus-title">
          <span></span>编辑品牌
        </div>
        <div class="vus-bottom"></div>
      </div>
      <el-form label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="分类名称：">
              <el-input :size="$size"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="分类图片：">
              <image-upload :more="false" v-model="imgData">
                <img :src="imgData" class="imgSize" v-if="imgData">
                <div v-else class="avatar">
                  <i class="el-icon-plus"></i>
                </div>
              </image-upload>
              <div>(点击图片重新上传)</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="品牌描述：">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否启用：">
              <el-switch v-model="switchValue"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="content">
        <el-button :size="$size" type="primary" @click="selfMallCategory">确定</el-button>
        <el-button :size="$size" type="plain" @click="selfMallCategory">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import ImageUpload from "@/components/ImageUpload";
  export default {
    name: "brandInfo",
    data() {
      return {
        data: [],
        switchValue: "false",
        imgData:
          "https://img12.360buyimg.com/jdcms/jfs/t2563/328/415143299/24365/e8a01b9b/564c4175N92a2e171.jpg"
      };
    },
    methods: {
      selfMallCategory() {
        this.$router.push({ path: "/brandList" });
      }
    },
    components: {
      ImageUpload
    }
  };
</script>

<style lang="scss" scoped>
  .imgSize {
    width: 320px;
    height: 160px;
  }
  .content {
    margin: 0 auto;
    text-align: center;
  }
</style>
