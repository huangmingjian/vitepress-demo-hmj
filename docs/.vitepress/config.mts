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
        base: '/vitepress-demo-hmj/',
        sidebar: {
          '/linklocation/': [
            {
              text: 'vitepress',
              items: [
                { text: '项目创建', link: '/linklocation/learn-vitepress' },
                { text: '导航栏配置', link: '/linklocation/navigationbar' },
                { text: '侧边栏配置', link: '/linklocation/sidebar' }
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

