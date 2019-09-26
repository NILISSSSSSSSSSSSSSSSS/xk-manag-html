//网页地址
export const site = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+.*/;
//电话号码
export const phone = /^[1-9]\d*$/;
//打折（范围0-10，左开右闭）
export const discount = /^(?:([1-9](?:\.[\d]{0,2})?)|(?:0\.[1-9]{1,2})|10)$/;
//0-100区间
export const percent = /^(\d|[1-9]\d)(\.\d{1,2})?$/;
//大于0的正整数
export const integer = /^[1-9]\d*$/;
//金钱
export const money = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;