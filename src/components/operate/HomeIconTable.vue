<template>
    <div class="home-icon-table">
        <el-table :data="dataTable" v-loading="loading">
            <el-table-column label="序号" prop="code"></el-table-column>
            <el-table-column label="icon名称" prop="name"></el-table-column>
            <el-table-column label="icon缩略图">
                <template slot-scope="scope">
                    <div class="img-list">
                        <img :src="scope.row.icon" alt="" @click="$viewImage(scope.row.icon)">
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="用户能否移动定制">
                <template slot-scope="scope">
                    <slot name="move" :row="scope.row" :index="scope.$index"></slot>
                </template>
            </el-table-column>
            <el-table-column label="IOS是否隐藏" v-if="index!=2">
                <template slot-scope="scope">
                    <slot name="ios" :row="scope.row" :index="scope.$index"></slot>
                </template>
            </el-table-column>
            <el-table-column label="Android是否隐藏" v-if="index!=2">
                <template slot-scope="scope">
                    <slot name="android" :row="scope.row" :index="scope.$index"></slot>
                </template>
            </el-table-column>
            <el-table-column label="操作" v-if="index==1">
                <template slot-scope="scope">
                    <!-- <span v-for="(row,index) in scope.row" :key="index"> -->
                        <slot :row="scope.row" :index="scope.$index"></slot>
                    <!-- </span> -->
                    
                    <!-- <el-button :size="$size" type="primary" @click="editData(scope.row.id)">编辑</el-button> -->
                    <!-- <el-button :size="$size" type="danger" @click="deleteData(scope.row.id)">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        props: {
            dataTable: {
                type: Array,
                default: ()=>[]
            },
            index: {
                default: 1
            },
            loading: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                picUrl: "",
            }
        },
        methods: {
            editData(id) {
                // console.log(编辑)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .img-list {
        img {
            height: 60px;
        }
    }
</style>
