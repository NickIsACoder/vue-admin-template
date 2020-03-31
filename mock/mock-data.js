const mockData = {
  resList: [{
    id: '101',
    name: '系统管理',
    des: '系统管理模块',
    url: '/permission',
    type: '菜单',
    children: [
      {
        id: '10101',
        parentId: '101',
        name: '资源管理',
        des: '系统资源管理模块',
        url: '/permission/resources',
        type: '功能'
      }, {
        id: '10102',
        parentId: '101',
        name: '角色管理',
        des: '系统角色管理模块',
        url: '/permission/role',
        type: '功能'

      }, {
        id: '10103',
        parentId: '101',
        name: '用户管理',
        des: '用户权限管理模块',
        url: '/permission/userManager',
        type: '功能'
      }
    ]
  }, {
    id: '102',
    name: '人力资源管理',
    des: '跳转人力资源管理系统',
    url: '/rlzugl',
    type: '菜单',
    children: []
  }, {
    id: '103',
    name: '芜湖便民宝',
    des: '跳转芜湖便民宝系统',
    url: '/bmb',
    type: '菜单',
    children: []
  }, {
    id: '104',
    name: '西藏卡务',
    des: '跳转西藏卡务系统',
    url: '/xzCard',
    type: '菜单',
    children: []
  }, {
    id: '105',
    name: '自助发卡一体化',
    des: '跳转自助发卡一体化',
    url: '/yth',
    type: '菜单',
    children: []
  }, {
    id: '106',
    name: '德阳惠民惠农',
    des: '跳转自德阳惠民惠农系统',
    url: '/dyhmhn',
    type: '菜单',
    children: []
  }

  ]

}

export default mockData
