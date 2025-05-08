import{_ as a,c as n,o as i,ae as e}from"./chunks/framework.Dh1jimFm.js";const l="/assets/title.D5YOy4ZJ.jpg",t="/assets/bar.I__SEGye.jpg",g=JSON.parse('{"title":"导航栏配置","description":"","frontmatter":{},"headers":[],"relativePath":"linklocation/navigationbar.md","filePath":"linklocation/navigationbar.md"}'),p={name:"linklocation/navigationbar.md"};function E(h,s,k,r,o,d){return i(),n("div",null,s[0]||(s[0]=[e('<h1 id="导航栏配置" tabindex="-1">导航栏配置 <a class="header-anchor" href="#导航栏配置" aria-label="Permalink to &quot;导航栏配置&quot;">​</a></h1><h2 id="_1-1、导航左侧" tabindex="-1">1.1、导航左侧 <a class="header-anchor" href="#_1-1、导航左侧" aria-label="Permalink to &quot;1.1、导航左侧&quot;">​</a></h2><p>需要配置 config.mts 文件下的title，如下代码所示: <img src="'+l+`" style="zoom:50%;"></p><h2 id="_1-2、右上角-导航内容自定义" tabindex="-1">1.2、右上角-导航内容自定义 <a class="header-anchor" href="#_1-2、右上角-导航内容自定义" aria-label="Permalink to &quot;1.2、右上角-导航内容自定义&quot;">​</a></h2><p>首先先确定nav在docs/.vitepress/config.ts文件的位置，具体如下:</p><div class="language-md vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">export default defineConfig({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    themeConfig: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        nav: [] // 这里传入一个数组，将相关的导航栏信息传递进来</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p>位置有了，接下来我们来定义navbar的内容。具体代码如下：</p><div class="language-md vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// docs/.vitepress/relaConf/index.ts 配置内容较多，单独起个文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">export * from &#39;./navbar&#39;;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// docs/.vitepress/relaConf/navbar.ts</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { DefaultTheme } from &quot;vitepress&quot;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">export const nav: DefaultTheme.NavItem[] = [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    { </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      text: &#39;首页&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      link: &#39;/&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        text:&#39;个人学习&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        items:[</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;cesium&#39;, link: &#39;../linklocation/learn-vitepress&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;@jodvf/cesium-3d&#39;, link: &#39;/frontend/&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;node.js&#39;, link: &#39;/frontend/&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;tailwindcss&#39;, link: &#39;/frontend/&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text:&#39;joplayer.js&#39;,link:&#39;/frontend/&#39;},</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;vitepress&#39;, link: &#39;../linklocation/learn-vitepress&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    },{</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        text:&#39;公司学习&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        items:[</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;产品谱系&#39;, link: &#39;/frontend/&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;组织架构&#39;, link: &#39;/frontend/&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;业务领域&#39;, link: &#39;/frontend/&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;技术优势&#39;, link: &#39;/frontend/&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">// 在config.mts中引用</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { defineConfig } from &#39;vitepress&#39;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">import { nav } from &#39;./relaConf&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">export default defineConfig({</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  title: &quot;huangmingjian_blog&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  description: &quot;unknow&quot;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  themeConfig: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    nav: nav,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    socialLinks: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      { icon: &#39;github&#39;, link: &#39;https://github.com/vuejs/vitepress&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">})</span></span></code></pre></div><p>到这里，我们就完成了navbar的美化。具体来看下效果: <img src="`+t+'" style="zoom:50%;"></p><p>更多导航栏配置可以根据官方文档进行学习（<a href="https://vitepress.dev/zh/reference/default-theme-nav%EF%BC%89%E3%80%82" target="_blank" rel="noreferrer">https://vitepress.dev/zh/reference/default-theme-nav）。</a></p>',10)]))}const y=a(p,[["render",E]]);export{g as __pageData,y as default};
