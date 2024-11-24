<template>
    <page-main
        v-loading="loading"
        class="photoShow"
    >
        <waterfall v-if="reload" :col="column" :data="images">
            <template>
                <div v-for="(item, index) in images" :key="index" class="cell-item">
                    <img v-if="item.imageUrl" v-long-press="handleLongPress" :lazy-src="item.imageUrl" alt="加载错误" @click="clickImg(index)">
                </div>
            </template>
        </waterfall>
        <el-image-viewer v-if="showPreview"
                         :on-close="()=>{showPreview=false}"
                         :url-list="urlList"
                         :initial-index="idx"
        />
        <div v-if="total" class="block">
            <el-pagination
                v-if="mode == 'pc'"
                :current-page="current"
                :page-size="size"
                layout="total, prev, pager, next, jumper"
                :total="total"
                @current-change="handleCurrentChange"
            />
            <el-pagination
                v-if="mode == 'mobile'"
                :current-page="current"
                :page-size="size"
                layout="prev, pager, next"
                :total="total"
                @current-change="handleCurrentChange"
            />
        </div>
    </page-main>
</template>
<script>

import { downLoadImgs, deleteImg } from '@/api/pics'
export default {
    name: 'Show',
    components: {
        'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
    },
    data() {
        return {
            images: [],
            urlList: [],
            loading: true,
            showModal: true,
            showPreview: false,
            idx: 0,
            loadedCount: 0,
            isLongPress: false,
            size: 15,
            total: '',
            reload: false,
            mode: this.$store.state.settings.mode

        }
    },

    computed: {
        column() {
            if (this.$store.state.settings.mode == 'pc') {
                return 5
            } else {
                return 3
            }
        },
        current() {
            if (sessionStorage.getItem('photo-view-page')) {
                return parseInt(sessionStorage.getItem('photo-view-page'))
            } else {
                return 1
            }
        }

    },

    created() {
        this.loading = true
        downLoadImgs({current: this.current, size: this.size}).then(res => {
            if (res.code == 200) {
                this.loading = false
                this.reload = true
                this.images = res.data.records
                this.total = res.data.total
                this.urlList = this.images.map(item => item.imageUrl)
            } else {
                this.loading = false
                this.$message.error('获取图片失败')
            }
        }).catch(err => {
            this.loading = false
            console.log('error', err)
            this.$message.error('服务异常')
        })
    },
    methods: {
        handleMouseDown(index) {
            alert('hello')
            this.index = index
        },

        clickImg(index) {
            if (!this.isLongPress) {
                this.idx = index
                this.showPreview = true
            }
            this.isLongPress = false
        },
        handleLongPress(event) {
            // console.log('target', event.target.outerHTML)
            if (this.$store.state.settings.mode == 'pc') {
                this.$confirm('是否确认删除选中的图片？', '提示').then(() => {
                    // 找到最后一个斜杠的位置
                    const lastSlashIndex = event.target.outerHTML.lastIndexOf('/')
                    const tempfileName = event.target.outerHTML.substring(lastSlashIndex + 1)
                    const index = tempfileName.indexOf('"')
                    const fileName = tempfileName.substring(0, index)
                    console.log('fileName', fileName)
                    this.loading = true
                    deleteImg({fileName: fileName}).then(res => {
                        this.loading = false
                        if (res.code == 200) {
                            this.$message.success('删除成功')
                            this.loading = true
                            this.reload = false
                            downLoadImgs({current: this.current, size: this.size}).then(res => {
                                if (res.code == 200) {
                                    this.loading = false
                                    this.$alert('页面刷新成功', '温馨提示', {
                                        confirmButtonText: '确定'
                                    })
                                    this.images = res.data.records
                                    this.total = res.data.total
                                    this.urlList = this.images.map(item => item.imageUrl)
                                    this.reload = true
                                } else {
                                    this.loading = false
                                    this.$message.error('获取图片失败')
                                }
                            }).catch(err => {
                                this.loading = false
                                console.log('error', err)
                                this.$message.error('服务异常')
                            })
                        } else {
                            this.$message.error('删除失败')
                        }
                    }).catch(() => {
                        this.loading = false
                        this.$message.fail('删除失败')
                    })
                }).catch(e => {
                    console.log(e)
                    console.log('关闭')
                })
            } else {
                this.$dialog.confirm({
                    title: '温馨提示',
                    message: '是否确认删除选中的图片？'
                }).then(() => {
                    // 找到最后一个斜杠的位置
                    const lastSlashIndex = event.target.outerHTML.lastIndexOf('/')
                    const tempfileName = event.target.outerHTML.substring(lastSlashIndex + 1)
                    const index = tempfileName.indexOf('"')
                    const fileName = tempfileName.substring(0, index)
                    console.log('fileName', fileName)
                    this.loading = true
                    deleteImg({fileName: fileName}).then(res => {
                        this.loading = false
                        if (res.code == 200) {
                            this.$toast.success('删除成功')
                            this.loading = true
                            this.reload = false
                            downLoadImgs({current: this.current, size: this.size}).then(res => {
                                this.loading = false
                                if (res.code == 200) {
                                    this.$toast.success('刷新成功')
                                    this.images = res.data.records
                                    this.total = res.data.total
                                    this.urlList = this.images.map(item => item.imageUrl)
                                    this.reload = true
                                } else {
                                    this.$toast.fail('获取图片失败')
                                }
                            }).catch(err => {
                                this.loading = false
                                console.log('error', err)
                                this.$toast.fail('服务异常')
                            })
                        } else {
                            this.$toast.fail('删除失败')
                        }
                    }).catch(() => {
                        this.loading = false
                        this.$toast.fail('删除失败')
                    })
                }).catch(() => {
                    console.log('关闭')
                })
            }
            this.isLongPress = true
        },
        handleCurrentChange(val) {
            this.loading = true
            this.reload = false
            sessionStorage.setItem('photo-view-page', val)
            downLoadImgs({current: val, size: this.size}).then(res => {
                if (res.code == 200) {
                    this.loading = false
                    this.reload = true
                    this.images = res.data.records
                    this.total = res.data.total
                    this.urlList = this.images.map(item => item.imageUrl)
                } else {
                    this.loading = false
                    this.$message.error('获取图片失败')
                }
            }).catch(err => {
                this.loading = false
                console.log('error', err)
                this.$message.error('服务异常')
            })
        }

    }
}
</script>
<style lang="scss" scoped>
[data-mode=pc] {
    .photoShow {
        min-height: 100vh;
        .cell-item {
            width: 100%;
            margin-bottom: 6px;
            background: #fff;
            border: 2px solid #f0f0f0;
            border-radius: 6px;
            overflow: hidden;
            box-sizing: border-box;
            img {
                width: 100%;
                height: auto;
                display: block;
            }
        }
        .block {
            display: flex;
            justify-content: center;
            margin: 28px;
        }
    }
}
[data-mode=mobile] {
    .photoShow {
        min-height: 100vh;
        ::v-deep .el-loading-mask {
            z-index: 800;
        }
        .cell-item {
            width: 100%;
            margin-bottom: 6px;
            background: #fff;
            border: 2px solid #f0f0f0;
            border-radius: 6px;
            overflow: hidden;
            box-sizing: border-box;
            img {
                width: 100%;
                height: auto;
                display: block;
            }
        }
        .block {
            display: flex;
            justify-content: center;
            margin: 28px;
        }
    }
}
</style>
