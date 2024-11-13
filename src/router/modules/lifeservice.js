import Layout from '@/layout'
export default [
    {
        path: '/lifeservice',
        component: Layout,
        name: 'lifeservice',
        redirect: '/lifeservice/index',
        meta: {
            title: '生活服务',
            icon: 'life'
        },
        children: [
            {
                path: 'index',
                name: 'index',
                component: () => import('@/views/lifeservice/index.vue'),
                sidebar: false,
                breadcrumb: false,
                meta: {
                    title: '天气预览',
                    icon: 'weather'
                }
            }
        ]
    }
]
