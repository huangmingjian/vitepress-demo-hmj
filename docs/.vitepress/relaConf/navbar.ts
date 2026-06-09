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
      { text: 'Gateway 网关', link: '/linklocation/getway' },
      { text: 'Redis', link: '/linklocation/redis' },
      { text: 'MySQL', link: '/mysql' }
    ]
  },
  {
    text: '运维与部署',
    items: [
      { text: 'Nginx', link: '/nginx' },
      { text: 'Ubuntu / Docker / SSH', link: '/linklocation/ubuntu' },
      { text: 'GitHub Pages 部署', link: '/linklocation/githubDeployment' }
    ]
  },
  {
    text: 'VitePress',
    items: [
      { text: '项目创建', link: '/linklocation/learn-vitepress' },
      { text: '导航栏配置', link: '/linklocation/navigationbar' },
      { text: '侧边栏配置', link: '/linklocation/sidebar' }
    ]
  }
]
