<template>
    <div class="xkCoin">
        <div class="xk-radius">
            <div class='xk-title'>
              <div class="vus-title">
                  <span></span>晓可币
              </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="getUserList">搜索</el-button>
                    <el-button type="primary" :size="$size" @click="resetForm">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-form :label-position="labelPosition" label-width="120px" :model="searchForm" class="xk-search">
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="消费/充值单号：" >
                            <el-input :size="$size" v-model="searchForm.withdrawalId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户ID：" >
                            <el-input :size="$size" v-model="searchForm.hostId"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户名称：">
                            <el-input :size="$size" v-model="searchForm.hostName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="消费/充值日期：">
                            <el-date-picker v-model="searchForm.date" type="daterange" start-placeholder="开始日期"
                                            end-placeholder="结束日期" :size="$size" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="消费/充值时间：">
                          <el-select v-model="searchForm.timeRange" :size="$size" style="width: 100%">
                            <el-option v-for="item in timeRange" :key="item" :label="item" :value="item"></el-option>
                          </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="类型：">
                            <el-select v-model="searchForm.shape" :size="$size" style="width: 100%">
                              <el-option v-for="item in shape" :key="item" :label="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div class="xk-radius margintop20">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>列表
                </div>
                <div class="vus-bottom"></div>
            </div>
            <el-table :data="tableData" width="100%" stripe class="margintop20">
                <el-table-column type="selection" width="55px"></el-table-column>
                <el-table-column  label="消费/充值单号" prop="order"></el-table-column>
                <el-table-column  label="消费/充值时间" prop="date"></el-table-column>
                <el-table-column  label="用户ID" prop="userId"></el-table-column>
                <el-table-column  label="用户名称" prop="userName"></el-table-column>
                <el-table-column  label="消费/充值晓可币" prop="fee"></el-table-column>
                <el-table-column  label="类型" prop="type"></el-table-column>
                <el-table-column  label="去向/来源" prop="origin"></el-table-column>
                <el-table-column  label="操作"  fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" :size="$size" @click="handleDetail(scope)">查看详情</el-button>
                        <el-button type="text" :size="$size" @click="handleDelete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination></pagination>
        </div>
        <el-dialog :visible.sync="detailDialog" title="充值明细详情" :data="tableData" class="xk-dialog" :before-close="handleClose" width="600px">
          <el-form label-position="labelPosition" label-width="100px">
              <el-row :gutter="10">
                  <el-col :span="12">
                      <el-form-item label="充值单号：">122333333</el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="充值时间：">2018-09-09</el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="10">
                  <el-col :span="12">
                      <el-form-item label="用户ID：">12233</el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="用户名称：">mark</el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="10">
                  <el-col :span="12">
                      <el-form-item label="充值晓可币：">200晓可币</el-form-item>
                  </el-col>
                  <el-col :span="12">
                      <el-form-item label="来源：">平台充值/礼物获得</el-form-item>
                  </el-col>
              </el-row>
              <el-row :gutter="10">
                  <el-col :span="12">
                      <el-form-item label="账户余额：">200晓可币</el-form-item>
                  </el-col>
              </el-row>
              <el-form-item>
                  <el-button :size="$size" type="plain" @click="handleClose">取消</el-button>
                  <el-button :size="$size" type="primary" @click="handleClose">确定</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog :visible.sync="delDialog" title="删除账户明细记录" width="400px" top="35vh" class="xk-dialog"
                   :before-close="delCancle">
            <el-form class="content">
                <el-form-item>
                    <div class="mediumFont">确认要删除该记录吗？</div>
                </el-form-item>
                <el-form-item>
                    <el-button type="plain" @click="delCancle" :size="$size">取消</el-button>
                    <el-button type="primary" @click="xkCoinDelete" :size="$size">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "xkCoin",
        data() {
            return {
                labelPosition: "right",
                searchForm: {
                    withdrawalId: '',
                    hostId: '',
                    hostName: '',
                    date: '',
                    timeRange: '',
                    year: '',
                },
                year: [2018,2017,2016,2015],
                timeRange: ["最近3天", "最近一周", "最近一月"],
                shape: ["全部", "消费", "充值"],
                tableData: [{
                    order: "122113kaj11",
                    order: '12344uu1u11',
                    date: '2018-09-18',
                    userId: 'b3u8h77811t511',
                    userName: '虎牙',
                    fee: '500.00',
                    type: '充值',
                    origin: '平台充值'
                }, {
                  order: "122mm13kaj11",
                  order: '12344uu1u11',
                  date: '2018-09-18',
                  userId: 'b3u8h77811t511',
                  userName: '斗鱼',
                  fee: '800.00',
                  type: '消费',
                  origin: '自营商城'
                }],
                detailDialog: false,
                delDialog: false
            }
        },
        methods: {
          // 搜索栏重置
            resetForm() {
                this.searchForm = []
            },
            // 触发详情弹框
            handleDetail() {
              this.detailDialog = true;
            },
            // 关闭/取消详情弹框
            handleClose() {
              this.detailDialog = false;
            },
            // 触发删除框
            handleDelete() {
              this.delDialog = true;
            },
            // 删除弹框和删除操作
            xkCoinDelete() {
              this.delDialog = false;
            },
            // 关闭/取消删除框
            delCancle() {
              this.delDialog = false;
            }
        }
    }
</script>

<style lang="scss" scoped>
.content {
    width: 80%;
    margin: 0 auto;
    text-align: center;
}
</style>
