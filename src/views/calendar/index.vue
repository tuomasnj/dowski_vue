<template>
    <div>
        <page-main v-loading="loading" class="calendarPage">
            <el-row :gutter="10" style="margin: 15px;">
                <el-col :span="8">
                    <div style="display: flex; justify-content: space-between;">
                        <el-date-picker
                            v-model="yearMonth"
                            type="month"
                            placeholder="选择年月"
                        />
                        <el-button type="primary" round class="view" style="width: 100px; margin-left: 15px;" @click="queryMenuInfo">查&nbsp;&nbsp;&nbsp;询</el-button>
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
                <el-form ref="form" :model="form" :rules="rules">
                    <el-form-item label="事件日期：" :label-width="formLabelWidth">
                        {{ form.date }}
                    </el-form-item>
                    <el-form-item v-if="form.status == 1" label="通知内容：" :label-width="formLabelWidth">
                        <clearableTextInputVue v-model="form.thingToDo" :clearable="true" :values="form.thingToDo" :disable="form.status == 1 || forbid == 1" />
                    </el-form-item>
                    <el-form-item v-else label="通知内容：" :label-width="formLabelWidth" prop="thingToDo">
                        <clearableTextInputVue v-model="form.thingToDo" :clearable="true" :values="form.thingToDo" :disable="form.status == 1 || forbid == 1" />
                    </el-form-item>
                    <el-form-item :label-width="formLabelWidth" prop="remindTime">
                        <span slot="label">
                            <el-tooltip placement="top">
                                <div slot="content">如果不选择通知时间则默认为9:00</div>
                                <i v-if="form.status == 0" class="el-icon-info" />
                            </el-tooltip>
                            <span> 通知时间：</span>
                        </span>
                        <div v-if="form.status == 1">
                            {{ form.remindTime }}
                        </div>
                        <el-time-picker
                            v-else
                            v-model="form.remindTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            :placeholder="form.remindTime"
                            :disabled="forbid == 1"
                        />
                    </el-form-item>
                    <el-form-item v-if="form.status" label="通知状态：" :label-width="formLabelWidth">
                        {{ form.status | statusFilter }}
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button v-if="hasThisDate && form.status == 0" type="danger" @click="deleteEvent">删 除</el-button>
                    <el-button v-if="form.status == 1" @click="dialogFormVisible = false">关 闭</el-button>
                    <el-button v-if="form.status == 0 && forbid != 1" type="primary" @click="submitForm">保 存</el-button>
                </div>
            </el-dialog>
        </page-main>
    </div>
</template>

<script>
import moment from 'moment'
import clearableTextInputVue from '@/layout/components/clearableTextInput.vue'
import { getMenus, addMenus, deleteMenu, alterMenu} from '@/api/menu'
export default {
    components: {
        clearableTextInputVue
    },
    filters: {
        statusFilter(val) {
            switch (val) {
                case 0:
                    return '未发送邮件'
                case 1:
                    return '已邮件通知'
            }
        }
    },
    data() {
        return {
            loading: false,
            curDate: new Date(),
            yearMonth: '',
            showDialog: true,
            choosedDate: '',
            calendarData: [{
                day: '2024-06-28',
                thingToDo: '陪小倩宝宝一起过生日，吃生日蛋糕，去海底捞海皮，唱歌okok，还要玩真心话大冒险，要一起睡觉觉亲亲抱抱，一起贴贴睡大懒觉。',
                remindTime: '2024-06-28 14:12:15',
                status: 0
            }, {
                day: '2024-06-16',
                thingToDo: '父亲节，问候一下爸爸。',
                remindTime: '2024-06-28 10:00:30',
                status: 1
            }],
            dialogFormVisible: false,
            form: {
                date: '',
                remindTime: '',
                thingToDo: '',
                status: ''
            },
            formLabelWidth: '120px',
            rules: {
                thingToDo: [{ required: true, message: '请填写通知内容', trigger: 'blur' }]
                // remindTime: [
                //     {required: true, message: '请选择时间', trigger: 'change' }
                // ]
            },
            forbid: ''
        }
    },
    computed: {
        hasThisDate() {
            return this.calendarData.some(item => item.day == moment(this.choosedDate).format('yyyy-MM-DD'))
        }
    },

    created() {
        let month = {
            month: moment(new Date()).format('yyyyMM')
        }
        this.loading = true
        getMenus(month).then(res => {
            this.loading = false
            if (res.code == 200) {
                this.calendarData = res.data
            } else {
                this.$message.error('服务异常')
            }
        }).catch(() => {
            this.loading = false
            this.$notify({
                title: '提示',
                message: '网络异常，请重试'
            })
        })
    },

    methods: {
        noop() {},
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    let submitData = {
                        day: moment(this.form.date, 'YYYY年M月D日').format('YYYY-MM-DD'),
                        remindTime: moment(moment(this.form.date, 'YYYY年M月D日').format('YYYY-MM-DD') + ' ' + this.form.remindTime, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm:ss'),
                        thingToDo: this.form.thingToDo,
                        status: 0
                    }
                    if (!this.form.remindTime) {
                        submitData.remindTime = ''
                    }
                    this.loading = true
                    if (this.calendarData.some(item => item.day == moment(this.choosedDate).format('yyyy-MM-DD'))) { // 修改内容
                        alterMenu(submitData).then(res => {
                            this.dialogFormVisible = false
                            if (res.code == 200) {
                                this.$notify({
                                    title: '提示',
                                    message: '修改内容成功'
                                })
                                let month = {
                                    month: moment(submitData.day, 'YYYY-MM-DD').format('yyyyMM')
                                }
                                getMenus(month).then(res => {
                                    this.loading = false
                                    if (res.code == 200) {
                                        this.calendarData = res.data
                                    } else {
                                        this.$message.error('服务异常')
                                    }
                                }).catch(() => {
                                    this.loading = false
                                    this.$notify({
                                        title: '提示',
                                        message: '网络异常，请重试'
                                    })
                                })
                            } else {
                                this.loading = false
                                this.$notify({
                                    title: '提示',
                                    message: '服务异常'
                                })
                            }
                        }).catch(() => {
                            this.loading = false
                            this.$notify({
                                title: '提示',
                                message: '网络异常，请重试'
                            })
                            this.dialogFormVisible = false
                        })
                    } else { // 新增内容
                        addMenus(submitData).then(res => {
                            this.dialogFormVisible = false
                            if (res.code == 200) {
                                this.$notify({
                                    title: '提示',
                                    message: '添加成功'
                                })
                                let month = {
                                    month: moment(submitData.day, 'YYYY-MM-DD').format('yyyyMM')
                                }
                                getMenus(month).then(res => {
                                    this.loading = false
                                    if (res.code == 200) {
                                        this.calendarData = res.data
                                    } else {
                                        this.$message.error('服务异常')
                                    }
                                }).catch(() => {
                                    this.loading = false
                                    this.$notify({
                                        title: '提示',
                                        message: '网络异常，请重试'
                                    })
                                })
                            } else {
                                this.loading = false
                                this.$notify({
                                    title: '提示',
                                    message: '服务异常'
                                })
                            }
                        }).catch(() => {
                            this.loading = false
                            this.$notify({
                                title: '提示',
                                message: '网络异常，请重试'
                            })
                            this.dialogFormVisible = false
                        })
                    }
                } else {
                    console.log('校验失败')
                }
            })
        },
        viewDetail(data) {
            let date = moment(data).format('YYYY年M月D日')
            // 判断calendarData中是否包含该日期
            // 如果包含是修改，否则是添加备忘
            this.form.date = date
            this.choosedDate = data
            let index = moment(data).format('yyyy-MM-DD')
            let obj = this.calendarData.filter(item => item.day == index)
            if (index < moment(new Date()).format('yyyy-MM-DD')) {
                this.forbid = '1'
            } else {
                this.forbid = '0'
            }
            if (obj.length == 0) {
                console.log('尚未添加备忘录')
                this.form.remindTime = ''
                this.form.thingToDo = ''
                this.form.status = ''
                this.dialogFormVisible = true
            } else if (obj.length == 1) {
                // 已添加备忘录，查看或者修改内容
                this.form.remindTime = moment(obj[0].remindTime).format('HH:mm')
                this.form.thingToDo = obj[0].thingToDo
                this.form.status = obj[0].status
                this.dialogFormVisible = true
            } else if (obj.length > 1) {
                this.$message.error('数据异常')
            }

        },
        queryMenuInfo() {
            if (this.yearMonth == '' || this.yearMonth == null) {
                this.$message.error('请选择年月')
                return
            }
            this.curDate = new Date((moment(this.yearMonth).format('yyyy-MM-DD')))
            let data = {
                month: moment(this.curDate).format('YYYYMM')
            }
            this.loading = true
            getMenus(data).then(res => {
                this.loading = false
                if (res.code == 200) {
                    this.calendarData = res.data
                } else {
                    this.$message.error('服务异常')
                }
            }).catch(() => {
                this.loading = false
                this.$notify({
                    title: '提示',
                    message: '网络异常，请重试'
                })
            })
        },
        deleteEvent() {
            this.$confirm('是否确认删除该事项？',  '温馨提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消'
            }).then(() => {
                let data = {
                    day: moment(this.form.date, 'YYYY年M月D日 HH:mm:ss').format('YYYY-MM-DD')
                }
                this.loading = true
                deleteMenu(data).then(res => {
                    if (res.code == 200) {
                        this.$notify({
                            title: '提示',
                            message: '删除成功'
                        })
                        let month = {
                            month: moment(this.form.date, 'YYYY年M月D日 HH:mm:ss').format('yyyyMM')
                        }
                        getMenus(month).then(res => {
                            this.loading = false
                            if (res.code == 200) {
                                this.calendarData = res.data
                            } else {
                                this.$message.error('服务异常')
                            }
                        }).catch(() => {
                            this.loading = false
                            this.$notify({
                                title: '提示',
                                message: '网络异常，请重试'
                            })
                        })
                    } else {
                        this.loading = false
                        this.$notify({
                            title: '提示',
                            message: '服务异常'
                        })
                    }
                }).catch(() => {
                    this.loading = false
                    this.$notify({
                        title: '提示',
                        message: '网络异常，请重试'
                    })
                })
                this.dialogFormVisible = false
            }).catch(() => {
                this.dialogFormVisible = false
            })
        }
    }
}
</script>

<style scoped lang="scss">
[data-mode=mobile] {
    .calendarPage {
        ::v-deep .el-input__inner {
            width: 150px;
        }
        .Detaildialog {
            ::v-deep .el-dialog {
                width: 95%;
            }
            ::v-deep .el-dialog__header {
                text-align: center;
            }
            ::v-deep .el-form-item__label {
                text-align: left;
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
            line-clamp: 1;
            background-color: rgb(205, 243, 243);
            width: 100%;
            word-break: break-all;
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
            line-clamp: 1;
            height: 5em;               /* 设置容器的高度（行数 * 行高） */
            line-height: 1.5em;          /* 行高 */
            background-color: rgb(205, 243, 243);
            padding: 5px 10px;
            width: 100%;
            word-break: break-all;
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
    color: red;
}
.view {
    background-color: #3f9eff;
    color: #fff;
    border-color: #3f9eff;
}

</style>
