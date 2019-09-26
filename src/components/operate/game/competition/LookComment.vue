<template>
    <el-dialog
        :title="isComment ? '评价列表' : '回复列表'"
        :visible.sync="commentDia"
        append-to-body
        :before-close="handleClose"
        width="1200px"
        spp
    >
        <div>
            <div class="xk-radius">
                    <div class="vus-btn" style="text-align: right;padding-top: 12px;padding-bottom: 5px">
                        <el-button
                            type="primary"
                            :size="$size"
                            @click="search"
                            :loading="loadingSearch"
                        >查询</el-button>
                        <el-button type="danger" :size="$size" @click="reset">清空</el-button>
                    </div>
                    <el-form :model="searchForm" class="xk-search" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="昵称：">
                                    <el-input :size="$size" placeholder="请输入昵称" v-model="searchForm.commentUserName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="用户ID：">
                                    <el-input :size="$size" placeholder="请输入用户ID" v-model="searchForm.commentUserId"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="评价内容：">
                                    <el-input :size="$size" placeholder="请输入评价内容" v-model="searchForm.comment"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="发布日期：">
                                    <el-date-picker 
                                        v-model="searchForm.timeBox"
                                        type="daterange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :size="$size"
                                        style="width: 100%"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-col>
                         
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="xk-radius margintop20">
                <div class="xk-title">
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <!-- 评价列表 -->
                 <template  v-if="isComment">
                            <el-table
                            :data="tableCommentData"
                            v-loading="loadingTable1"
                        >
                            <el-table-column label="昵称" prop="userName"></el-table-column>
                            <el-table-column label="用户ID" prop="userId"></el-table-column>
                            <el-table-column label="评价内容" prop="content"></el-table-column>
                            <el-table-column label="发布时间">
                                <template slot-scope="scope">
                                    <span  style="display: block;cursor: pointer;">{{ scope.row.createdAt | formatTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="回复数" prop="replyNum" ></el-table-column>
                            <el-table-column label="操作" fixed="right" >
                                <template slot-scope="scope">
                                    <el-button :size="$size" type="text" @click="lookReply(scope.row.commentId)">查看回复</el-button>
                                    <el-button :size="$size" type="text" @click="del(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页组件-->
                        <pagination
                            :currentPage="pageComment.page"
                            :pageSize="pageComment.limit"
                            :total="pageComment.total"
                            @change="changePage"
                        ></pagination>
                 </template>
                 <!-- 回复列表 -->
                      <template  v-else>
                            <el-table
                            :data="tableReplytData"
                            v-loading="loadingTable2"
                        >
                            <el-table-column label="昵称" prop="creator.nickName"></el-table-column>
                            <el-table-column label="用户ID" prop="creator.id"></el-table-column>
                            <el-table-column label="评价内容" prop="content"></el-table-column>
                            <el-table-column label="发布时间">
                                <template slot-scope="scope">
                                    <span  style="display: block;cursor: pointer;">{{ scope.row.createdAt | formatTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" fixed="right" >
                                <template slot-scope="{row}">
                                    <el-button :size="$size" type="text" @click="del(row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--分页组件-->
                        <pagination
                            :currentPage="pageReply.page"
                            :pageSize="pageReply.limit"
                            :total="pageReply.total"
                            @change="changePage"
                        ></pagination>
                 </template>
            </div>
    </el-dialog>
</template>
<script>
export default {
    name: "查看评论列表",
    components: {},
    props: {
        commentDia: {
            type: Boolean,
            default: false
        },
        videoId:{
            default: ""
        }
    },
    watch:{
        commentDia(val){
         if(val){
              this.searchForm = {
               timeBox: [],
               };
             this.isComment=true;
             this.getCommentList();
         }
        }
    },
    data() {
        return {
            isComment:true,
            pageComment: {
                page: 1,
                limit: 10,
                total: 0
            },
              pageReply: {
                page: 1,
                limit: 10,
                total: 0
            },
            loadingTable1: false,
             loadingTable2: false,
             tableCommentData:[],
             tableReplytData:[],
            searchForm: {
               timeBox:[]
            },
           commentId:"",
        };
    },
    methods: {
        handleClose() {
            this.$emit("update:commentDia", false);
        },
         changePage(page, pageSize) {
             if(this.isComment){
                this.pageComment.limit = pageSize;
                this.pageComment.page = page;
                this.getCommentList();
             }
             else{
                  this.pageReply.limit = pageSize;
                  this.pageReply.page = page;
                  this.getReplyList();
             }
           
        },
        search() {
            this.isComment ? this.getCommentList() : this.getReplyList();
        },
        reset() {
            this.searchForm = {
               timeBox: [],
            };
            this.isComment ? this.getCommentList() : this.getReplyList();
        },
        //评论列表
         getCommentList(){
            let data={
                videoId:this.videoId,
                 commentUserName:this.searchForm.commentUserName,
                 commentUserId:this.searchForm.commentUserId,
                 comment:this.searchForm.comment,
                 startTime:this.searchForm.timeBox && this.searchForm.timeBox[0] ?  this.searchForm.timeBox[0]/1000 : null,
                 endTime:this.searchForm.timeBox && this.searchForm.timeBox[1] ?  this.searchForm.timeBox[1]/1000 : null,
                 page:this.pageComment.page,
                 limit:this.pageComment.limit,
            }
             this.loadingTable1 = true;
             this.$http.get(this.$api.videoCommentQPage, data, true) .then(res => {
                    console.log("评论列表" + JSON.stringify(res));
                     if( res && res.data){
                        this.tableCommentData=res.data;
                        this.pageComment.total=res.total;
                    }
                    else{
                        [this.tableCommentData,this.pageComment.total]=[[],0]
                    }
                    this.loadingTable1 = false;
                })
                .catch(res => {
                    this.loadingTable1 = false;
                     [this.tableCommentData,this.pageComment.total]=[[],0]
                    this.$message.error(res.message);
                });
        },

        //回复列表
         getReplyList(){
             let data={};
            let commentReplyParam={
                 commentId:this.commentId,
                 userName:this.searchForm.commentUserName,
                 userId:this.searchForm.commentUserId,
                 reply:this.searchForm.comment,
                 startTime:this.searchForm.timeBox && this.searchForm.timeBox[0] ?  this.searchForm.timeBox[0]/1000 :null,
                 endTime:this.searchForm.timeBox && this.searchForm.timeBox[1] ?  this.searchForm.timeBox[1]/1000 : null,
                 page:this.pageReply.page,
                 limit:this.pageReply.limit,
            }
            data.commentReplyParam=commentReplyParam;
             this.loadingTable2 = true;
             this.$http.get(this.$api.videoCommentReplyList, data, true) .then(res => {
                    console.log("回复列表" + JSON.stringify(res));
                     if( res && res.data){
                        this.tableReplytData=res.data;
                        this.pageReply.total=res.total;
                    }
                    else{
                        [this.tableReplytData,this.pageReply.total]=[[],0]
                    }
                    this.loadingTable2 = false;
                })
                .catch(res => {
                    this.loadingTable2 = false;
                     [this.tableReplytData,this.pageReply.total]=[[],0]
                    this.$message.error(res.message);
                });
        },

        lookReply(val){
            this.commentId=val;
            this.isComment=false;
            this.getReplyList();
        },
         //删除
        del(row) {
            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                if(this.isComment){
                    let data={
                        videoId:this.videoId,
                        commentId:row.commentId,
                    }
                    this.$http.get(this.$api.deleteVideoComment, data, true) .then(res => {
                           this.$message.success("删除成功");
                            this.getCommentList();
                        })
                        .catch(res => {
                            this.$message.error(res.message);
                        });
                }
               else{
                     let data={
                        replyId:row.replyId,
                        commentId:row.commentId,
                      }
                    this.$http.get(this.$api.deleteVideoCommentReply, data, true) .then(res => {
                           this.$message.success("删除成功");
                            this.getReplyList();
                        })
                        .catch(res => {
                            this.$message.error(res.message);
                        });
               } 
            });
        }
    }
};
</script>
<style scoped lang="scss">
    .text{
        line-height: 2;
        font-size: 15px;
    }
</style>