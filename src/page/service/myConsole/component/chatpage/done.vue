<template>
  <div class = 'worklistcreat'>
        <el-dialog
            title="确认已完成"
            :visible="workdoneshow"
            width="793px"
            @close="handleClose">
            <el-form ref="form" :model="form" label-width="120px">
              <el-form-item label="工单标题：" required>
                <el-input v-model="form.title"></el-input>
              </el-form-item>
              <el-form-item label="工单描述：" required>
                <el-input :rows='10' type='textarea' v-model="form.description"></el-input>
              </el-form-item>
              <el-form-item label="上传附件：">
                <image-upload v-model="form.attachments" class="imgupload" more='true' :isShow.sync='isShow'></image-upload>
              </el-form-item>
            </el-form>
            <div class="btn-center">
                <el-button @click="handleClose" :size="$size">取 消</el-button>
                <el-button type="primary" @click="handleSure" :size="$size" :loading='load'>确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>
<script>
import ImageUpload from '@/components/ImageUpload.vue'
export default {
  name:'worklistcreat',
  data () {
    return {
      form:{
        title:"",
        description:"",
        attachments:''
      },
      load:false,
      isShow:true
    };
  },
  props: {
    workdoneshow:{},
    customerId:{},
    workOrderId:{}
  },
  components: {
    ImageUpload
  },
  mounted() {},
  methods: {
    handleClose(){
      this.$emit('closeshow')
    },
    handleSure(){
      this.form.customerId = this.customerId;
      this.load = true ;
      console.log(this.form);
      this.form.id = this.workOrderId ;
      this.$http.post(this.$api.workOrderFinish,this.form,true)
          .then(res => {
            console.log(this.form.id)
            this.form={
              title:"",
              description:"",
              attachments:''
            }
            this.load = false;
            this.$emit('refreshPage')
            this.$emit('closeshow')
          })
          .catch(err => {
            this.$message.error(err.message);
            this.load = false;
            this.$emit('closeshow');
            this.form={
              title:"",
              description:"",
              attachments:''
            }
          })
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
