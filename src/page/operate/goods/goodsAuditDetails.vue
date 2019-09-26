<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>商品详情
          </div>
            <div class="vus-bottom"></div>
        </div>
        <div class="pubpadd">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>详情信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between">
                        <el-col>商品类型： 服务类</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>状态：xxx店铺 服务类-子类 在架</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>商品名称： 暗杀奥所啥所</el-col>
                        <el-col>是否需要预约：是</el-col>
                        <el-col>是否可退： 消费前随时可退</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>店铺图片： </el-col>
                        <el-col><img src="" class="imgSize"></el-col>
                        <el-col><img src="" class="imgSize"></el-col>
                        <el-col><img src="" class="imgSize"></el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>规格设置： </el-col>
                        <el-col></el-col>
                        <el-col></el-col>
                        <el-col></el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>价格设置： </el-col>
                        <el-col></el-col>
                        <el-col></el-col>
                        <el-col></el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>商品介绍： </el-col>
                    </el-row>
                </div>
              </el-card>
              <el-card class="box-card margintop20" >
                  <div slot="header" class="clearfix">
                      <span>审核：</span>
                  </div>
                  <div class="paddBoth">
                      <el-row type="flex" justify="space-between">
                          <el-col>审核结果：
                            <el-radio v-model="radio" label="SUCCESS">通过</el-radio>
                            <el-radio v-model="radio" label="FAILED">不通过</el-radio>
                          </el-col>
                          <el-col>
                            <el-input type="textarea" placeholder="请输入不通过原因" :autosize="{minRows:2, maxRows: 4}"></el-input>
                          </el-col>
                          <el-col>&emsp;&emsp;&emsp;</el-col>
                          <el-col>&emsp;&emsp;&emsp;</el-col>
                      </el-row>
                  </div>
              </el-card>
                <div class="content">
                  <el-button type="primary" @click="orderRecord">确定</el-button>
                </div>
          </div>
      </div>

  </div>
</template>
<script>
export default {
    name: "goodsAuditDetails",
    data() {
      return {
        labelPosition: "right",
        searchForm: [],
        radio: "0"
    }
  }
}

</script>

<style lang="scss" scoped>
.imgSize {
  margin-left: 10px;
  width: 200px;
  height: 100px;
  vertical-align: top
}
.content {
  margin: 20px auto;
  text-align: center;
}
</style>
