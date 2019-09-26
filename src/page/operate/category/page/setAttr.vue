<template>
  <div class='set-attr'>
      <el-form ref="form" v-for="(item,index) in formArr" :key='item' :model="item" label-width="160px" v-loading='vloading'>
        <el-form-item label="模块属性名称：">
            <el-row :gutter="20">
                <el-col :span="14">
                    <el-input v-model="item.setName"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-button :size="$size" @click.stop='delAttr(index)'>删除此属性</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item label="模板子属性名称：" v-for="(list,i) in item.nameArr" :key='list'>
            <el-row :gutter="20">
                <el-col :span="14">
                    <el-input :size="$size" v-model="list.setName"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-button :size="$size" @click.stop='delSubAttr(index,i)'>删除此子属性</el-button>
                </el-col>
            </el-row>
            
            <el-radio-group :size="$size" v-model="list.columnValueType">
                <el-radio label="INPUT">设为输入项</el-radio>
                <el-radio label="SELECT">设为选择项</el-radio>
            </el-radio-group>

            <div class="" v-if="list.columnValueType=='SELECT'">
                子选项属性：
                <template v-if="list.values">
                    <el-tag v-for="(sub,subIndex) in list.values" :key="subIndex" size="medium" closable @close="delTag(list.values, subIndex)">{{ sub }}</el-tag>
                </template>
                <el-button size="mini" type="success" @click="addTag(list, index, i)">+&nbsp;标签</el-button>
            </div>
        </el-form-item>
        <el-form-item label="添加子属性：">
            <el-button :size="$size" @click.stop='addSubAttr(index)'>添加子属性</el-button>
        </el-form-item>
      </el-form>
      <div class="set-center">
            <el-button type="primary" :size="$size" @click.stop='addAttr'>添加模板属性名称</el-button>
      </div>

      <!-- 添加子选项 -->
      <el-dialog title="请输入标签名称" :visible.sync="visible" width="200px" appendToBody :show-close="false" :close-on-click-modal="false">
          <el-input :size="$size" v-model.trim="tagName"></el-input>
          <div class="btn-group">
              <el-button :size="$size" @click="visible=false">取消</el-button>
              <el-button :size="$size" type="primary" @click="sure()">确定</el-button>
          </div>
      </el-dialog>
  </div>
</template>
<script>
export default {
  name:'setAttr',
  data () {
    return {
        formArr:[
            {
                setName:'',
                nameArr:[]
            }
        ],
        vloading:true,
        visible: false,
        tagName: "",
        currentTagForm: {}
    };
  },
  props: {
      value:{},
      saveData:{},
      attrDialog:{},
      attrData:{},
      xiugai:{
          type:Boolean,
          default:false
      },
      categoryAttrs:{}
  },
  components: {},
  computed: {},
  created() {
      this.$emit('input',this.formArr);
      if(this.xiugai){
          this.dataAdd();
      }else{
          this.categoryAttrsInit();
      }
  },
  mounted() {},
  methods: {
      addAttr(){
          this.formArr.push({
                setName:'',
                nameArr:[]
              })
        this.$emit('input',this.formArr);
      },
      delAttr(i){
          this.formArr.splice(i,1);
          this.$emit('input',this.formArr);
      },
      delSubAttr(index,i){
          this.formArr[index].nameArr.splice(i,1);
      },
      addSubAttr(i){
        this.formArr[i].nameArr.push({
            setName:'',
            columnValueType: 'INPUT'
        });
            this.$emit('input',this.formArr);
      },
      dataInit(){
          this.formArr = [
                {
                    setName:'',
                    nameArr:[]
                }
            ]
            this.vloading = true ;
      },
      async dataAdd(){
          let res = await this.getAttr(this.attrData);
          console.log(res)
          this.vloading = false ;
          if(res){
              try {
                  this.formArr = [];
                  this.$emit('attrId',res.id)
                  res.attrs.forEach((item,index) => {
                        this.formArr.push({
                            setName:item.name,
                            nameArr:[]
                        })
                        item.columns.forEach((page,i) => {
                            this.formArr[this.formArr.length - 1].nameArr.push({
                                setName:page.name,
                                columnValueType: page.columnValueType? page.columnValueType: 'INPUT',    //兼容以前的老版本
                                values: page.values
                            })
                        });
                  });
                  this.$emit('input',this.formArr);
              } catch (error) {
                  
              }
          }else{
              this.$emit('attrId',null)
          }
      },
      getAttr(data){
        return new Promise((resolve,reject) => {
            this.$http.get(this.$api.queryCategoryAttrList,{categoryCode:data.code} , true).then((res) => {
                console.log(res)
               resolve(res)
            }).catch((err) => {
                this.$message.error(err.message);
               reject(err);
            });
        })
      },
      categoryAttrsInit(){
          this.vloading = false;
          if(this.categoryAttrs.length){
                this.formArr = [];
                this.categoryAttrs.forEach((item,index) => {
                    this.formArr.push({
                        setName:item.name,
                        nameArr:[]
                    })
                    item.columns.forEach((page,i) => {
                        this.formArr[this.formArr.length - 1].nameArr.push({
                            setName:page.name
                        })
                    });
                });
          }
      },
      /** 新增标签
       * @param list 当前标签所属的对象
       * @param parentIndex 父级索引
       * @param subIndex 子级索引
       */
      addTag(list, parentIndex, subIndex) {
        if(!Array.isArray(list.values)) {
            this.$set(list, 'values', [])
        }
        this.tagName = "";
        this.currentTagForm = {
            list,
            parentIndex,
            subIndex
        }
        this.visible = true;
      },
      sure() {
          if(this.currentTagForm.list.values.indexOf(this.tagName)>-1) {
              this.$message.error('已经有相同的标签，请勿重复添加');
              return false;
          }
          if(!this.tagName) {
              this.$message.error('标签不能为空！');
              return false;
          }
          this.formArr[this.currentTagForm.parentIndex].nameArr[this.currentTagForm.subIndex].values.push(this.tagName);
          this.visible =false;
      },
      //删除标签
      delTag(list, index) {
          list.splice(index, 1);
      }
  },
  watch: {
      saveData(){
          this.$emit('input',this.formArr);
      },
      attrDialog(){
          if(!this.attrDialog){
              this.dataInit();
              this.$emit('input',this.formArr);
          }else{
              if(this.xiugai){
                  this.dataAdd()
              }else{
                  this.categoryAttrsInit();
              }
          }
      }
  }
}
</script>
<style lang='scss' scoped>
.set-attr{
    .set-center{
        text-align: center
    }
    /deep/ .el-tag {
        margin-left: 5px;
    }
}
</style>