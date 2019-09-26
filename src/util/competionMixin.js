let statusList={
    COMPETITIONED:"monitor",
    OFF_LINE:"review"
}

// isTurnPage:只有从竞赛详情里面的轮次表格点进去时，才不会获取最新轮次并且刷新
export default {
    data() {
        return {
        }
    },
    methods: {
        getCompetionInfo(){
            let data = {
                competitionId: this.$route.query.competitionId,
            };
            this.$http
                .get(this.$api.competitionRoundInfo, data, true)
                .then(res => {
                    console.log("竞赛信息" + JSON.stringify(res));
                    if (res) {
                        let curentLun=this.$route.query.curentLun;
                        let type=this.$route.query.type;
                        let isTurnPage=this.$route.query.isTurnPage;
                        //如果轮次或者竞赛状态改变了,并且允许刷新最新轮次状态，则获取最新轮次和状态
                        if((curentLun !=res.roundIndex || type!=statusList[res.competitionStatus]) && isTurnPage){
                            console.log("跳转页面");
                            this.$router.push({
                                path: res.competitionType == "GAME" ? '/gameCompetion' :  "/uploadCompetion",
                                query: {
                                    type: res.competitionStatus=='COMPETITIONED' ? 'monitor' : 'review',
                                    competitionId: res.competitionId,
                                    curentLun: res.roundIndex,
                                    isTurnPage:this.$route.query.isTurnPage
                                }
                            })
                        }
                        else{
                            console.log("不刷新");
                        }
                    }
                })
                .catch(res => {
                    this.$message.error(res.message);
                });
        }
    }
}