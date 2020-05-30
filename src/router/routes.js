const routes = [
  {
    children: [
      { component: () => import('components/general/TosText.vue'),
        path: '/tos',
        meta: {
          breadcrumb: [
            { link: '/', name: 'Главная' },
            { name: 'Условия предоставления сервиса' }
          ]
        },
      },
      { component: () => import('pages/agent/Search.vue'),
        path: '/agents',
        meta: {
          breadcrumb: [
            { link: '/', name: 'Главная' },
            { name: 'Поиск агентов' }
          ]
        },
      },
      { component: () => import('components/calcs/Sberbank.vue'),
        path: '/calcs/sberbank',
        meta: {
          breadcrumb: [
            { link: '/', name: 'Главная' },
            { name: 'Ипотечный калькулятор Сбербанка' }
          ],
        },
      },


      { component: () => import('components/objects/Objects.vue'),
        meta: {
          breadcrumb: [
            {
              name: 'Поиск объектов'
            }
          ]
        },
        path: '' },
      {
        component: () => import('pages/profile/EditProfile.vue'),
        meta: {
          breadcrumb: [
            { link: '/', name: 'Главная' },
            { link: '/profile', name: 'Мой профиль' },
            { name: 'Редактирование профиля' }
          ],
          permissions:{ name: 'editOwn', target: 'profile', 'who':{ name: 'user_id', param: 'user_id' } }
        },
        path: '/profile/edit'
      },
      {
        component: () => import('pages/profile/Profile.vue'),
        meta: {
          breadcrumb: [
            { link: '/', name: 'Главная' },
            {  name: 'Мой профиль' }
          ],
          permissions:{ name: 'be', target: 'logged'}
        },
        path: '/profile/'
      },
      {
        component: () => import('pages/profile/ChangePassword.vue'),
        meta: {
          breadcrumb: [
            { link: '/', name: 'Главная' },
            { link: '/profile', name: 'Мой профиль' },
            { name: 'Сменить пароль' }

          ]
        },
        path: '/profile/change-password'
      },
      {
        component: () => import('pages/profile/Profile.vue'),
        meta: {
          breadcrumb: [
            { link: '/', name: 'Главная' }
          ]
        },
        path: '/profile/:id',
        props: true
      },

      {
        path: '/users',
        component: () => import('pages/admin/Users.vue'),
        meta: {
          breadcrumb: [
            {
              name: 'Управление пользователями'
            }
          ],
          permissions:{ name: 'admin', target: 'site'}
        }
      },
      // {
      //   path: '/roles',
      //   component: () => import('pages/admin/Roles.vue'),
      //   meta: {
      //     breadcrumb: [
      //       {
      //         name: 'Управление ролями'
      //       }
      //     ]
      //   }
      // },
      // {
      //   path: '/roles/edit/:name',
      //   props:true,
      //   name: 'editRole',
      //   component: () => import('pages/admin/EditRole.vue'),
      //   meta: {
      //     breadcrumb: [
      //       {
      //         name: 'Управление ролями',
      //         link: '/roles',
      //       },
      //       {
      //         name: 'Редактирование роли'
      //       }
      //     ]
      //   }
      // },
      {
        component: () => import('pages/objects/AddObject.vue'),
        meta: {
          breadcrumb: [
            {
              icon: 'business',
              link: '/',
              name: 'Объекты'
            },
            {
              name: 'Создать объект'
            }
          ],
          permissions:{ name: 'create', target: 'flat' }
        },
        path: '/objects/add',


      },
      {
        component: () => import('components/objects/flat/flatView.vue'),
        meta: {
          breadcrumb: [
            {
              icon: 'business',
              link: '/',
              name: 'Объекты'
            }
          ]
        },
        name: 'object',
        path: '/objects/:id',
        props: true
      },
      {
        component: () => import('pages/objects/EditObject.vue'),
        meta: {
          breadcrumb: [
            {
              icon: 'business',
              link: '/',
              name: 'Объекты'
            }
          ],
          permissions:{ name: 'be', target: 'logged'}
        },
        name: 'object-edit',
        path: '/objects/edit/:id',
        props: true
      },
      {
        component: () => import('pages/FilterPage.vue'),
        path: '/filters'
      },
      {
        component: () => import('pages/agencies/Agencies.vue'),
        meta: {
          breadcrumb: [
            {
              icon: 'business',
              link: '/agencies',
              name: 'Агентства недвижимости'
            }
          ]
        },
        name: 'agencies',
        path: '/agencies',
        props: true
      },
      {
        component: () => import('components/agencies/EditAgencies.vue'),
        meta: {
          breadcrumb: [
            {
              icon: 'business',
              link: '/agencies',
              name: 'Агентства недвижимости'
            }
          ],
          permissions:{ name: 'admin', target: 'site'}
        },
        name: 'agencies-edit',
        path: '/agencies/edit/:id?',
        props: true
      },
      {
        component: () => import('pages/agencies/Agency.vue'),
        meta: {
          breadcrumb: [
            {
              icon: 'business',
              link: '/agencies',
              name: 'Агентства недвижимости'
            }
          ]
        },
        name: 'agency',
        path: '/agency/:id',
        props: true
      },
      {
        component: () => import('pages/agencies/AgencyApplications.vue'),
        name: 'Agency Applications',
        path: '/agency-applications',
        meta: {
          breadcrumb: [
            {
              icon: 'remove_red_eye',
              name: 'Заявки в агентства'
            }
          ],
          permissions:{ name: 'manage', target: 'complaints'}
        }
      }
    ],
    component: () => import('layouts/MainLayout.vue'),
    path: '/'
  },
  {
    component: () => import('components/objects/flat/landingView.vue'),
    name: 'landing',
    path: '/landing/:id/:showProfile?',
    props: true
  },
  {
    component: () => import('pages/Registration/Login.vue'),
    path: '/login'
  },
  {
    component: () => import('pages/Registration/Register.vue'),
    path: '/register'
  },
  {
    component: () => import('pages/Registration/Confirm.vue'),
    name: 'confirm',
    path: '/confirm',
    props (route) {
      return route.query || {}
    }
  },
  {
    component: () => import('pages/Registration/ForgotPassword.vue'),
    path: '/forgot-password'
  },
  {
    component: () => import('pages/Registration/PasswordRecovery.vue'),
    path: '/recovery',
    props (route) {
      return route.query || {}
    }
  },
  {
    component: () => import('pages/Registration/Resend.vue'),
    name: 'resend',
    path: '/resend'
  }

]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    component: () => import('pages/Error404.vue'),
    path: '*'
  })
}

export default routes
