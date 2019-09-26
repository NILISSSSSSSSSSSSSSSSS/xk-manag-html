
export default {
    data() {
        options: []
    },
    created() {
        this.getMallCategoryQueryList();
    },
    methods: {
        getMallCategoryQueryList() {
            this.$http.get(this.$api.categoryQueryList, {}, true)
                .then(res => {
                    res.forEach(item => {
                        this.options.push(item);
                    })
                })
                .catch(err => {
                    this.$message.error(err.message);
                })
        },
    }
}

