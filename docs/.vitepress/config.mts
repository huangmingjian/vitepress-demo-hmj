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
          text: 'VitePress 建站',
          items: [
            { text: '项目创建', link: '/linklocation/learn-vitepress' },
            { text: '导航栏配置', link: '/linklocation/navigationbar' },
            { text: '侧边栏配置', link: '/linklocation/sidebar' }
          ]
        },
        {
          text: '前端与浏览器能力',
          items: [
            { text: 'OffscreenCanvas 多线程优化', link: '/OffscreenCanvas渲染多线程优化' }
          ]
        },
        {
          text: '面试与架构',
          items: [
            { text: '面试 / 架构问答', link: '/linklocation/youhhua' }
          ]
        }
      ],
      '/linklocation/': [
        {
          text: 'VitePress 建站',
          items: [
            { text: '项目创建', link: '/linklocation/learn-vitepress' },
            { text: '导航栏配置', link: '/linklocation/navigationbar' },
            { text: '侧边栏配置', link: '/linklocation/sidebar' },
            { text: 'GitHub Pages 部署', link: '/linklocation/githubDeployment' }
          ]
        },
        {
          text: '后端与运维',
          items: [
            { text: 'Gateway 网关', link: '/linklocation/getway' },
            { text: 'Redis', link: '/linklocation/redis' },
            { text: 'Ubuntu / Docker / SSH', link: '/linklocation/ubuntu' },
            { text: '面试 / 架构问答', link: '/linklocation/youhhua' }
          ]
        }
      ],
      '/': [
        {
          text: '学习入口',
          items: [
            { text: '学习笔记目录', link: '/learning/' },
            { text: 'Gateway 网关', link: '/linklocation/getway' },
            { text: 'Nginx', link: '/nginx' },
            { text: 'MySQL', link: '/mysql' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
