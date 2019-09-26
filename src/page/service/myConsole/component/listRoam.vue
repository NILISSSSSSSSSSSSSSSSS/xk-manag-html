<template>
    <div class='listRoam'>
        <el-table v-loading='vloading' :data="tableData" stripe style="width: 100%" border>
            <el-table-column prop="order" label="序号">
            </el-table-column>
            <el-table-column prop="title" label="工单标题">
            </el-table-column>
            <el-table-column prop="description" label="工单描述">
            </el-table-column>
            <el-table-column prop="attachments" label="工单附件">
                <template slot-scope="scope">
                    <a target="_blank" style="margin-right:5px" v-for="(item,index) in scope.row.attachments" :href="item"
                        :key="index">附件{{index+1}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="接单时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt*1000 | formatTime}}
                </template>
            </el-table-column>
            <el-table-column prop="finishAt" label="完成时间">
                <template slot-scope="scope">
                    {{scope.row.finishAt*1000 | formatTime}}
                </template>
            </el-table-column>
            <el-table-column prop="createdName" label="创建客服真名">
                <template slot-scope="scope">
                    {{scope.row.createdRealName ? scope.row.createdRealName : "未知"}}
                </template>
            </el-table-column>
            <el-table-column prop="createdName" label="创建客服昵称">
                <template slot-scope="scope">
                    {{scope.row.createdNickName ? scope.row.createdNickName : "未知"}}
                </template>
            </el-table-column>
            <el-table-column prop="takeOverName" label="接单客服真名">
                <template slot-scope="scope">
                    {{scope.row.takeOverRealName ? scope.row.takeOverRealName : "未知"}}
                </template>
            </el-table-column>
            <el-table-column prop="takeOverName" label="接单客服昵称">
                <template slot-scope="scope">
                    {{scope.row.takeOverNickName ? scope.row.takeOverNickName : "未知"}}
                </template>
            </el-table-column>
            <el-table-column prop="orderStatus" label="状态">
                <template slot-scope="scope">
                    {{scope.row.orderStatus | WorkStatus}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150px" fixed="right">
                <template slot-scope="scope">
                    <el-button v-permission="workListRoamReceipt" @click="fnJieDan(scope.row,scope.$index)"
                        :loading="scope.row.loading"
                        v-show="scope.row.orderStatus==='not_receipt'&&scope.row.takeOverBy==xkaccount.accid" type="success"
                        :size="$size">接单</el-button>
                    <el-button v-permission="workListRoamLook" @click="fnChaKan(scope.row)" type="primary" :size="$size">查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :currentPage="currentPage" :pageSize="pageSize" :total="total" @change="fnpagechange"></Pagination>
        <listdetail :showdetail='showdetail' @closeshowdetail='closeshowdetail' :workId='workId'></listdetail>
    </div>
</template>
<script>
import Listdetail from '@/components/service/ListDetail';
import { getSession } from '@/util/publicMehotds';
export default {
    name: 'listRoam',
    data() {
        return {
            tableData: [
                //   {
                //   order:1,
                //   id: 1,
                //   title: '退货单',
                //   description: '我觉得不应该给他退货，但是我拿不定主意',
                //   attachments:["aa","bb"],
                //   createdAt:"8月28日 1：00",
                //   finishAt:"8月28日 2：00",
                //   createdName:"乔达摩",
                //   takeOverName:"悉达多",
                //   orderStatus:true
                // }
            ],
            currentPage: 1,
            pageSize: 10,
            total: 0,
            showdetail: false,
            workId: '',
            xkaccount: getSession('xk-im-account') ? JSON.parse(getSession('xk-im-account')) : {},
            vloading: true
        };
    },
    components: {
        Listdetail
    },
    props: {
        allroam: {
            type: Boolean,
            default: false
        }
    },
    computed: {},
    created() {
        this.getThisPage();
    },
    mounted() {},
    methods: {
        fnpagechange(val, page) {
            console.log(val, page);
            this.currentPage = val;
            this.pageSize = page;
            this.vloading = true;
            this.getThisPage();
        },
        getThisPage(data = { page: this.currentPage, limit: this.pageSize }) {
            if (!this.allroam) {
                // 是否筛选自己的流转给自己的工单
                data.customerServiceId = this.xkaccount.accid;
                console.log(this.xkaccount.accid);
            }
            this.$http
                .get(this.$api.workOrderPageTakeOver, data, true)
                .then(res => {
                    this.vloading = false;
                    console.log(res);
                    if (res.total) {
                        this.total = res.total;
                    }
                    this.tableData = [];

                    if (res.data) {
                        res.data.forEach((item, index) => {
                            this.tableData.push(item);
                            this.tableData[index].order = index + 1 + this.pageSize * (this.currentPage - 1);
                            this.tableData[index].loading = false;
                        });
                    }
                })
                .catch(err => {
                    this.vloading = false;
                    if (err.message != 'empty data') {
                        this.$message.error(err.message);
                    }
                });
        },
        fnJieDan(target, index) {
            console.log(target, index);
            this.tableData[index].loading = true;
            this.tableData.push();
            this.$http
                .get(this.$api.workOrderReceipt, { id: target.id }, true)
                .then(res => {
                    console.log(res);
                    this.tableData[index].loading = false;
                    this.tableData[index].orderStatus = 'receipt';
                    this.tableData.push();
                })
                .catch(err => {
                    this.$message.error(err.message);
                    this.tableData[index].loading = false;
                    this.tableData.push();
                });
        },
        fnChaKan(target) {
            this.workId = target.id;
            this.showdetail = true;
        },
        closeshowdetail() {
            this.showdetail = false;
        }
    }
};
</script>
<style lang='scss' scoped>
.el-button {
    margin: 0 5px 5px 0;
}
</style>