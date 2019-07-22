
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '',
        component: () => import('pages/Index.vue'),
        meta: {
          breadcrumb: [
            {
              name: 'Главная'
            }
          ]
        } },
      { path: '/tickets/create', component: () => import('components/tickets/Create.vue') },
      { path: '/firms',
        component: () => import('components/Firms.vue'),
        meta: {
          breadcrumb: [
            {
              name: 'Фирмы',
              icon: 'business'
            }
          ]
        }
      }

    ]
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
