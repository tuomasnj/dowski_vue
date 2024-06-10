<template>
    <div>
        <div class="bg-banner" />
        <div id="login-box">
            <div class="login-banner" />
            <el-form ref="form" :model="form" :rules="rules" class="login-form" auto-complete="on" label-position="left">
                <div class="title-container">
                    <h3 class="title">{{ title }}管理后台</h3>
                </div>
                <div>
                    <el-form-item prop="account">
                        <el-input ref="name" v-model="form.account" placeholder="用户名" type="text" tabindex="1" auto-complete="on">
                            <svg-icon slot="prefix" name="user" />
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password" style="margin-bottom: 0;">
                        <el-input ref="password" v-model="form.password" :type="passwordType" placeholder="密码" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin">
                            <svg-icon slot="prefix" name="password" />
                            <svg-icon slot="suffix" :name="passwordType === 'password' ? 'eye' : 'eye-open'" @click="showPassword" />
                        </el-input>
                    </el-form-item>
                </div>
                <el-checkbox v-model="form.remember">记住我</el-checkbox>
                <el-button :loading="loading" type="primary" style="width: 100%; white-space: pre-wrap;" @click="handleLogin">登&nbsp;&nbsp;&nbsp;录</el-button>
                <!-- <div style="margin-top: 20px; margin-bottom: -10px; color: #666; font-size: 14px; text-align: center; font-weight: bold;">
                    <span style="margin-right: 5px;">演示帐号一键登录：</span>
                    <el-button type="danger" size="mini" @click="testAccount('admin')">admin</el-button>
                    <el-button type="danger" size="mini" plain @click="testAccount('test')">test</el-button>
                </div> -->
            </el-form>
        </div>
        <Copyright v-if="$store.state.settings.showCopyright" />
    </div>
</template>

<script>
import { userLogin } from '@/api/login'
import router from '@/router/index'

export default {
    name: 'Login',
    data() {
        return {
            title: process.env.VUE_APP_TITLE,
            form: {
                account: '',
                password: '',
                remember: false
            },
            rules: {
                account: [
                    { required: true, trigger: 'blur', message: '请输入用户名' }
                ],
                password: [
                    { required: true, trigger: 'blur', message: '请输入密码' },
                    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' }
                ]
            },
            loading: false,
            passwordType: 'password'
        }
    },

    mounted() {
        if (localStorage.getItem('remember_pass') && localStorage.getItem('remember_account')) {
            this.form.account = localStorage.getItem('remember_account')
            this.form.password = localStorage.getItem('remember_pass')
        }
    },
    methods: {
        showPassword() {
            this.passwordType = this.passwordType === 'password' ? '' : 'password'
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        handleLogin() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.loading = true
                    let data = {
                        userName: this.form.account,
                        password: this.form.password
                    }
                    userLogin(data).then(res => {
                        this.loading = false
                        if (res.code == 200) {
                            router.push({ path: '/calendar' })
                            if (this.form.remember) {
                                localStorage.setItem('remember_account', this.form.account)
                                localStorage.setItem('remember_pass', this.form.password)
                            }
                            this.$message({
                                message: '登陆成功',
                                type: 'success'
                            })
                            this.$store.commit('user/setUserData', {
                                account: this.form.account,
                                token: localStorage.getItem('token'),
                                failure_time: ''
                            })
                        } else {
                            this.$message({
                                message: '用户名或密码错误',
                                type: 'error'
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                        this.loading = false
                        this.$message.error('网络异常')
                    })
                }
            })
        },
        testAccount(account) {
            this.form.account = account
            this.form.password = '123456'
            this.handleLogin()
        }
    }
}
</script>

<style lang="scss" scoped>
[data-mode=mobile] {
    #login-box {
        max-width: 80%;
        .login-banner {
            display: none;
        }
    }
}
::v-deep input[type=password]::-ms-reveal {
    display: none;
}
.bg-banner {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-image: url(../assets/images/login-bg1.jpg);
    background-size: cover;
    background-position: center center;
}
#login-box {
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 5px #999;
    .login-banner {
        width: 300px;
        background-image: url(../assets/images/login-banner1.jpg);
        opacity: 0.9;
        background-size: cover;
        background-position: center center;
    }
    .login-form {
        width: 450px;
        padding: 50px 35px 30px;
        overflow: hidden;
        .svg-icon {
            vertical-align: -0.35em;
        }
        .title-container {
            position: relative;
            .title {
                font-size: 22px;
                color: #666;
                margin: 0 auto 30px;
                text-align: center;
                font-weight: bold;
                @include text-overflow;
            }
        }
    }
    ::v-deep .el-input {
        display: inline-block;
        height: 48px;
        width: 100%;
        input {
            height: 48px;
        }
        .el-input__prefix {
            left: 10px;
        }
        .el-input__suffix {
            right: 10px;
        }
    }
    .el-checkbox {
        margin: 20px 0;
    }
}
.copyright {
    position: absolute;
    bottom: 30px;
    width: 100%;
    margin: 0;
    mix-blend-mode: difference;
}
</style>
