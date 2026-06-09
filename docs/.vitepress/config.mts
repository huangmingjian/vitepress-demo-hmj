import { defineConfig } from 'vitepress'
import { nav } from './relaConf'

export default defineConfig({

  title: "huangmingjian_blog",
  description: "unknow",
  themeConfig: {
        nav: nav,
        // sidebar: [
        //   {
        //     text: 'Examples',
        //     items: [
        //       { text: 'Markdown Examples', link: '/markdown-examples' },
        //       { text: 'Runtime API Examples', link: '/api-examples' }
        //     ]
        //   }
        // ],
        sidebar: {
          '/linklocation/': [
            {
              text: '学习笔记',
              items: [
                { text: 'VitePress-项目创建', link: '/linklocation/learn-vitepress' },
                { text: 'VitePress-导航栏配置', link: '/linklocation/navigationbar' },
                { text: 'VitePress-侧边栏配置', link: '/linklocation/sidebar' },
                { text: 'VitePress-gitHub部署', link: '/linklocation/githubDeployment' },
                { text: 'Ubuntu 运维 / Docker / SSH', link: '/linklocation/ubuntu' },
                { text: 'Redis 命令与概念', link: '/linklocation/redis' },
                { text: '面试 / 架构问答', link: '/linklocation/youhhua' }
              ]
            }
          ],
          '/learning/': [
            {
              text: '学习记录',
              items: [
                { text: '目录', link: '/learning/' },
                { text: 'VitePress-项目创建', link: '/linklocation/learn-vitepress' },
                { text: 'Ubuntu 运维 / Docker / SSH', link: '/linklocation/ubuntu' },
                { text: 'Redis 命令与概念', link: '/linklocation/redis' },
                { text: 'MySQL SQL 语句整理', link: '/mysql' },
                { text: 'OffscreenCanvas 渲染多线程优化', link: '/OffscreenCanvas渲染多线程优化.html' },
                { text: '面试 / 架构问答', link: '/linklocation/youhhua' }
              ]
            }
          ],
          '/config/': [
            {
              text: 'Examples',
              items: [
                { text: 'Index', link: '/config/' },
                { text: 'Three', link: '/config/three' },
                { text: 'Four', link: '/config/four' }
              ]
            }
          ]
        },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  base: '/vitepress-demo-hmj/',
})

