<template>
  <div class="xk-container">
    <!--搜索头-->
    <div class="xk-radius">
      <div class="xk-title">
        <div class="vus-title">
          <span></span>夺奖派对商品分类管理
        </div>
        <div class="vus-btn">
          <el-button type="primary" :size="$size" @click="addFirstCategory" v-permission="'welfareMallCategoryAdd'">添加分类</el-button>
        </div>
        <div class="vus-bottom"></div>
      </div>
      <div class="xk-category">
        <el-tree :data="data" :props="props" accordion v-loading='vloading' v-if="showAgain">
          <span slot-scope="{ node, data }">
            <span class="content">
              <img v-show="data.level === 3" class="imgSize" :src="data.picUrl">
              {{ node.label }}
              <div class="xk-sort">
                <el-button type="success" :size="$size" @click.stop="fnXkSort(data,node,'up')" v-permission="'welfareMallCategorySort'">
                  <i class="iconfont icon-shang"></i>
                </el-button>
                <el-button type="info" :size="$size" @click.stop="fnXkSort(data,node,'down')" v-permission="'welfareMallCategorySort'">
                  <i class="iconfont icon-xia"></i>
                </el-button>
              </div>
            </span>
            <span class="operation">
              <el-button
                type="primary"
                :size="$size"
                @click.stop="addSecondCategory(data)"
                v-show="data.level===1"
                v-permission="'welfareMallCategoryAdd'"
              >添加二级分类</el-button>
              <el-button
                type="success"
                :size="$size"
                @click.stop="addThirdCategory(data)"
                v-show="data.level===2"
                v-permission="'welfareMallCategoryAdd'"
              >添加三级分类</el-button>
              <el-button type="warning" :size="$size" @click.stop="editCategory(data)" v-permission="'welfareMallCategoryEdit'">编辑</el-button>
              <el-button type="danger" :size="$size" @click.stop="deleteDialog(data)" v-permission="'welfareMallCategoryDel'">删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <el-dialog
      :visible.sync="delDialog"
      title="确认删除分类"
      width="400px"
      top="35vh"
      :before-close="delCancle"
    >
      <el-form class="content">
        <el-form-item>
          <div class="mediumFont">确认要删除该分类吗？</div>
        </el-form-item>
        <el-form-item>
          <el-button type="plain" @click="delCancle" :size="$size">取消</el-button>
          <el-button type="primary" @click="delSure" :size="$size">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <add-first-category :firstDialog.sync="firstDialog" :title="title" :lastSort='lastSort' @categoryRefresh = 'categoryRefresh'></add-first-category>
    <add-second-category :secondDialog.sync="secondDialog" :title="title"></add-second-category>
    <add-third-category :thirdDialog.sync="thirdDialog" :title="title"></add-third-category>
    <edit-category :editDialog.sync="editDialog" :title="title" :editData='editData' @categoryRefresh = 'categoryRefresh'></edit-category>
  </div>
</template>
<script>
  import addFirstCategory from "./page/welfare/addFirstCategory";
  import addSecondCategory from "./page/welfare/addSecondCategory";
  import addThirdCategory from "./page/welfare/addThirdCategory";
  import editCategory from "./page/welfare/editCategory";
  export default {
    name: "welfareMallCategory",
    data() {
      return {
        props: {
          label: "name",
          children: "children"
        },
        firstDialog: false,
        secondDialog: false,
        thirdDialog: false,
        editDialog: false,
        delDialog: false,
        title: "",
        data: [
          // {
          //   picUrl:
          //     "https://img12.360buyimg.com/jdcms/jfs/t2563/328/415143299/24365/e8a01b9b/564c4175N92a2e171.jpg",
          //   code: 10001,
          //   level: 1,
          //   children: [
          //     {
          //       picUrl:
          //         "https://img12.360buyimg.com/jdcms/jfs/t2563/328/415143299/24365/e8a01b9b/564c4175N92a2e171.jpg",
          //       code: 10024,
          //       level: 2,
          //       pCode: 10001,
          //       name: "英文原版",
          //       sort: 1
          //     }
          //   ],
          //   pCode: 0,
          //   name: "图书、音像、电子书刊",
          //   sort: 1
          // }
        ],
        vloading:true,
        isSort:true,
        lastSort:1,
        editData:null,
        delData:null,
        showAgain:true
      };
    },
    created() {
      this.getThisPage()
    },
    methods: {
      addFirstCategory() {
        this.title = "新增一级分类";
        this.firstDialog = true;
      },
      addSecondCategory() {
        this.title = "新增二级分类";
        this.secondDialog = true;
      },
      addThirdCategory() {
        this.title = "新增三级分类";
        this.thirdDialog = true;
      },
      editCategory(data) {
        this.title = "编辑分类";
        this.editData = data ;
        this.editDialog = true;
      },
      deleteDialog(data) {
        this.delDialog = true;
        this.delData = data ;
      },
      delCancle() {
        this.delDialog = false;
      },
      delSure(){
        this.$http.post(this.$api.deleteJFCategory,{code:this.delData.code} , true).then((res) => {
           this.delDialog = false;
           this.getThisPage();
           this.$message({
                message: '删除成功！',
                type: 'success'
              });
        }).catch((err) => {
           console.log(err)
           this.$message.error(err.message)
        });
      },
      fnXkSort(target,node,p) {
        let targetNode = node.parent.data;
        if(Object.prototype.toString.call(targetNode) !== '[object Array]'){
          targetNode = node.parent.data.children
        }
        
        let targetCode = 0 ;
        let sourceCode = 0 ;
        let targetIndex = 0 ;
        let sourceIndex = 0 ;
        if(p=='up'){
          targetNode.forEach((item,index) => {
            if(item.code===target.code){
              targetCode = item.code ;
              if(index===0){
                sourceCode = targetNode[targetNode.length - 1].code ;
                sourceIndex = targetNode.length - 1 ;
              }else{
                sourceCode = targetNode[index - 1].code
                sourceIndex = index - 1 ;
              }
              targetIndex = index ;
            }
          });
        }else{
          targetNode.forEach((item,index) => {
            if(item.code===target.code){
              targetCode = item.code ;
              if(index===targetNode.length - 1){
                sourceCode = targetNode[0].code;
                sourceIndex = 0 ;
              }else{
                sourceCode = targetNode[index + 1].code;
                sourceIndex = index + 1
              }
              targetIndex = index ;
            }
          });
        }
        this.$http.post(this.$api.jfCategoryUpdateSort,{
          "sourceCode":sourceCode,
          "targetCode":targetCode
        } , true).then((res) => {
          console.log(res)
          this.showAgain = false ;
          let [a,b] = [this.data[targetIndex],this.data[sourceIndex]]
          Vue.set(this.data,sourceIndex,a);
          Vue.set(this.data,targetIndex,b)
          this.$nextTick(()=>{
            this.showAgain = true
          })
        }).catch((err) => {
          console.log(err)
        });
      },
      getThisPage(){
        this.$http.get(this.$api.queryJFCategory,{},true).then(res => {
          console.log(res);
          if(res){
            this.data = res ;
            this.lastSort = res[res.length - 1].sort
          }
          this.vloading = false ;
        }).catch(err => {
          if(err.code != 409){
            this.$message.error(err.message);
          };
          this.data = [];
          this.vloading = false ;
        })
      },
      categoryRefresh(){
        this.getThisPage();
      }
    },
    components: {
      addFirstCategory,
      addSecondCategory,
      addThirdCategory,
      editCategory
    }
  };
</script>
<style lang="scss" scoped>
  .operation {
    position: absolute;
    display: inline-block;
    right: 0;
  }
  .content {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    position: relative;
    .xk-sort {
      width: 100px;
      position: absolute;
      right: -120px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      .el-button--small {
        padding: 0 5px;
        font-size: 20px;
        height: 32px;
        line-height: 30px;
      }
    }
  }
  .imgSize {
    height: 28px;
    width: 40px;
    vertical-align: middle;
    margin: 0 10px 0 10px;
  }
  @import "./icon/iconfont.css";
</style>
