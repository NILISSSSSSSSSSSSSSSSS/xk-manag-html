<template>
    <div class="training-file">
        <div class="top">
            <el-table
                :data="fileData"
                border
                stripe
                style="width: 100%;text-align:center;"
                v-loading="fileLoading">
                <el-table-column
                    prop="fileName"
                    label="文件">
                    <template slot-scope="scope">
                        <div class="file-name">
                            <img v-if="scope.row.fileSuffix=='avi'" src="@/assets/image/file/avi.png" alt="">
                            <img v-else-if="scope.row.fileSuffix=='jpg'" src="@/assets/image/file/jpg.png" alt="">
                            <img v-else-if="scope.row.fileSuffix=='mp4'" src="@/assets/image/file/mp4.png" alt="">
                            <img v-else-if="scope.row.fileSuffix=='png'" src="@/assets/image/file/png.png" alt="">
                            <img v-else-if="scope.row.fileSuffix=='zip'" src="@/assets/image/file/zip.png" alt="">
                            <img v-else src="@/assets/image/file/unknow.png" alt="">
                            <span>
                                {{scope.row.fileName}}
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="updatedAt"
                    label="更新时间">
                    <template slot-scope="scope">
                        {{scope.row.updatedAt | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="fileSize"
                    label="大小">
                    <template slot-scope="scope">
                        {{scope.row.fileSize | formatSize}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="上传者">
                </el-table-column>
                <el-table-column
                    prop="fileUrl"
                    label="操作">
                    <template slot-scope="scope">
                        <a :href="scope.row.fileUrl" target="_blank" download>下载</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="bottom">
            <div class="search-box">
                <el-input
                    placeholder="请输入文件名或上传者"
                    prefix-icon="el-icon-search"
                    v-model="sSearchName">
                </el-input>
            </div>
            <div class="group-upfile">
                <file-upload v-model="fileObj" @percent="fnPercent">
                    <el-button type="primary" :size="$size">上传文件</el-button>
                </file-upload>
            </div>
            <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
        </div>
        <el-dialog
            :visible.sync="bFileUpload"
            width="0"
            top="50vh"
            :show-close="false">
            <div class="load-box">
                <el-progress type="circle" :percentage="percentage"></el-progress>
                <p>文件上传中。。。</p>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import fileUpload from "@/components/FileUpload";
import { mapState} from "vuex";
import {getSession} from '@/util/publicMehotds'
export default {
  name:'file',
  data () {
    return {
        sSearchName:"",
        fileData:[
        //     {
        //   fileName: '三年高考五年模拟',
        //   updatedAt: '2018-08-06 12:20:16',
        //   fileSize: '6kb',
        //   username:"邓大毛",
        //   fileUrl:""
        // }
        ],
        currentPage:1,
        pageSize:10,
        total:0,
        fileObj:null,
        bFileUpload:false,
        percentage:0,
        fileLoading:false,
        searchTimer:null,
        userData: getSession("xk-user") ? JSON.parse(getSession("xk-user")) : {},
    };
  },
  props: {
      tid:{}
  },
  components: {
      fileUpload
  },
  computed: {
      ...mapState({
          groupChat:state=>state.service.groupChat
      })
  },
  created() {
      this.fnGetList()
  },
  mounted() {},
  methods: {
      fnpagechange(currentPage,pageSize){
          console.log(currentPage,pageSize);
          this.currentPage = currentPage ;
          this.pageSize = pageSize ;
          this.fnGetList()
      },
      fnPercent(num){
          this.bFileUpload = true ;
          this.percentage = parseFloat(num) ;
      },
      fnFileUpload(obj){
          obj.tid = this.tid;
          console.log(obj)
          this.$http.post(this.$api.teamFileUpload, obj, true).then((res) => {
             console.log(res)
             this.bFileUpload = false ;
             this.fnGetList();
            //  发送上传信息
             let sendData = {
                data:{
                    msgContent:`${this.userData.nickName}，上传了 ${obj.fileName} 到群文件`,
                    // msgContent:obj.fileName,
                    username:this.userData.realName,
                    fileName:obj.fileName,
                    fileSize:obj.fileSize,
                    fileSuffix:obj.fileSuffix,
                    fileUrl:obj.fileUrl,
                },
                type:1008,
                group:1
            }
            var msg = this.groupChat.sendCustomMsg({
                scene: 'team',
                to: this.tid,
                content: JSON.stringify(sendData)
            });
          }).catch((err) => {
             this.$message.error(err.message)
             this.bFileUpload = false ;
          });
      },
      fnGetList(params={tid:this.tid,page:this.currentPage,limit:this.pageSize}){
          this.fileLoading = true ;
          this.$http.get(this.$api.teamFileList, params, true).then((res) => {
             console.log(res);
             this.fileLoading = false ;
             this.fileData = res.data;
             if(res.total){
                 this.total = res.total;
             }
          }).catch((err) => {
             console.log(err);
             this.$message.error(err.message);
             this.fileLoading = false ;
             this.fileLoading = [];
          });
      }
  },
  watch: {
      fileObj(){
          this.fnFileUpload(this.fileObj)
      },
      sSearchName(){
          clearTimeout(this.searchTimer);
          this.searchTimer = setTimeout(() => {
              let params = {
                    tid:this.tid,
                    page:this.currentPage,
                    limit:this.pageSize,
                    searchKey:this.sSearchName
                  }
                  console.log(params)
              this.fnGetList(params)
          }, 1200);
      }
  }
}
</script>
<style lang='scss'>
    // 文件
    @import '../scss/trainingFile/index.scss';
</style>