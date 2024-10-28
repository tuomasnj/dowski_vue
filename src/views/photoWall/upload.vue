<template>
    <div>
        <page-main
            v-loading="loading"
            element-loading-text="文件上传中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            class="photoUpload"
        >
            <div class="container">
                <div class="left">
                    <el-image :src="require('@/assets/images/illustration1.png')" class="illustration1" />
                </div>
                <div class="right">
                    <el-upload
                        ref="upload"
                        class="upload"
                        action="#"
                        :on-preview="handlePreview"
                        :file-list="fileList"
                        list-type="picture"
                        multiple
                        accept="image/jpeg, image/png"
                        :auto-upload="false"
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                    >
                        <el-button class="choosePic" type="primary">选择图片</el-button>
                        <el-button class="queren" icon="el-icon-upload"
                                   round type="success" @click.stop="ConfirmSubmit"
                        >
                            开始上传
                        </el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且单张文件不超过10MB,文件总和不超过50MB</div>
                    </el-upload>
                </div>
                <div v-if="fileList.length > 0" class="break" style="color: red; font-size: 20px;">
                    <i class="el-icon-delete" @click="deleteIcon" />
                </div>
            </div>
        </page-main>
    </div>
</template>

<script>
// import {uploadImgs} from '@/api/pics'
export default {
    name: 'Upload',
    data() {
        return {
            fileList: [],
            loading: false
        }
    },

    watch: {
        // 调整整个页面的高度
        fileList(newVal) {
            if (newVal.length >= 3) {
                const photoUploadElement = document.querySelector('.container')
                photoUploadElement.style.margin = '0'
            } else {
                const photoUploadElement = document.querySelector('.container')
                photoUploadElement.style.marginTop = '100px'
                photoUploadElement.style.marginBottom = '100px'
            }
        }
    },
    mounted() {

    },
    methods: {
        ConfirmSubmit() {
            if (this.fileList.length > 8) {
                this.$notify({
                    title: '错误提示',
                    message: '一次最多上传8张图片',
                    offset: 50
                })
                return
            }
            this.loading = true
            setTimeout(() => {
                this.loading = false
            }, 5000)
            // uploadImgs(this.fileList).then(res => {
            //     console.log(res)
            // }).catch(err => {
            //     console.log('error', err)
            // })
        },
        handlePreview() {

        },
        handleChange(file, fileList) {
            console.log('fileList', this.fileList)
            const isJPG = file.raw.type === 'image/jpeg'
            const isPNG = file.raw.type === 'image/png'

            fileList.some(item => {
                if (!isJPG && !isPNG) {
                    const h = this.$createElement
                    setTimeout(() => {
                        this.$notify({
                            title: '出错啦！',
                            message: h('i', { style: 'color: teal'}, '上传文件的格式错误'),
                            offset: 50
                        })
                    })
                    fileList = []
                    return true
                }
                if (item.size > 10 * 1024 * 1024) {
                    const h = this.$createElement
                    setTimeout(() => {
                        this.$notify({
                            title: '出错啦！',
                            message: h('i', { style: 'color: teal'}, '上传图片大小不能超过 10MB!'),
                            offset: 30
                        })
                    })
                    fileList = []
                    return true
                }
            })
            this.fileList = fileList
        },
        handleRemove(file, fileList) {
            this.fileList = fileList
        },
        deleteIcon() {
            this.fileList = []
        }
    }
}
</script>

<style lang="scss" scoped>
[data-mode=mobile] {
    .photoUpload {
        font-size: 5px;
    }
}
[data-mode=pc] {
    .photoUpload {
        background: url('../../assets/images/cloud.jpg') no-repeat center center/cover;
        position: relative;
        display: flex;
        justify-content: center;
        .short {
            margin: 0 0 !important;
        }
        .container {
            margin: 100px 0;
            display: flex;
            align-self: center;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 10px;
            box-shadow: 0 0 5px #999;
            width: 800px;
            padding: 50px 35px 30px;
            .left {
                width: 45%;
                .illustration1 {
                    width: 300px;
                    height: 300px;
                    margin-right: 40px;
                    opacity: 0.85;
                    align-self: center;
                }
            }
            .right {
                width: 50%;
                .upload {
                    align-self: center;
                    .choosePic {
                        width: 200px;
                        height: 50px;
                        font-size: 20px;
                    }
                    .queren {
                        width: 100;
                        height: 20;
                        font-size: 15;
                        margin-left: 25px;
                    }
                    .el-upload__tip {
                        margin-top: 15px;
                    }
                }
            }
            .break {
                margin-left: 10px;
                align-self: center;
                cursor: pointer;
            }
        }
        ::v-deep .el-loading-spinner {
            .el-icon-loading {
                font-size: 28px;
            }
            .el-loading-text {
                font-size: 18px;
            }
        }
    }
}
</style>
