<template>
  <div class="xk-container">
    <!--搜索头-->
    <div class="xk-radius">
      <div class="xk-title">
        <div class="vus-title">
          <span></span>品牌管理
        </div>
        <div class="vus-btn">
          <el-button type="primary" :size="$size" @click="fnSearch" v-permission="'brandListSearch'">搜索</el-button>
          <el-button type="primary" :size="$size" @click="fnClear">清空</el-button>
        </div>
        <div class="vus-bottom"></div>
      </div>
      <!--搜索栏-->
      <el-form label-width="120px" :model="searchForm">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="品牌ID：">
              <el-input :size="$size" v-model="searchForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称：">
              <el-input :size="$size" v-model="searchForm.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--table-->
    <div class="xk-radius margintop20">
      <div class="xk-title">
        <div class="vus-title">
          <span></span>列表
        </div>
        <div class="vus-btn">
          <el-button type="primary" :size="$size" @click="handleAdd" v-permission="'brandListAdd'">添加品牌</el-button>
        </div>
        <div class="vus-bottom"></div>
      </div>
      
      <div class="xk-brand-list">
        <el-table :data="tableData" width="100%" stripe class="margintop20" border v-loading='vloading'>
          <el-table-column label="品牌ID" prop="code"></el-table-column>
          <el-table-column label="品牌名称" prop="name"></el-table-column>
          <el-table-column label="品牌图片" prop="order">
            <template slot-scope="scope">
              <img :src="item" v-for="(item,index) in scope.row.url" :key='index' alt="">
            </template>
          </el-table-column>
          <el-table-column label="品牌描述" prop="introduction"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200px">
            <template slot-scope="scope">
              <el-button type="primary" :size="$size" @click="handleEdit(scope.row)" v-permission="'brandListEdit'">编辑</el-button>
              <el-button type="primary" :size="$size" @click="handleDelete(scope.row)" v-permission="'brandListDelete'">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination :currentPage = "currentPage" :pageSize = "pageSize" :total = "total" @change = "fnpagechange"></Pagination>
      <el-dialog
        :title="title"
        width="900px"
        :visible.sync="brandInfo"
        :before-close="handleCancle"
      >
        <el-form label-width="120px" :rules="rules" :model='form' ref='form'>
          <el-row>
            <el-col>
              <el-form-item label="品牌名称：" prop='name'>
                <el-input :size="$size" placeholder='华为' v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="首字母：" prop='firstChar'>
                <el-input :size="$size" placeholder='H' v-model="form.firstChar"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="全拼：" prop='enName'>
                <el-input :size="$size" placeholder='huawei' v-model="form.enName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="品牌图片：" prop='logoUrl' v-if="brandInfo">
                <image-upload more v-model="form.logoUrl" size="3"></image-upload>
                <div>(点击图片重新上传)</div>
                <div>建议尺寸：1065*540px</div>
                <div>品牌图片至少上传三张</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="品牌描述：" prop='introduction'>
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.introduction"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="是否启用：">
                <el-switch v-model="bEnable"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="content">
          <el-button :size="$size" type="plain" @click="handleCancle">取消</el-button>
          <el-button :size="$size" type="primary" @click="handleSure('form')" :loading='loading'>确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import ImageUpload from "../../../components/ImageUpload";
  export default {
    name: "",
    data() {
      return {
        searchForm: {
          code:"",
          name:""
        },
        brandInfo: false,
        form: {
          name:"",
          firstChar:"",
          enName:"",
          logoUrl:[],
          introduction:"",
          enable:false
        },
        title: '添加品牌',
        rules:{
          name: [
            { required: true, message: '请输入公司名', trigger: 'blur' }
          ],
          firstChar: [
            { required: true, message: '请输入公司名首字母', trigger: 'blur' }
          ],
          enName: [
            { required: true, message: '请输入公司名全拼', trigger: 'blur' }
          ],
          introduction: [
            { required: true, message: '请输入品牌描述', trigger: 'blur' }
          ]
        },
        switchValue: false,
        tableData: [],
        currentPage:1,
        pageSize:10,
        total:0,
        vloading:false,
        loading:false,
        thisBrand:{},
        bEnable:true,
        relateloding: false
      };
    },
    created(){
      this.getThisPage()
    },
    methods: {
      fnpagechange(currentPage,pageSize){
        this.currentPage = currentPage ;
        this.pageSize = pageSize ;
        console.log(currentPage,pageSize);
        this.getThisPage()
      },
      fnClear() {
        this.searchForm = {};
        this.getThisPage()
      },
      handleEdit(target) {
        this.brandInfo = true;
        this.title = "编辑品牌";
        this.thisBrand = target ;
        console.log(target);
        
      },
      handleDelete(target){
        console.log(target);
        this.$confirm('此操作将永久删除该品牌, 是否继续?', '删除品牌', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$http.get(this.$api.brandDelete, {code:target.code}, true).then((res) => {
                console.log(res)
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getThisPage()
          }).catch((err) => {
             console.log(err)
             this.$message.error(err.message);
          });
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      handleCancle() {
        this.brandInfo = false;
      },
      handleSure(formName){
        this.form.enable = this.bEnable ? 1 : 0 ;
        console.log(this.form);
        this.$refs[formName].validate((valid) => {
          if(this.form.logoUrl.length<3){
            this.$message.error("品牌图片至少上传三张");
            return
          }
          this.loading = true ;
          if (valid) {
            if(!this.thisBrand){
              this.$http.post(this.$api.brandCreate, {brand:this.form}, true).then((res) => {
                console.log(res)
                this.getThisPage();
                this.brandInfo = false;
                this.$message({
                    message: '添加成功！',
                    type: 'success'
                })
                this.loading = false ;
              }).catch((err) => {
                console.log(err)
                this.$message.error(err.message);
                this.brandInfo = false;
                this.loading = false ;
              });
            }else{
              this.$http.post(this.$api.brandUpdate, {brand:this.form}, true).then((res) => {
                console.log(res)
                this.getThisPage();
                this.brandInfo = false;
                this.$message({
                    message: '编辑成功！',
                    type: 'success'
                })
                this.loading = false ;
              }).catch((err) => {
                console.log(err)
                this.$message.error(err.message);
                this.brandInfo = false;
                this.loading = false ;
              });
            }
            
          } else {
            return false;
          }
        });
      },
      handleAdd() {
        this.brandInfo = true;
        this.title = "添加品牌";
        this.thisBrand = null;
        this.form.logoUrl = [];
        this.bEnable = true;
      },
      fnSearch(){
          let data = {
            page:this.currentPage,
            limit:this.pageSize,
            brandSearchDTO:{}
          }
          if(this.searchForm.code){
            data.brandSearchDTO.code = this.searchForm.code
          }
          if(this.searchForm.name){
            data.brandSearchDTO.name = this.searchForm.name
          }
          this.getThisPage(data);
          console.log(data)
      },
      getThisPage(data={page:this.currentPage,limit:this.pageSize,brandSearchDTO:{}}){
        this.vloading = true ;
        console.log(data)
        this.$http.get(this.$api.queryAll, data, true).then((res) => {
           console.log(res)
           this.tableData = res? res.data: [];
           this.total = res? res.total: 0;
           this.vloading = false ;
        }).catch((err) => {
          this.vloading = false ;
           this.$message.error(err.message)
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    components: {
      ImageUpload
    },
    watch:{
      brandInfo(){
        if(!this.brandInfo){
          this.resetForm('form')
        }else{
          if(this.thisBrand){
            for (const key in this.thisBrand) {
              console.log(key)
              if(key === 'url'){
                this.form.logoUrl = this.thisBrand[key]
              }else{
                this.form[key] = this.thisBrand[key]
              }
            }
          }else{
            this.form={
              name:"",
              firstChar:"",
              enName:"",
              logoUrl:[],
              introduction:"",
              enable:true
            }
          }
          console.log(this.form.enable)
          this.bEnable = this.form.enable ? true : false
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .avatar {
    width: 320px;
    height: 160px;
    line-height: 160px;
    text-align: center;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }
  .avatar:hover {
    border: 1px dashed #4c63b7;
  }
  .el-icon-plus {
    font-size: 28px;
    color: #8c939d;
  }
  .imgSize {
    width: 320px;
    height: 160px;
  }
  .content {
    margin: 0 auto;
    text-align: center;
  }
  
  .xk-brand-list table img{
    width: 50px;
    margin: 0 5px
  }
</style>
