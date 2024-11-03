<template>
    <page-main
        v-loading="loading"
        element-loading-text="图片加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="photoShow"
    >
        <waterfall :col="column" :data="images">
            <template>
                <div v-for="(item, index) in images" :key="index" class="cell-item">
                    <img :src="item.imageUrl" alt="加载错误" @click="clickImg(index)">
                </div>
            </template>
        </waterfall>
        <el-image-viewer v-if="showPreview"
                         :on-close="()=>{showPreview=false}"
                         :url-list="urlList"
                         :initial-index="idx"
        />
    </page-main>
</template>
<script>

import { downLoadImgs } from '@/api/pics'
export default {
    name: 'Show',
    components: {
        'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
    },
    data() {
        return {
            images: [],
            urlList: [],
            loading: false,
            column: 5,
            showModal: true,
            showPreview: false,
            idx: 0
        }
    },

    created() {
        this.loading = true
        downLoadImgs().then(res => {
            if (res.code == 200) {
                setTimeout(() => {
                    this.loading = false
                }, 2000)
                this.images = res.data
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
        clickImg(index) {
            this.idx = index
            this.showPreview = true
        }
    }
}
</script>

<style lang="scss" scoped>
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
}
// .el-image-viewer__wrapper {
//     position: absolute !important;
//     ::v-deep .el-image-viewer__canvas {
//         position: absolute !important;
//         height: 80% !important;
//         top: 10% !important;
//     }
// }
</style>
