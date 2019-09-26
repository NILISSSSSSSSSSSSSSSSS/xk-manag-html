<template>
    <div class="virtual-evaluate-detail">
        <div class='xk-title'>
            <div class="vus-title">
                <span></span>虚拟评价列表
            </div>
            <div class="vus-btn">
                <el-button :size="$size" :disabled="selectData.length? false: true" type="success" @click="delEvaluate()">删除</el-button>
                <el-button :size="$size" type="primary" @click="addVisible=true">新增</el-button>
            </div>
            <div class="vus-bottom"></div>
        </div>
        <el-table :data="tableData" v-loading="loadingTable" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="商品评分" prop="score"></el-table-column>
            <el-table-column label="评价内容" prop="content"></el-table-column>
            <el-table-column label="评价视频">
                <template slot-scope="scope">
                    <img class="pic-table" :src="scope.row.video+'&vframe/jpg/offset/1/'" @click="$viewImage(scope.row.video, true)" alt="">
                </template>
            </el-table-column>
            <el-table-column label="评价图片">
                <template slot-scope="scope">
                    <img class="pic-table" :src="scope.row.picture" alt="" @click="$viewImage(scope.row.picture)">
                </template>
            </el-table-column>
            <el-table-column label="评价用户" prop="commenter"></el-table-column>
            <el-table-column label="评价时间">
                <template slot-scope="scope">
                    {{ scope.row.createdAt | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="是否启用">
                <template slot-scope="scope">
                    {{ scope.row.enabled==0? '否': '是' }}
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200">
                <template slot-scope="scope">
                    <el-button :loading="loading" :size="$size" type="primary" @click="openDia(scope.row)">{{ scope.row.enabled==0? '编辑': '查看' }}</el-button>
                    <el-button :size="$size" type="danger" @click="delEvaluate(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>

        <el-dialog :visible.sync="visible" :title="editStatus?'编辑': '查看详情'">
            <el-form label-width="120px" ref="detailForm" :model="detailForm">
                <el-form-item label="商品评分：">
                    <el-rate :disabled="editStatus?false: true" v-model="detailForm.score"></el-rate>
                </el-form-item>
                <el-form-item label="评价内容：">
                    <template v-if="editStatus">
                        <el-input :size="$size" v-model.trim="detailForm.content"></el-input>
                    </template>
                    <template v-else>
                        {{ detailForm.content }}
                    </template>
                </el-form-item>
                <el-form-item label="评价视频：" class="videoUrl">
                    <template v-if="editStatus">
                        <image-upload :more="false" v-model="detailForm.video" @percentage="percentage" :accept="'video/*'">
                            <img v-if="persent && !persent.status && persent.url" :src="persent.url+'?vframe/jpg/offset/2/'" alt="">
                            <video v-if="detailForm.video && !persent.url" :src="detailForm.video" poster></video>
                            <i v-else-if="!persent.url" class="el-icon-plus avatar-uploader-icon"></i>
                            <el-progress v-if="persent.status" class="circly-progress" type="circle" :percentage="persent.percentage" color="#8e71c7"></el-progress>
                        </image-upload>
                        <el-button v-if="detailForm.video&&editStatus" :size="$size" type="primary" @click="$viewImage(detailForm.video, true)">预览视频</el-button>
                        <el-button v-if="detailForm.video&&editStatus" :size="$size" type="danger" @click="deleteVideo()">删除视频</el-button>
                    </template>
                    <template v-else>
                        <span v-if="!detailForm.video">无</span>
                            <image-list v-else type="video" :url="detailForm.video+'&vframe/jpg/offset/1/'" :videoUrl="detailForm.video"></image-list>
                    </template>
                </el-form-item>
                <el-form-item label="评价图片：">
                    <template v-if="editStatus">
                        <image-upload v-model="detailForm.pictures" :isShow="isShow" :more="true" size="3" uploadNumber="9"></image-upload>
                    </template>
                    <template v-else>
                        <template v-if="detailForm.pictures&&detailForm.pictures.length">
                            <image-list v-for="item in detailForm.pictures" :url="item" :key="item"></image-list>
                        </template>
                        <span v-else>无</span>
                    </template>
                </el-form-item>
                <el-form-item label="评价用户：">
                    {{ detailForm.commenter? detailForm.commenter.nickName: "" }}
                </el-form-item>
                <el-form-item label="评价时间：">
                    {{ detailForm.createdAt | formatTime }}
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-checkbox v-model="detailForm.enabled" :true-label="1" :false-label="0"></el-checkbox>
                </el-form-item>
            </el-form>
            <div class="btn-group">
                <el-button v-if="editStatus" :size="$size" type="info" @click="visible=false">取消</el-button>
                <el-button :loading="loadingSubmit" :size="$size" type="primary" @click="submit('detailForm')">确定</el-button>
            </div>
        </el-dialog>

        <virtual-evaluate :visible.sync="addVisible" :goods="goods" :type="type" :goodsIds="[goodsId]"></virtual-evaluate>
    </div>
</template>
<script>
    import ImageUpload from "@/components/ImageUpload.vue"
    import VirtualEvaluate from './VirtualEvaluate';
    import ImageList from '@/components/common/ImageList.vue'
    export default {
        components: {
            ImageUpload,
            ImageList,
            VirtualEvaluate
        },
        props: {
            goodsId: '',
            shopId: '',
            type: {
                default: 'mall'
            }
        },
        data() {
            return {
                addVisible: false,
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                persent: {},
                visible: false,
                loadingTable: false,
                tableData: [],
                detailForm: {},
                selectData: "",
                editStatus: false,   //true为编辑
                loadingSubmit: false
            }
        },
        mounted() {
            this.goods = [{
                shopId: this.shopId,
                goodsId: this.goodsId
            }]
            this.getList();
        },
        methods: {
            handleSelectionChange(val) {
                if(val) {
                    this.selectData = val;
                }else{
                    this.selectData = "";
                }
                console.log(val)
            },
            //进度条
            percentage(obj) {
                this.persent = obj
            },
            //删除视频
            deleteVideo() {
                this.detailForm.video = "";
                this.persent = {};
            },
            changePage(page, pageSize) {
                this.page.limit = pageSize
                this.page.page = page
                this.getList();
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit,
                    goodsId: this.goodsId
                }
                let url = this.$api.QPageInMall
                if(this.type === 'shop') {
                    url = this.$api.QPageInBCircle;
                    params.shopId = this.shopId;
                }
                this.loadingTable = true;
                console.log(params)
                this.$http
                .get(url, params, true)
                .then(res=>{
                    this.loadingTable =false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                    console.log(res)
                })
                .catch(err=>{
                    this.loadingTable =false;
                    this.$message.error(err.message);
                })
            },
            openDia(row) {
                this.detailForm = {};
                this.persent={};
                if(row) {
                    this.editStatus = row.enabled==0? true: false
                    this.$set(row, 'loading', true);
                    let url = this.$api.detailCommentsInMall;
                    if(this.type ==='shop') {
                        url = this.$api.detailCommentsInBCircle
                    }
                    this.$http.get(url, {id: row.id}, true)
                    .then(res=>{
                        this.$set(row, 'loading', false);
                        this.visible = true;
                        res.video = res.video&& typeof res.video=='object'? res.video.url: '';
                        this.detailForm = res;
                    })
                    .catch(err=>{
                        this.$set(row, 'loading', false);
                        this.$message.error(err.message);
                    })
                }else{
                    this.visible = true;
                }
            },
            //删除评价
            delEvaluate(row) {
                this.$confirm("是否永久删除当前评论？", "警告", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(()=>{
                    let url = this.$api.deleteCommentsInMall;
                    if(this.type === 'shop') {
                        url = this.$api.deleteCommentsInBCircle
                    }
                    let params = {
                        ids: []
                    }
                    if(row) {
                        params.ids = [row.id]
                    }else{
                        params.ids = this.selectData.map(item=>{
                            return item.id
                        })
                    }
                    this.$http
                    .post(url, params, true)
                    .then(res=>{
                        this.$message.success('删除成功！');
                        this.delateHandle();
                    })
                    .catch(err=>{
                        this.$message.error(err.message);
                    })
                })
                .catch(()=>{})
            },
            submit(formName) {
                if(!this.editStatus) {
                    this.visible = false;
                    return false;
                }
                this.$refs[formName].validate(v=>{
                    if(v) {
                        let params = {
                            id: this.detailForm.id,
                            content: this.detailForm.content,
                            score: this.detailForm.score,
                            enabled: this.detailForm.enabled
                        }
                        this.detailForm.video
                        ? params.video = {
                            url: this.detailForm.video,
                            mainPic: this.detailForm.video + '&vframe/jpg/offset/1/'
                        }
                        : null;
                        this.detailForm.pictures                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                        ? params.pictures = this.detailForm.pictures
                        : null;
                        let url = this.$api.editCommentsInMall;
                        this.loadingSubmit = true;
                        if(this.type === 'shop') {
                            url = this.$api.editCommentsInBCircle
                        }
                        this.$http.post(url, params, true)
                        .then(res=>{
                            this.delateHandle();
                        })
                        .catch(err=>{
                            this.loadingSubmit = false;
                            this.$message.error(err.message);
                        })
                    }else{
                        return false;
                    }
                })
            },
            delateHandle() {
                this.visible = false;
                this.loadingSubmit = false;
                this.getList();
            }
        },
        watch: {
            addVisible(val) {
                if(!val) {
                    this.delateHandle();
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .virtual-evaluate-detail {
        .videoUrl {
            /deep/ .el-upload {
                width: 146px;
                height: 146px;
                line-height: 146px;
                position: relative;
                border: 1px dashed #c0ccda;
                border-radius: 6px;
                i{
                    font-size: 28px;
                    color: #8c939d;
                }
            }
            img {
                width: 100%;
                height: 100%;
            }
            video{
                width: 100%;
                height: 100%;
            }
            .circly-progress{
                position: absolute;
                left: 0;
                top: 0;
                background: #fff;
                width: 100%;
                height: 100%;
                display: flex;
                z-index: 666;
                justify-content: center;
                align-items: center;
            }
        }
        .pic-table {
            width: 60px;
            height: auto;
        }
        /deep/ .el-form-item {
            margin-bottom: 15px;
        }
        /deep/ .el-rate {
            display: inline-block;
        }
    }
</style>
