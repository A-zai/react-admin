/* 
菜单界面的所有数据的数组
*/
const menuList =[
  {
    key:'/home',
    title:'首页',
    Icon: 'home'
  },
  {
    key: '/cp',
    title: '商品',
    Icon: 'appstore',
    children:[
      {
        key: '/category',
        title: '品类管理',
        Icon: 'bars',
      },
      {
        key: '/product',
        title: '商品管理',
        Icon: 'tool',
      }
    ]

  },
  {
    key: '/user',
    title: '用户管理',
    Icon: 'user'
  },
  {
    key: '/role',
    title: '角色管理',
    Icon: 'safety'
  },
  {
    key: '/charts',
    title: '图形图表',
    Icon: 'area-chart',
    children: [{
        key: '/charts/bar',
        title: '柱形图',
        Icon: 'bar-chart',
      },
      {
        key: '/charts/line',
        title: '折线图',
        Icon: 'line-chart',
      },
      {
        key: '/charts/pie',
        title: '饼图',
        Icon: 'pie-chart',
      }
    ]

  }

]
export default menuList