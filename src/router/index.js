import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style

Vue.use(VueRouter)

import Layout from '@/layout'
import EmptyLayout from '@/layout/empty'

const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/views/index'),
                meta: {
                    title: store.state.settings.dashboardTitle
                }
            },
            {
                path: 'personal',
                component: EmptyLayout,
                redirect: '/personal/setting',
                meta: {
                    title: '个人中心',
                    breadcrumb: false
                },
                children: [
                    {
                        path: 'setting',
                        name: 'personalSetting',
                        component: () => import('@/views/personal/setting'),
                        meta: {
                            title: '个人设置'
                        }
                    },
                    {
                        path: 'edit/password',
                        name: 'personalEditPassword',
                        component: () => import('@/views/personal/edit.password'),
                        meta: {
                            title: '修改密码'
                        }
                    }
                ]
            },
            {
                path: 'reload',
                name: 'reload',
                component: () => import('@/views/reload')
            }
        ]
    }
]

// import MultilevelMenuExample from './modules/multilevel.menu.example'
// import BreadcrumbExample from './modules/breadcrumb.example'
// import KeepAliveExample from './modules/keep.alive.example'
// import ComponentBasicExample from './modules/component.basic.example'
// import ComponentExtendExample from './modules/component.extend.example'
// import PermissionExample from './modules/permission.example'
// import MockExample from './modules/mock.example'
// import VideosExample from './modules/videos.example'
// import ExTernalLinkExample from './modules/external.link.example'
// import EcologyExample from './modules/ecology.example'
// import CooperationExample from './modules/cooperation.example.js'
import CalendarRouter from './modules/calendar.js'
import Others from './modules/birthday.js'
import photoWall from './modules/photoWall.js'
import lifeservice from './modules/lifeservice.js'

// 当 children 不为空的主导航只有一项时，则隐藏
let asyncRoutes = [
    // {
    //     meta: {
    //         title: '演示',
    //         icon: 'sidebar-default'
    //     },
    //     children: [
    //         MultilevelMenuExample,
    //         BreadcrumbExample,
    //         KeepAliveExample,
    //         ComponentBasicExample,
    //         ComponentExtendExample,
    //         PermissionExample,
    //         MockExample,
    //         ExTernalLinkExample
    //     ]
    // },
    // {
    //     meta: {
    //         title: '教程',
    //         icon: 'sidebar-videos'
    //     },
    //     children: [
    //         ...VideosExample
    //     ]
    // },
    // {
    //     meta: {
    //         title: '生态',
    //         icon: 'sidebar-ecology'
    //     },
    //     children: [
    //         ...EcologyExample
    //     ]
    // },
    // {
    //     meta: {
    //         title: '战略合作',
    //         icon: 'sidebar-cooperation'
    //     },
    //     children: [
    //         ...CooperationExample
    //     ]
    // },
    {
        children: [
            ...CalendarRouter,
            ...Others,
            ...photoWall,
            ...lifeservice
        ]
    }
]

const lastRoute = [{
    path: '*',
    component: () => import('@/views/404'),
    meta: {
        title: '404',
        sidebar: false
    }
}]

const router = new VueRouter({
    mode: 'hash',
    routes: constantRoutes
})

// 解决路由在 push/replace 了相同地址报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}

router.beforeEach(async(to, from, next) => {
    store.state.settings.enableProgress && NProgress.start()
    // 已经登录，但还没根据权限动态挂载路由
    // alert(store.state.menu.isGenerate)
    if (localStorage.getItem('token') && !store.state.menu.isGenerate) {
        /**
         * 重置 matcher
         * https://blog.csdn.net/baidu_28647571/article/details/101711682
         */
        router.matcher = new VueRouter({
            routes: constantRoutes
        }).matcher
        const accessRoutes = await store.dispatch('menu/generateRoutes', {
            asyncRoutes,
            currentPath: to.path
        })
        accessRoutes.push(...lastRoute)
        accessRoutes.forEach(route => {
            router.addRoute(route)
        })
        next({ ...to, replace: true })
    }
    if (store.state.menu.isGenerate) {
        store.commit('menu/setHeaderActived', to.path)
    }
    to.meta.title && store.commit('settings/setTitle', to.meta.title)
    if (localStorage.getItem('token')) {
        if (to.name) {
            if (to.matched.length !== 0) {
                // 登陆状态禁止用户通过url进入登录界面
                if (from.path == '/calendar/page') {
                    NProgress.done()
                    next(false)
                }
                if (to.name == 'login') {
                    next({
                        name: 'calendar',
                        replace: true
                    })
                } else if (!store.state.settings.enableDashboard && to.name == 'dashboard') {
                    // 如果未开启控制台页面，则默认进入侧边栏导航第一个模块，但如果侧边栏导航没有模块，则还是进入控制台页面
                    if (store.getters['menu/sidebarRoutes'].length > 0) {
                        next({
                            name: store.getters['menu/sidebarRoutes'][0].name,
                            replace: true
                        })
                    }
                }
            } else {
                // 如果是通过 name 跳转，并且 name 对应的路由没有权限时，需要做这步处理，手动指向到 404 页面
                next({
                    path: '/404'
                })
            }
        }
    } else {
        if (to.name != 'login') {
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    }
    next()
})

router.afterEach(() => {
    store.state.settings.enableProgress && NProgress.done()
})

export default router
