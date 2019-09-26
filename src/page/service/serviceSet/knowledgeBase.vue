<template>
    <div class = 'xk-container'>
        <div class='xk-body'>
            <div class='knowledge-base'>
                <div class="xk-radius" v-if="selectV==='xkqus'">
                    <div class='xk-title'>
                        <div class="vus-title">
                            <span></span>
                            {{title}}搜索
                        </div>
                        <div class="vus-btn">
                            <el-button type="primary" @click="onSubmit" :size="$size" :loading = "load">搜索</el-button>
                        </div>
                        <div class="vus-bottom"></div>
                    </div>
                    <el-form :size="$size" 
                            :inline="true" 
                            :model="formInline"
                            class="demo-form-inline xk-search">
                        <el-form-item label="问题内容：">
                            <el-input v-model="formInline.title" :size="$size" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="问题分类：">
                            <el-select v-model="formInline.categoryId" :size="$size" placeholder="分类">
                                <el-option v-for="(item,index) in categoryId" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态：">
                            <el-select v-model="formInline.status" :size="$size" placeholder="状态">
                                <el-option label="激活" value="active"></el-option>
                                <el-option label="冻结" value="disabled"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="视角：">
                            <el-select v-model="formInline.viewerType" :size="$size" placeholder="视角">
                                <el-option label="所有视角" value=""></el-option>
                                <el-option
                                    v-for="item in viewerType"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="xk-radius marintop20">
                <div class='xk-title'>
                        <div class="vus-title">
                            <span></span>
                            {{title}}列表
                        </div>
                        <div class="vus-btn">
                            <el-button v-permission="'knowledgeBaseKnowAdd'" v-show="activeIndex=='xkqus'" type="primary service-btn" :size="$size" @click.stop = "showdialog(selectV)">{{activeTitle}}</el-button>
                            <el-button v-permission="'knowledgeBaseKnowClassAdd'" v-show="activeIndex=='xkclass'" type="primary service-btn" :size="$size" @click.stop = "showdialog(selectV)">{{activeTitle}}</el-button>
                            <el-button v-permission="'knowledgeBaseQusAdd'" v-show="activeIndex=='xkknow'" type="primary service-btn" :size="$size" @click.stop = "showdialog(selectV)">{{activeTitle}}</el-button>
                            <el-button v-permission="'konwledgeBaseQusClassAdd'" v-show="activeIndex=='xkknowclass'" type="primary service-btn" :size="$size" @click.stop = "showdialog(selectV)">{{activeTitle}}</el-button>
                        </div>
                        <div class="vus-bottom"></div>
                    </div>
                <div class="know-main" style="margin-top:-20px">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                        <el-menu-item index="xkqus" v-permission="'knowledgeBaseKnowSearch'">客服培训问题（内部用）</el-menu-item>
                        <el-menu-item index="xkclass" v-permission="'knowledgeBaseKnowClassPage'">培训问题分类管理</el-menu-item>
                        <el-menu-item index="xkknow" v-permission="'knowledgeBaseQusPage'">常见问题编辑（客户端）</el-menu-item>
                        <el-menu-item index="xkknowclass" v-permission="'knowledgeBaseQusClassPage'">常见问题分类（客户端）</el-menu-item>
                    </el-menu>
                </div>
                <div class="know-table">
                    <component @update='fnupdate' :is="selectV" :isadd="isAdd" :searchData = "formInline" :issearch = "issearch" @searchSuccess="fnsearchSuccess"></component>
                </div>
            </div>
            <addqus :targetId="targetId" :dialogTableVisible.sync="isshowqus" @addSuccsee = 'fnaddSuccsee' @listdata = "fnlistdata"></addqus>
            <addclass :targetId="targetId" :dialogTableVisible.sync="isshowclass" @addSuccsee = 'fnaddSuccsee'></addclass>
            <addknow :targetId="targetId" :dialogTableVisible.sync="isshowknow" @addSuccsee = 'fnaddSuccsee'></addknow>
            <addknowclass :targetId="targetId" :dialogTableVisible.sync="isknowclass" @addSuccsee = 'fnaddSuccsee'></addknowclass>
        </div>
    </div>
</template>
<script>
import xkqus from "./knowBas/qus"
import xkclass from "./knowBas/class"
import xkknow from "./knowBas/know"
import addqus from "./knowBas/addqus"
import addclass from "./knowBas/addclass"
import addknow from "./knowBas/addknow"
import {mapState,mapMutations} from 'vuex';
import xkknowclass from "./knowBas/knowclass"
import addknowclass from "./knowBas/addknowclass"
export default {
  name:'knowledgeBase',
  data () {
    return {
        formInline: {
          title: '',
          status:"active",
          viewerType:null,
          categoryId:null
        },
        activeIndex:"xkqus",
        selectV:'xkqus',
        isshowqus:false,
        isshowclass:false,
        isshowknow:false,
        isknowclass:false,
        viewerType:JSON.parse(localStorage.getItem('viewerType')),
        issearch:false,
        categoryId:[],
        isAdd:false,
        targetId:null,
        load:false
    };
  },
  components: {
      xkqus,
      xkclass,
      xkknow,
      addqus,
      addclass,
      addknow,
      xkknowclass,
      addknowclass
  },
  computed: {
      activeTitle(){
          return this.selectV === 'xkqus' ? '增加问题' : this.selectV === 'xkclass'?'新增分类':this.selectV === 'xkknow'?'新增知识点':'新增知识点分类'
      },
      title(){
          return this.selectV === 'xkqus' ? '知识库(问题)' : this.selectV === 'xkclass'?'知识库(分类)':this.selectV === 'xkknow'?'知识库(知识点)':'知识库(知识点分类)'
      },
      ...mapState({
          knowledgeBase:state => state.service.knowledgeBase
      })
  },
  created() {
      this.formInline = this.knowledgeBase ? this.knowledgeBase : {
          title: '',
          status:"active",
          viewerType:null,
          categoryId:null
        }
  },
  mounted() {},
  methods: {
      ...mapMutations({
          setknowledgeBase:"service/setknowledgeBase"
      }),
      handleSelect(v){
          this.selectV = v ;
      },
      showdialog(v){
          this.targetId = null;
          switch (v) {
              case 'xkqus':
                  this.isshowqus = true
                  break;
              case 'xkclass':
                  this.isshowclass = true
              break;
              case 'xkknowclass':
                  this.isknowclass = true
              break;
          
              default:
                  this.isshowknow = true
                  break;
          }
          
      },
      fnupdate(target){
          this.targetId = target.id;
          switch (this.selectV) {
              case 'xkqus':
                  this.isshowqus = true
                  break;
              case 'xkclass':
                  this.isshowclass = true
              break;
              case 'xkknowclass':
                  this.isknowclass = true
              break;
          
              default:
                  this.isshowknow = true
                  break;
          }
          
      },
      onSubmit(){
          this.load = true ;
          this.issearch = !this.issearch;
          this.setknowledgeBase(this.formInline)
      },
      fnsearchSuccess(){
          this.load = false ;
      },
      fnlistdata(d){
          this.categoryId = d ;
        //   this.categoryId.unshift({
        //       value: null,
        //       label: '全部分类'
        //   })
      },
      fnaddSuccsee(){
          this.isAdd = !this.isAdd
      }
  }
}
</script>
<style lang='scss' scoped>
    @import "./scss/knowledegBase";
</style>