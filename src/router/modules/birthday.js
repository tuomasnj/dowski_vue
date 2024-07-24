import Layout from '@/layout'
export default [
    {
        path: '/others',
        component: Layout,
        redirect: '/others/birthday',
        name: 'others',
        meta: {
            title: '其他',
            icon: 'sidebar-menu'
        },
        children: [
            {
                path: '/birthday',
                name: 'birthday',
                component: () => import('@/views/others/birth.vue'),
                meta: {
                    title: '生日',
                    icon: 'birth',
                    auth: ['sys:birthday']
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
