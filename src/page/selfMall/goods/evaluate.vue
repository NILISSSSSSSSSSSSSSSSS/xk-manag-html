<template>
    <div class="xk-container">
        <div class="xk-body">
            <div class="selfmall-goods-evaluate xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" size="small" @click="search" :loading="searchLoading">查询</el-button>
                        <el-button type="primary" size="small" @click="clearCondition">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-form class="xk-search" :model="searchForm" label-width="100px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="评分：">
                                <el-select v-model="searchForm.score" size="small">
                                    <el-option v-for="(item,index) in EnumPoint" :key="index" :label="item.value" :value="item.key">{{ item.value }}</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="评价内容：">
                                <el-select size="small" v-model="searchForm.type">
                                    <el-option v-for="(item,index) in EnumCommentList" :key="index" :label="item.value" :value="item.key">{{ item.value }}</el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="商品ID：">
                                <el-input size="small" v-model.trim="searchForm.id"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="xk-radius marintop20">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <!-- 表格 -->
                <el-table :data="tableData" v-loading="tableLoading">
                    <el-table-column label="评分">
                        <template slot-scope="scope">
                            <span style="color: #4b90fa">{{ scope.row.score }}分</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="评论内容" width="400">
                        <template slot-scope="scope">
                            <p style="text-align:left;margin: 5px 0" class="text-overflow" :title="scope.row.content">{{ scope.row.content}}</p>
                            <template v-if="scope.row.pictures&&scope.row.pictures.length>0 || scope.row.video&&scope.row.video.mainPic">
                                <el-row class="pic-list" :gutter="10">
                                    <el-col :span="6" v-if="scope.row.video && scope.row.video.mainPic" :key="index">
                                        <p><img :src="scope.row.video.mainPic" alt="" @click="$viewImage(scope.row.video.url+'?type=video', true)"></p>
                                    </el-col>
                                    <el-col :span="6" v-for="(item,index) in scope.row.pictures" :key="index">
                                        <p><img :src="item" alt="" @click="$viewImage(item)"></p>
                                    </el-col>
                                </el-row>
                            </template>
                            <p style="text-align:left;">{{ scope.row.createdAt | formatTime }}</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="评价人" width="120">
                        <template slot-scope="scope">
                            <span v-if="scope.row.commenter">
                                {{ scope.row.commenter.nickName }}
                            </span>
                            <span v-else class="xk-success">系统</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="商品名称">
                        <template slot-scope="scope">
                            <p>{{ scope.row.goods.name }}</p>
                            <p style="color: #4b90fa">{{ scope.row.goods.price? $math.divide(scope.row.goods.price, 100).toFixed(2): 0 }}元</p>
                        </template>
                    </el-table-column>
                    <el-table-column label="评论状态">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.mallReply">未回复</span>
                            <span v-else>已回复</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品ID">
                        <template slot-scope="scope">
                            {{ scope.row.goods.id }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="170">
                        <template slot-scope="scope">
                            <el-button type="primary" v-permission="'evaluateReply'" v-if="!scope.row.mallReply" :size="$size" @click="reply(scope.row, true)">回复</el-button>
                            <el-button type="primary" v-permission="'evaluateView'" :size="$size" :loading="scope.row.loading" @click="reply(scope.row)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total" @change="changePage"></pagination>
                <!-- 回复评论 -->
                <el-dialog :title="title?'查看详情': '回复评论'" :visible.sync="visibleDialog" class="reply-evaluate-dialog">
                    <el-form label-width="150px" :model="submitForm" ref="submitForm" :rules="rules">
                        <el-form-item label="评价商品：">
                            <el-row class="evaluate-content">{{ submitForm.content }}</el-row>
                            <el-row>
                                <template v-if="submitForm.video">
                                    <image-list :url="submitForm.video.mainPic" :videoUrl="submitForm.video.url" type="video"></image-list>
                                </template>
                                <image-list v-for="(item,index) in submitForm.pictures" :key="index" :url="item"></image-list>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="评价人：">{{ submitForm.nickName }}</el-form-item>
                        <el-form-item label="评分：">{{ submitForm.score }}分</el-form-item>
                        <el-form-item label="掌柜回复：" v-if="submitForm.replyContent">
                            <el-row>{{ submitForm.replyContent }}</el-row>
                            <el-row>
                                <image-list v-for="(item,index) in submitForm.replyPictures" :key="index" :url="item"></image-list>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="评论列表：" v-if="submitForm.commentReplyList && submitForm.commentReplyList.length!==0">
                            <el-row v-for="(item,index) in submitForm.commentReplyList" :key="index">
                                <el-col :span="24" v-if="item.refCreator">
                                    {{ item.refCreator.nickName+"：" }}
                                    <span v-if="item.refCreator" style="color: rgb(75, 144, 250);margin: 0 5px">回复</span>
                                    {{ item.creator.nickName }}：{{ item.content }}
                                </el-col>
                                <el-col :span="24" v-else>
                                    {{ item.creator.nickName }}：{{ item.content }}
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-row>
                            <el-col :span="6"></el-col>
                        </el-row>
                        <div style="text-align:center" v-if="submitForm.commentReplyList && submitForm.commentReplyList.length!=0">
                            <el-button :size="$size" :loading="loadingMore" type="text" @click="loadMore">{{  loadingTxt }}</el-button>
                        </div>
                        
                        <el-form-item label="回复：" v-if="!title">
                            <el-form-item prop="con">
                                <el-input 
                                    type="textarea" 
                                    v-model="submitForm.con"
                                    placeholder="请输入回复评论内容..." 
                                    :autosize="{ minRows: 6, maxRows: 6}" 
                                    resize="none">
                                </el-input>
                            </el-form-item>
                            <image-upload v-model="submitForm.pic" more="true" class="reply-img-list">
                                <!-- <img v-if="submitForm.pic" :src="submitForm.pic"> -->
                            </image-upload>
                        </el-form-item>
                        <div class="btn-group">
                            <el-button :size="$size" @click="visibleDialog=false">返回</el-button>
                            <el-button v-if="title" :size="$size" type="primary" @click="visibleDialog=false">确定</el-button>
                            <el-button v-else :size="$size" :disabled="submitLoading" :loading="submitLoading" type="primary" @click="submit('submitForm')">提交</el-button>
                        </div>
                    </el-form>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    //枚举评论类型
    const EnumCommentList = [{key: '', value: '全部'},{key: 'havePic', value: '有图'},{key: 'good', value: '好评'},{key: 'notBad', value: '中评'},{key: 'bad', value: '差评'}];
    //枚举评分类型
    const EnumPoint = [{key: '', value: '全部'},{key: '1', value: '1分'},{key: '2', value: '2分'},{key: '3', value: '3分'},{key: '4', value: '4分'},{key: '5', value: '5分'}];
    import ImageUpload from '@/components/ImageUpload.vue'
    import {getPermission} from "../../../util/publicMehotds.js"
    import ImageList from '@/components/common/ImageList.vue';
    
    export default {
        name: "evaluate",
        components: {
            ImageUpload,
            ImageList
        },
        data(){
            return{
                EnumCommentList,
                searchLoading: false,
                EnumPoint,
                visibleDialog: false,
                searchForm: {},
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                pageComment: {
                    page: 1,
                    limit: 3,
                    total: 0
                },
                tableData:[],
                tableLoading: false,
                submitLoading: false,
                loadingMore: false,
                imgSrc: "",
                submitForm: {},
                rules: {
                    con: [
                        { required: true , message: '不能为空', trigger: 'blur'}
                    ]
                },
                title: false,
                loadingTxt: '评论加载中...',
                isContinue: true
            }
        },
        created() {
            this.searchData
                ? (this.page=this.searchData.page, this.searchForm = this.searchData.searchForm)
                : null;
            this.getList();
        },
        computed: {
            ...mapState({
                searchData: state => state.selfMallGoods.evaluate
            })
        },
        methods:{
            ...mapMutations({
                setEvaluate: "selfMallGoods/setEvaluate"
            }),
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                this.getList();
            },
            getList() {
                let params = {
                    page: this.page.page,
                    limit: this.page.limit,
                    score: this.searchForm.score,
                    type: this.searchForm.type,
                    goodsId: this.searchForm.id
                };
                this.tableLoading = true;
                this.$http.get(this.$api.mallGoodsCommentList4Manager, params, true).then(res=>{
                    console.log(res)
                    this.setEvaluate(Object.assign({searchForm: this.searchForm}, {page: this.page}))
                    this.tableLoading = false;
                    this.searchLoading = false;
                    this.tableData = res? res.data: [];
                    this.page.total = res? res.total: 0;
                })
                .catch(err=>{
                    this.tableLoading = false;
                    this.searchLoading = false;
                    this.$message.error(err.message);
                })
            },
            //搜索
            search(formName) {
                this.page.page = 1;
                this.searchLoading = true;
                this.getList();
            },
            //清空搜索条件
            clearCondition() {
                this.searchForm = {};
                this.setEvaluate(null);
                this.getList();
            },
            reply(row, bool) {
                this.$refs['submitForm']?this.$refs['submitForm'].resetFields():"";
                this.title = bool? false: true;
                this.submitForm = {
                    id: row.id,
                    pictures: row.pictures,
                    nickName: row.commenter.nickName,
                    content: row.content,
                    score: row.score,
                    replyContent: row.mallReply? row.mallReply.content:"",
                    replyPictures: row.mallReply? row.mallReply.pictures:"",
                    commentReplyList: []
                }
                row.video&&row.video.mainPic? this.submitForm.video = row.video: null;
                this.initComment();
                this.getReplyList();
                this.visibleDialog = true;
            },
            //获取评论列表
            getReplyList() {
                this.loadingMore = true;
                this.loadingTxt = '评论加载中...';
                this.$http.get(this.$api.mallGoodsCommentReplyList4Manager, {commentId: this.submitForm.id, page: this.pageComment.page, limit: this.pageComment.limit}, true).then(res=>{
                    this.loadingMore = false;
                    if(res.data && res.data.length !=0){
                        this.loadingTxt = '加载更多评论...';
                        res.data.forEach(item=>{
                            this.submitForm.commentReplyList.push(item);
                        })
                    }else{
                        this.loadingTxt = '评论全部加载完毕';
                        this.isContinue = false;
                    }
                })
                .catch(err=>{
                    this.loadingMore = false;
                    this.$message.error(err.message);
                    if(err.code === 409) {
                        this.loadingTxt = '评论全部加载完毕';
                        this.isContinue = false;
                    }
                })
            },
            //提交回复
            submit(formName) {
                this.$refs[formName].validate(v=>{
                    if(v){
                        let params = {
                            content: this.submitForm.con,
                            commentId: this.submitForm.id
                        };
                        this.submitForm.pic&&this.submitForm.pic.length>0? params.pictures = this.submitForm.pic: "";
                        this.submitLoading = true;
                        this.$http.post(this.$api.mallGoodsCommentMallReply4Manager, params, true).then(res=>{
                            this.submitLoading = false;
                            this.visibleDialog=false;
                            this.getList();
                        })
                        .catch(err=>{
                            this.$message.error(err.message);
                            this.submitLoading = false;
                        })
                    }
                })
            },
            //加载更多评论
            loadMore() {
                if(this.isContinue) {
                    this.pageComment.page = this.pageComment.page+1;
                    this.loadingMore = true;
                    this.getReplyList();
                }else{
                    this.loadingTxt = '评论全部加载完毕';
                }
            },
            //初始化用户评论条件
            initComment() {
                this.pageComment= {
                    page: 1,
                    limit: 3,
                    total: 0
                };
                this.loadingTxt= '评论加载中...';
                this.isContinue= true
            }
        }
    }
</script>
<style lang="scss" scoped src="./evaluate.scss"></style>