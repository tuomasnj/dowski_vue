import Layout from '@/layout'
export default [
    {
        path: '/calendar',
        component: Layout,
        redirect: '/calendar/page',
        name: 'calendar',
        meta: {
            title: '备忘录',
            icon: 'sidebar-menu'
        },
        children: [
            {
                path: 'page',
                name: 'calendarHome',
                component: () => import('@/views/calendar/index.vue'),
                meta: {
                    title: '首页'
                }
            },
            {
                path: 'calendarWish',
                name: '',
                component: () => import('@/views/calendar/index.vue'),
                meta: {
                    title: '愿望单'
                }
            }
        ]
    }
]
