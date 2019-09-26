<template>
  <div class="xk-container">
    <div class="xk-radius">
      <div class="xk-title">
        <div class="vus-title">
            <span></span>商品反馈详情
        </div>
        <div class="vus-bottom"></div>
      </div>
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col>商品名称： 张三</el-col>
        <el-col>商品ID: 12222</el-col>
        <el-col>&emsp;&emsp;&emsp;</el-col>
        <el-col>&emsp;&emsp;&emsp;</el-col>
      </el-row>
      <el-row type="flex" justify="space-between" :gutter="20" class="paddtop20">
        <el-col>用户名称： 张三</el-col>
        <el-col>用户ID: 12222</el-col>
        <el-col>手机号码： 1122121222</el-col>
        <el-col>&emsp;&emsp;&emsp;</el-col>
      </el-row>
      <el-row type="flex" justify="space-between" :gutter="20" class="paddtop20">
        <el-col>反馈内容： 张三XXXXXXXXXXXXXX</el-col>
      </el-row>
      <el-row :gutter="20" class="paddtop20">
        <el-col :span="4">反馈图片/视频：</el-col>
        <el-col :span="20">
          <div class="img-border">
            <img src="http://cpyx.xksquare.com/XKWEB/images/%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85/u1200.png" class="imgSize"/>
          </div>
          <div class="img-border">
            <img src="http://cpyx.xksquare.com/XKWEB/images/%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85/u1200.png" class="imgSize"/>
          </div>
          <div class="img-border">
            <img src="http://cpyx.xksquare.com/XKWEB/images/%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85/u1200.png" class="imgSize"/>
          </div>
          <div class="img-border">
            <img src="http://cpyx.xksquare.com/XKWEB/images/%E8%AE%A2%E5%8D%95%E8%AF%A6%E6%83%85/u1200.png" class="imgSize"/>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" :gutter="20" class="paddtop20">
        <el-col>反馈时间： 2018-09-09 12:12:12</el-col>
      </el-row>
      <div class="content">
          <el-button type="primary" :size="$size" @click="feedback">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    name: "InfoGoodsDetails",
    data() {
      return {

      }
    },
    methods: {
    feedback() {
      this.$router.push({path: "/feedback"});
    }
    }
}

</script>

<style lang="scss" scoped>
.img-border {
  display: inline-block;
  margin-bottom: 20px;
  margin-right: 20px;
}
.imgSize {
  height: 100px;
}
.content {
  margin-top: 20px;
  text-align: center;
}
</style>
