import { DefaultTheme } from "vitepress";
export const nav: DefaultTheme.NavItem[] = [
    { 
      text: '首页',
      link: '/'
    },
    {
        text:'个人学习',
        items:[
            { text: 'cesium', link: '/linklocation/learn-vitepress' },
            { text: '@jodvf/cesium-3d', link: '/frontend/' },
            { text: 'node.js', link: '/frontend/' },
            { text: 'tailwindcss', link: '/frontend/' },
            { text:'joplayer.js',link:'/frontend/'},
            { text: 'vitepress', link: '/linklocation/learn-vitepress' }
        ]
    },{
        text:'公司学习',
        items:[
            { text: '产品谱系', link: '/frontend/' },
            { text: '组织架构', link: '/frontend/' },
            { text: '业务领域', link: '/frontend/' },
            { text: '技术优势', link: '/frontend/' }
        ]
    }
]