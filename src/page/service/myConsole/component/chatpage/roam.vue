<template>
  <div class = 'worklistroam'>
    <el-dialog
            title="请生成工单后选择流转的客服对象"
            :visible="workroamshow"
            width="793px"
            @close="handleClose">
            <el-form ref="form" :model="form" label-width="120px">
              <el-form-item label="工单标题：" required>
                <el-input v-model="form.title"></el-input>
              </el-form-item>
              <el-form-item label="工单描述：" required>
                <el-input :rows='10' type='textarea' v-model="form.description"></el-input>
              </el-form-item>
              <el-form-item label="流转对象：" required>
                <el-select v-model="form.takeOverBy" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.realname"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上传附件：">
                <image-upload v-model="form.attachments" class="imgupload" more='true' :isShow.sync='isShow'></image-upload>
              </el-form-item>
            </el-form>
            <div class="btn-center">
                <el-button @click="handleClose" :size="$size">取 消</el-button>
                <el-button type="primary" @click="handleSure" :size="$size" :loading="load">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>
<script>
import ImageUpload from '@/components/ImageUpload.vue';
import {getSession} from '@/util/publicMehotds';
export default {
  name:'worklistroam',
  data () {
    return {
      form:{
        title:"",
        description:"",
        takeOverBy:"",
        attachments:''
      },
      options:JSON.parse(localStorage.getItem('customerQPage')),
      isShow:true,
      load:false,
      xkaccount : getSession("xk-im-account") ? JSON.parse(getSession("xk-im-account")) : {},
    };
  },
  props: {
    workroamshow:{},
    customerId:{},
    workOrderId:{}
  },
  computed: {
    thiscustomerId(){
      return this.customerId
    }
  },
  mounted() {},
  components:{
    ImageUpload
  },
  methods: {
    handleClose(){
      this.$emit('closeshow')
    },
    dataInit(){
      this.form = {
        title:"",
        description:"",
        takeOverBy:"",
        attachments:''
      }
    },
    handleSure(){
      let obj = {};
      for (const key in this.form) {
        if (key === 'attachments' ) {
          if(this.form[key]){
            obj[key] = this.form[key]
          }
          
        }else{
          obj[key] = this.form[key]
        }
      }
      obj.customerId = this.thiscustomerId;
      console.log(obj);
      obj.id = this.workOrderId;
      this.load = true ;
      this.$http.post(this.$api.workOrderTransfer,obj,true)
        .then(res => {
          console.log(res);
          this.dataInit();
          this.$emit('closeshow');
          this.$emit('refreshPage');
          this.load = false ;
        })
        .catch(err => {
          this.$message.error(err.message);
          this.dataInit();
          // this.$emit('closeshow');
          // this.$emit('refreshPage');
          this.load = false ;
        })
    }
  },
  watch:{
    workroamshow(val){
      this.$http.get(this.$api.customerQPage, {}, true).then((res) => {
         if(res){
           res = res.filter((v)=>{
             return this.xkaccount.accid != v.id;
           })
           this.options = res ;
         }
         localStorage.setItem("customerQPage", JSON.stringify(res))
      }).catch((err) => {
         console.log(err);
        this.$message.error(err.message);
      });
    }
  }
}
</script>
<style lang='scss' scoped>
.btn-center{
    display: flex;
    justify-content: center;
}
</style>