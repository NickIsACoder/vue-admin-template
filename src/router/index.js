import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/welcome',
    children: [
      {
        path: 'welcome',
        component: () => import('@/views/welcome/index'),
        name: '首页',
        meta: { title: '首页', icon: 'nested', affix: true }
      }
    ]
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: () => import('@/views/dashboard/index'),
    //     name: 'Dashboard',
    //     meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
    //   }
    // ]
  },
  {
    path: '/persioninfo',
    component: Layout,
    redirect: '/persioninfo/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/personinfo/index'),
        name: 'persioninfo',
        meta: { title: '个人信息', icon: 'nested', affix: true }
      }
    ]
  },
  {
    path: '/modifyPass',
    component: Layout,
    redirect: '/modifyPass/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/personinfo/modifyPass/index'),
        name: 'modifyPass',
        meta: { title: '修改密码', icon: 'nested', affix: true }
      }
    ]
  }
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/role',
    alwaysShow: true, // will always show the root menu
    name: '权限管理',
    title: '权限管理',
    meta: {
      title: '权限管理',
      icon: 'lock',
      roles: ['admin'] // you can set roles in root nav
    },
    children: [
      {
        path: '/permission/resources',
        component: () => import('@/views/permission/resources'),
        name: '资源管理',
        meta: {
          title: '资源管理',
          roles: ['admin']
        }
      },
      {
        path: '/permission/role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '角色管理',
          roles: ['admin']
        }
      },
      {
        path: '/permission/distinct',
        component: () => import('@/views/permission/distinct'),
        name: '区域管理',
        meta: {
          title: '区域管理',
          roles: ['admin']
        }
      },
      {
        path: '/permission/organ',
        component: () => import('@/views/permission/organ'),
        name: '机构管理',
        meta: {
          title: '机构管理',
          roles: ['admin']
        }
      },
      {
        path: '/permission/userManager',
        component: () => import('@/views/permission/userManager'),
        name: '用户管理',
        meta: {
          title: '用户管理',
          roles: ['admin']
        }
      }
    ]
  },
  {
    path: '/policy',
    component: Layout,
    redirect: '/policy/policyList',
    name: '内容管理',
    meta: {
      title: '内容管理',
      icon: 'example'
    },
    children: [
      {
        path: '/policy/policyList',
        component: () => import('@/views/policy/policyList'),
        name: '政策管理',
        meta: { title: '政策管理' }
      },
      {
        path: '/policy/policyEdit',
        component: () => import('@/views/policy/policyEdit'),
        name: '政策',
        meta: { title: '政策' }
      },
      {
        path: '/policy/newsList',
        component: () => import('@/views/policy/newsList'),
        name: '公告管理',
        meta: { title: '公告管理' }
      },
      {
        path: '/policy/newsEdit',
        component: () => import('@/views/policy/newsEdit'),
        name: 'newsEdit', // 由于公告修改的跳转路由不一样，因此这里改为 路由name
        meta: { title: '公告' }
      },
      {
        path: '/policy/carouselList',
        component: () => import('@/views/policy/carouselList'),
        name: '轮播图管理',
        meta: { title: '轮播图管理' }
      }
    ]
  },
  {
    path: '/jobFair',
    component: Layout,
    redirect: '/jobFair/jobFairList',
    name: '招聘会',
    meta: {
      title: '招聘会管理',
      icon: 'component'
    },
    children: [
      {
        path: '/jobFair/jobFairList',
        component: () => import('@/views/jobFair/jobFairList'),
        name: '招聘会列表',
        meta: { title: '招聘会列表' }
      },
      {
        path: '/jobFair/jobFairEdit',
        component: () => import('@/views/jobFair/jobFairEdit'),
        name: '招聘会',
        hidden: true,
        meta: { title: '招聘会' }
      },
      {
        path: '/jobFair/jobFairDetail',
        component: () => import('@/views/jobFair/jobFairDetail'),
        name: '招聘会详情',
        hidden: true,
        meta: { title: '招聘会详情' }
      },
      {
        path: '/jobFair/boothList',
        component: () => import('@/views/jobFair/boothList'),
        name: '展位列表',

        meta: { title: '展位列表' }
      },
      {
        path: '/jobFair/boothManage',
        component: () => import('@/views/jobFair/boothManage'),
        name: '现场展位管理',
        hidden: true,
        meta: { title: '现场展位管理' }
      },
      {
        path: '/jobFair/padList',
        component: () => import('@/views/jobFair/padList'),
        name: 'pad设备管理',
        hidden: true,
        meta: { title: 'pad设备管理' }
      }
    ]
  },
  {
    path: '/company',
    component: Layout,
    redirect: '/company/companyList',
    name: '企业管理',
    meta: {
      title: '企业管理',
      icon: 'guide'
    },
    children: [
      {
        path: '/company/companyList',
        component: () => import('@/views/company/companyList'),
        name: '企业列表',
        meta: { title: '企业列表', icon: 'list' }
      },
      {
        path: '/company/companyEdit',
        component: () => import('@/views/company/companyEdit'),
        name: '企业信息',
        hidden: true,
        meta: { title: '企业信息', icon: 'edit' }
      },
      {
        path: '/company/entDetail',
        component: () => import('@/views/company/entDetail'),
        name: '企业详情',
        hidden: true,
        meta: { title: '企业详情', icon: 'edit' }
      },
      {
        path: '/company/entVerify',
        component: () => import('@/views/company/entVerify'),
        name: '企业审核',
        meta: { title: '企业审核', icon: 'edit' }
      },
      {
        path: '/company/positionDetail',
        component: () => import('@/views/company/positionDetail'),
        name: '职位详情',
        hidden: true,
        meta: { title: '职位详情' }
      },
      {
        path: '/company/accountUnbind',
        component: () => import('@/views/company/accountUnbind'),
        name: '帐号解绑',
        meta: { title: '帐号解绑', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/monitorList',
    name: '援企稳岗大数据',
    meta: {
      title: '援企稳岗大数据',
      icon: 'guide'
    },
    children: [
      {
        path: '/monitor/monitorList',
        component: () => import('@/views/monitor/monitorList'),
        name: '大屏数据管理',
        meta: { title: '大屏数据管理', icon: 'list' }
      },
      {
        path: '/monitor/monitorEdit',
        component: () => import('@/views/monitor/monitorEdit'),
        name: '大屏数据编辑',
        hidden: true,
        meta: { title: '大屏数据编辑', icon: 'edit' }
      }
    ]
  },
  {
    path: '/support',
    component: Layout,
    redirect: '/support/supportList',
    name: '援企稳岗',
    meta: {
      title: '援企稳岗',
      icon: 'guide'
    },
    children: [
      {
        path: '/support/supportList',
        component: () => import('@/views/support/supportList'),
        name: '采集信息管理',
        meta: { title: '采集信息管理', icon: 'list' }
      },
      {
        path: '/support/resumptionList',
        component: () => import('@/views/support/resumptionList'),
        name: '企业复工',
        meta: { title: '企业复工', icon: 'list' }
      },
      {
        path: '/support/employList',
        component: () => import('@/views/support/employList'),
        name: '企业招聘',
        meta: { title: '企业招聘', icon: 'list' }
      },
      {
        path: '/support/personalJobList',
        component: () => import('@/views/support/personalJobList'),
        name: '个人求职',
        meta: { title: '个人求职', icon: 'list' }
      }
    ]
  },
  {
    path: '/jobSeeker',
    component: Layout,
    redirect: '/jobSeeker/seekerList',
    name: '求职者信息管理',
    meta: {
      title: '求职者信息管理',
      icon: 'excel'
    },
    children: [
      {
        path: '/jobSeeker/seekerList',
        component: () => import('@/views/jobSeeker/seekerList'),
        name: '求职者信息管理',
        meta: { title: '求职者信息管理' }
      },
      {
        path: '/jobSeeker/seekerEdit',
        component: () => import('@/views/jobSeeker/seekerEdit'),
        name: '求职者信息',
        hidden: true,
        meta: { title: '求职者信息' }
      },
      {
        path: '/jobSeeker/seekerDetail',
        component: () => import('@/views/jobSeeker/seekerDetail'),
        name: '求职者信息详情',
        hidden: true,
        meta: { title: '求职者信息详情' }
      }
    ]
  },
  {
    path: '/graduate',
    component: Layout,
    redirect: '/graduate/infoList',
    name: '高校毕业生报到管理',
    meta: {
      title: '高校毕业生报到管理',
      icon: 'clipboard'
    },
    children: [
      {
        path: '/graduate/infoList',
        component: () => import('@/views/graduate/infoList'),
        name: '毕业生报到情况列表',
        meta: { title: '毕业生报到情况列表' }
      },
      {
        path: '/graduate/graduateVeritfy',
        component: () => import('@/views/graduate/graduateVeritfy'),
        name: '毕业生报到审核',
        meta: { title: '毕业生报到审核' }
      },
      {
        path: '/graduate/fileList',
        component: () => import('@/views/graduate/fileList'),
        name: '毕业生档案查询',
        meta: { title: '毕业生档案查询' }
      }
    ]
  },
  {
    path: '/app',
    component: Layout,
    redirect: '/app/appList',
    name: '援企稳岗应用管理',
    meta: {
      title: '援企稳岗应用管理',
      icon: 'tab'
    },
    children: [
      {
        path: '/app/appList',
        component: () => import('@/views/app/appList'),
        name: '应用管理',
        meta: { title: '应用管理' }
      },
      {
        path: '/app/collectList',
        component: () => import('@/views/app/collectList'),
        name: '采集信息配置管理',
        meta: { title: '采集信息配置管理' }
      },
      {
        path: '/app/addForm/:survey?',
        component: () => import('@/views/app/addForm'),
        name: '采集表',
        hidden: true,
        meta: { title: '采集表' }
      },
      {
        path: '/app/surveyModule',
        component: () => import('@/views/app/surveyModule'),
        name: '采集表模板',
        hidden: true,
        meta: { title: '采集表模板' }
      },
      {
        path: '/app/preview',
        component: () => import('@/views/app/preview'),
        name: '采集表预览',
        meta: { title: '采集表预览' }
      }
    ]
  },
  {
    path: '/operation',
    forTest: true,
    component: Layout,
    redirect: '/operation/importRecord',
    name: '运维管理',
    meta: {
      title: '运维管理',
      icon: 'component'
    },
    children: [
      {
        path: '/operation/importRecord',
        component: () => import('@/views/operation/importRecord'),
        name: '数据导入记录',
        meta: { title: '数据导入记录' }
      }
    ]
  },
  {
    path: '/bengbu',
    component: Layout,
    redirect: '/bengbu/bengbuSupport',
    name: '蚌埠援企稳岗',
    meta: {
      title: '蚌埠援企稳岗',
      icon: 'tab'
    },
    children: [
      {
        path: '/bengbu/bengbuSupport',
        component: () => import('@/views/bengbu/bengbuSupport'),
        name: '蚌埠援企稳岗',
        meta: { title: '蚌埠援企稳岗' }
      }
    ]
  },
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/yth',
  //   component: Layout,
  //   name: '自助发卡一体化',
  //   children: [
  //     {
  //       path: 'http://192.168.1.71:82/#/login',
  //       meta: { title: '自助发卡一体化', icon: 'link' }
  //     }
  //   ]
  // },
  // {
  //   path: '/dyhmhn',
  //   component: Layout,
  //   name: '德阳惠民惠农',
  //   children: [
  //     {
  //       path: 'http://192.168.1.106:82/#/login',
  //       meta: { title: '德阳惠民惠农', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
