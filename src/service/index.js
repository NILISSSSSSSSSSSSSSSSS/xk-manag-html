import {baseUrl,phpBaseUrl} from '../util/publicParams'
import goods from './goods'
import prizes from './prizes'
import service from './service'
import audit from './audit'
import live from './live'
import financial from './financial'
import lottery from './lottery'



export default {
    ...audit,
    ...goods,
    ...prizes,
    ...service,
    ...live,
    ...financial,
    ...lottery,
    timestamp: baseUrl + "sys/om/systemTime/1.0",
    qiniu_token: baseUrl + "sys/om/qosstoken/1.0",
    provinceList: baseUrl + 'sys/om/provinceList/1.0',
    city_list: baseUrl + 'sys/om/cityList/1.0',
    district_list: baseUrl + 'sys/om/districtList/1.0',
    login: baseUrl + "user/om/sOperatorLogin/1.0",
    //物流信息查询
    logisticsQuery: baseUrl + 'sys/om/logisticsQuery/1.0',
    //查询所有省份
    provinceCacheList: baseUrl + "sys/om/provinceCacheList/1.0",
    //查询所有城市
    cityCacheList: baseUrl + 'sys/om/cityCacheList/1.0',
    //查询所有区县
    districtCacheList: baseUrl + 'sys/om/districtCacheList/1.0',
    /*
    查询所有省份：level=1
    查询所有城市：level=2
    查询所有区/县：level=3
    查询热门城市：level=2&isHot=1
    查询四川的所有城市：parentCode=510000
    查询成都：keyword=成都 || keyword=chengdu || keyword=cd
    */
    regionPage: baseUrl + 'sys/om/regionPage/1.0',


    /**
     * php 接口
     */
    videoList: phpBaseUrl + "index/Square/a001/recoms/1.0",
    //直播登录入口
    liveLogin: phpBaseUrl + "admin/index/login"

}
