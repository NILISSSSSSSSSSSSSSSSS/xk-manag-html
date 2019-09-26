<template>
    <div class="xk-container game-list">
        <div class="xk-body">
            <div class="xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>查询
                    </div>
                    <div class="vus-btn">
                        <el-button type="primary" :size="$size" @click="search" :loading="searchLoading">查询</el-button>
                        <el-button type="danger" :size="$size" @click="clearCondition">清空</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                    <el-form :model="searchForm" class="xk-search" label-width="100px">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="游戏ID：">
                                    <el-input :size="$size" v-model="searchForm.gameId"
                                              placeholder="请输入游戏ID"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="游戏类型：">
                                    <el-select :size="$size" v-model="searchForm.type" placeholder="游戏类型">
                                        <el-option v-for="item in EnumType" :key="item.value" :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="游戏名称：">
                                    <el-input :size="$size" v-model="searchForm.nameObm" placeholder="请输入游戏名称"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="游戏分类：">
                                    <el-select :size="$size" v-model="searchForm.categoryCode" placeholder="游戏类型">
                                        <el-option v-for="item in EnumClass" :key="item.value" :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="人气指数：">
                                    <el-select :size="$size" v-model="searchForm.popularity" placeholder="人气指数">
                                        <el-option v-for="item in EnumPoint" :key="item.value" :label="item.label"
                                                   :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="热门/推荐：">
                                    <!-- 修改为推荐、热门、全部 -->
                                    <el-select :size="$size" v-model="searchForm.pageTypeOBM" placeholder="热门">
                                        <el-option label="全部" value="all"></el-option>
                                        <el-option label="推荐" value="recommend"></el-option>
                                        <el-option label="热门" value="hotGame"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="游戏平台：">
                                    <el-select :size="$size" v-model="searchForm.gameChannel" placeholder="游戏平台">
                                        <el-option v-for="(item, key) in gameChannel" :key="key" :label="item.name" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <!--表格数据-->
            <div class="pubBackground marintop20 solidtop xk-radius">
                <div class='xk-title'>
                    <div class="vus-title">
                        <span></span>列表
                    </div>
                    <div class="vus-btn">
                        <el-button v-permission="'gameListAdd'" type="primary" size="small" @click="add('submitForm')">新增游戏</el-button>
                    </div>
                    <div class="vus-bottom"></div>
                </div>
                <el-table :data="tableData" v-loading="loadingTable" border stripe>
                    <el-table-column label="游戏ID" prop="id"></el-table-column>
                    <el-table-column label="游戏名称" prop="name"></el-table-column>
                    <el-table-column label="游戏分类" prop="categoryCode">
                        <template slot-scope="scope">
                            {{scope.row.categoryCode | GameCategory}}
                        </template>
                    </el-table-column>
                    <el-table-column label="游戏类型" prop="gamePlatfrom">
                        <template slot-scope="scope">
                            {{scope.row.gamePlatfrom == 'all' ? '通用' : scope.row.gamePlatfrom}}
                        </template>
                    </el-table-column>
                    <el-table-column label="游戏平台">
                        <template slot-scope="scope">
                            {{getChannelName(scope.row.gameChannelConfig.gameChannel)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="排序指数" prop="index"></el-table-column>
                    <el-table-column label="是否热门" prop="isHotGame">
                        <template slot-scope="scope">
                            {{scope.row.isHotGame == '1' ? '是' : '否'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="是否推荐" prop="isRecommend">
                        <template slot-scope="scope">
                            {{scope.row.isRecommend == '1' ? '是' : '否'}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="汇率（1晓可：xx）" prop="exchangerate"></el-table-column> -->
                    <el-table-column label="状态" prop="isUpper">
                        <template slot-scope="scope">
                            {{scope.row.isUpper ? '上架' : '下架'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="160">
                        <template slot-scope="scope">
                            <el-button :size="$size" :loading="scope.row.viewLoading" v-permission="'gameListLook'"
                                       @click="viewItem(scope.$index, scope.row)">查看
                            </el-button>
                            <el-button :size="$size" v-if="!scope.row.isUpper" :loading="scope.row.editLoading" v-permission="'gameListEdit'"
                                       @click="editItem(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button :size="$size" v-if="!scope.row.isUpper" :loading="scope.row.upLoading" v-permission="'gameListUp'"
                                       @click="upItem(scope.$index, scope.row)">上架
                            </el-button>
                            <el-button :size="$size" v-if="scope.row.isUpper" :loading="scope.row.downLoading" v-permission="'gameListDown'"
                                       @click="downItem(scope.$index, scope.row)">下架
                            </el-button>
                            <el-button :size="$size" type="danger" v-if="!scope.row.isUpper" v-permission="'gameListDelete'"
                                       :loading="scope.row.deleteLoading"
                                       @click="deleteItem(scope.$index,scope.row.id)">删除
                            </el-button>
                            <el-button :size="$size" type="primary" v-if="!scope.row.isHotGame" v-permission="'gameListSetHot'"
                                       :loading="scope.row.hotLoading" @click="hotItem(scope.$index,scope.row.id)">设为热门
                            </el-button>
                            <el-button :size="$size" type="danger" v-if="scope.row.isHotGame" v-permission="'gameListCancelHot'"
                                       :loading="scope.row.cancelHotLoading"
                                       @click="cancelHotItem(scope.$index,scope.row.id)">取消热门
                            </el-button>
                            <el-button :size="$size" type="primary" v-if="!scope.row.isRecommend" v-permission="'gameListSetRecommend'"
                                       :loading="scope.row.recommendLoading"
                                       @click="recommendItem(scope.$index,scope.row.id)">设为推荐
                            </el-button>
                            <el-button :size="$size" type="danger" v-if="scope.row.isRecommend" v-permission="'gameListCancelRecomm'"
                                       :loading="scope.row.cancelRecommendLoading"
                                       @click="cancelRecommendItem(scope.$index,scope.row.id)">取消推荐
                            </el-button>
                            <template v-if="scope.row.type==='client'">
                                <el-button v-permission="'gameListOpenDown'" v-if="scope.row.isAllowDownload == 0" :size="$size" @click="operateDown('open', scope.row.id)">开启下载</el-button>
                                <el-button v-permission="'gameListCloseDown'" v-else :size="$size" @click="operateDown('close', scope.row.id)">关闭下载</el-button>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页组件-->
                <pagination :currentPage="page.page" :pageSize="page.limit" :total="page.total"
                            @change="changePage"></pagination>
            </div>
        </div>

        <!-- 编辑游戏 -->
        <el-dialog :title="edit? '编辑游戏': '新增游戏'" :visible.sync="editVisible" width="800px" top="50px">
            <div v-loading="editLoading">
                <el-form :model="submitForm" label-width="150px" ref="submitForm" :rules="submitFormRules">
                    <el-form-item label="游戏名称：" prop="name">
                        <el-input v-model="submitForm.name" :size="$size" placeholder="请输入游戏名称"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏分类：" prop="class">
                        <el-select :size="$size" placeholder="游戏分类" v-model="submitForm.class">
                            <el-option v-for="(item, index) in EnumClass" :label="item.label" :value="item.value"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏链接：" prop="links">
                        <el-input v-model="submitForm.links" :size="$size"
                                  placeholder="H5链接or端游下载(如：http://xksquare.com)"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏类型：" prop="type">
                        <el-select :size="$size" v-model="submitForm.type">
                            <el-option v-for="(item, index) in EnumType" :label="item.label" :value="item.value"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏安装包路径：" prop="clientPackagePath" v-if="submitForm.type=='client'">
                        <el-input v-model="submitForm.clientPackagePath" :size="$size" placeholder="游戏安装包路径"></el-input>
                    </el-form-item>
                    <el-form-item label-width="200px" label="游戏大小（端游需填写）：" prop="size">
                        <el-input v-model="submitForm.size" :size="$size" placeholder="游戏大小(单位：M)"></el-input>
                    </el-form-item>
                    <el-form-item label="适用平台：" prop="platform">
                        <el-select :size="$size" placeholder="请选择适用平台" v-model="submitForm.platform">
                            <el-option v-for="(item, index) in EnumPlatForm" :label="item.label" :value="item.value"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏简介：" prop="describe">
                        <!-- <UE v-model="submitForm.detail"></UE> -->
                        <el-input v-model="submitForm.describe" :size="$size" placeholder="请输入游戏简介" type="textarea"
                                  :autosize="{ minRows: 5, maxRows: 5}" resize="none"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏币汇率：" prop="rate">
                        <el-row>
                            <el-col :span="10">
                                <el-input v-model="submitForm.rate" :size="$size" placeholder="请输入游戏币汇率"></el-input>
                            </el-col>
                            <el-col :span="6">&nbsp;&nbsp;&nbsp;&nbsp;1晓可币= xx游戏币</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="排序指数：" prop="sort">
                        <el-input v-model="submitForm.sort" :size="$size" placeholder="请输入排序指数"></el-input>
                    </el-form-item>
                    <el-form-item label="人气指数：" prop="point">
                        <el-select :size="$size" placeholder="请选择人气指数" v-model="submitForm.point">
                            <el-option v-for="(item, index) in EnumPoint" :label="item.label" :value="item.value"
                                       :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏大图（封推）：" prop="gameBigPic" ref="gameBigPic">
                        <image-upload v-model="submitForm.gameBigPic" :more="false" size="2">
                            <img v-if="submitForm.gameBigPic" :src="submitForm.gameBigPic" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </image-upload>
                        <p><span class="xk-danger">*  </span>建议上传图片尺寸为480*234，大小为2M以内的图片</p>
                    </el-form-item>
                    <el-form-item label="游戏小图（列表）：" prop="gameSmallPic" ref="gameSmallPic">
                        <image-upload v-model="submitForm.gameSmallPic" :more="false" size="2">
                            <img v-if="submitForm.gameSmallPic" :src="submitForm.gameSmallPic" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </image-upload>
                        <p><span class="xk-danger">*  </span>建议上传图片大小228*228，大小为2M以内的图片</p>
                    </el-form-item>
                    <el-form-item label="支付方式配置：" prop="payChannels">
                        <el-checkbox-group v-model="submitForm.payChannels">
                            <el-row>
                                <el-col :span="6" v-for="item in EnumPayWay" :key="item.key">
                                    <el-checkbox :label="item.key">{{ item.value }}</el-checkbox>
                                </el-col>
                            </el-row>
                        </el-checkbox-group>
                    </el-form-item>
                    <!-- <el-form-item label="游戏显示方式：">
                        <el-radio v-model="submitForm.gameMode" label="vertical">竖</el-radio>
                        <el-radio v-model="submitForm.gameMode" label="horizontal">横</el-radio>
                    </el-form-item> -->
                    <el-form-item label="是否缩放：">
                        <el-row>
                            <el-col :span="2">
                                <el-switch v-model="submitForm.isShrinkage" active-value="1" inactive-value="0"></el-switch>
                            </el-col>
                            <el-col :span="10" v-if="submitForm.isShrinkage==1">
                                <el-row>
                                    <el-col :span="10">
                                        <el-form-item label-width="0" prop="shrinkageSizeMin">
                                            <el-input :size="$size" v-model.trim="submitForm.shrinkageSizeMin"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4" class="center">：</el-col>
                                    <el-col :span="10">
                                        <el-form-item label-width="0" prop="shrinkageSizeMax">
                                            <el-input :size="$size" v-model.trim="submitForm.shrinkageSizeMax"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="游戏详情：" prop="detail">
                        <!-- <UE v-model="submitForm.detail"></UE> -->
                        <el-input v-model="submitForm.detail" :size="$size" placeholder="请输入游戏详情" type="textarea"
                                  :autosize="{ minRows: 5, maxRows: 5}" resize="none"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏平台：" prop="gameChannel">
                        <el-select :size="$size" v-model="submitForm.gameChannel" placeholder="请选择">
                            <el-option
                                    v-for="item in gamePlats"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value"
                                    :disabled="submitForm.type=='h5'&& item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="游戏参数：" prop="game_id">
                        <el-input v-model.trim="submitForm.game_id" :size="$size" placeholder="请输入游戏平台的游戏参数"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="channel_id：" prop="channel_id">
                        <el-input v-model="submitForm.channel_id" :size="$size" placeholder="请输入channel_id"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏密钥：" prop="secret_key">
                        <el-input v-model="submitForm.secret_key" :size="$size" placeholder="游戏密钥"></el-input>
                    </el-form-item> -->
                    <el-form-item label="游戏公司返点：" prop="returnPoint">
                        <el-input v-model.number="submitForm.returnPoint" :size="$size" placeholder="10"
                                  style="width:200px"></el-input>&nbsp;&nbsp;%
                    </el-form-item>
                </el-form>
                <prize-set v-model="prizeset" ref="prizeset"></prize-set>
                <goods-source ref="b2c_s" v-model="b2c_s"></goods-source>
            </div>

            <div class="btn-group">
                <el-button :size="$size" @click="editVisible=false">取消</el-button>
                <el-button :size="$size" type="primary" @click="submitData('submitForm')" :loading="submitLoading">确定
                </el-button>
            </div>
        </el-dialog>
        <!-- 查看游戏 -->
        <el-dialog title="查看游戏" :visible.sync="lookVisible" width="800px" top="50px">
            <el-form label-width="150px">
                <el-form-item label="游戏名称：">
                    {{lookData.name}}
                </el-form-item>
                <el-form-item label="游戏分类：">
                    {{lookData.categoryCode | GameCategory}}
                </el-form-item>
                <el-form-item label="游戏链接：">
                    {{lookData.url}}
                </el-form-item>
                <el-form-item label="游戏类型：">
                    {{lookData.type == 'h5' ? "H5" : "端游"}}
                </el-form-item>
                <el-form-item label="游戏安装包路径：" v-if="lookData.type != 'h5'">
                    {{lookData.clientPackagePath}}
                </el-form-item>
                <el-form-item label="游戏大小：">
                    {{lookData.size*1024 | formatSize}}
                </el-form-item>
                <el-form-item label="适用平台：">
                    {{lookData.gamePlatfrom}}
                </el-form-item>
                <el-form-item label="游戏简介：">
                    {{lookData.describe}}
                </el-form-item>
                <el-form-item label="游戏币汇率：">
                    {{lookData.exchangerate}} （xx游戏币 = 1 晓可币）
                </el-form-item>
                <el-form-item label="排序指数：">
                    {{lookData.index}}
                </el-form-item>
                <el-form-item label="人气指数：">
                    {{lookData.popularity}}
                </el-form-item>
                <el-form-item label="游戏大图（封推）：">
                    <img :src="lookData.bigPic" style="max-width:100%">
                </el-form-item>
                <el-form-item label="游戏小图（列表）：">
                    <img :src="lookData.smallPic" style="max-width:100%">
                </el-form-item>
                <el-form-item label="游戏详情：">
                    <div v-html="lookData.detail"></div>
                </el-form-item>
                <el-form-item label="游戏平台：">
                    {{lookData.gameChannelConfig.gameChannel}}
                </el-form-item>
                <el-form-item label="游戏编号：">
                    {{JSON.stringify(lookData.gameChannelConfig.config)}}
                </el-form-item>
                <el-form-item label="支付方式：" v-if="lookData.payChannels">
                    <el-tag style="margin-right: 10px" v-for="item in lookData.payChannels" :key="item">
                        {{ item | formatPay }}
                    </el-tag>
                </el-form-item>
                <el-form-item label="是否缩放：">
                    {{ lookData.isShrinkage ==0||lookData.isShrinkage ==undefined? '否':  lookData.shrinkageSize.split('/')[0] + '：'+ lookData.shrinkageSize.split('/')[1] }}
                </el-form-item>
                <!-- <el-form-item label="channel_id：">
                    {{lookData.gameChannelConfig.config.channel_id}}
                </el-form-item>
                <el-form-item label="游戏密钥：">
                    {{lookData.gameChannelConfig.config.secret_key}}
                </el-form-item> -->
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import ImageUpload from '@/components/ImageUpload.vue';
    import UE from '@/components/UE.vue';
    import PrizeSet from '@/components/operate/game/PrizeSet.vue';
    import GoodsSource from '@/components/operate/game/GoodsSource.vue';
    import { EnumPayWay } from '@/util/publicParams.js';
    import { enumFormatter } from '../../../util/publicMehotds';
    //枚举游戏
    const EnumGame = [{label: '天天斗地主', value: '1'}, {label: '天天打麻将', value: '2'}];
    //枚举游戏指数
    const EnumPoint = [
        {label: '1', value: 1}, {label: '2', value: 2}, {label: '3', value: 3},
        {label: '4', value: 4}, {label: '5', value: 5}];
    //枚举游戏类型
    const EnumType = [{label: '端游', value: 'client'}, {label: 'H5', value: 'h5'}];
    //枚举游戏分类
    const EnumClass = [
        {label: '益智', value: 1}, {label: '动作', value: 2}, {label: '角色', value: 3},
        {label: '街机', value: 4}, {label: '卡牌', value: 5}, {label: '冒险', value: 6},
        {label: '刺激', value: 7}, {label: '养成', value: 8}, {label: '文字', value: 9}
    ];
    //枚举游戏适用平台
    const EnumPlatForm = [
        {label: 'ios', value: 'ios'}, {label: '通用', value: 'all'}, {label: 'android', value: 'android'}
    ];
    export default {
        components: {
            ImageUpload,
            UE,
            PrizeSet,
            GoodsSource
        },
        data() {
            const checkUrl = (rule, value, call) => {
                if (!value) {
                    return call(new Error('不能为空'))
                }
                if (!/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/).*/.test(value)) {
                    return call(new Error('网址格式不正确'))
                }
                call();
            }
            const checClass = (rule, value, call) => {
                if (!value) {
                    return call(new Error('不能为空'))
                }
                call();
            }
            const checkType = (rule, value, call) => {
                if (!value) {
                    return call(new Error('不能为空'))
                }
                call();
            }
            const checkClient = (rule, value, call) => {
                console.log(value)
                if (this.submitForm.type=='client' && !value) {
                    return call(new Error('不能为空'))
                }
                call();
            }
            const checkSize = (rule, value, call) => {
                if (!value && this.submitForm.type == "1") {
                    return call(new Error('端游大小不能为空'))
                }
                call();
            }
            const checkPlatForm = (rule, value, call) => {
                if (!value) {
                    return call(new Error('不能为空'))
                }
                call();
            }
            const checkPci = (rule, value, call) => {
                if (!value) {
                    return call(new Error('请上传图片'))
                }
                call();
            }
            const checkNum = (rule, value, call) => {
                // console.log(value)
                if (!value && value != 0) {
                    return call(new Error('不能为空'));
                }
                if (!/(^0{1}$)|(^[1-9]{1}\d*$)/.test(value)) {
                    return call(new Error('请输入整数'))
                }
                call();
            }
            const chcReturnPoint = (rule, value, call) => {
                if (!value && value != 0) {
                    return call(new Error('不能为空'));
                }
                if (typeof value != 'number') {
                    return call(new Error('请输入数字'))
                }
                call();
            }
            const chcGame_id = (rule, value, call) => {
                if(value){
                    try {
                        let jsonParam = JSON.parse(value)
                    } catch (error) {
                        return call(new Error('游戏参数格式不对'))
                    }
                }
                call();
            }
            return {
                EnumPayWay: EnumPayWay.slice(0, 3),
                EnumGame,
                EnumPoint,
                EnumType,
                EnumClass,
                EnumPlatForm,
                gamePlats: [],
                searchForm: {},//游戏搜索项
                gameChannel: [],
                searchLoading: false,
                tableData: [],
                loadingTable: false,
                edit: false,
                editVisible: false,
                editLoading: false,
                lookData: {
                    gameChannelConfig: {
                        gameChannel: "",
                        config: {}
                    }
                },
                lookVisible: false,
                submitForm: {
                    // gameMode: 'vertical',
                    payChannels: []
                },
                submitLoading: false,
                submitFormRules: {
                    name: [
                        {required: true, message: '名称不能为空', trigger: 'blur'}
                    ],
                    class: [
                        {required: true, validator: checClass, trigger: 'change'}
                    ],
                    links: [
                        {required: true, validator: checkUrl, trigger: 'blur'}
                    ],
                    type: [
                        {required: true, validator: checkType, trigger: 'change'}
                    ],
                    clientPackagePath:[
                        {required: true, validator: checkClient, trigger: 'change'}
                    ],
                    size: [
                        {validator: checkSize, trigger: 'blur'}
                    ],
                    platform: [
                        {required: true, validator: checkPlatForm, trigger: 'change'}
                    ],
                    detail: [
                        {required: true, message: '游戏详情不能为空', trigger: 'change'}
                    ],
                    describe: [
                        {required: true, message: '游戏简介不能为空', trigger: 'blur'}
                    ],
                    rate: [
                        {required: true, validator: checkNum, trigger: 'blur'}
                    ],
                    sort: [
                        {required: true, validator: checkNum, trigger: 'blur'}
                    ],
                    point: [
                        {required: true, validator: checkNum, trigger: 'change'}
                    ],
                    gameBigPic: [
                        {required: true, validator: checkPci, trigger: 'change'}
                    ],
                    gameSmallPic: [
                        {required: true, validator: checkPci, trigger: 'change'}
                    ],
                    gameChannel: [
                        {required: true, message: '游戏平台不能为空', trigger: 'blur'}
                    ],
                    game_id: [
                        {required: false, trigger: 'blur', validator: chcGame_id}
                    ],
                    channel_id: [
                        {required: true, message: 'channel_id不能为空', trigger: 'blur'}
                    ],
                    secret_key: [
                        {required: true, message: '游戏密钥不能为空', trigger: 'blur'}
                    ],
                    returnPoint: [
                        {required: true, validator: chcReturnPoint, trigger: 'blur'}
                    ],
                    payChannels: [
                        { required: true,message: '必选选择一个支付方式', trigger: 'change' }
                    ],
                    shrinkageSizeMin: [
                        { required: true, validator: checkNum, trigger: 'blur' }
                    ],
                    shrinkageSizeMax: [
                        { required: true, validator: checkNum, trigger: 'blur' }
                    ]
                },
                page: {
                    page: 1,
                    limit: 10,
                    total: 0
                },
                prizeset: {
                    mothSale: {
                        currency: "xfq",
                    },
                    singleBatch: {
                        currency: 'xfq'   //单词批量
                    },
                    sale: {},   //销售
                    saleSubsidyTempList: [{
                        areaCode: '',
                        areaCodes: '',
                        buyerRatio: '',
                        areaAdminRatio: '',
                        areaAdminCurrency: 'rmb',
                        buyerCurrency: 'xfq'
                    }]
                },
                b2c_s: {
                    sourceOfGoods: {},
                    sourceOfGoodsMonthSaleSubsidy: {}
                }
            }
        },
        created() {
            this.getGameChannel();
            this.getList();
            // this.$http.get(this.$api.drawoutSaleGameDefine,{} , true).then((res) => {
            //    console.log(res)
            // }).catch((err) => {
            //    console.log(err);
            //     this.$message.error(err.message);
            // });
        },
        methods: {
            changePage(page, pageSize) {
                this.page.limit = pageSize;
                this.page.page = page;
                let obj = {
                    gameDto: {}
                };
                
                for (const key in this.searchForm) {
                    if (key === 'isHotGame') {
                        obj.gameDto[key] = Number(this.searchForm[key])
                    } else {
                        obj.gameDto[key] = this.searchForm[key]
                    }
                }
                this.getList(obj);
            },
            getGameChannel() { // 游戏平台渠道
                this.$http.get(this.$api.gameChannelList, {}, true)
                .then(res => {
                    if(res){
                        this.gameChannel = res;
                        this.gamePlats = res.filter(item=>item.value);
                    }
                    this.gameChannel.push({name: '全部', value: ''})
                    this.gameChannel.reverse();
                })
                .catch(err => {
                    this.$message.error(err.message)
                })
            },
            getChannelName(val) {
                let name = ''
                for(let item of this.gameChannel) {
                    if(item) {
                        if(val === item.value) {
                            name = item.name;
                            break;
                        }
                    }
                }
                return name;
            },
            //获取列表信息
            getList(param = {}) {
                param.limit = this.page.limit
                param.page = this.page.page
                this.loadingTable = true;
                this.$http.get(this.$api.gameQpage, param, true).then((res) => {
                    console.log(res)
                    this.tableData = res.data;
                    if (res.total) {
                        this.page.total = res.total;
                    }
                    this.page.total = res.total;
                    this.loadingTable = false;
                    this.searchLoading = false;
                }).catch((err) => {
                    this.loadingTable = false;
                    this.searchLoading = false;
                    this.$message.error(err.message);
                });
            },
            search() {
                this.page.page = 1;
                this.searchLoading = true;
                let obj = {
                    gameDto: {}
                };
                
                for (const key in this.searchForm) {
                    if (key === 'isHotGame') {
                        obj.gameDto[key] = Number(this.searchForm[key])
                    } else {
                        obj.gameDto[key] = this.searchForm[key]
                    }
                }
                console.log(obj);
                this.getList(obj);
            },
            clearCondition() {
                this.searchForm = {};
                this.page.page = 1;
                this.getList();
            },
            //查看
            viewItem(index, row) {
                this.lookData = {};
                console.log(row)
                this.lookVisible = true;
                this.lookData = row;
            },
            //编辑
            editItem(index, row) {
                this.$refs['submitForm'] ? this.$refs['submitForm'].resetFields() : "";
                this.edit = true;
                this.editVisible = true;
                this.editLoading = true;
                this.$http.get(this.$api.gameDetail, {id: row.id}, true).then((res) => {
                    console.log(res)
                    this.editLoading = false;
                    this.submitForm = {
                        name: res.game.name,
                        class: res.game.categoryCode,
                        links: res.game.url,
                        type: res.game.type,
                        size: res.game.size,
                        platform: res.game.gamePlatfrom,
                        clientPackagePath: res.game.clientPackagePath,
                        detail: res.game.detail,
                        describe: res.game.describe,
                        rate: res.game.exchangerate,
                        sort: res.game.index,
                        point: res.game.popularity,
                        gameBigPic: res.game.bigPic,
                        gameSmallPic: res.game.smallPic,
                        id: res.game.id,
                        gameChannel: res.game.gameChannelConfig.gameChannel,
                        game_id: JSON.stringify(res.game.gameChannelConfig.config),
                        returnPoint: res.drawout ? res.drawout.returnPoint ? res.drawout.returnPoint.ratio : 0 : 0,
                        // gameMode: res.game.gameMode?res.game.gameMode: 'vertical',
                        isShrinkage: res.game.isShrinkage+'',
                        shrinkageSizeMin: res.game.shrinkageSize? res.game.shrinkageSize.split('/')[0]: "",
                        shrinkageSizeMax: res.game.shrinkageSize? res.game.shrinkageSize.split('/')[1]: "",
                        payChannels: res.game.payChannels?res.game.payChannels: []
                    }
                    if (res.drawout) {
                        console.log(res)
                        this.prizeset = {
                            mothSale: res.drawout.mothSale? res.drawout.mothSale: {
                                currency: 'xfq'
                            },
                            singleBatch: res.drawout.singleBatch? res.drawout.singleBatch: {
                                currency: 'xfq'
                            },
                            sale: res.drawout.sale? res.drawout.sale: {},   //销售
                            saleSubsidyTempList: res.drawout.saleSubsidyTempList ? res.drawout.saleSubsidyTempList : [{
                                areaCode: '',
                                areaCodes: '',
                                buyerRatio: '',
                                areaAdminRatio: '',
                                areaAdminCurrency: 'rmb',
                                buyerCurrency: 'xfq'
                            }]
                        };

                        
                        
                        // for (let index = 0; index < this.prizeset.saleSubsidyTempList.length; index++) {
                        //     if (this.prizeset.saleSubsidyTempList[index].areaCodes) {
                        //         this.prizeset.saleSubsidyTempList[index].areaCodes = [
                        //             this.prizeset.saleSubsidyTempList[index].areaCodes
                        //         ]
                        //     }
                        // }
                        this.b2c_s = {
                            sourceOfGoods: res.drawout.sourceOfGoods? res.drawout.sourceOfGoods: {},
                            sourceOfGoodsMonthSaleSubsidy: res.drawout.sourceOfGoodsMonthSaleSubsidy? res.drawout.sourceOfGoodsMonthSaleSubsidy: {}
                        }

                        this.prizeset.mothSale&&this.prizeset.mothSale.sales
                                ? this.$set(this.prizeset.mothSale, 'sales', this.$math.divide(this.prizeset.mothSale.sales, 100)): null;
                        this.prizeset.singleBatch&&this.prizeset.singleBatch.sales
                                ? this.$set(this.prizeset.singleBatch, 'sales', this.$math.divide(this.prizeset.singleBatch.sales, 100)): null;
                        this.b2c_s.sourceOfGoodsMonthSaleSubsidy&&this.b2c_s.sourceOfGoodsMonthSaleSubsidy.sales
                                ? this.$set(this.b2c_s.sourceOfGoodsMonthSaleSubsidy, 'sales', this.$math.divide(this.b2c_s.sourceOfGoodsMonthSaleSubsidy.sales, 100)): null;
                    }
                }).catch((err) => {
                    console.log(err);
                    this.editLoading = false;
                    this.$message.error(err.message);
                });
            },
            //上架
            upItem(index, row) {
                this.tableData[index].upLoading = true;
                this.tableData.push();//hack
                this.$http.get(this.$api.gameUpper, {id: row.id}, true).then((res) => {
                    this.tableData[index].isUpper = !this.tableData[index].isUpper;
                    this.tableData[index].upLoading = false;
                    this.tableData.push()
                }).catch((err) => {
                    this.tableData[index].upLoading = false;
                    this.tableData.push()
                    this.$message.error(err.message);
                });
            },
            //下架
            downItem(index, row) {
                this.tableData[index].downLoading = true;
                this.tableData.push();//hack
                this.$http.get(this.$api.gameUnUpper, {id: row.id}, true).then((res) => {
                    this.tableData[index].isUpper = !this.tableData[index].isUpper;
                    this.tableData[index].downLoading = false;
                    this.tableData.push()
                }).catch((err) => {
                    this.tableData[index].downLoading = false;
                    this.tableData.push()
                    this.$message.error(err.message);
                });
            },
            deleteItem(index, id) {
                this.$confirm('时候删除当前游戏？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(index, id)
                    this.tableData[index].deleteLoading = true;
                    this.tableData.push();//hack
                    this.$http.get(this.$api.gameDelete, {id}, true).then((res) => {
                        console.log(res)
                        this.getList();
                        this.tableData[index].deleteLoading = false;
                        this.tableData.push();//hack
                    }).catch((err) => {
                        this.tableData[index].deleteLoading = false;
                        this.tableData.push();//hack
                        this.$message.error(err.message);
                    });
                }).catch(() => {
                })
            },
            hotItem(index, id) {//设为热门
                this.tableData[index].hotLoading = true;
                this.tableData.push();//hack
                this.$http.get(this.$api.gameDoHotGame, {id: id}, true).then((res) => {
                    this.tableData[index].isHotGame = !this.tableData[index].isHotGame;
                    this.tableData[index].hotLoading = false;
                    this.tableData.push()
                }).catch((err) => {
                    this.tableData[index].hotLoading = false;
                    this.tableData.push()
                    this.$message.error(err.message);
                });
            },
            cancelHotItem(index, id) {//取消热门
                this.tableData[index].cancelHotLoading = true;
                this.tableData.push();//hack
                this.$http.get(this.$api.gameUnHotGame, {id: id}, true).then((res) => {
                    this.tableData[index].isHotGame = !this.tableData[index].isHotGame;
                    this.tableData[index].cancelHotLoading = false;
                    this.tableData.push()
                }).catch((err) => {
                    this.tableData[index].cancelHotLoading = false;
                    this.tableData.push()
                    this.$message.error(err.message);
                });
            },
            recommendItem(index, id) {//设为推荐
                this.tableData[index].recommendLoading = true;
                this.tableData.push();//hack
                this.$http.get(this.$api.gameDoRecommend, {id: id}, true).then((res) => {
                    this.tableData[index].isRecommend = !this.tableData[index].isRecommend;
                    this.tableData[index].recommendLoading = false;
                    this.tableData.push()
                }).catch((err) => {
                    this.tableData[index].recommendLoading = false;
                    this.tableData.push()
                    this.$message.error(err.message);
                });
            },
            cancelRecommendItem(index, id) {//取消推荐
                this.tableData[index].cancelRecommendLoading = true;
                this.tableData.push();//hack
                this.$http.get(this.$api.gameUnRecommend, {id: id}, true).then((res) => {
                    this.tableData[index].isRecommend = !this.tableData[index].isRecommend;
                    this.tableData[index].cancelRecommendLoading = false;
                    this.tableData.push()
                }).catch((err) => {
                    this.tableData[index].cancelRecommendLoading = false;
                    this.tableData.push()
                    this.$message.error(err.message);
                });
            },
            //新增游戏
            add(formName) {
                this.edit = false;
                this.$refs[formName] ? this.$refs[formName].resetFields() : "";
                this.submitForm = {
                    // gameMode: "vertical",
                    payChannels: []
                };
                this.prizeset = {
                    mothSale: {
                        currency: "xfq",
                    },
                    singleBatch: {
                        currency: 'xfq'   //单词批量
                    },
                    sale: {},   //销售
                    saleSubsidyTempList: [{
                        areaCode: '',
                        buyerRatio: '',
                        areaAdminRatio: '',
                        areaAdminCurrency: '',
                        buyerCurrency: ''
                    }]
                };
                
                this.b2c_s = {
                    sourceOfGoods: {},
                    sourceOfGoodsMonthSaleSubsidy: {}
                }
                this.editVisible = true;
            },
            //提交数据
            submitData(formName) {
                console.log(this.submitForm)
                let b = false;
                this.$refs[formName].validate((v) => {
                    if (v) {
                        b = true;
                    } else {
                        this.$nextTick(() => {
                            try {
                                let num = $('.is-error:first')[0].offsetTop + 50;
                                $('.el-dialog__wrapper').animate({
                                    scrollTop: num
                                }, 300);
                            } catch (error) {

                            }
                        })
                        return false;
                    }
                })
                if (b) {
                    let arr = [this.$refs.b2c_s._validate(), this.$refs.prizeset._validate()];
                    Promise.all(arr).then(res => {
                        if (this.edit) {
                            this.game(false);
                        } else {
                            this.game(true);
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            },
            game(isCreat) {
                let prizeset = JSON.parse(JSON.stringify(this.prizeset));
                let b2c_s = JSON.parse(JSON.stringify(this.b2c_s));

                prizeset.mothSale&&prizeset.mothSale.sales? prizeset.mothSale.sales= this.$math.multip(prizeset.mothSale.sales, 100): null;
                prizeset.singleBatch&&prizeset.singleBatch.sales? prizeset.singleBatch.sales= this.$math.multip(prizeset.singleBatch.sales, 100): null;
                b2c_s.sourceOfGoodsMonthSaleSubsidy&&b2c_s.sourceOfGoodsMonthSaleSubsidy.sales? b2c_s.sourceOfGoodsMonthSaleSubsidy.sales= this.$math.multip(b2c_s.sourceOfGoodsMonthSaleSubsidy.sales, 100): null;

                let obj = {
                    id: this.submitForm.id,
                    name: this.submitForm.name,
                    gamePlatfrom: this.submitForm.platform,
                    clientPackagePath: this.submitForm.clientPackagePath,
                    popularity: this.submitForm.point,
                    bigPic: this.submitForm.gameBigPic,
                    smallPic: this.submitForm.gameSmallPic,
                    describe: this.submitForm.describe,
                    detail: this.submitForm.detail,
                    size: this.submitForm.size,
                    url: this.submitForm.links,
                    type: this.submitForm.type,
                    categoryCode: this.submitForm.class,
                    exchangerate: this.submitForm.rate,
                    index: this.submitForm.sort,
                    gameChannel: this.submitForm.gameChannel,
                    config: this.submitForm.game_id,
                    payChannels: this.submitForm.payChannels,
                    // gameMode: this.submitForm.gameMode,
                    isShrinkage: this.submitForm.isShrinkage,
                    gameRule: {
                        ...prizeset,
                        ...b2c_s,
                        returnPoint: {
                            ratio: this.submitForm.returnPoint
                        }
                    }
                }
                this.submitForm.isShrinkage==1?obj.shrinkageSize=this.submitForm.shrinkageSizeMin+'/'+this.submitForm.shrinkageSizeMax: null;
                let apiname = "gameUpdate";
                if (isCreat) {
                    apiname = "gameCreate";
                    delete obj.id;
                }
                try {
                    obj = JSON.parse(JSON.stringify(obj))
                    for (let index = 0; index < obj.gameRule.saleSubsidyTempList.length; index++) {
                        obj.gameRule.saleSubsidyTempList[index].areaCode = obj.gameRule.saleSubsidyTempList[index].areaCode[2]
                    }
                } catch (error) {

                }
                console.log(JSON.stringify(obj))
                this.submitLoading = true;
                this.$http.post(this.$api[apiname], obj, true).then((res) => {
                    this.getList();
                    this.submitLoading = false;
                    this.editVisible = false;
                }).catch((err) => {
                    this.submitLoading = false;
                    this.$message.error(err.message);
                });
            },
            operateDown(type, id) {
                this.$confirm(`是否${type==='open'? '开启': '关闭'}下载`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let url = type==='open'? this.$api.gameEnableDownload: this.$api.gameUnableDownload;
                    this.$http.post(url , {id: id}, true).then(()=>{
                        this.$message.success(type==='open'? '开启成功': '关闭成功');
                        this.getList();
                    }).catch(err=>{
                        this.$message.error(err.message);
                    })
                }).catch(()=>{})
            }
        },
        watch: {
            'submitForm.type': {
                handler(val) {
                    if (val == 'h5') {
                        // this.submitForm.gameChannel = "";
                    }
                },
                deep: true
            },
            editVisible(val) {
                if(!val){
                    this.$refs.b2c_s._resetFields();
                    this.$refs.prizeset._resetFields();
                }
            }
        },
        filters: {
            formatPay(val) {
                if(val) {
                    return enumFormatter(val, EnumPayWay)
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "./gameList.scss"
</style>
