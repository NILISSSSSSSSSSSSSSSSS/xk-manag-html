<template>
    <div class="xk-container groom-merchant-regulation-list">
        <div class="xk-radius">
            <div class="xk-title ">
                <div class="vus-title">
                    <span></span>查询
                </div>
                <div class="vus-btn">
                    <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">查询</el-button>
                    <el-button type="primary" :size="$size" @click="clearCondition">清空</el-button>
                </div>
                <div class="vus-bottom"></div>
                <el-form :model="searchForm" label-width="120px" class="xk-search">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="店铺ID：">
                                <el-input :size="$size" v-model="searchForm.id" placeholder="请输入店铺ID"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="店铺名称：">
                                <el-input :size="$size" v-model="searchForm.name" placeholder="请输入店铺名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="8">
                            <el-form-item label="手机号码：">
                                <el-input :size="$size" v-model="searchForm.admainPhone" placeholder="请输入手机号码"></el-input>
                            </el-form-item>
                        </el-col> -->
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="xk-body xk-radius marintop20">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>店铺列表
                </div>
                <div class="vus-bottom"></div>
                <el-table :data="shopData" v-loading="tableLoading">
                    <!-- <el-table-column label="店铺编号" prop="code" width="100"></el-table-column> -->
                    <el-table-column label="店铺ID" prop="id" width="220"></el-table-column>
                    <template v-if="recommendType==='all'">
                        <el-table-column label="安全码" prop="mrCode" width="100"></el-table-column>
                    </template>
                    <!-- <el-table-column label="上级店铺编号" width="120">
                        <template slot-scope="scope">
                            {{ scope.row.masterCode? scope.row.masterCode: '无' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="上级名称">
                        <template slot-scope="scope">
                            {{ scope.row.masterName? scope.row.masterName: '无' }}
                        </template>
                    </el-table-column> -->
                    <el-table-column label="店铺名称" prop="name"></el-table-column>
                    <el-table-column label="店铺状态">
                        <template slot-scope="scope">
                            {{ scope.row.onBusiness=='1'? '营业中': '未营业' }}
                        </template>
                    </el-table-column>
                     <el-table-column label="店铺分类">
                         <template slot-scope="scope">
                             {{scope.row.industry | getShopName}}
                         </template>
                     </el-table-column>
                    <el-table-column label="地址" :formatter="formatRegion"></el-table-column>
                    <el-table-column label="操作" width="200px">
                        <template slot-scope="scope">
                            <el-button :size="$size" :loading="scope.row.loading" @click="viewDetail(scope.row.id, scope.row)" type="primary">查看详情</el-button>
                            <el-button :size="$size" @click="select(scope.row.id)" type="success">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
            </div>
        </div>
        <div class="btn-group">
            <el-button :size="$size" type="primary" @click="back()">返回上一页</el-button>
        </div>
        <!-- 查看详情 -->
        <groom-merchant-regulation-detail v-if="detailVisible" :visible.sync="detailVisible" :detailForm="detailForm"></groom-merchant-regulation-detail>
    </div>
</template>
<script>
    import groomMerchantRegulationDetail from "@/components/operate/GroomMerchantRegulationDetail.vue"

    let province = new Map(JSON.parse(localStorage.getItem('xk-province')));
    let city = new Map(JSON.parse(localStorage.getItem('xk-city')));
    let district = new Map(JSON.parse(localStorage.getItem('xk-district')));

    export default {
      data() {
        return {
            detailVisible: false,
            page: {
                page: 1,
                limit: 10,
                total: 0
            },
            searchForm: {},
            detailForm: {},
            shopData: [],
            tableLoading: false,
            searchLoading: false,
            recommendType: "",     //判断是推荐什么位置的店铺
        };
      },
      components: {
          groomMerchantRegulationDetail
      },
      created() {
          this.recommendType = this.$route.query.recommendType;
          this.getList();
      },
      methods: {
        //翻页
        changePage(page, pageSize) {
            this.page.limit = pageSize
            this.page.page = page
            this.getList();
        },
        
        //查询
        search() {
            this.page.page = 1;
            this.searchLoading = true;
            this.getList();
        },
        clearCondition() {
            this.searchForm = {},
            this.getList();
        },
        getList() {
            let params = {
                id: this.searchForm.id?this.searchForm.id: "",
                name: this.searchForm.name?this.searchForm.name: "",
                admainPhone: this.searchForm.admainPhone?this.searchForm.admainPhone: "",
                page: this.page.page,
                provinceCode: this.$route.query.provinceCode,
                cityCode: this.$route.query.cityCode,
                limit: this.page.limit
            }
            this.$route.query.districtCode? params.districtCode = this.$route.query.districtCode: null;

            let url = this.recommendType==='all'? this.$api.unRecommendShopQPage: this.$api.mShopAddRecommendShopQPage;
            
            if(this.recommendType!=='all') {
                params.recommendType = this.recommendType;
                !this.$route.query.districtCode? params.recommendType += '_city': ''
            }
            console.log(params)
            this.tableLoading = true;
            this.$http.get(url, params, true).then(res=>{
                console.log(res)
                this.shopData = res? res.data: [];
                this.page.total = res? res.total: 0;
                this.tableLoading = false;
                this.searchLoading = false;
            })
            .catch(err=>{
                this.tableLoading = false;
                this.searchLoading = false;
                this.$message.error(err.message);
            })
        },
        //查看详情
        viewDetail(id, row) {
            this.$set(row, 'loading', true);
            this.$http.get(this.$api.mShopDetail, {id: id}, true).then(res=>{
                this.$set(row, 'loading', false);
                this.detailForm = res;
                this.detailVisible = true;
                console.log(res)
            })
            .catch(err=>{
                this.$set(row, 'loading', false);
                this.$message.error(err.message);
            })
        },
        //格式化地区
        formatRegion(row) {
            if(row) {
                let pro = province.get(row.provinceCode)? province.get(row.provinceCode).name: row.provinceCode;
                let _city = city.get(row.cityCode)? city.get(row.cityCode).name: row.cityCode;
                let dis = district.get(row.districtCode)? district.get(row.districtCode).name: row.districtCode;
                return pro+_city + dis + '\n' + (row.address? row.address: "")
            }
        },
        //遍历
        iterationData(code, arr) {
            if(arr instanceof Array) {
                for(let i =0; i< arr.length; i++) {
                    if(arr[i].code == code) {
                        return arr[i].name
                    }
                }
            }
        },
        //选择当前店铺作为推荐店铺
        select(id) {
            this.$confirm('是否推荐该店铺？', '提示', {
                type: 'info',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(()=>{
                let api = this.recommendType!=='all'? this.$api.mShopAddRecommend: this.$api.mShopRecommend;
                let params = this.recommendType==='all'
                    ? {
                        shopId: id
                    }
                    : {
                        id: id,
                        recommendType: this.recommendType
                    }
                if(!this.$route.query.districtCode&&this.recommendType!=='all') {
                    params.recommendType = this.recommendType=== 'bcle'? 'bcle_city': 'home_city';
                }
                console.log(params)
                this.$http.post(api, params, true).then(res=>{
                    this.$message({type: 'success', message: '推荐成功'});
                    this.back();
                })
                .catch(err=>{
                    this.$message.error(err.message);
                })
            })
            .catch(()=>{
                this.$message({
                    type: 'info',
                    message: '取消删除'
                })
            })
        },
        back() {
            this.$router.push({
                path: "/groomMerchantRegulation",
                query: {
                    recommendType: this.recommendType
                }
            })
        }
      },
      filters: {
            getShopName(val) {
                let str = '';
                let Qlist = JSON.parse(localStorage.getItem('industryAllQList'));
                for(let i in val[0]) {
                    if(i==='levelOneCode') {
                        let res =  (code=>{
                            for(let j in Qlist.oneLevel) {
                                if(Qlist.oneLevel[j].code == code) {
                                    return Qlist.oneLevel[j].name
                                }
                            }
                        })(val[0][i]);
                        
                        str = res? res: '';
                    }else if(i === 'levelTwoCode') {
                        let res = (code=>{
                            for(let j in Qlist.twoLevel) {
                                if(Qlist.twoLevel[j].code == code) {
                                    return Qlist.twoLevel[j].name
                                }
                            }
                        })(val[0][i]);
                        str += res? ' / ' + res: '';
                    }
                }
                return str? str: '无';
            },
      }
    }
</script>
<style scoped>
</style> 