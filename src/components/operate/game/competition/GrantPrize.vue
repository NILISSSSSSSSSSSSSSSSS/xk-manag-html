<template>
    <el-dialog 
        title="确认发放奖品"
        :visible.sync="grantPrizeDia"
        append-to-body
        :before-close="handleClose"
        width="900px"
        spp
    >
        <div>
            <el-row style="margin-top: 10px;">实物奖品：</el-row>
            <el-table :data="tableData" v-loading="loadingTable" style="margin:20px 0">
                <el-table-column label="奖品ID" prop="id"></el-table-column>
                <el-table-column label="奖品来源" prop="id"></el-table-column>
                <el-table-column label="发放方式" prop="name"></el-table-column>
                <el-table-column label="奖品名称" prop="name"></el-table-column>
                <el-table-column label="发放数量" prop="name"></el-table-column>
                <el-table-column label="单件成本价(元)" prop="name"></el-table-column>
                <el-table-column label="总成本价(元)" prop="name"></el-table-column>
            </el-table>
            <el-row style="margin-top: 10px;">
                实物奖品总数量：XXXX件
                <span>实物奖品总成本：XXXX元</span>
            </el-row>
        </div>
        <div style="margin-top: 40px;">
            <el-row style="margin-top: 10px;">虚拟奖品：</el-row>
            <el-table :data="tableData" v-loading="loadingTable" style="margin:20px 0">
                <el-table-column label="奖品ID" prop="id"></el-table-column>
                <el-table-column label="奖品来源" prop="id"></el-table-column>
                <el-table-column label="发放方式" prop="name"></el-table-column>
                <el-table-column label="奖品名称" prop="name"></el-table-column>
                <el-table-column label="发放数量" prop="name"></el-table-column>
            </el-table>
            <el-row style="margin-top: 10px;">虚拟奖品总数量：XXX件</el-row>
        </div>
        <div class="sub-btn" style="text-align:center;margin-top:30px">
                <el-button :size="$size" @click="handleClose" type="primary">返回</el-button>
                 <el-button :size="$size" type="primary" @click="surePrize=true">发放奖品</el-button>
            </div>


          <!-- 确认奖品成本弹框 -->
        <el-dialog title="确认奖品成本" :visible.sync="surePrize" width="500px" append-to-body>
            <div>
               本次比赛 奖品总成本为：XXX元   请及时充值相应金额至平台账户
            </div>
            <div class="sub-btn" style="text-align:center;margin-top:40px">
                <el-button :size="$size" @click="surePrize=false">返回</el-button>
                <el-button
                    :size="$size"
                    type="primary"
                >确 定</el-button>
            </div>
        </el-dialog>
    </el-dialog>
</template>
<script>
export default {
    name: "发放奖品",
    components: {},
    props: {
        grantPrizeDia: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            tableData: [{}],
            loadingTable: false,

            surePrize:false
        };
    },
    methods: {
        handleClose() {
            this.$emit("update:grantPrizeDia", false);
        }
    }
};
</script>