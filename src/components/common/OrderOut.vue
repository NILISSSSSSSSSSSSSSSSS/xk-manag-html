<template>
    <el-dialog :close-on-click-modal="false" title="订单导出" :visible.sync="visible" width="400px" append-to-body :before-close="close">
        <div class="order-out">
            <el-form :model="orderForm" :label-width="labelWidth" class="xk-search" ref="orderForm" :rules="orderRule">
                <!-- <el-row>
                    <el-col :span="8"> -->
                        <el-form-item label="条数：" prop="limit">
                            <el-input :size="$size" placeholder="请输入条数" v-model.trim="orderForm.limit"></el-input>
                        </el-form-item>
                    <!-- </el-col> -->
                    <!-- <el-col :span="8">
                        <xk-form-item label="页码：" prop="page" type="integer">
                            <el-input :size="$size" placeholder="请输入要页码" v-model.trim="orderForm.page"></el-input>
                        </xk-form-item>
                    </el-col> -->
                <!-- </el-row> -->
            </el-form>
            <div class="btn-group">
                <el-button :size="$size" type="success" @click="close()">取消</el-button>
                <el-button :loading="loading" :size="$size" type="primary" @click="downExcel('orderForm')">确定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
import XkFormItem from '@/components/common/XKFormItem.vue';
import moment from 'moment';
export default {
    props: {
        loading: {
            default: false,
            type: Boolean
        },
        visible: {
            default: false,
            type: Boolean
        }
    },
    components: {
        XkFormItem
    },
    data() {
        const checkLimit = (rule, value, call) => {
            if(!value) {
                return call(new Error('不能为0或者不能为空！'))
            }
            if(!/^[1-9]\d*$/.test(value)) {
                return call(new Error('必须为正整数'))
            }
            call();
        }

        return {
            labelWidth: '100px',
            orderForm: {},
            orderRule: {
                limit: [
                    { required: true, validator: checkLimit, trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        downExcel(formName) {
            this.$refs[formName].validate(v=>{
                if(v){
                    this.$emit('down', this.orderForm.limit)
                }else{
                    return false;
                }
            })
        },
        close() {
            this.$emit('update:visible', false)
        }
    },
    watch: {
        visible(val) {
            if(val) {
                this.orderForm = {};
                this.$refs['orderForm']? this.$refs['orderForm'].resetFields(): null;
            }
        }
    }
}
</script>