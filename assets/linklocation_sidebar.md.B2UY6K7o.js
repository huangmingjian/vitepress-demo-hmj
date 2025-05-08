import{_ as a,c as i,o as n,ae as e}from"./chunks/framework.Dh1jimFm.js";const l="/assets/config1.yzFOimqt.jpg",t="/assets/config2.CpMk7AhA.jpg",g=JSON.parse('{"title":"导航栏配置","description":"","frontmatter":{},"headers":[],"relativePath":"linklocation/sidebar.md","filePath":"linklocation/sidebar.md"}'),p={name:"linklocation/sidebar.md"};function h(E,s,k,r,d,c){return n(),i("div",null,s[0]||(s[0]=[e(`<h1 id="导航栏配置" tabindex="-1">导航栏配置 <a class="header-anchor" href="#导航栏配置" aria-label="Permalink to &quot;导航栏配置&quot;">​</a></h1><h2 id="_1-1、默认配置" tabindex="-1">1.1、默认配置 <a class="header-anchor" href="#_1-1、默认配置" aria-label="Permalink to &quot;1.1、默认配置&quot;">​</a></h2><p>需要配置 config.mts 文件下的themeConfig.sidebar，如下代码所示:</p><div class="language-md vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sidebar: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     text: &#39;Examples&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     items: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       { text: &#39;Markdown Examples&#39;, link: &#39;/markdown-examples&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">       { text: &#39;Runtime API Examples&#39;, link: &#39;/api-examples&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">]</span></span></code></pre></div><p>配置结果: <img src="`+l+`" style="zoom:50%;"></p><h2 id="_1-2、多侧边栏" tabindex="-1">1.2、多侧边栏 <a class="header-anchor" href="#_1-2、多侧边栏" aria-label="Permalink to &quot;1.2、多侧边栏&quot;">​</a></h2><p>会根据页面路径显示不同的侧边栏。</p><div class="language-md vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sidebar: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &#39;/linklocation/&#39;: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        text: &#39;vitepress&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        items: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;项目创建&#39;, link: &#39;/linklocation/learn-vitepress&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;导航栏配置&#39;, link: &#39;/linklocation/navigationbar&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;侧边栏配置&#39;, link: &#39;/linklocation/sidebar&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &#39;/config/&#39;: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        text: &#39;Examples&#39;,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        items: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;Index&#39;, link: &#39;/config/&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;Three&#39;, link: &#39;/config/three&#39; },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            { text: &#39;Four&#39;, link: &#39;/config/four&#39; }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    ]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>linklocation为路径前缀,当路由为linklocation开头时，显示对应的侧边栏。 配置结果: <img src="`+t+'" style="zoom:50%;"></p><p>其他更多配置可以参考官方文档（<a href="https://vitepress.dev/zh/reference/default-theme-sidebar%EF%BC%89" target="_blank" rel="noreferrer">https://vitepress.dev/zh/reference/default-theme-sidebar）</a></p>',10)]))}const m=a(p,[["render",h]]);export{g as __pageData,m as default};
