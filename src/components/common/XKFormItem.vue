<template>
    <el-form-item
        :label="label" 
        :prop="prop" 
        :label-width="labelWidth"
        :rules="rules[type]">
        <slot />
    </el-form-item>
</template>
<script>
    export default {
        props: {
            label: String, 
            prop: String,
            /**
             * type字段说明：
             * 
             * @param  none      不验证
             * @param  money     金钱
             * @param  phone     电话号码
             * @param  integer   整数
             * @param  discount  打折
             * @param  persent   百分比  0-100以内的数字，包括两位有效数字
             */
            type: {
                default: 'money',
                type: String
            },
            "label-width": String
        },
        data() {
            return {
                rules: {
                    money: [
                        { required: true, validator: this.money, trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, validator: this.phone, trigger: 'blur' }
                    ],
                    integer: [
                        { required: true, validator: this.integer, trigger: 'blur' }
                    ],
                    persent: [
                        { required: true, validator: this.persent, trigger: 'blur' }
                    ],
                    discount: [
                        { required: true, validator: this.discount, trigger: 'blur' }
                    ],
                    none: [
                        { required: true, validator: this.none, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            money(rule, value, call) {
                if(!value) {
                    return call(new Error(value=='0' || value===0? '不能为0':'不能为空'))
                }
                if(!/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
                    return call(new Error('格式不正确'));
                }
                call();
            },
            phone(rule, value, call) {
                if(!value) {
                    return call(new Error('不能为空'))
                }
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请输入正整数'))
                }
                if(value.length!=11) {
                    return call(new Error('电话号码位数不正确'))
                }
                return call();
            },
            integer(rule, value, call) {
                if(!value) {
                    return call(new Error(value===0? '不能为0':'不能为空'))
                }
                
                if(!/^[1-9]\d*$/.test(value)) {
                    return call(new Error('请输入正整数'))
                }
                return call();
            },
            persent(rule, value, call) {
                if(!value) {
                    return call(new Error(value===0?'不能为0':'不能为空'))
                }
                if(value==100) {
                    return call(new Error('不能超过100'))
                }
                if(!/^(\d|[1-9]\d)(\.\d{1,2})?$/.test(value)) {
                    return call(new Error('比例格式设置不正确'))
                }
                return call();
            },
            discount(rule, value, call) {
                if(!value) {
                    return call(new Error(value===0? '不能为0': '不能为空'))
                }
                if(!value) {
                    return call(new Error('请输入折扣'))
                }
                if(!/^(?:([1-9](?:\.[\d]{0,2})?)|(?:0\.[1-9]{1,2})|10)$/g.test(value)) {
                    return call(new Error('折扣格式不正确'))
                }
                return call();
            },
            none(rule, value, call) {
                return call();
            }
        }
    }
</script>