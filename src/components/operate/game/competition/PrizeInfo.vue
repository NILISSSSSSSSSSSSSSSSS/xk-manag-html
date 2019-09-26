<template>
    <div>
        <el-row :gutter="20" class="competionTitleItem" v-if="hasPeriod" style="margin-bottom:15px">
            <el-col :span="8">
                排名区间：
                <span>第{{ prizeList.rankingInterval.lowerLimit }}名-第{{ prizeList.rankingInterval.upperLimit}}名</span>
            </el-col>
        </el-row>
        <!-- 实物奖品 -->
        <el-row style="margin-top: 5px;" class="fontBold">实物奖品：</el-row>
        <el-table :data="materialTableData" style="margin:15px 0">
            <el-table-column label="奖品ID" prop="prize.prizeId"  width="290"></el-table-column>
            <el-table-column label="奖品来源">
                <template slot-scope="scope">
                    <span
                        v-if="scope.row.prize && scope.row.prize.prizeSource"
                    >{{ scope.row.prize.prizeSource | prizeSource}}</span>
                </template>
            </el-table-column>
            <el-table-column label="发放方式">
                <template slot-scope="scope">
                    <span
                        v-if="scope.row.prize && scope.row.prize.terrain"
                    >{{ scope.row.prize.terrain =='online' ? '线上' : '线下'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="奖品名称" prop="prize.prizeName"></el-table-column>
            <el-table-column label="每人可获得数量" prop="awardNum"></el-table-column>
            <el-table-column label="最大成本价">
                <template slot-scope="scope">
                    <span>{{ scope.row.prize.product.costPrice? $math.divide(scope.row.prize.product.costPrice*scope.row.awardNum,100):0}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-row style="margin-top: 5px;">总最大成本价：{{ matterAllMoney() }}</el-row>
      <!-- 虚拟奖品 -->
        <div style="margin-top: 20px;">
            <el-row style="margin-top: 5px;" class="fontBold">虚拟奖品：</el-row>
            <el-table :data="virtualTableData" style="margin:15px 0">
                <el-table-column label="奖品ID" prop="prize.prizeId" width="290"></el-table-column>
                <el-table-column label="奖品来源">
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.prize && scope.row.prize.prizeSource"
                        >{{ scope.row.prize.prizeSource | prizeSource}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发放方式">
                    <template slot-scope="scope">
                        <span
                            v-if="scope.row.prize && scope.row.prize.terrain"
                        >{{ scope.row.prize.terrain =='online' ? '线上' : '线下'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="奖品名称" prop="prize.prizeName"></el-table-column>
                <el-table-column label="每人可获得数量" prop="awardNum"></el-table-column>
            </el-table>
            <el-row style="margin-top: 5px;">总数量：{{ fictitiousAllNum() }}</el-row>
        </div>
    </div>
</template>

<script>
import { prizeSource } from "@/util/publicParams";
export default {
    name: "实物奖品和虚拟奖品",
    components: {},
    props: {
        hasPeriod: {
            type: Boolean,
            default: false
        },
        prizeList: {
            default: ()=>({
                awardPrizes: []
            })
        }
    },
    watch: {
        prizeList(val) {
            if (JSON.stringify(val) !== "{}") {
                console.log("奖品表信息"+val);
                this.materialTableData=[];this.virtualTableData=[];
                this.dealPrize();
            }
        }
    },
    data() {
        return {
            materialTableData: [],
            virtualTableData: []
        };
    },
    mounted() {
        this.dealPrize();
    },
    methods: {
        dealPrize() {
            this.totalNum = this.totalPrize = "";
            for (let item of this.prizeList.awardPrizes) {
                if (item.prize) {
                    if (item.prize.articleType == "VIRTUAL") {
                        this.virtualTableData.push(item);
                    } else {
                        this.materialTableData.push(item);
                    }
                }
            }
        },
        matterAllMoney() {
            let price = 0;
            if (this.materialTableData.length !== 0) {
                this.materialTableData.forEach(item => {
                    if (item.prize && item.prize.product) {
                        price +=
                            item.prize.product.costPrice * item.awardNum;
                    }
                });
            }
            return price / 100;
        },
        fictitiousAllNum() {
            let num = 0;
            if (this.virtualTableData.length !== 0) {
                this.virtualTableData.forEach(item => {
                    num += ~~item.awardNum;
                });
            }
            return num;
        }
    }
};
</script>
<style scoped lang="scss">
/deep/ .competionTitleItem {
    margin-bottom: 10px;
}
.fontBold {
    font-weight: bold;
    font-size: 15px;
}
</style>