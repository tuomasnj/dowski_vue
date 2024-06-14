<template>
    <div>
        <page-main class="calendarPage">
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
            <el-calendar v-model="curDate" @input="viewDetail">
                <div
                    slot="dateCell"
                    slot-scope="{ data }"
                >
                    <p class="date-number">
                        {{ data.day.split("-").slice(2).join("-") }}
                        <span
                            v-for="(item, index) in calendarData"
                            :key="index"
                        >{{ item.day == data.day?'✅' : '' }}</span>
                    </p>
                    <div
                        v-for="(item, index) in calendarData"
                        :key="index"
                    >
                        <span v-if="item.day == data.day && item.thingToDo">
                            <el-tooltip placement="top">
                                <div slot="content" style="width: 200px;">
                                    <div>
                                        {{ item.thingToDo }}
                                    </div>
                                </div>
                                <div style="display: flex; vertical-align: center;">
                                    <div class="ellipsis-multi-line" @click.stop="noop">
                                        {{ item.thingToDo }}
                                    </div>
                                </div>
                            </el-tooltip>
                        </span>
                    </div>
                </div>
            </el-calendar>
            <el-dialog class="Detaildialog" title="详细信息" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="事件日期" :label-width="formLabelWidth">
                        {{ form.date }}
                    </el-form-item>
                    <el-form-item label="活动名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="活动区域" :label-width="formLabelWidth">
                        <el-select v-model="form.region" placeholder="请选择活动区域">
                            <el-option label="区域一" value="shanghai" />
                            <el-option label="区域二" value="beijing" />
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                </div>
            </el-dialog>
        </page-main>
    </div>
</template>

<script>
import moment from 'moment'
export default {
    data() {
        return {
            curDate: new Date(),
            yearMonth: '',
            showDialog: true,
            calendarData: [{
                day: '2024-06-28',
                thingToDo: '陪小倩宝宝一起过生日，吃生日蛋糕，去海底捞海皮，唱歌okok，还要玩真心话大冒险，要一起睡觉觉亲亲抱抱，一起贴贴睡大懒觉。',
                remindTime: '2024-06-28 14:12:15'
            }, {
                day: '2024-06-16',
                thingToDo: '父亲节，问候一下爸爸。',
                remindTime: '2024-06-28 10:00:30'
            }],
            dialogFormVisible: false,
            form: {
                date: '',
                name: '',
                region: '',
                date1: '',
                date2: '',
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '120px'
        }
    },

    methods: {
        noop() {},

        viewDetail(data) {
            let date = moment(data).format('yyyy-MM-DD')
            console.log(date)
            // 判断calendarData中是否包含该日期
            // 如果包含是修改，否则是添加备忘
            this.form.date = date
            this.dialogFormVisible = true
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

<style scoped lang="scss">
[data-mode=mobile] {
    .calendarPage {
        ::v-deep .el-input__inner {
            width: auto;
        }
        .Detaildialog {
            ::v-deep .el-dialog {
                width: 95%;
            }
            ::v-deep .el-dialog__header {
                text-align: center;
            }
        }
        .ellipsis-multi-line {
            font-size: 8px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 80px;
            line-height: 16px;
            -webkit-line-clamp: 5;
            background-color: rgb(205, 243, 243);
        }
        .date-number {
            font-size: 12px;
        }
    }
}
[data-mode=pc] {
    .calendarPage {
        ::v-deep .el-dialog__header {
            text-align: center;
        }
        .ellipsis-multi-line {
            display: -webkit-box;        /* 创建一个伸缩盒子元素 */
            -webkit-box-orient: vertical;/* 设置盒子为垂直方向 */
            overflow: hidden;            /* 隐藏溢出内容 */
            text-overflow: ellipsis;     /* 使用省略号表示溢出内容 */
            -webkit-line-clamp: 3;    /* 显示的行数 */
            height: 5em;               /* 设置容器的高度（行数 * 行高） */
            line-height: 1.5em;          /* 行高 */
            background-color: rgb(205, 243, 243);
            padding: 5px 10px;
        }
    }
}
::v-deep .el-calendar-table:not(.is-range) td.prev {
    pointer-events: none;
}
::v-deep .el-calendar-table:not(.is-range) td.next {
    pointer-events: none;
}
::v-deep .el-button-group {
    display: none;
}
::v-deep .el-calendar-table .el-calendar-day {
    height: 150px;
}
::v-deep .el-calendar-table td.is-today {
    color: green;
}
.view {
    background-color: #3f9eff;
    color: #fff;
    border-color: #3f9eff;
}

</style>
