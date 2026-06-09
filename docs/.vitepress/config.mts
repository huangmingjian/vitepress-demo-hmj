import { defineConfig } from 'vitepress'
import { nav } from './relaConf'

export default defineConfig({
  title: 'huangmingjian_blog',
  description: '学习笔记与技术记录',
  base: '/vitepress-demo-hmj/',
  themeConfig: {
    nav,
    sidebar: {
      '/learning/': [
        {
          text: '学习笔记目录',
          items: [
            { text: '总目录', link: '/learning/' }
          ]
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
          text: 'VitePress 建站',
          items: [
            { text: '项目创建', link: '/linklocation/learn-vitepress.html' },
            { text: '导航栏配置', link: '/linklocation/navigationbar.html' },
            { text: '侧边栏配置', link: '/linklocation/sidebar.html' }
          ]
        },
        {
          text: '前端与浏览器能力',
          items: [
            { text: 'OffscreenCanvas 多线程优化', link: '/OffscreenCanvas渲染多线程优化.html' }
          ]
        },
        {
          text: '面试与架构',
          items: [
            { text: '面试 / 架构问答', link: '/linklocation/youhhua.html' }
          ]
        }
      ],
      '/linklocation/': [
        {
          text: 'VitePress 建站',
          items: [
            { text: '项目创建', link: '/linklocation/learn-vitepress.html' },
            { text: '导航栏配置', link: '/linklocation/navigationbar.html' },
            { text: '侧边栏配置', link: '/linklocation/sidebar.html' },
            { text: 'GitHub Pages 部署', link: '/linklocation/githubDeployment.html' }
          ]
        },
        {
          text: '后端与运维',
          items: [
            { text: 'Gateway 网关', link: '/linklocation/getway.html' },
            { text: 'Redis', link: '/linklocation/redis.html' },
            { text: 'Ubuntu / Docker / SSH', link: '/linklocation/ubuntu.html' },
            { text: '面试 / 架构问答', link: '/linklocation/youhhua.html' }
          ]
        }
      ],
      '/': [
        {
          text: '学习入口',
          items: [
            { text: '学习笔记目录', link: '/learning/' },
            { text: 'Gateway 网关', link: '/linklocation/getway.html' },
            { text: 'Nginx', link: '/nginx.html' },
            { text: 'MySQL', link: '/mysql.html' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
