<template>
    <div>
        <page-main>
            <el-row :gutter="10" style="margin: 15px;">
                <el-col :span="8">
                    <div style="display: flex; justify-content: space-between;">
                        <el-date-picker
                            v-model="yearMonth"
                            type="month"
                            placeholder="选择年月"
                        />
                        <el-button type="primary" round class="view" style="width: 100px;" @click="queryMenuInfo">查&nbsp;&nbsp;&nbsp;询</el-button>
                    </div>
                </el-col>
                <el-col :span="16" />
            </el-row>
            <el-calendar v-model="curDate" @input="handle">
                <div
                    slot="dateCell"
                    slot-scope="{ data }"
                >
                    <p>
                        {{ data.day.split("-").slice(1).join("-") }}{{ data.isSelected ? '✅' : '' }}
                    </p>
                </div>
            </el-calendar>
        </page-main>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    data() {
        return {
            curDate: new Date(),
            yearMonth: ''
        }
    },
    methods: {
        handle(data) {
            alert(data)
        },
        queryMenuInfo() {
            if (this.yearMonth == '') {
                this.$message.error('请选择年月')
                return
            }
            alert(moment(this.yearMonth).format('yyyy-MM'))
        }
    }

}
</script>

<style scoped>
::v-deep .el-calendar-table:not(.is-range) td.prev {
    pointer-events: none;
}
::v-deep .el-calendar-table:not(.is-range) td.next {
    pointer-events: none;
}
::v-deep .el-button-group {
    display: none;
}
.view {
    background-color: #3f9eff;
    color: #fff;
    border-color: #3f9eff;
}
</style>
