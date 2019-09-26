<template>
    <div>
        <div
                class="dynamic-banner"
                :style="{width : config.width + 'px', height : config.height + 'px'}"
        >
            <div
                    v-for="(item,i) in config.arr"
                    :key="i"
                    class="banner-item"
                    :style="{
                left : Number(item.gridStart.split(',')[0]) * (config.width / config.x) + 'px',
                top : Number(item.gridStart.split(',')[1]) * (config.height / config.y) + 'px',
                right : config.width - ((config.width / config.x) * Number(item.gridEnd.split(',')[0])) + 'px',
                bottom : config.height - ((config.height / config.y) * Number(item.gridEnd.split(',')[1])) + 'px',
                lineHeight : config.height*(Number(item.gridEnd.split(',')[1]) - Number(item.gridStart.split(',')[1]))/2 + 'px'
                }"
            >
                <!-- <image-upload clip='true' v-model="urlArr[i]" :optionsConfig='optionsConfigArr[i]'></image-upload> -->
                <!-- <image-upload v-model="urlArr[i]">
                    <img v-if="urlArr[i]" :src="urlArr[i]" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </image-upload>-->

                <div class="add-img" @click.stop="fnAddImg(i,$event)">
                    <img v-if="item.src" :src="item.src" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </div>
                <div class="dynamic-txt" :class="{
                  xkone:item.position=='1' || item.position == undefined,
                  xktwo:item.position=='2',
                  xkthree:item.position=='3',
                  xkfour:item.position=='4'
                }" v-show="item.txt">
                    {{item.txt}}
                </div>
            </div>
        </div>
        <el-dialog
                title="图片属性"
                :visible.sync="dialogVisible"
                append-to-body
                width="693px"
        >
            <div>
                <el-form ref="ruleFormBanner" :model="form" :rules="rule" label-width="120px" :size="$size">
                    <el-form-item label="上传banner：" style="margin-bottom:20px" required>
                        <div
                                class="xk-banner-add"
                                :style="{height:rate.height+'px',lineHeight:rate.height+'px',width: rate.width+'px'}"
                        >
                            <image-upload v-model="temp.src"
                                          :size="modul==='ALLIANCE' || modul==='MERCHANT_WELFARE' || modul==='MERCHANT_SELF_SHOP'? 2: 6">
                                <img
                                        v-if="temp.src"
                                        :src="temp.src"
                                        class="avatar"
                                        style="width:100%"
                                >
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </image-upload>
                            <p style="line-height: 1.1;margin-top: 15px;"><span class="xk-danger">*  </span>
                                建议上传尺寸：
                                <template v-if="modul=== 'XKSQUARE'">1125*612px 比例：16:9 (图片大小6M以内)</template>
                                <template v-if="modul==='BUSINESS_AREA' || modul==='WELFARE' || modul==='SELF_SHOP'">
                                    1124*408px (图片大小6M以内)
                                </template>
                                <template v-if="modul==='LIVE_VIDEO'">1065*438px (图片大小6M以内)</template>
                                <template v-if="modul==='GAME'">1125*450px(图片大小6M以内)</template>
                                <template v-if="modul==='ALLIANCE'">750*326px(图片大小2M以内)</template>
                                <template v-if="modul==='MERCHANT_WELFARE' || modul==='MERCHANT_SELF_SHOP'">
                                    750*272px(图片大小2M以内)
                                </template>
                                <template v-if="modul==='WX_GAME'">375*150px(图片大小2M以内)</template>
                            </p>
                            <div class="dynamic-txt" :class="{
                                xkone:temp.position=='1' || temp.position==undefined,
                                xktwo:temp.position=='2',
                                xkthree:temp.position=='3',
                                xkfour:temp.position=='4'
                              }">
                                {{temp.txt}}
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="选择位置：" style="margin-bottom:20px">
                        <el-select v-model="temp.position" placeholder="选择位置">
                            <el-option label="左上" value="1"></el-option>
                            <el-option label="右上" value="2"></el-option>
                            <el-option label="右下" value="3"></el-option>
                            <el-option label="左下" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="添加内容：" style="margin-bottom:20px">
                        <el-input v-model="temp.txt" placeholder="添加内容"></el-input>
                    </el-form-item>
                    <el-form-item label="顶部导航：" style="margin-bottom:20px">
                        <el-radio v-model="temp.isHead" :label="1">有顶部导航</el-radio>
                        <el-radio v-model="temp.isHead" :label="2">无顶部导航</el-radio>
                    </el-form-item>
                    <el-form-item label="跳转类型：">
                        <el-select @change="changeType" v-model="temp.type" placeholder="跳转类型">
                            <el-option label="外部H5链接" :value="1"></el-option>
                            <el-option label="APP内部链接" :value="2"></el-option>
                        </el-select>

                        <el-cascader
                                v-if="temp.type === 2"
                                style="float: right;width: 280px"
                                :options="selectedOptions"
                                v-model="bannerType"
                                placeholder="请选择跳转模块"
                                @change="handleChange">
                        </el-cascader>
                    </el-form-item>

                    <!--<el-form-item prop="jumpId"-->
                    <el-form-item
                            v-if="temp.type === 2 && bannerObj[1]"
                            :label="`${bannerObj[1]}：`">
                        <el-select
                                v-model="temp.id"
                                style="width: 100%"
                                :size="$size"
                                v-if="bannerObj[3] === 'select'"
                                :placeholder="bannerObj[2]">
                            <el-option v-for="(item,index) in categoryJF" :key="index" :label="item.name"
                                       :value="Number(item.code)"></el-option>
                        </el-select>
                        <el-cascader
                                v-model="temp.id"
                                style="width: 100%"
                                :size="$size"
                                v-else-if="bannerObj[3] === 'cascader'"
                                :options="categorySF"
                        ></el-cascader>
                        <el-row v-else>
                            <el-col :span="18">
                                <el-input disabled="disabled" v-model="temp.name" :size="$size"
                                          :placeholder="bannerObj[2]"></el-input>
                            </el-col>
                            <el-col :span="6" style="text-align: right">
                                <el-button @click="openOtherDialog(bannerObj[0])"
                                           :size="$size" type="primary">选择
                                </el-button>
                            </el-col>
                        </el-row>

                    </el-form-item>
                    <el-form-item v-if="temp.type === 1" label="添加链接：" style="margin-bottom:20px">
                        <el-input v-model="temp.jump" placeholder="添加链接"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="fnCancel" :size="$size">取 消</el-button>
                <el-button type="primary" :size="$size" @click="fnsure">确 定</el-button>
            </span>
        </el-dialog>

        <self-goods-list :dialogVisible.sync="selfDialog" @changeSelect="selfChangeSelect"></self-goods-list>
        <video-list :dialogVisible.sync="videoDialog" @changeVideo="videoChangeSelect"></video-list>
        <welf-goods-list :dialogVisible.sync="welfDialog" @welfChange="welfChangeSelect"></welf-goods-list>
        <shops-components :dialogVisible.sync="shopsDialog" @changeShops="changeShops"></shops-components>
        <shop-goods-list :dialogVisible.sync="shopsGoodsDialog" @changeShopGoods="changeShopGoods"></shop-goods-list>
        <game-list :dialogVisible.sync="gameDialog" @changeGame="changeGame"></game-list>
    </div>
</template>

<script>
    import ImageUpload from "./ImageUpload.vue";
    import SelfGoodsList from "./SelfGoodsList"
    import VideoList from './VideoList'
    import WelfGoodsList from './WelfGoodsList'
    import ShopsComponents from './ShopsComponents'
    import ShopGoodsList from './ShopGoodsList'
    import GameList from './GameList'

    export default {
        props: {
            value: {
                type: Object,
                default: () => ({
                    width: 400,
                    height: 200,
                    x: 2,
                    y: 2,
                    arr: [
                        {
                            gridX: "0,0",
                            gridY: "2,2"
                        }
                    ]
                })
            },
            modul: {
                type: String,
                default: ''
            },
            imgArr: {
                type: Array,
                default: () => []
            },
            infoArr: {
                type: Array,
                default: () => []
            },
            categoryJF: {
                type: Array,
                default: () => []
            },
            categorySF: {
                type: Array,
                default: () => []
            }
        },
        data() {
            const checkRun = (rule, value, callback) => {
                if (!this.temp.id) {
                    callback(new Error(this.bannerObj[2]))
                } else {
                    callback()
                }
            }
            return {
                selfDialog: false,
                welfDialog: false,
                videoDialog: false,
                shopsGoodsDialog: false,
                shopsDialog: false,
                gameDialog: false,
                config: this.value,
                color: ["#ff00ff", "#fab6b6", "#FAE881", "#5173FF", "#DCDCDC", "#ADBFFA"],
                temp: {type: 1, position: "1", id: "", isHead: 1},
                bannerType: ['["detail/video", "小视频", "请选择小视频"]'],
                bannerObj: ["detail/video", "小视频", "请选择小视频"],
                rule: {
                    jumpId: [
                        {required: true, validator: checkRun, trigger: 'change'}
                    ]
                },
                selectedOptions: [
                    {
                        value: '["detail/video", "小视频", "请选择小视频"]',
                        label: "小视频",
                    },
                    {
                        value: "welf",
                        label: "夺奖派对",
                        children: [
                            {
                                value: '["detail/welfGoods", "奖品", "请选择奖品"]',
                                label: "奖品详情"
                            },
                            {
                                value: '["list/welfRe", "", ""]',
                                label: "推荐奖品列表"
                            },
                            /*    {
                                    value: '["list/welfClass", "奖品分类", "请选择奖品分类", "select"]',
                                    label: "奖品分类列表"
                                }*/
                        ]
                    },
                    {
                        value: "self",
                        label: "自营商城",
                        children: [
                            {
                                value: '["detail/selfGoods", "自营商品", "请选择自营商城商品"]',
                                label: "商品详情"
                            },
                            {
                                value: '["list/selfRe", "", ""]',
                                label: "推荐商品列表"
                            },
                            {
                                value: '["list/selfClass", "商品分类", "请选择商品分类", "cascader"]',
                                label: "商品分类列表"
                            },
                            {
                                value: '["list/outlets", "直营店", "请选择直营店"]',
                                label: "直营店"
                            }
                        ]
                    },
                    {
                        value: "district",
                        label: "商圈",
                        children: [
                            {
                                value: '["detail/shops", "店铺", "请选择店铺"]',
                                label: "店铺"
                            },
                            {
                                value: '["detail/shopGoods", "店铺商品", "请选择店铺商品"]',
                                label: "店铺商品"
                            }
                        ]
                    },
                    {
                        value: '["jump/live", "", ""]',
                        label: "直播APP"
                    },
                    {
                        value: '["coupon", "", ""]',
                        label: "领券中心"
                    },
                    {
                        value: '["detail/game", "游戏", "请选择游戏"]',
                        label: "游戏"
                    }
                ],
                obj: {
                    x: 2,
                    y: 2,
                    arr: [
                        {
                            src: "", //图片路径
                            type: 1, //跳转类型（外部H5链接，APP内部链接）
                            jumpAndroid: "", //跳转路径
                            jumpIOS: "", //跳转路径
                            jumpRN: "", //跳转路径
                            gridStart: "0,0",
                            gridEnd: "2,1"
                        }
                    ]
                },
                index: 0,
                dialogVisible: false,
                form: {
                    jump: "",
                    type: "h5",
                    temp: {}
                },
                clearArr: false,
                rate: 1
            };
        },
        components: {
            ImageUpload,
            SelfGoodsList,
            VideoList,
            WelfGoodsList,
            ShopsComponents,
            ShopGoodsList,
            GameList
        },
        methods: {
            backVulue() {
                this.$emit("input", this.obj);
            },
            fnAddImg(i, e) {
                this.index = i;
                try {
                    this.rate = {
                        width: $(e.path[1]).width(),
                        height: $(e.path[1]).height()
                    }
                } catch (e) {
                    this.rate = {
                        width: $(".add-img").width(),
                        height: $(".add-img").height()
                    }
                }
                this.temp = JSON.parse(JSON.stringify(this.config.arr[i]));
                if (!this.temp.isHead) this.$set(this.temp, "isHead", 1);
                let tempJump = this.config.arr[i].jump;
                let tempType = this.temp.type ? this.temp.type : 1;
                let tempPosition = this.temp.position ? this.temp.position : "1";
                if (tempType === 2) {
                    let tempJ = null;
                    try {
                        tempJ = JSON.parse(tempJump);
                    } catch (e) {
                        tempJ = {};
                    }
                    if (tempJ.oldType) {
                        this.bannerType = JSON.parse(JSON.stringify(tempJ.oldType));
                        this.bannerObj = JSON.parse(this.bannerType[this.bannerType.length - 1]);
                    }
                    if (tempJ.oldId) {
                        this.temp.id = JSON.parse(JSON.stringify(tempJ.oldId));
                    }
                }
                this.$set(this.temp, "jump", tempJump);
                this.$set(this.temp, "type", tempType);
                this.$set(this.temp, "position", tempPosition);
                this.dialogVisible = true;
            },
            fnCancel() {
                this.dialogVisible = false;
            },
            fnsure() {
                if (!this.temp.src) {
                    this.$message.error("图片不能为空");
                    return;
                }
                if (this.temp.type === 2 && this.bannerObj[1] && !this.temp.id) {
                    this.$message.error(this.bannerObj[2]);
                    return;
                }
                this.$refs["ruleFormBanner"].validate((valid) => {
                    if (valid) {
                        if (this.temp.type === 2) {
                            this.temp.jump = {
                                type: (this.bannerObj[0].split("/"))[0],
                                modular: (this.bannerObj[0].split("/"))[1],
                                oldId: this.temp.id,
                                isHead: this.temp.isHead,
                                oldType: this.bannerType,
                                goodsId: this.temp.goodsId,
                                sequenceId: this.temp.sequenceId,
                                id: this.bannerObj[0] === "list/selfClass" ? this.temp.id[this.temp.id.length - 1] : this.temp.id
                            };
                            if (this.bannerObj[0] === "list/selfClass") {
                                this.findSFName(this.categorySF, this.temp.id[this.temp.id.length - 1]);
                            }
                            this.temp.jump = JSON.stringify(this.temp.jump);
                        }else{
                            this.temp.jump = this.temp.jump.indexOf("?") >= 0 ? `${this.temp.jump}&isHead=${this.temp.isHead}` : `${this.temp.jump}?isHead=${this.temp.isHead}`;
                        }
                        console.log(this.temp.jump)
                        this.config.arr[this.index] = JSON.parse(JSON.stringify(this.temp));
                        this.config.arr[this.index].type = this.temp.type;
                        this.config.arr[this.index].jumpRN = this.temp.jump;
                        this.config.arr[this.index].jumpAndroid = this.temp.jump;
                        this.config.arr[this.index].jumpIOS = this.temp.jump;
                        this.dialogVisible = false;
                    }
                })
            },
            findSFName(arr, code) {
                for (let item of arr) {
                    if (item.children instanceof Array && item.children.length > 0) {
                        this.findSFName(item.children, code);
                    } else {
                        if (item.value == code) {
                            this.temp.jump.name = item.label;
                            return false;
                        }
                    }
                }
            },
            handleChange() {
                this.$set(this.temp, "id", "");
                this.$set(this.temp, "name", "");
                this.$refs["ruleFormBanner"].resetFields();
                this.bannerObj = JSON.parse(this.bannerType[this.bannerType.length - 1]);
                this.openOtherDialog(this.bannerObj[0]);
            },
            changeType(val) {
                this.$set(this.temp, "id", "");
                if (val === 1) {
                    this.$set(this.temp, "jump", "");
                }
            },
            selfChangeSelect(goods) {
                this.$set(this.temp, "name", goods.name);
                this.$set(this.temp, "id", goods.id);
            },
            openOtherDialog(type) {
                if (type === "detail/selfGoods") {
                    this.selfDialog = true;
                } else if (type === "detail/video") {
                    this.videoDialog = true;
                } else if (type === "detail/welfGoods") {
                    this.welfDialog = true;
                } else if (type === "detail/shops") {
                    this.shopsDialog = true;
                } else if (type === "detail/shopGoods") {
                    this.shopsGoodsDialog = true;
                } else if (type === "detail/game") {
                    this.gameDialog = true;
                }
            },
            videoChangeSelect(video) {
                this.$set(this.temp, "name", video.topic_name);
                this.$set(this.temp, "id", video.video_id);
            },
            welfChangeSelect(welf) {
                this.$set(this.temp, "name", welf.name);
                this.$set(this.temp, "id", welf.id);
                this.$set(this.temp, "sequenceId", welf.jSequence.id);
            },
            changeShops(shop) {
                this.$set(this.temp, "name", shop.name);
                this.$set(this.temp, "id", shop.id);
            },
            changeShopGoods(goods) {
                this.$set(this.temp, "name", goods.name);
                this.$set(this.temp, "goodsId", goods.id);
                this.$set(this.temp, "id", goods.shopId);
            },
            changeGame(game) {
                this.$set(this.temp, "name", game.name);
                this.$set(this.temp, "id", game.id);
            }
        },
        watch: {
            value(val) {
                this.config = val;
            }
        }
    };
</script>

<style lang='scss'>
    .dynamic-banner {
        position: relative;

        .banner-item {
            position: absolute;
            border: 1px solid #dddddd;
        }

        .add-img {
            width: 100%;
            height: 100%;

            .avatar-uploader-icon {
                width: 100% !important;
                height: 100% !important;
                line-height: inherit !important;
                text-align: center;
                cursor: pointer;
                font-size: 20px;
            }

            img {
                width: 100%;
                height: 100%;
                cursor: pointer;
            }
        }
    }

    .xk-banner-add {
        width: 400px;
        min-height: 100px;
        margin-bottom: 20px;
        // margin-left: 50%;
        // transform: translateX(-50%);
        border: 1px dashed #dddddd;
        position: relative;

        .xk-image-upload,
        .el-row,
        .el-col,
        .avatar-uploader,
        .el-upload,
        img {
            width: 100%;
            height: 100%;
            line-height: inherit;
        }
    }

    .dynamic-txt {
        position: absolute;
        min-width: 80px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.8);
        padding: 0 5px
    }

    .xkone {
        left: 0;
        top: 0;
    }

    .xktwo {
        right: 0;
        top: 0;
    }

    .xkthree {
        right: 0;
        bottom: 0;
    }

    .xkfour {
        left: 0;
        bottom: 0;
    }
</style>
