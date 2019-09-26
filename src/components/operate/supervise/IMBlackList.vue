<template>
    <div class="im-black-list">
        <el-table :data="prizeData">
            <el-table-column label="用户ID"></el-table-column>
            <el-table-column label="用户名称"></el-table-column>
            <el-table-column label="文字涉敏感次数"></el-table-column>
            <el-table-column label="图片/视频涉敏感次数"></el-table-column>
            <el-table-column label="最近拉黑日期"></el-table-column>
            <el-table-column label="用户状态"></el-table-column>
            <el-table-column label="操作" fixed="right" width="200px">
                <template slot-scope="scope">
                    <el-button class="xk-danger" :size="$size" type="text">从黑名单删除</el-button>
                    <el-button class="xk-success" :size="$size" type="text" @click="viewDetail(scope.row)">查看详情</el-button>
                    <br>
                    <el-button class="xk-warning" :size="$size" type="text">恢复功能</el-button>
                    <el-button :size="$size" type="text">冻结账号</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        props:{
            prizeData: {
                default: ()=> [],
                type: Array
            }
        },
        data() {
            return {}
        }
    }
</script>

<style scoped lang="scss">
    .im-black-list {
        
    }
</style>
