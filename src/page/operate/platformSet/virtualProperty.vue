<template>
 <div class = 'virtual-property xk-container'>
        <div class='xk-radius'>
            <div class='xk-title'>
                <div class='vus-title'>
                    <span></span>虚拟资产汇率设置
                </div>
                <div class='vus-bottom'></div>
            </div>
            <el-form :inline="true" :model="detailData" ref="detailData" v-loading="formLoading">
                <div style="margin-left: 100px" v-for="(item, index) in detailData" :key="item">
                        <span class="location">现金（RMB）1元 = </span>
                        <xk-form-item :prop="index + '.exAmount'" type="money">
                            <el-input :size="$size" v-model.number="item.exAmount"></el-input>
                        </xk-form-item>
                        <span class="location">{{ item.currency | formatType }}</span>
                </div>
                <div class='xk-title'>
                    <div class='vus-title'>
                        <span></span>虚拟资产充值限额
                    </div>
                    <div class='vus-bottom'></div>
                </div>
                <div style="margin-left: 100px">
                        <span class="location">充值晓可币限额&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <xk-form-item prop="total" type="money">
                            <el-input class="limit-input" :size="$size" v-model.number="detailData.total"></el-input>
                        </xk-form-item>
                        <span class="location">晓可币</span>
                </div>
            </el-form>
            <div class="btn-group">
                <el-button :loading="btnLoading" :size="$size" type="primary" @click="save()" v-permission="virtualPropertySet">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import XkFormItem from '@/components/common/XKFormItem.vue';

const mapCurrency = new Map([['xkb',{name: '晓可币'}],['xfq',{name: '消费券'}],['swq',{name: '实物券'}],['zs',{name: '钻石'}]]);
export default {
  components: {
      XkFormItem
  },
  data () {
    return {
       defaultData: [
           {
               currency: 'xkb',
               exAmount: null,
               unit: 'fen'
           },
           {
               currency: 'xfq',
               exAmount: null,
               unit: 'fen'
           },
           {
               currency: 'zs',
               exAmount: null,
               unit: 'fen'
           },
           {
               currency: 'swq',
               exAmount: null,
               unit: 'fen'
           }
       ],
       detailData: [],
       btnLoading: false,
       formLoading: false
    }
  },
  created() {
      this.getProprtyDetail();
  },
  methods: {
      getProprtyDetail() { // 获取详情
          this.formLoading = true
          this.$http.get(this.$api.RmbExchangeRateQList, {}, true)
          .then(res => {
              if(!res) {
                  this.detailData = JSON.parse(JSON.stringify(this.defaultData));
              } else {
                  this.detailData = res
              }
              this.formLoading = false
          })
          .catch(err => {
              this.$message.error(err.message)
              this.formLoadig = false
          })
      },
      save() {
          this.$refs["detailData"].validate((valid) => {
              if(valid) {
                  this.btnLoading = true
                  for(let item of this.detailData) {
                    item.exAmount = Number(item.exAmount);
                    delete item.createdAt;
                    delete item.status;
                    delete item.updatedAt;
                  }
                  console.log(this.detailData)
                this.$http.post(this.$api.RmbExchangeRateCreate, {rmbExchangeRates:this.detailData}, true)
                .then(res => {
                    this.$message.success("保存成功");
                    this.btnLoading = false;
                    this.getProprtyDetail();
                })
                .catch(err => {
                    this.$message.error(err.message);
                    this.btnLoading = false;
                })
              } else {
                  return false;
              }
          })
      }
  },
  filters: {
      formatType(val) {
          if(val) {
              return mapCurrency.get(val).name;
          }
      }
  }
}
</script>

<style lang="scss" scoped>
.virtual-property {
     /deep/ .el-input {
        width: 80px;
    }
    .limit-input {
        width: 160px;
    }
    .positionClass {
        margin-top: 20px;
        margin-left: 100px;
    }
    .content {
        text-align: center;
    }
    .location {
        line-height: 40px;
    }
}
</style>