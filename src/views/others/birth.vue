<template>
    <div class="birth">
        <page-main v-loading="showLoading" class="page">
            <div v-if="mode=='mobile'" class="stand">
                <audio controls>
                    <source src="@/assets/song.mp3" type="audio/mp3">
                </audio>
            </div>
            <div class="cake">
                <div class="artFont">
                    生日快乐
                    <div v-if="mode=='pc'" class="stand">
                        <audio controls>
                            <source src="@/assets/song.mp3" type="audio/mp3">
                        </audio>
                    </div>
                </div>
                <div class="gif">
                    <el-image :src="require('@/assets/images/20240705.gif')" alt="蛋糕" @load="onResourceLoaded" />
                </div>
                <div v-if="mode == 'pc'" class="led-container">
                    <el-image :src="require('@/assets/images/light.jpeg')" alt="灯光" @load="onResourceLoaded" />
                </div>
            </div>
            <div v-if="mode == 'mobile'" class="led-container">
                <el-image :src="require('@/assets/images/light.jpeg')" alt="灯光" @load="onResourceLoaded" />
            </div>
            <div v-if="mode == 'mobile'" class="heart">
                <el-image :src="require('@/assets/images/heart.png')" @load="onResourceLoaded" />
            </div>
            <div v-if="mode == 'mobile'" style="cursor: pointer; margin-top: 15px; margin-bottom: 20px;" @click="dialogVisible = true">
                <el-image :src="require('@/assets/images/envelop.png')" @load="onResourceLoaded" />
            </div>
            <div v-if="mode =='mobile' && dialogVisible" class="letter">
                <div style="display: flex; justify-content: right;">
                    <i class="el-icon-circle-close" style="font-size: 30px; cursor: pointer;" @click="dialogVisible = false" />
                </div>
                <p>祝我亲爱的小倩生日快乐！🎂</p>
                <p>从2月17号和你在一起到现在已经166天啦~ 和你度过的每天都很开心，喜欢我们一起散步，一起做饭，一起旅游，一起学习……也谢谢你在我失落和疲惫的时候关心我，温暖我。</p>
                <p>
                    你是一个乖巧懂事，又有些俏皮的女孩，你第一次说你的记仇本和记好本让我觉得非常的神奇😆。我一直觉得你有很多奇思妙想✨，
                    而我可能没有那么浪漫有趣。但是你给我的建议我也会积极努力的去听取，尽可能做到事事有回应。你是我的小宝贝，当然会一直把你放在心头哒❤️
                </p>
                <p>以后的以后还有很长的路要一起走，希望你压力大或者不开心的时候可以说出来，我知道你不愿意在手机上发消息，如果难过了可以直接叫我过去陪你的呀，我会闪现的！</p>
                <p>祝我们永远相爱，相伴到老。喜欢我们在一起的点点滴滴，生日快乐，我的小公主👸🏻</p>
                <p style="font-weight: bold;">2024年7月31日</p>
                <span style="color: cyan; display: block; text-align: right;">你亲爱的小贤</span>
            </div>
            <div v-if="mode =='pc'" style="display: flex;">
                <div class="left-heart">
                    <el-image :src="require('@/assets/images/heart.png')" style="width: 70%;" @load="onResourceLoaded" />
                </div>
                <div class="right-mail" style="cursor: pointer;" @click="dialogVisible = true">
                    <el-image :src="require('@/assets/images/envelop.png')" @load="onResourceLoaded" />
                </div>
            </div>
            <div v-if="mode =='pc' && dialogVisible" class="letter">
                <div style="display: flex; justify-content: right;">
                    <i class="el-icon-circle-close" style="font-size: 30px; cursor: pointer;" @click="dialogVisible = false" />
                </div>
                <p>祝我亲爱的小倩生日快乐！🎂</p>
                <p>从2月17号和你在一起到现在已经166天啦~ 和你度过的每天都很开心，喜欢我们一起散步，一起做饭，一起旅游，一起学习……也谢谢你在我失落和疲惫的时候关心我，温暖我。</p>
                <p>
                    你是一个乖巧懂事，又有些俏皮的女孩，你第一次说你的记仇本和记好本让我觉得非常的神奇😆。我一直觉得你有很多奇思妙想✨，
                    而我可能没有那么浪漫有趣。但是你给我的建议我也会积极努力的去听取，尽可能做到事事有回应。你是我的小宝贝，当然会一直把你放在心头哒❤️
                </p>
                <p>以后的以后还有很长的路要一起走，希望你压力大或者不开心的时候可以说出来，我知道你不愿意在手机上发消息，如果难过了可以直接叫我过去陪你的呀，我会闪现的！</p>
                <p>祝我们永远相爱，相伴到老。喜欢我们在一起的点点滴滴，生日快乐，我的小公主👸🏻</p>
                <p style="font-weight: bold;">2024年7月31日</p>
                <span style="color: cyan; display: block; text-align: right;">你亲爱的小贤</span>
            </div>
        </page-main>
    </div>
</template>

<script>
export default {
    data() {
        return {
            mode: this.$store.state.settings.mode,
            showLoading: false,
            dialogVisible: false,
            loadedResources: 0,
            totalResources: 4
        }
    },
    created() {
        this.showLoading = true
    },
    methods: {
        load() {
            this.showLoading = true
            setTimeout(() => {
                this.showLoading = false
            }, 2000)
        },
        onResourceLoaded() {
            this.loadedResources++
            if (this.loadedResources >= this.totalResources) {
                this.showLoading = false
            }
        }
    }

}
</script>

<style scoped lang="scss">
[data-mode=mobile] {
    .page {
        z-index: 0;
        background: linear-gradient(45deg, #fcc, #f9c);
        .stand {
            margin-top: 20px;
            display: flex;
            justify-content: center;
        }
        .cake {
            width: 100%;
            display: flex;
            //   margin-top: 25px;
            align-items: center;
            .gif {
                width: 70%;
            }
            .artFont {
                font-family: 'Arial', sans-serif;
                font-size: 50px;
                font-weight: bold;
                color: #ff69b4;
                text-shadow: 2px 2px 5px #ff1493, 4px 4px 5px #ff69b4, 6px 6px 5px #ffb6c1, 8px 8px 5px #ff1493;
                transform: rotate(-5deg);
                animation: shimmer 2s infinite;
                width: 55%;
                margin-left: 5%;
                height: 40%;
            }
        }
        .led-container {
            margin-top: 10px;
            display: flex;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 1);
            width: 100%;
        }
        .heart {
            margin-top: 20px;
        }
        .letter {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            width: 94%;
            height: auto;
            margin: 2px;
            padding: 35px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 16px;
            box-shadow: 2px 5px 10px #000;
            p {
                font-size: 18px;
                line-height: 1.6;
                color: #213547;
                margin: 10px 0;
            }
            span {
                font-size: 24px;
                font-weight: 700;
                top: 20px;
                right: 26px;
                opacity: 0.6;
            }
        }
    }
}
[data-mode=pc] {
    .page {
        z-index: 0;
        background: linear-gradient(45deg, #fcc, #f9c);
        .cake {
            width: 100%;
            display: flex;
            margin-top: 25px;
            align-items: center;
            .gif {
                width: 30%;
            }
            .artFont {
                font-family: 'Arial', sans-serif;
                font-size: 90px;
                font-weight: bold;
                color: #ff69b4;
                text-shadow: 2px 2px 0 #ff1493, 4px 4px 0 #ff69b4, 6px 6px 0 #ffb6c1, 8px 8px 0 #ff1493;
                transform: rotate(-5deg);
                animation: shimmer 2s infinite;
                width: 35%;
                margin-left: 5%;
                height: 40%;
                .stand {
                    transform: rotate(5deg);
                    -webkit-transform: rotate(5deg);
                    margin-top: 100px;
                }
            }
            .artFont:hover {
                text-shadow: 2px 2px 5px #ff1493, 4px 4px 5px #ff69b4, 6px 6px 5px #ffb6c1, 8px 8px 5px #ff1493;
            }
            .led-container {
                display: flex;
                box-shadow: 0 0 15px 0 rgba(0, 0, 0, 1);
                width: 35%;
            }
        }
        .left-heart {
            width: 40%;
            margin-left: 100px;
        }
        .right-mail {
            margin-top: 50px;
            margin-left: 100px;
            width: 60%;
        }
        .letter {
            position: absolute;
            top: 50%;
            left: 70%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            width: 450px;
            height: 720px;
            margin: 2px;
            padding: 35px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 16px;
            box-shadow: 2px 5px 10px #000;
            p {
                font-size: 18px;
                line-height: 1.6;
                color: #213547;
                margin: 10px 0;
            }
            span {
                font-size: 24px;
                font-weight: 700;
                top: 20px;
                right: 26px;
                opacity: 0.6;
            }
        }
    }
}
</style>
