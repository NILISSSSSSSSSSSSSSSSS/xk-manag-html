<template>
  <div>
    <div>
      <el-button class="customStyle" @click="showMessage">有人想加你为好友</el-button>
      <p id="text" ></p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'message',
    props: {
      pubTitle: {
        type: String,
        default: ''
      },
      pubBody: {
        type: String,
        default: ''
      },
      friendName: {
        type: String,
        default: ''
      },
      pubIcon: {
        type: String,
        default: ''
      },
    },
    data() {
      return {

      }
    },
    created() {
    },
    methods: {
      showMessage(){
        if (window.Notification) {
          if (Notification.permission == "granted") {
            this.popNotice();
          } else if (Notification.permission != "denied") {
            Notification.requestPermission(function (permission) {
              this.popNotice();
            });
          }
        } else {
          this.open();
        }
        this.$emit("showMessage");
      },
      popNotice() {
        if (Notification.permission == "granted") {
          var notification = new Notification(this.pubTitle, {
            body: this.pubBody,
            icon:'//image.zhangxinxu.com/image/study/s/s128/'+this.pubIcon+'.jpg'
          });
          notification.onclick = ()=>{
            text.innerHTML = this.friendName+'已于' + new Date().toTimeString().split(' ')[0] + '加你为好友！';
            notification.close();
          };
        } else {
          this.open();
        }
      },
      open() {
        this.$notify({
          title: this.pubTitle,
          message: this.pubBody,
          duration: 0,
        });
      }
    }
  }
</script>

<style scoped>
</style>

