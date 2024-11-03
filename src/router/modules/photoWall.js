import Layout from '@/layout'
export default [
    {
        path: '/photoWall',
        component: Layout,
        redirect: '/photoWall/upload',
        name: 'photoWall',
        meta: {
            title: '照片墙',
            icon: 'camera'
        },
        children: [
            {
                path: 'upload',
                name: 'upload',
                component: () => import('@/views/photoWall/upload.vue'),
                meta: {
                    title: '上传图片',
                    icon: 'pic-upload',
                    auth: ['sys:pic']
                }
            },
            {
                path: 'show',
                name: 'show',
                component: () => import('@/views/photoWall/show.vue'),
                meta: {
                    title: '图片浏览',
                    icon: 'photo',
                    auth: ['sys:pic']
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
