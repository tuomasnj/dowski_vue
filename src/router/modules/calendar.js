import Layout from '@/layout'
export default [
    {
        path: '/calendar',
        component: Layout,
        redirect: '/calendar/page',
        name: 'calendar',
        meta: {
            title: '备忘录',
            icon: 'sidebar-keep-alive'
        },
        children: [
            {
                path: 'page',
                name: 'calendarHome',
                component: () => import('@/views/calendar/index.vue'),
                meta: {
                    title: '重要事项',
                    icon: 'menu',
                    auth: ['sys:memo']
                }
            }
            // {
            //     path: 'calendarWish',
            //     name: '',
            //     component: () => import('@/views/calendar/calendarWish.vue'),
            //     meta: {
            //         title: '愿望单'
            //     }
            // }
        ]
    }
]
