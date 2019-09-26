<template>
  <div class = 'creat-user-group'>
        <el-form ref="oForm" :model="oForm" label-width="130px" :size="$size">
            <el-form-item label="名称：">
                <el-input v-model="oForm.name" placeholder='填写用户组名称'></el-input>
            </el-form-item>
            <el-form-item label="描述：">
                <el-input v-model="oForm.describe" type='textarea' autosize></el-input>
            </el-form-item>
            <el-form-item label="选择用户组成员：">
                <div class="xk-radius">
                    <div class="xk-title">
                        <div class="vus-title">
                            <span></span>筛选
                        </div>
                        <div class="vus-btn">
                            <!-- <el-button type="primary" :size="$size">查询</el-button>
                            <el-button type="primary" :size="$size">清空</el-button> -->
                        </div>
                        <div class="vus-bottom"></div>
                        <div class="xk-filter">
                            <el-form ref="form" :model="oFilterData" label-width="100px" inline :size='$size'>
                                <el-form-item label="手机号：">
                                    <el-input v-model="oFilterData.pone"></el-input>
                                </el-form-item>
                                <el-form-item label="活跃情况：">
                                    <el-select v-model="oFilterData.region" placeholder="活跃情况">
                                        <el-option label="区域一" value="shanghai"></el-option>
                                        <el-option label="区域二" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="注册时间：">
                                    <el-select v-model="oFilterData.region" placeholder="注册时间">
                                        <el-option label="区域一" value="shanghai"></el-option>
                                        <el-option label="区域二" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="下单时间：">
                                    <el-select v-model="oFilterData.region" placeholder="下单时间">
                                        <el-option label="区域一" value="shanghai"></el-option>
                                        <el-option label="区域二" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="消费金额：">
                                    <el-select v-model="oFilterData.region" placeholder="消费金额">
                                        <el-option label="区域一" value="shanghai"></el-option>
                                        <el-option label="区域二" value="beijing"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    
                    <el-table
                        :data="oForm.aMember"
                        style="width: 100%"
                        border
                        stripe
                        checkbox>
                        <el-table-column
                            type="selection">
                        </el-table-column>
                        <el-table-column
                            type="index">
                        </el-table-column>
                        <el-table-column
                            prop="id"
                            label="用户ID">
                        </el-table-column>
                        <el-table-column
                            prop="phone"
                            label="手机">
                        </el-table-column>
                        <el-table-column
                            prop="level"
                            label="用户等级">
                        </el-table-column>
                        <el-table-column
                            prop="realname"
                            label="用户实名">
                        </el-table-column>
                        <el-table-column
                            prop="idNumber"
                            label="身份证号码">
                        </el-table-column>
                        <el-table-column
                            label="基本信息">
                            <template slot-scope="scope">
                                <el-button type="primary" :size='$size' @click.stop='fnLookBaseInfo(scope.row)'>查 看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="订单记录">
                            <template slot-scope="scope">
                                <el-button type="primary" :size='$size' @click.stop='fnLookOrderRecords(scope.row)'>查 看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="浏览记录">
                            <template slot-scope="scope">
                                <el-button type="primary" :size='$size' @click.stop='fnLookBrowseRecords(scope.row)'>查 看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                
            </el-form-item>
            <div class="btn-center">
                <el-button :size='$size' @click='fnCreateCancel'>取 消</el-button>
                <el-button type="primary" :size='$size'>确 认</el-button>
            </div>
        </el-form>
        <el-dialog
            title="查看基本信息"
            :visible.sync="bBaseData"
            width="1400px"
            append-to-body
            :before-close="fnBaseDataClose">
            <base-data></base-data>
        </el-dialog>
        <el-dialog
            title="查看订单记录"
            :visible.sync="bOrderRecords"
            width="1400px"
            append-to-body
            :before-close="fnOrderREcordsClose">
            <order-records></order-records>
        </el-dialog>
        <el-dialog
            title="查看浏览记录"
            :visible.sync="bBrowseRecords"
            width="1400px"
            append-to-body
            :before-close="fnBrowseRecordsClose">
        </el-dialog>
  </div>
</template>
<script>
import BaseData from './BaseData';
import OrderRecords from './OrderRecords';
export default {
  name:'creatUserGroup',
  data () {
    return {
        oForm:{
            name:"",//名称
            describe:"",//描述
            aMember:[{
                id:56161,
                phone:110,
                level:100,
                realname:"邓皓月",
                idNumber:"51100000000000"
            }],//成员
        },
        oFilterData:{

        },
        bBaseData:false,
        bOrderRecords:false,
        bBrowseRecords:false,
    };
  },
  props: {
      bCreateUserGroup:Boolean
  },
  components: {
      BaseData,
      OrderRecords
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
        fnCreateCancel(){
            this.$emit('update:bCreateUserGroup',false)
        },
        fnLookBaseInfo(targetData){
            console.log(targetData);
            this.bBaseData = true ;
        },
        fnLookOrderRecords(targetData){
            console.log(targetData);
            this.bOrderRecords = true ;
        },
        fnLookBrowseRecords(targetData){
            console.log(targetData);
            this.bBrowseRecords = true ;
        },
        fnBaseDataClose(){
            this.bBaseData = false ;
        },
        fnOrderREcordsClose(){
            this.bOrderRecords = false ;
        },
        fnBrowseRecordsClose(){
            this.bBrowseRecords = false ;
        },
  },
  watch: {}
}
</script>
<style scoped lang='scss'>
.creat-user-group{
    .btn-center{
        display: flex;
        justify-content: center
    }
    .el-input{
        width: 300px;
    }
    .el-textarea{
        width: 500px;
    }
    .xk-filter{
        .el-input{
            width: 215px;
        }
    }
}
</style>