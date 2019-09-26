<template>
    <div class="banner">
        <el-form ref="form" :model="form" label-width="100px" v-loading="vloading">
            <el-form-item label="所属模块：" required>
                <el-select v-model="form.modul" placeholder="所属模块">
                    <el-option
                        :label="item.label"
                        :value="item.value"
                        v-for="item in opations"
                        :key="item"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择模块：" required>
                <el-select v-model="tempValue" style="margin-bottom:20px">
                    <el-option
                        v-for="(item,index) in tempArr"
                        :key="index"
                        :label="item.label"
                        :value="item.tempValue"
                    ></el-option>
                </el-select>
                <dynamic-banner
                    :config="config"
                    v-model="templateContent"
                    :imgArr="imgArr"
                    :infoArr="infoArr"
                ></dynamic-banner>
            </el-form-item>
            <el-form-item label="专属区域：" v-if="showAgain" required>
                <province-cascader v-model="form.province"></province-cascader>
            </el-form-item>
            <el-form-item v-if="!lookdetail">
                <el-button @click="cancel" :size="$size">取消</el-button>
                <el-button type="primary" :size="$size" @click="onSubmit" :loading="load">添加</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import DynamicBanner from "../../../../components/DynamicBanner";
    import ProvinceCascader from "@/components/ProvinceCascader.vue";
    export default {
      name: "banner",
      data() {
        return {
          templateContent: "",
          opations: JSON.parse(localStorage.getItem("bannerModule")),
          form: {
            modul: "",
            province: []
          },
          tempArr: [
            {
              label: "模板一",
              tempValue: 1,
              templateName: "TMP_ONE"
            },
            // {
            //     label:'模板二',
            //     tempValue:2
            // },
            {
              label: "模板二",
              tempValue: 2,
              templateName: "TMP_TWO"
            },
            {
              label: "模板三",
              tempValue: 3,
              templateName: "TMP_THREE"
            },
            {
              label: "模板四",
              tempValue: 4,
              templateName: "TMP_FOUR"
            },
            {
              label: "模板五",
              tempValue: 5,
              templateName: "TMP_FIVE"
            }
            // {
            //     label:'模板七',
            //     tempValue:7
            // },
            // {
            //     label:'模板八',
            //     tempValue:8
            // }
          ],
          tempValue: 1,
          vloading: false,
          showAgain: true,
          imgArr: [],
          templateContentDetail: null,
          infoArr: [],
          load: false
        };
      },
      props: {
        lookdetail: {
          type: Boolean,
          default: false
        },
        dochange: {},
        targetId: {},
        dialogVisible: {}
      },
      components: {
        DynamicBanner,
        ProvinceCascader
      },
      computed: {
        config() {
          let arr = [];
          let config = {
            width: 400,
            height: 200,
            x: 2,
            y: 2,
            arr: []
          };
          switch (this.tempValue) {
            case 1:
              arr = [
                {
                  gridX: "0,0",
                  gridY: "2,2"
                }
              ];
              break;
            case 2:
              arr = [
                {
                  gridX: "0,0",
                  gridY: "1,1"
                },
                {
                  gridX: "1,0",
                  gridY: "2,1"
                },
                {
                  gridX: "0,1",
                  gridY: "1,2"
                },
                {
                  gridX: "1,1",
                  gridY: "2,2"
                }
              ];
              break;
            case 3:
              arr = [
                {
                  gridX: "0,0",
                  gridY: "2,1"
                },
                {
                  gridX: "0,1",
                  gridY: "1,2"
                },
                {
                  gridX: "1,1",
                  gridY: "2,2"
                }
              ];

              break;
            case 4:
              arr = [
                {
                  gridX: "0,0",
                  gridY: "1,1"
                },
                {
                  gridX: "1,0",
                  gridY: "2,2"
                },
                {
                  gridX: "0,1",
                  gridY: "1,2"
                }
              ];

              break;
            case 5:
              arr = [
                {
                  gridX: "0,0",
                  gridY: "1,1"
                },
                {
                  gridX: "1,0",
                  gridY: "2,1"
                },
                {
                  gridX: "0,1",
                  gridY: "2,2"
                }
              ];

              break;
            case 6:
              arr = [
                {
                  gridX: "0,0",
                  gridY: "1,2"
                },
                {
                  gridX: "1,0",
                  gridY: "2,1"
                },
                {
                  gridX: "1,1",
                  gridY: "2,2"
                }
              ];

              break;
            case 7:
              arr = [
                {
                  gridX: "0,0",
                  gridY: "2,1"
                },
                {
                  gridX: "0,1",
                  gridY: "2,2"
                }
              ];

              break;
            case 8:
              arr = [
                {
                  gridX: "0,0",
                  gridY: "1,2"
                },
                {
                  gridX: "1,0",
                  gridY: "2,2"
                }
              ];

              break;
            case 1:
              console.log(1);

              break;

            default:
              break;
          }
          config.arr = arr;
          return config;
        }
      },
      created() {
        if (this.dialogVisible && this.lookdetail) {
          this.getDetail();
        }
      },
      mounted() {},
      methods: {
        dataInit() {
          this.form = {
            modul: "",
            province: []
          };
          this.showAgain = false;
          this.tempValue = 1;
          this.$nextTick(()=>{
            this.showAgain = true ;
          })
        },
        getDetail() {
          this.vloading = true;
          this.$http.get(this.$api.bannerDetail, { id: this.targetId }, true)
            .then(res => {
              console.log(res);
              
              this.vloading = false;
              this.showAgain = false;
              this.form = {
                modul: res.bannerModule,
                province: [res.provinceCode, res.cityCode, res.districtCode]
              };
              this.tempArr.forEach(item => {
                if (item.templateName === res.template) {
                  this.tempValue = item.tempValue;
                }
              });
              this.imgArr = [];//查询出的所有图地址
              let templateContent = JSON.parse(res.templateContent).arr;
              this.templateContentDetail = templateContent;
              this.infoArr = templateContent;//所有templateContent信息
              templateContent.forEach(item => {
                this.imgArr.push(item.src);
              });
              this.$nextTick(() => {
                this.showAgain = true;
              });
            })
            .catch(err => {
              console.log(err);
              this.vloading = false;
            });
        },
        changePage() {
          this.$emit("closeBanner");
        },
        cancel() {
          this.$emit("closeBanner");
        },
        onSubmit() {
          let obj = {
            templateName: this.tempArr[this.tempValue - 1].templateName,
            templateContent: this.templateContent,
            provinceCode: this.form.province[0],
            cityCode: this.form.province[1],
            districtCode: this.form.province[2],
            bannerModule: this.form.modul
          };
          //   无法跳出循环
          //   obj.templateContent.arr.forEach((item,index)=>{
          //       if(!item){
          //           this.$message.error('轮播图不能为空')
          //           return false;
          //       }
          //   })
          for (let index = 0; index < obj.templateContent.arr.length; index++) {
            if (!obj.templateContent.arr[index]) {
              this.$message.error("轮播图不能为空");
              return false;
            }
          }
          this.load = true;
          console.log(obj);
          
          this.$http.post(this.$api.bannerCreate, obj, true)
            .then(res => {
              this.dataInit();
              this.tempValue = 2;
              this.$nextTick(() => {
                this.tempValue = 1;
              });
              this.$emit("addsuccess");
              this.load = false;
              this.$message({
                message: "添加成功！",
                type: "success"
              });
            })
            .catch(err => {
              this.$message.error(err.message);
              this.load = false;
            });
        },
        changeBanner() {
          let obj = {
            templateName: this.tempArr[this.tempValue - 1].templateName,
            templateContent: this.templateContent,
            provinceCode: this.form.province[0],
            cityCode: this.form.province[1],
            districtCode: this.form.province[2],
            bannerModule: this.form.modul
          };
          obj.id = this.targetId;
          //   obj.templateContent.arr.forEach((item,index) => {
          //       if(!item){
          //           obj.templateContent.arr[index] = this.templateContentDetail.arr[index];
          //           if(!obj.templateContent.arr[index]){
          //               this.$message.error('轮播图不能为空')
          //               return false;
          //           }
          //       }
          //   });
          for (let index = 0; index < obj.templateContent.arr.length; index++) {
            let item = obj.templateContent.arr[index];
            if (!item) {
              obj.templateContent.arr[index] = this.templateContentDetail.arr[
                index
              ];
              if (!obj.templateContent.arr[index]) {
                this.$message.error("轮播图不能为空");
                this.$emit("changfail");
                return false;
              }
            }
          }
          console.log(obj);

          this.$http
            .post(this.$api.bannerUpdate, obj, true)
            .then(res => {
              console.log(res);
              this.$emit("changsuccess");
              this.$message({
                message: "修改成功！",
                type: "success"
              });
            })
            .catch(err => {
              console.log(err);
              this.$emit("changsuccess");
              this.$message.error("修改失败");
            });
        }
      },
      watch: {
        dochange() {
          this.changeBanner();
        },
        dialogVisible() {
          if (this.dialogVisible && this.lookdetail) {
            this.getDetail();
          }
        }
      }
    };
</script>
<style>
    .province-cascader .el-input {
      width: 400px;
    }
</style>