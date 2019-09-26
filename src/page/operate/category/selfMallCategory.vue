<template>
  <div class="xk-container">
    <!--搜索头-->
    <div class="xk-radius">
      <div class="xk-title">
        <div class="vus-title">
          <span></span>自营商城商品分类管理
        </div>
        <div class="vus-btn">
          <el-button type="primary" :size="$size" @click.stop="addFirstCategory" v-permission="'selfMallCategoryAdd'">添加分类</el-button>
        </div>
        <div class="vus-bottom"></div>
      </div>
      <div class="xk-category">
        <el-tree v-if='showAgain' :data="data" accordion :props="props" v-loading='vloading' node-key="code" @node-expand='nodeExpand' :default-expanded-keys="[openCode]">
          <span slot-scope="{ node, data }">
            <span class="content">
              <img v-show="data.level === 3" class="imgSize" :src="data.picUrl">
              {{ node.label }}
              <div class="xk-sort">
                <el-button type="success" :size="$size" @click.stop="fnXkSort(data,node,'up')" v-permission="'selfMallCategorySort'">
                  <i class="iconfont icon-shang"></i>
                </el-button>
                <el-button type="info" :size="$size" @click.stop="fnXkSort(data,node,'down')" v-permission="'selfMallCategorySort'">
                  <i class="iconfont icon-xia"></i>
                </el-button>
              </div>
            </span>
            <span class="operation">
              <el-button
                type="primary"
                size="mini"
                @click.stop="addSecondCategory(data)"
                v-show="data.level===1"
                v-permission="'selfMallCategoryAdd'"
              >添加二级分类</el-button>
              <el-button
                type="success"
                size="mini"
                @click.stop="addThirdCategory(data)"
                v-show="data.level===2"
                v-permission="'selfMallCategoryAdd'"
              >添加三级分类</el-button>
              <el-button
                type="warning"
                size="mini"
                @click.stop="setAttr(data)"
                v-show="data.level===3"
                v-permission="'selfAddCategoryAttr'"
              >属性模板设置</el-button>
              <el-button type="warning" size="mini" @click.stop="editCategory(data)" v-permission="'selfMallCategoryEdit'">编辑</el-button>
              <el-button type="danger" size="mini" @click.stop="deleteDialog(data)" v-permission="'selfMallCategoryDel'">删除</el-button>
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
          <el-button type="plain" @click.stop="delCancle" :size="$size">取消</el-button>
          <el-button type="primary" @click.stop="delSure" :size="$size">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <add-first-category :firstDialog.sync="firstDialog" :title="title" :lastSort='lastSort' @categoryRefresh = 'categoryRefresh'></add-first-category>
    <add-second-category :secondDialog.sync="secondDialog" :title="title" :secData='secData' @categoryRefresh = 'categoryRefresh'></add-second-category>
    <add-third-category :thirdDialog.sync="thirdDialog" :title="title" :thirdData='thirdData' @categoryRefresh = 'categoryRefresh'></add-third-category>
    <edit-category :editDialog.sync="editDialog" :title="title" :editData='editData' @categoryRefresh = 'categoryRefresh'></edit-category>
    <el-dialog
      :visible.sync="attrDialog"
      title="设置属性"
      width="793px"
      :before-close="attrCancle"
    >
      <set-attr v-model="setValue" :saveData='saveData' :attrData='attrData' :attrDialog='attrDialog' @attrId='attrId' :xiugai='xiugai'></set-attr>
      <div class="attr-center">
        <el-button type="plain" @click.stop="attrCancle" :size="$size">取消</el-button>
        <el-button type="primary" @click.stop="attrSure" :size="$size">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import addFirstCategory from "./page/self/addFirstCategory.vue";
  import addSecondCategory from "./page/self/addSecondCategory";
  import addThirdCategory from "./page/self/addThirdCategory.vue";
  import editCategory from "./page/self/editCategory";
  import setAttr from "./page/setAttr.vue";
  import {mapState,mapMutations} from 'vuex'
  export default {
    name: "selfMallCategory",
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
        data: [],
        vloading:true,
        lastSort:1,
        editData:null,
        delData:null,
        secData:null,
        thirdData:null,
        attrDialog:false,
        setValue:"",
        saveData:false,
        attrData:null,
        id:null,
        openCode:0,
        xiugai:true,
        showAgain:true
      };
    },
    created() {
      this.getThisPage();
      if(this.openCodeVuex){
        this.openCode = this.openCodeVuex
      }
    },
    computed:{
      ...mapState({
        openCodeVuex:(state) => state.operateCategory.openCode
      })
    },
    methods: {
      ...mapMutations({
        setOpenCode:'operateCategory/setOpenCode'
      }),
      nodeExpand(data,node){
        this.openCode = node.data.code ;
        this.setOpenCode(node.data.code)
      },
      addFirstCategory() {
        this.title = "新增一级分类";
        this.firstDialog = true;
        this.openCode = ""
      },
      addSecondCategory(data) {
        this.title = "新增二级分类";
        this.secondDialog = true;
        this.secData = data ;
        this.openCode = ""
      },
      addThirdCategory(data) {
        this.title = "新增三级分类";
        this.thirdDialog = true;
        this.thirdData = data ;
      },
      setAttr(data){
        console.log(data);
        this.attrData = data ;
        this.attrDialog = true ;
        this.openCode = ""
      },
      attrId(id){
        this.id = id ;
        this.openCode = ""
      },
      attrSure(){
        this.openCode = ""
        let arr = [];
        let mainStatus = true,
            subStatus =true,
            selectStatus = true;
        this.setValue.forEach((item,index) => {
            if(item.setName){
              arr.push({
                columns:[],
                name:item.setName
              });
              if(item.nameArr.length){
                item.nameArr.forEach((list,i) => {
                    if(list.setName){
                        if(list.columnValueType=='SELECT'&&(!list.values|| list.values&&list.values.length==0)){
                            selectStatus = false;
                            return false;
                        }
                        let obj = {
                            name:list.setName,
                            required: 0,  //全部修改为非比必填
                            columnValueType: list.columnValueType
                        }
                        list.columnValueType=='SELECT'? obj.values = list.values: null;
                        arr[arr.length - 1].columns.push(obj)
                    }else{
                        subStatus = false;
                        return false;
                    }
                });
              }else{
                  subStatus = false;
                  return false;
              }
            }else{
                mainStatus =false;
                return false;
            }
        });
        if(!mainStatus) {
            this.$message.error('请完善模块属性名称！');
            return false;
        }
        if(!subStatus) {
            this.$message.error('请完善子属性名称！')
            return false;
        }
        if(!selectStatus) {
            this.$message.error('请完善选择项标签！')
            return false;
        }
        console.log(JSON.stringify(arr));
        if(!arr.length){
          this.$message.error("无有效数据")
        }else{
          if(this.id){
              this.$http.post(this.$api.addCategoryAttr, {categoryAttrDTO:{attrList:arr,id:this.id}} , true).then((res) => {
                this.attrDialog = false ;
              }).catch((err) => {
                console.log(err)
                this.$message.error(err.error);
                this.attrDialog = false ;
              });
          }else{
              let sendObj = {
                      categoryCreateDTO:{
                          category:{
                              picUrl:this.attrData.picUrl,
                              enable:this.attrData.enable,
                              name:this.attrData.name,
                              sort:this.attrData.sort,
                              level:3,
                              pCode:this.attrData.pCode,
                              code:this.attrData.code
                          },
                          categoryAttrs:arr
                      }
              }
              this.$http.post(this.$api.categoryCreate, sendObj, true).then((res) => {
                this.attrDialog = false;
                console.log(sendObj);
                this.getThisPage()
                this.$message({
                    message: '添加成功！',
                    type: 'success'
                  });
              }).catch((err) => {
                this.$message.error(err.message);
                this.attrDialog = false;
              });
          }

        }
        
      },
      attrCancle(){
        this.attrDialog = false ;
        this.openCode = ""
      },
      editCategory(data) {
        this.title = "编辑分类";
        this.editDialog = true;
        this.editData = data ;
        this.openCode = ""
      },
      deleteDialog(data) {
        this.delDialog = true;
        this.delData = data ;
        this.openCode = ""
      },
      delCancle() {
        this.delDialog = false;
        this.openCode = ""
      },
      delSure(){
        this.openCode = ""
        this.$http.post(this.$api.categoryDelete,{code:this.delData.code} , true).then((res) => {
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
      getThisPage(){
        this.$http.get(this.$api.categoryQueryList, {}, true).then((res) => {
           console.log(res);
            if(res){
              this.data = res ;
              this.lastSort = res[res.length - 1].sort
            }
            this.vloading = false ;
        }).catch((err) => {
           if(err.code != 409){
              this.$message.error(err.message);
            };
            this.data = [];
            this.vloading = false ;
        });
      },
      categoryRefresh(){
        this.getThisPage();
      },
      fnXkSort(target,node,p) {
        this.openCode = ""
        // console.log(target,node,p);
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
        
        
        this.$http.post(this.$api.categoryUpdateSort,{
          "sourceCode":sourceCode,
          "targetCode":targetCode
        } , true).then((res) => {
          console.log(res)
          // console.log(targetNode);
          // this.showAgain = false ;
          // if(targetNode[sourceIndex].pCode===0){
          //   let [a,b] = [this.data[targetIndex],this.data[sourceIndex]]
          //   Vue.set(this.data,sourceIndex,a);
          //   Vue.set(this.data,targetIndex,b)
          // }else{
          //   this.data.forEach((item,index) => {
          //     if(item.code===targetNode[sourceIndex].pCode){
          //       let [a,b] = [this.data[index].children[targetIndex],this.data[index].children[sourceIndex]]
          //       Vue.set(this.data[index].children,sourceIndex,a);
          //       Vue.set(this.data[index].children,targetIndex,b)
          //     }
          //   });
          // }
          // console.log(this.data);
          // this.$nextTick(()=>{
          //   this.showAgain = true
          // })
          this.getThisPage()
        }).catch((err) => {
          console.log(err)
        });
      }
    },
    components: {
      addFirstCategory,
      addSecondCategory,
      addThirdCategory,
      editCategory,
      setAttr
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
  .attr-center{
    padding-top: 20px;
    text-align: center
  }
  @import "./icon/iconfont.css";
</style>
