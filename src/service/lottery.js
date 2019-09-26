import { baseUrl } from '../util/publicParams';

export default {
    //彩票信息设置
    sequenceWinningList: baseUrl + 'manager/om/sequenceWinningList/1.0', // 查询已开奖的期（吴常辉）  
    lotteryResult: baseUrl + 'manager/om/lotteryResult/1.0', // 彩票开奖结果查询（吴常辉）
    updateLotteryType: baseUrl + 'manager/om/updateLotteryType/1.0', // 修改彩票类型（吴常辉）
    typeHistoryList: baseUrl + 'manager/om/typeHistoryList/1.0', // 查询彩票类型修改历史记录（吴常辉）
    typeDetail: baseUrl + 'manager/om/typeDetail/1.0', // 根据类型查询最新记录（吴常辉）
    sequenceNoAll: baseUrl + 'manager/om/sequenceNoAll/1.0', // 查询所有已开奖期号（吴常辉）待兑奖列表
    sequenceDetail: baseUrl + 'manager/om/sequenceDetail/1.0', // 彩票期-详情（吴常辉）
    sequenceNotWinningList: baseUrl + 'manager/om/sequenceNotWinningList/1.0', // 查询未开奖的已结束期（吴常辉）
    drawLottery: baseUrl + 'manager/om/drawLottery/1.0', // aa彩票开奖（吴常辉）
    stopSettingDetail: baseUrl + 'manager/om/stopSettingDetail/1.0', // 查询休市时间（吴常辉）
    addStopSetting: baseUrl + 'manager/om/addStopSetting/1.0', // 添加或修改休市时间（吴常辉）
    // 待出票列表
    sequenceNotOpenList: baseUrl + 'manager/om/sequenceNotOpenList/1.0', // 查询未开奖的期（吴常辉）
    aaLotteryInvoiceQPage: baseUrl + 'manager/om/aaLotteryInvoiceQPage/1.0', // 待出票列表（崔鹏）
    failedInvoiceTicketsQPage: baseUrl + 'manager/om/failedInvoiceTicketsQPage/1.0', // AA彩票 异常票出票列表（王鹏）
    updateInvoiceFailedTickets: baseUrl + 'manager/om/updateInvoiceFailedTickets/1.0', // AA彩票 导出异常出票（王鹏）
    invoiceTicketToken: baseUrl + 'manager/om/invoiceTicketToken/1.0', //AA彩票 获取token（王鹏）
    aaLotteryMatchNum: baseUrl + 'manager/om/aaLotteryMatchNum/1.0', //AA彩票精确匹配(王琪)
    invoiceFailedTickets: baseUrl + 'manager/om/invoiceFailedTickets/1.0', //AA彩票 导出异常出票（王鹏）
    invoiceSuccessTickets: baseUrl + 'manager/om/invoiceSuccessTickets/1.0', //AA彩票 匹配成功批量出票（王鹏）
    aaLotteryInvoicedQPage: baseUrl + 'manager/om/aaLotteryInvoicedQPage/1.0', //待开奖列表（王鹏）
    aaLotteryInvoicedDetail: baseUrl + 'manager/om/aaLotteryInvoicedDetail/1.0', //待开奖详情（王鹏）
    // 待兑奖列表
    aaLotteryClaimQPage: baseUrl + 'manager/om/aaLotteryClaimQPage/1.0', // 待兑奖列表（崔鹏）
    aaLotteryClaimDetail: baseUrl + 'manager/om/aaLotteryClaimDetail/1.0', // 待兑奖彩票详情（崔鹏）
    aaLotteryClaimOnlineClaim: baseUrl + 'manager/om/aaLotteryClaimOnlineClaim/1.0', // 线上手动兑奖（崔鹏）
    aaLotteryClaimOffLineClaim: baseUrl + 'manager/om/aaLotteryClaimOffLineClaim/1.0', // 线下兑奖（崔鹏）
    aaLotteryClaimRemarkSave: baseUrl + 'manager/om/aaLotteryClaimRemarkSave/1.0', // 待兑奖保存备注信息（崔鹏）
    // 已完成列表
    aaLotteryFinishQPage: baseUrl + 'manager/om/aaLotteryFinishQPage/1.0', // 已完成列表（崔鹏）
    aaLotteryFinishDetail: baseUrl + 'manager/om/aaLotteryFinishDetail/1.0', // 已完成彩票详情（崔鹏）
    // 晒单列表
    aaLotteryCommentQPage: baseUrl + 'manager/om/aaLotteryCommentQPage/1.0', // AA彩票晒单列表（王琪）
    aaLotteryCommentDetail: baseUrl + 'manager/om/aaLotteryCommentDetail/1.0', // aa彩票晒单详情（王琪）
    aaLotteryCommentAuth: baseUrl + 'manager/om/aaLotteryCommentAuth/1.0', // AA彩票晒单审核（王琪）
    aaLotteryCommentDelete: baseUrl + 'manager/om/aaLotteryCommentDelete/1.0', // AA彩票晒单删除（王琪）




}