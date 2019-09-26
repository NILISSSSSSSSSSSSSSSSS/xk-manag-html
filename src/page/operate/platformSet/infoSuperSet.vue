<template>
    <div class = 'xk-container'>
      <div class='xk-radius'>
        <div class='xk-title'>
          <div class='vus-title'>
           <span></span>
              信息监管设置
        </div>
        <div class='vus-btn'>
          <el-button type='primary' v-show="getPermission('infoSuperSetMPage')" v-permission="infoSuperSetMAdd" :size='$size' v-if="activeName==='badWord'" @click="fnadd">新增</el-button>
        </div>
        <div class='vus-bottom'></div>
        
      </div>
    </div>
    <div class='xk-body xk-radius marintop20'>
        <div class='xk-title'>
            <div class='vus-title'>
            <span></span>
                {{activeName==='badWord' ? '列表':'信息监管黑名单阀值设置'}}
          </div>
          <div class='vus-bottom'></div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <!-- <el-tab-pane label="敏感词列表" name="badWord" v-if="getPermission('infoSuperSetMPage')">
            <bad-word :xkrefresh='xkrefresh'></bad-word>
          </el-tab-pane> -->
          <el-tab-pane label="敏感词列表" name="newBadWord">
            <new-bad-word></new-bad-word>
          </el-tab-pane>
          <el-tab-pane label="黑名单阀值设置" name="blackSet" v-if="getPermission('infoSuperSetInfo')">
            <black-set></black-set>
          </el-tab-pane>
        </el-tabs>
        <el-dialog title="新增敏感词" :visible="dialogFormVisible" @close='dialogFormVisible = false'>
          <el-form label-width="80px">
            <el-form-item label="敏感词：" >
              <el-input v-model="word" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false" :size='$size'>取 消</el-button>
            <el-button type="primary" @click="submit" :loading='load' :size='$size'>确 定</el-button>
          </span>
        </el-dialog>
    </div>
  </div>
</template>
<script>
import badWord from './infoSuperSet/badWord'
import newBadWord from './infoSuperSet/newBadWord'
import blackSet from './infoSuperSet/blackSet'
import {getPermission} from '@/util/publicMehotds';
export default {
  name:'infoSuperSet',
  data () {
    return {
      activeName: 'newBadWord',
      dialogFormVisible:false,
      word:'',
      load:false,
      xkrefresh:false
    };
  },
  props: {},
  components: {
    badWord,
    blackSet,
    newBadWord
  },
  computed: {},
  created() {
    if(!getPermission('infoSuperSetMPage')){
      this.activeName='blackSet'
    }
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {},
    fnadd(){
      this.dialogFormVisible = true;
      this.word = '';
    },
    submit(){
      this.$http.post(this.$api.sensitiveWordCreate,{"word":this.word},true).then(res => {
        console.log(this.word);
        this.load = false ;
        this.dialogFormVisible = false;
        this.xkrefresh = !this.xkrefresh ;
      }).catch(err => {
        console.log(err);
        this.load = false ;
        this.dialogFormVisible = false;
      })
    },
    getPermission
  },
  watch: {}
}
</script>
<style scoped>
</style>