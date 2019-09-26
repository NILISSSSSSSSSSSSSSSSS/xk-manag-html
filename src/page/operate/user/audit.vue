<template>
  <div class="xk-container">
    <div class="xk-radius">
      <div class="xk-title">
        <div class="vus-title">
            <span></span>选择审核
        </div>
        <div class="vus-bottom"></div>
      </div>
      <el-row type="flex" justify="space-between" :gutter="20">
        <el-col>
          <el-card>
            <div class="card" @click="merchantAudit">
              <div class="content">
                <div>商户审核</div>
                <div class="circle">
                  <div>{{merchantNum}}</div>
                </div>
                 <div class="text">待审核</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col>
          <el-card>
            <div class="card" @click="storeAudit">
               <div class="content">
                <div>商铺审核</div>
                <div class="circle">
                  <div>{{storeNum}}</div>
                </div>
                 <div class="text">待审核</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
    name: "audit",
    data() {
      return {
        merchantNum: 0,
        storeNum: 0
      }
    },
    created() {
      this.getNumbers();
    },
    methods: {
      merchantAudit() {
        this.$router.push({path: "/merchantAudit"})
      },
      storeAudit() {
        this.$router.push({path: "/storeAudit"})
      },
      getNumbers() {
        this.$http.get(this.$api.NotAuthNum, {}, true)
        .then(res => {
          this.merchantNum = res.merchantNotAuthNum;
          this.storeNum = res.shopNotAuthNum;
        })
        .catch(err => {
          this.$message.error("获取未审核数量失败")
        })
      }
    }
}

</script>

<style lang="scss" scoped>
.card {
  position: relative;
  height: 300px;
  // line-height: 300px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #4C63B7;
}
.content {
  position: absolute;
  height: 100px;
  width: 100px;
  left: 50%;
  top: 50%;
  margin-top: -40px;
  margin-left: -40px;
}
.circle {
  margin: 0 auto;
  height: 50px;
  width: 50px;
  margin-top: 5px;
  margin-bottom: 5px;
  line-height: 50px;
  border-radius: 50px;
  border: solid 2px #4C63B7;
}
.text {
  font-size: 16px;
  color: #000000;
  font-weight: normal;
}
</style>
