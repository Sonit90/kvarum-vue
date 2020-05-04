// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'axios',
      'notify-defaults',
      'currencyFilter',
      'vuelidate',
      'yandexMap',
      'timeFilter',
      'CASL',
      'declOfNum',
      'Sentry',
      'portal',
      'webWorker'
    ],

    // css: [
    //   'app.styl'
    // ],
    // preFetch:true,

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
       'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      //'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      lang: 'ru', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QAvatar',
        'QFooter',
        'QSeparator',
        'QBtnDropdown',
        'QBreadcrumbs',
        'QBreadcrumbsEl',
        'QScrollArea',
        'QImg',
        'QSpace',
        'QForm',
        'QInput',
        'QCheckbox',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QSpinnerGears',
        'QSelect',
        'QOptionGroup',
        'QDate',
        'QTree',
        'QBtnGroup',
        'QSplitter',
        'QPopupEdit',
        'QEditor',
        'QSpinnerDots',
        'QPagination',
        'QMenu',
        'QRadio',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QBanner',
        'QBtnToggle',
        'QTooltip',
        'QChip',
        'QUploader',
        'QUploaderAddTrigger',
        'QKnob',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QRating',
        'QTabPanels',
        'QTabPanel',
        'QTabs',
        'QSpinner',
        'QTab',
        'QField',
        'QSlideTransition',
        'QToggle',
        'QDialog',
        'QExpansionItem',
        'QBadge',
        'QPageSticky',
        'QPageScroller',
        'QLinearProgress',
        'QInnerLoading'
      ],

      directives: [
        'GoBack',
        'Ripple',
        'ClosePopup',
        'TouchPan',
        'TouchSwipe'
      ],

      // Quasar plugins
      plugins: [
        'Notify',
        'LocalStorage',
        'Loading',
        'Meta',
        'Dialog'
      ]
    },

    supportIE: false,

    build: {
      env: ctx.dev
        ? { // so on dev we'll have
          API: JSON.stringify('http://api.kvarum.test/api/'),
          URL: JSON.stringify('http://api.kvarum.test/')
        }
        : { // and on build (production):
          API: JSON.stringify('https://test.kvarum.ru/api/'),
          URL: JSON.stringify('https://test.kvarum.ru/')

        },
      scopeHoisting: true,
      vueRouterMode: 'history',
       gzip: false,
       analyze: false,
      vueCompiler:true,
       extractCSS: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
      }
    },

    devServer: {
      // https: true,
      // port: 8080,
      proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        '/api': {
          target: 'http://api.kvarum.test',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://api.kvarum.test',
          changeOrigin: true,
        }
      },
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    // animations: [],
    animations: [
      'fadeIn',
      'fadeOut'
    ],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        name: '1Printax Ticket System',
        short_name: '1Printax Ticket System',
        description: '1Printax Ticket System',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'printax-vue'
      }
    }
  }
}
