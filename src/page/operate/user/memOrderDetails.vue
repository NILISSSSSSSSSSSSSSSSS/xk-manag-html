<template>
  <div class="xk-container">
    <!--搜索头-->
      <div class="xk-radius">
        <div class='xk-title'>
          <div class="vus-title">
              <span></span>订单详情
          </div>
            <div class="vus-bottom"></div>
        </div>
        <div class="pubpadd">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>订单信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>订单ID： 1213324134</el-col>
                        <el-col>下单时间：2018-03-24 12：00：00</el-col>
                        <el-col>购买次数：2次</el-col>
                        <el-col>总质量：5Kg</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>参与活动促销： 3C数码品类满1000减200</el-col>
                        <el-col>使用优惠券：无</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>商品总价格： 17598元</el-col>
                        <el-col>会员折扣：880元</el-col>
                        <el-col>运费： 0元</el-col>
                        <el-col>抵扣/满减总金额：200元</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>订单总金额： 17598元</el-col>
                        <el-col>支付方式：微信支付</el-col>
                        <el-col>订单状态：已完成</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20" >
                <div slot="header" class="clearfix">
                    <span>商品信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>子单ID： 1213324134</el-col>
                        <el-col>数量：1</el-col>
                        <el-col>子单状态：已完成</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>商品ID： 123344</el-col>
                        <el-col>商品名称：无</el-col>
                        <el-col>商品类型：全新</el-col>
                        <el-col>商品分类：3C数码，笔记本</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>商品规格： 白色/512g</el-col>
                        <el-col>商品价格：8799元</el-col>
                        <el-col>商品品牌： Apple</el-col>
                        <el-col>商品系列：mac</el-col>
                    </el-row>
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>商品质量： 2.5kg</el-col>
                        <el-col>上市时间：2017-08-09</el-col>
                        <el-col>赠送消费券：3000消费券</el-col>
                        <el-col>运费设置：包邮</el-col>
                    </el-row>
                    <el-row class="paddtop20">
                      <el-col :span="6">商品图片：<img src="https://www.duohui.cn/img/why/features-icon-tech.png" class="imgSize"/></el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20" >
                <div slot="header" class="clearfix">
                    <span>用户信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>用户名： 张三</el-col>
                        <el-col>手机号码：xxxx</el-col>
                        <el-col>会员：普通会员</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card margintop20" >
                <div slot="header" class="clearfix">
                    <span>收货人信息：</span>
                </div>
                <div class="paddBoth">
                    <el-row type="flex" justify="space-between" class=" paddtop20">
                        <el-col>姓名： 张三</el-col>
                        <el-col>手机号码：xxxx</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                        <el-col>&emsp;&emsp;&emsp;</el-col>
                    </el-row>
                    <el-row class="paddtop20">
                        <el-col :span="12">收货地址： 四川省成都市锦江区红星路二段日出东方花园4栋2单元3312室</el-col>
                        <el-col :span="12">邮编：6666666</el-col>
                    </el-row>
                    <el-row class="paddtop20">
                      <el-col>留言： 请一起发货，谢谢</el-col>
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
      name: "memOrderDetails",
      data() {
        return {

        }
      },
      methods: {
        orderRecord() {
          this.$router.push({path: "/orderRecord"});
        }
      }
  }
</script>

<style scoped>
.imgSize {
  margin-left: 10px;
  width: 100px;
  height: 100px;
  vertical-align: top
}
.content {
  margin: 20px auto;
  text-align: center;
}
</style>
