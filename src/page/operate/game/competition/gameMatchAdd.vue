<template>
    <div class="game-match-add xk-container">
        <div class="xk-radius">
            <div class="xk-title">
                <div class="vus-title">
                    <span></span>新增比赛
                </div>
            </div>
            <el-form :model="submitForm" ref="submitForm" label-width="180px">
                <h4>1. 基本设置</h4>
                <el-form-item label="比赛名称：" prop="name" :rules="mustRule">
                    <el-input :size="$size" class="xk-input" v-model="submitForm.name"></el-input>
                </el-form-item>
                <el-form-item label="比赛规则：" prop="rule" :rules="mustRule">
                    <UE v-model="submitForm.rule"></UE>
                </el-form-item>
                <el-form-item label="比赛详情：" prop="detail" :rules="mustRule">
                    <UE v-model="submitForm.detail"></UE>
                </el-form-item>
                <el-form-item label="宣传语：" prop="tagline" :rules="mustRule">
                    <!--<UE v-model="submitForm.tagline"></UE>-->
                    <el-input :size="$size" type="textarea" v-model="submitForm.tagline" placeholder="请输入宣传语，100字以内"
                        maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="比赛缩略图：" prop="thumbnail" :rules="mustRule">
                    <image-upload v-model="submitForm.thumbnail" :more="false" size="2" class="up-img">
                        <img v-if="submitForm.thumbnail" :src="submitForm.thumbnail" class="img">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </image-upload>
                    <p>建议上传尺寸：1125*612px 比例：16:9 (图片大小6M以内)最多上传1张</p>
                </el-form-item>
                <el-form-item label="选择比赛类型：" prop="eventId" :rules="matchType!=='GAME'?mustRuleChange:noRule">
                    <el-select :size="$size" class="xk-input" v-model="matchType">
                        <el-option label="游戏类" value="GAME"></el-option>
                        <el-option label="上传类" value="UPLOAD"></el-option>
                    </el-select>

                    <el-select :size="$size" class="xk-input" v-model="subClass" @change="changeInfo">
                        <template v-for="(item,index) in subClassArr">
                            <el-option :key="index" :label="item.label" :value="item.value"></el-option>
                        </template>
                    </el-select>

                    <el-select :size="$size" class="xk-input" v-model="submitForm.eventId" v-if="matchType!=='GAME'"
                        :disabled="!subClass">
                        <el-option v-for="(item,index) in subArr" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <!--选择比赛项目-->
                <template v-if="matchType==='GAME'">
                    <el-form-item v-if="competitionTypeTag=='-1'" label="比赛项目：" prop="eventName" :rules="mustRule">
                        <el-input :size="$size" type="text" v-model="submitForm.eventName" class="xk-input" :disabled="!subClass">
                        </el-input>
                    </el-form-item>
                    <el-form-item v-else label="选择比赛项目：" prop="eventId" :rules="mustRuleChange">
                        <el-select :size="$size" class="xk-input" v-model="submitForm.eventId" :disabled="!subClass">
                            <el-option v-for="(item,index) in subArr" :key="index" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="用户填写对应昵称/ID：" prop="gameIdentify" :rules="mustRuleChange">
                        <el-select :size="$size" class="xk-input" v-model="submitForm.gameIdentify">
                            <el-option label="昵称" value="NICK_NAME"></el-option>
                            <el-option label="游戏ID" value="GAME_ID"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="管理群主ID：" prop="management" :rules="mustRule">
                        <span v-if="submitForm.management">{{ submitForm.management }} <template v-if="manageName">(
                                {{ manageName}} )</template></span>
                        <el-button type="text" :size="$size" @click="chooseManageIdDia=true">选择</el-button>
                    </el-form-item>
                </template>
                <el-form-item label="选择地区：" prop="region" :rules="mustRule">
                    <cascader-province class="xk-input" v-model="submitForm.region"></cascader-province>
                </el-form-item>
                <el-form-item label="报名时间：" prop="time" :rules="mustRule">
                    <el-date-picker v-model="submitForm.time" type="datetimerange" range-separator="至" value-format="timestamp"
                        start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="参赛人数下限：" prop="lowerLimit" :rules="mustNumberRule">
                    <el-input :size="$size" class="xk-input" v-model.number="submitForm.lowerLimit"></el-input>
                    <span>参赛人数未到下限时比赛取消</span>
                </el-form-item>
                <el-form-item label="参赛人数上限：" prop="upperLimit" :rules="mustNumberRule">
                    <el-input :size="$size" class="xk-input" v-model.number="submitForm.upperLimit"></el-input>
                </el-form-item>
                <h4 class="margintop20">2. 赛制及奖励设置</h4>
                <!-- 比赛设置（轮次、奖品、等） -->
                <GameFormat v-if="matchType==='GAME'" key="GAME" :gameType="matchType" v-model="mathAndRewardData[matchType]"
                    ref="GameFormatRef"></GameFormat>
                <GameFormat v-else :gameType="matchType" key="UPLOAD" v-model="mathAndRewardData[matchType]" ref="GameFormatRef">
                </GameFormat>
            </el-form>
            <div class="btn">
                <el-button type="primary" :size="$size" @click="fnPublishMatch" :loading="publishLoading">发布比赛</el-button>
            </div>
        </div>
        <choose-manageId :chooseManageIdDia.sync="chooseManageIdDia" @tellPar="tellPar"></choose-manageId>
    </div>
</template>

<script>
import CascaderProvince from '@/components/common/CascaderProvince.vue';
import UE from '@/components/UE.vue';
import GameFormat from '@/components/operate/game/competition/GameFormat';
import { getUUid } from '@/util/publicMehotds';
import ImageUpload from '@/components/ImageUpload.vue';
import ChooseManageId from '@/components/operate/game/competition/ChooseManageId.vue';
export default {
    name: 'gameMatchAdd',
    components: {
        CascaderProvince,
        UE,
        GameFormat,
        ImageUpload,
        ChooseManageId
    },
    data() {
        let mustNumberRule = (rule, value, callback) => {
            if (value || value == 0) {
                if (Number.isInteger(value)) {
                    if (value > 0) {
                        callback();
                    } else {
                        callback(new Error('请输入大于0的正整数'));
                    }
                } else {
                    callback(new Error('请输入正整数'));
                }
            } else {
                callback(new Error('不能为空'));
            }
        };
        return {
            manageName: '',
            competitionTypeTag: '',
            submitForm: {
                subName: '', //三级名
                eventId: '' //三级值
            },
            matchSet: 'on',
            matchType: 'GAME', //一级
            subClassArr: [], //二级,比赛类型子类,区分上传和游戏
            subClass: '', //二级值
            subArr: [], //三级,具体的名称,或者上传类型
            mustRule: [{ required: true, message: '不能为空', trigger: 'blur' }],
            mustNumberRule: [{ required: true, validator: mustNumberRule, trigger: 'blur' }],
            mustRuleChange: [{ required: true, message: '不能为空', trigger: 'change' }],
            noRule: [
                {
                    validator: (rule, value, call) => {
                        call();
                    },
                    trigger: 'blur'
                }
            ],
            mathAndRewardData: '', //赛制及奖励设置
            chooseManageIdDia: false, //管理群主id弹框
            mathAndRewardData: {
                GAME: '',
                UPLOAD: ''
            }, //赛制及奖励设置
            publishLoading: false
        };
    },
    created() {
        this.getCompetitionSubclasses();
    },
    methods: {
        changeInfo(res) {
            this.competitionTypeTag = res;
            console.log('change----------', res);
        },
        // 获取子类
        getCompetitionSubclasses(competitionType = 'GAME') {
            this.$http
                .get(this.$api.competitionSubclasses, { competitionType }, true)
                .then(res => {
                    this.subClassArr = [];
                    res.forEach((item, index) => {
                        let key = Object.keys(item)[0];
                        this.subClassArr.push({
                            value: key,
                            label: item[key]
                        });
                    });
                })
                .catch(err => {
                    this.$message.error(err.message);
                });
        },
        getCompetitionEvnets(subclassCode = this.subClass) {
            this.$http
                .post(this.$api.competitionEvnets, { competitionType: this.matchType, subclassCode }, true)
                .then(res => {
                    console.log(res);
                    this.subArr = res; //三级
                })
                .catch(err => {
                    this.subArr = [];
                    this.$message.error(err.message);
                });
        },
        fnPublishMatch() {
            this.$refs.submitForm.validate(valid => {
                // 当页非组件输入验证 valid
                if (valid) {
                    this.fnDataEdit();
                    // 时间/1000
                    let newObj = JSON.parse(JSON.stringify(this.submitForm));
                    if (newObj.competitionType == 'UPLOAD') {
                        for (let item of newObj.tournaments) {
                            item.startTime = item.startTime / 1000;
                            item.endTime = item.endTime / 1000;
                        }
                    }
                    console.log(JSON.stringify(newObj));
                    // 比赛详细设置的验证
                    this.$refs.GameFormatRef.submitForm(callData => {
                        if (callData) {
                            this.publishLoading = true;
                            this.$http
                                .post(this.$api.competitionCreate, { competition: newObj }, true)
                                .then(res => {
                                    this.publishLoading = false;
                                    this.$router.push('/gameMatchList');
                                })
                                .catch(err => {
                                    this.publishLoading = false;
                                    this.$message.error(err.message);
                                });
                        }
                    });
                } else {
                    this.$nextTick(() => {
                        let num = Number($('.xk-container').scrollTop()) + Number($('.is-error:first').offset().top);
                        $('.xk-container').animate(
                            {
                                scrollTop: num - 90
                            },
                            500
                        );
                    });
                    return false;
                }
            });
        },
        // 格式化处理需要提交的信息
        fnDataEdit() {
            this.submitForm.competitionType = this.matchType; //游戏 or 上传
            this.submitForm.code = this.subClass; //二级
            let target = [
                {
                    categoryCode: -1,
                    id: '-1',
                    name: this.submitForm.eventName,
                    url: ''
                }
            ];
            if (this.submitForm.code != -1) {
                target = this.subArr.filter(item => {
                    return item.id == this.submitForm.eventId;
                });
            }
            console.log(target);
            let time = JSON.parse(JSON.stringify(this.submitForm.time));
            this.submitForm.startTime = time[0] / 1000;
            this.submitForm.endTime = time[1] / 1000;
            let erjiArr = this.subClassArr.filter(item => {
                return item.value == this.subClass;
            });
            console.log(erjiArr);
            this.submitForm.subName = erjiArr[0].label; //二级
            if (this.matchType == 'GAME') {
                this.submitForm.eventUrl = target[0].url;
            }
            this.submitForm.eventName = target[0].name;
            let matchAreasArr = JSON.parse(JSON.stringify(this.submitForm.region));
            this.submitForm.matchAreas = this.fnMatchAreas(matchAreasArr);
            this.submitForm.competitionId = getUUid();
            this.submitForm.addressUrl = `${location.host}/activity/#/?competitionId=${this.submitForm.competitionId}&title=${this.submitForm.name}`;
            console.log(this.mathAndRewardData[this.matchType]);
            let extendObj = JSON.parse(JSON.stringify(this.mathAndRewardData[this.matchType])) || {};
            console.log(extendObj);
            this.submitForm = {
                ...this.submitForm,
                ...extendObj
            };
            console.log(this.submitForm);
        },
        fnMatchAreas(arr) {
            let returnArr = arr.map(item => {
                return this.fnReturnNameCode(item);
            });
            return returnArr;
        },
        fnReturnNameCode(distCode) {
            try {
                if (!distCode) {
                    return '全国';
                }
                if (distCode == 0 || distCode == '000000') {
                    let obj = {
                        city: 0,
                        cityName: null,
                        district: 0,
                        districtName: null,
                        province: 0,
                        provinceName: null,
                        all: true
                    };
                    return obj;
                }
                let province = new Map(JSON.parse(localStorage.getItem('xk-province')));
                let citys = new Map(JSON.parse(localStorage.getItem('xk-city')));
                let district = new Map(JSON.parse(localStorage.getItem('xk-district')));

                let codeStr = distCode.toString(),
                    pStr = codeStr.substring(2, 6),
                    cStr = codeStr.substring(4, 6);

                if (pStr === '0000') {
                    let obj = {
                        city: null,
                        cityName: null,
                        district: null,
                        districtName: null,
                        province: parseInt(distCode / 10000) * 10000,
                        provinceName: pro
                    };
                    return obj;
                }
                if (cStr === '00') {
                    let city = citys.get(codeStr);
                    let pro = province.get(city.parentCode).name;
                    let obj = {
                        city: parseInt(distCode / 100) * 100,
                        cityName: city.name,
                        district: null,
                        districtName: null,
                        province: parseInt(distCode / 10000) * 10000,
                        provinceName: pro
                    };
                    return obj;
                }
                let dis = district.get(codeStr);
                let city = citys.get(dis.parentCode);
                let pro = province.get(city.parentCode).name;
                let obj = {
                    city: parseInt(distCode / 100) * 100,
                    cityName: city.name,
                    district: distCode,
                    districtName: dis.name,
                    province: parseInt(distCode / 10000) * 10000,
                    provinceName: pro
                };
                return obj;
            } catch (e) {
                return distCode;
            }
        },
        tellPar(obj) {
            this.submitForm.management = obj.id;
            this.manageName = obj.nickname;
        }
    },
    watch: {
        matchType(val) {
            this.subClass = '';
            this.submitForm.subName = '';
            this.submitForm.eventId = ''; //三级值
            this.$refs.submitForm.validateField('eventId');
            this.getCompetitionSubclasses(val);
        },
        subClass(val) {
            this.submitForm.subName = '';
            this.submitForm.eventId = ''; //三级值
            this.$refs.submitForm.validateField('eventId');
            if (val) {
                this.getCompetitionEvnets(val);
            }
        },
        mathAndRewardData: {
            handler(val) {
                console.log('matchAdd', val[this.matchType]);
            },
            deep: true
        }
    }
};
</script>

<style scoped lang="scss">
.game-match-add {
    .el-form {
        padding: 0 20px;
        box-sizing: border-box;
    }
    h4 {
        margin-bottom: 10px;
    }
    .xk-input {
        width: 400px;
    }
    .xk-input-small {
        width: 300px;
    }
    .xk-color {
        color: #606266;
    }
    .match-set {
        margin-top: 15px;
        margin-left: 38px;
        margin-bottom: 15px;
    }
    .btn {
        text-align: center;
    }
    .up-img {
        /deep/ .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            img {
                max-width: 228px;
            }
        }

        /deep/ .avatar-uploader .el-upload:hover {
            border-color: #409eff;
            .el-icon-plus {
                color: #409eff;
            }
        }

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 128px;
            height: 128px;
            line-height: 128px;
            text-align: center;
        }

        .avatar {
            width: 128px;
            height: 128px;
            display: block;
        }
    }
}
</style>
