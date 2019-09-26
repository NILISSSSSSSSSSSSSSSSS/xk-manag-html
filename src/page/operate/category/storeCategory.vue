<template>
  <div class="xk-container">
    <!--搜索头-->
    <div class="xk-radius">
      <div class="xk-title">
        <div class="vus-title">
          <span></span>店铺行业分类管理
        </div>
        <div class="vus-btn">
          <el-button type="primary" :size="$size" @click.stop="addFirstCategory" v-permission="'storeCategoryAdd'">添加分类</el-button>
        </div>
        <div class="vus-bottom"></div>
      </div>
      <div class="xk-category">
        <el-tree :data="data" :props="props" v-if="showAgain" accordion @node-expand='nodeExpand' node-key="code" :default-expanded-keys="[openCode]">
          <span slot-scope="{ node, data }">
            <span class="content">
              <img v-show="data.level === 3" class="imgSize" :src="data.picUrl">
              {{ node.label }}
              <div class="xk-sort">
                <el-button type="success" :size="$size" @click.stop="fnXkSort(data,node,'up')" v-permission="'storeCategorySort'">
                  <i class="iconfont icon-shang"></i>
                </el-button>
                <el-button type="info" :size="$size" @click.stop="fnXkSort(data,node,'down')" v-permission="'storeCategorySort'">
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
                v-permission="'storeCategoryAdd'"
              >添加二级分类</el-button>
              <el-button type="warning" size="mini" @click.stop="editCategory(data)" v-permission="'storeCategoryEdit'">编辑</el-button>
              <el-button type="danger" size="mini" @click.stop="deleteDialog(data)" v-permission="'storeCategoryDel'">删除</el-button>
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
    <add-first-category :firstDialog.sync="firstDialog" :title="title" @categoryRefresh = 'categoryRefresh'></add-first-category>
    <add-second-category :secondDialog.sync="secondDialog" :secData='secData' :title="title" @categoryRefresh = 'categoryRefresh'></add-second-category>
    <edit-category :editDialog.sync="editDialog" :title="title" :editData='editData' @categoryRefresh = 'categoryRefresh'></edit-category>
  </div>
</template>
<script>
  import addFirstCategory from "./page/store/addFirstCategory";
  import addSecondCategory from "./page/store/addSecondCategory";
  import editCategory from "./page/store/editCategory";
  import {mapState,mapMutations} from 'vuex';
  export default {
    name: "storeCategory",
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
        secData:null,
        delData:null,
        editData:null,
        showAgain:true,
        openCode:0
      };
    },
    created(){
      this.industryAllQList();
      if(this.storeOpenCode){
        this.openCode = this.storeOpenCode
      }
      console.log(this.storeOpenCode)
    },
    computed:{
      ...mapState({
        storeOpenCode:state => state.operateCategory.storeOpenCode
      })
    },
    methods: {
      ...mapMutations({
        setStoreOpenCode:'operateCategory/setStoreOpenCode'
      }),
      nodeExpand(data,node){
        this.openCode = data.code;
        this.setStoreOpenCode(data.code)
      },
      addFirstCategory() {
        this.openCode = ""
        this.title = "新增一级分类";
        this.firstDialog = true;
      },
      addSecondCategory(data) {
        this.title = "新增二级分类";
        this.secondDialog = true;
        this.secData = data ;
        this.openCode = ""
      },
      editCategory(data) {
          console.log(data)
        this.title = "编辑分类";
        this.editDialog = true;
        this.editData = data;
        this.openCode = ""
      },
      deleteDialog(data) {
        this.delDialog = true;
        this.delData = data;
        this.openCode = ""
      },
      delCancle() {
        this.delDialog = false;
        this.openCode = ""
      },
      delSure(){
        this.openCode = ""
        this.$http.post(this.$api.industryDelete,{industryId:this.delData.id} , true).then((res) => {
           this.delDialog = false;
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.industryAllQList()
        }).catch((err) => {
           console.log(err)
           this.$message.error(err.message);
        });
      },
      fnXkSort(target,node,p) {
        this.openCode = ""
        let targetNode = node.parent.data;
        
        
        if(Object.prototype.toString.call(targetNode) !== '[object Array]'){
          targetNode = node.parent.data.children
        }
        
        let [targetCode,sourceCode,targetIndex,sourceIndex] = [0,0,0,0]
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
        console.log(targetCode,sourceCode,targetIndex,sourceIndex,node);
        
        this.$http.post(this.$api.industryUpdateSort,{
          "sourceCode":sourceCode,
          "targetCode":targetCode
        } , true).then((res) => {
          console.log(res)
          console.log(targetNode);
          this.showAgain = false ;
          if(targetNode[sourceIndex].pCode===0){
            let [a,b] = [this.data[targetIndex],this.data[sourceIndex]]
            Vue.set(this.data,sourceIndex,a);
            Vue.set(this.data,targetIndex,b)
          }else{
            this.data.forEach((item,index) => {
              if(item.code===targetNode[sourceIndex].pCode){
                let [a,b] = [this.data[index].children[targetIndex],this.data[index].children[sourceIndex]]
                Vue.set(this.data[index].children,sourceIndex,a);
                Vue.set(this.data[index].children,targetIndex,b)
              }
            });
          }
          console.log(this.data);
          this.$nextTick(()=>{
            this.showAgain = true
          })
        }).catch((err) => {
          console.log(err)
        });
        
      },
      industryAllQList(){
        this.$http.get(this.$api.industryAllQList,{} , true).then((res) => {
           if(res){
             this.data = [];
             res.oneLevel.forEach((item,index) => {
                this.data.push({
                  picUrl:item.picUrl,
                  code:item.code,
                  level:1,
                  pCode:item.parentCode,
                  name: item.name,
                  sort: index + 1,
                  createdAt:item.createdAt,
                  updatedAt:item.updatedAt,
                  status:item.status,
                  id:item.id,
                  enable: item.enable,
                  children:[]
                })
                res.twoLevel.forEach((list,i) => {
                  if(list.parentCode === item.code){
                    this.data[index].children.push({
                        picUrl:list.picUrl,
                        code:list.code,
                        level:2,
                        pCode:list.parentCode,
                        name: list.name,
                        enable: list.enable,
                        sort: i + 1,
                        createdAt:list.createdAt,
                        updatedAt:list.updatedAt,
                        status:list.status,
                        id:list.id
                    })
                  }
                });
             });
             
           }
        }).catch((err) => {
           console.log(err)
        });
      },
      categoryRefresh(){
        this.industryAllQList();
      }
    },
    components: {
      addFirstCategory,
      addSecondCategory,
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
