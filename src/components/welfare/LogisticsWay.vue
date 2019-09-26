<template>
    <div class="logistics-way">
        <el-row class="way-info" v-if="detail.list">
            <el-col :span="24" v-for="(item, index) in detail.list" :key="index"><span></span>  <p :class="index==0? 'red': ''"><i v-if="index==0">最新</i>{{ item.time | formatTime }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.location }}</p></el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        props: {
            detail: {
                type: Object,
                default: ()=>({})
            }
        }
    }
</script>
<style scoped lang="scss">
    .logistics-way {
        .way-info{
            .el-col {
                border-left: 1px dashed #ccc;
                padding: 0 20px 10px 50px;
                position: relative;
                font-size: 14px;
                color: #555;
                span{
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #fff;
                    border: 2px solid #1890FF;
                    border-radius: 50%;
                    position: absolute;
                    left: -4px;
                    top: 5px;
                }
            }
        }
        .red {
            color: #f54040;
            position: relative;
            i{
                font-style: normal;
                padding-left: 5px;
                padding-right: 5px;
                background-color: #f13f40;
                color: #fff;
                position: absolute;
                left: -43px;
                top: 0
            }
        }
    }
</style>
