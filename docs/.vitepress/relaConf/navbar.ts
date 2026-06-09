import { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
  {
    text: '首页',
    link: '/'
  },
  {
    text: '学习笔记',
    link: '/learning/'
  },
  {
    text: '后端与中间件',
    items: [
      { text: 'Gateway 网关', link: '/linklocation/getway.html' },
      { text: 'Redis', link: '/linklocation/redis.html' },
      { text: 'MySQL', link: '/mysql.html' }
    ]
  },
  {
    text: '运维与部署',
    items: [
      { text: 'Nginx', link: '/nginx.html' },
      { text: 'Ubuntu / Docker / SSH', link: '/linklocation/ubuntu.html' },
      { text: 'GitHub Pages 部署', link: '/linklocation/githubDeployment.html' }
    ]
  },
  {
    text: 'VitePress',
    items: [
      { text: '项目创建', link: '/linklocation/learn-vitepress.html' },
      { text: '导航栏配置', link: '/linklocation/navigationbar.html' },
      { text: '侧边栏配置', link: '/linklocation/sidebar.html' }
    ]
  }
]
