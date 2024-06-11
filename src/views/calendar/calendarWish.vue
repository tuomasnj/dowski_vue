<template>
    <div>
        <page-main v-loading="showLoading">
            <div>
                <el-button @click="load">点击加载</el-button>
            </div>
            <div>
                <page-header title="内容块" content="PageMain" />
                <page-main>
                    PageMain 是最常用的页面组件，几乎所有页面都会使用到
                </page-main>
                <page-main title="你可以设置一个自定义的标题">
                    这里放页面内容
                </page-main>
                <el-row :gutter="20" style="margin: 0 10px;">
                    <el-col :span="8">
                        <page-main style="margin: 0;">
                            还可以结合 ElRow 使用
                        </page-main>
                    </el-col>
                    <el-col :span="8">
                        <page-main style="margin: 0;">
                            这里放页面内容
                        </page-main>
                    </el-col>
                    <el-col :span="8">
                        <page-main style="margin: 0;">
                            这里放页面内容
                        </page-main>
                    </el-col>
                </el-row>
            </div>
            <div>
                <page-header title="内容块" content="PageMain" />
                <page-main>
                    PageMain 是最常用的页面组件，几乎所有页面都会使用到
                </page-main>
                <page-main title="你可以设置一个自定义的标题">
                    这里放页面内容
                </page-main>
                <el-row :gutter="20" style="margin: 0 10px;">
                    <el-col :span="8">
                        <page-main style="margin: 0;">
                            还可以结合 ElRow 使用
                        </page-main>
                    </el-col>
                    <el-col :span="8">
                        <page-main style="margin: 0;">
                            这里放页面内容
                        </page-main>
                    </el-col>
                    <el-col :span="8">
                        <page-main style="margin: 0;">
                            这里放页面内容
                        </page-main>
                    </el-col>
                </el-row>
            </div>
            <div class="sticky-scrollbar">
                <div style="width: 600px; height: 1px;" /> <!-- 仅用于显示滚动条 -->
            </div>
        </page-main>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showLoading: false,
            topScrollWidth: 0,
            tableDom: null
        }
    },
    methods: {
        load() {
            this.showLoading = true
            setTimeout(() => {
                this.showLoading = false
            }, 2000)
        }
    }

}
</script>

<style scoped>
</style>
