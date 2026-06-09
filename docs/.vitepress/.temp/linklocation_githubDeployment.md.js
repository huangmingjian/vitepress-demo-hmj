import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _imports_0 = "/vitepress-demo-hmj/assets/github1.Cl80WSGj.png";
const _imports_1 = "/vitepress-demo-hmj/assets/github2.CHSudOlc.png";
const _imports_2 = "/vitepress-demo-hmj/assets/github3.DjtXjw2u.png";
const _imports_3 = "/vitepress-demo-hmj/assets/github4.DlZr4Ofe.png";
const _imports_4 = "/vitepress-demo-hmj/assets/github5.DSkN6GzT.png";
const __pageData = JSON.parse('{"title":"github部署","description":"","frontmatter":{},"headers":[],"relativePath":"linklocation/githubDeployment.md","filePath":"linklocation/githubDeployment.md"}');
const _sfc_main = { name: "linklocation/githubDeployment.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="github部署" tabindex="-1">github部署 <a class="header-anchor" href="#github部署" aria-label="Permalink to &quot;github部署&quot;">​</a></h1><p>我们基本完成了一个博客的搭建。那搭建完成以后，就是发布上线啦~ 首先，我们采用Github Page来进行部署,没有账号的可以去注册一个，任何做一些部署前的准备。</p><h2 id="_1、创建github仓库" tabindex="-1">1、创建Github仓库 <a class="header-anchor" href="#_1、创建github仓库" aria-label="Permalink to &quot;1、创建Github仓库&quot;">​</a></h2><p>登录 <a href="https://github.com/" target="_blank" rel="noreferrer">https://github.com/</a> 创建账号,创建一个仓库，名称自己定，这里我使用 vitepress-demo-hmj。 <img${ssrRenderAttr("src", _imports_0)} style="${ssrRenderStyle({ "zoom": "50%" })}"> 然后把我们的代码推送到github仓库中。</p><div class="language-md vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">git init</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">git commit -m &quot;first commit&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">git branch -M main</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">//地址自己仓库仓库地址</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">git remote add origin https://github.com/huangmingjian/vitepress-demo-hmj.git</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">git push -u origin main</span></span></code></pre></div><p>后续的代码修改都是通过git进行推送，后续的分支管理规范自己学习吧。</p><h2 id="_2、创建github仓库" tabindex="-1">2、创建Github仓库 <a class="header-anchor" href="#_2、创建github仓库" aria-label="Permalink to &quot;2、创建Github仓库&quot;">​</a></h2><p>在项目根目录下创建 .github/workflows/deploy.yml 文件，内容如下： 其中secrets.HMJ_TEXT_TOKEN在第三步中获取。secrets默认应该设置GITHUB_TOKEN用于访问当前仓库的 GitHub API 令牌，具有与当前工作流相同的权限。如果后续在部署时出现权限不足时,可以自定义token。</p><div class="language-md vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">name: Deploy VitePress to GitHub Pages</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">on:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  push:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    branches:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">      - main  # 触发部署的分支，默认为 main</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">jobs:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  deploy:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    runs-on: ubuntu-latest  # 使用最新的 Ubuntu 环境</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    steps:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">      - name: Checkout code</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        uses: actions/checkout@v3  # 拉取代码</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">      - name: Set up Node.js</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        uses: actions/setup-node@v3  # 设置 Node.js 环境</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        with:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">          node-version: 22.15.0  # 指定 Node.js 版本</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">      - name: Install dependencies</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        run: npm install  # 安装依赖</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">      - name: Build VitePress</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        run: npm run docs:build  # 构建 VitePress 项目</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">      - name: Deploy to GitHub Pages</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        uses: peaceiris/actions-gh-pages@v3  # 使用 GitHub Pages 部署 Action</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">        with:</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">          github_token: \${{ secrets.HMJ_TEXT_TOKEN }}  # GitHub Token</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">          publish_dir: docs/.vitepress/dist  # 构建输出的目录</span></span></code></pre></div><h2 id="_3、获取自定义token" tabindex="-1">3、获取自定义token <a class="header-anchor" href="#_3、获取自定义token" aria-label="Permalink to &quot;3、获取自定义token&quot;">​</a></h2><p>1.进入 GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)。 2.点击 Generate new token → Generate new token (classic)。 3.填写Note: Deploy to GitHub Pages（描述用途）,Expiration: 建议选择有效期（如 90 天）,Scopes: 勾选 repo（全仓库权限）和 workflow（如需操作 Actions）其他权限自己根据需求勾选,点击 Generate token，复制生成的 Token。</p><img${ssrRenderAttr("src", _imports_1)} style="${ssrRenderStyle({ "zoom": "50%" })}"><p>4.进入你的仓库，点击 Settings &gt; Secrets and variables &gt; Actions,点击 New repository secret,在 Name 字段中输入 HMJ_TEXT_TOKEN，在 Value 字段中输入你的密钥值（如 API 令牌）,点击 Add secret 保存。 <img${ssrRenderAttr("src", _imports_2)} style="${ssrRenderStyle({ "zoom": "50%" })}"></p><p>5.然后修改.github/workflows/deploy.yml 文件,并使用git提交</p><div class="language-md vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">github_token: \${{ secrets.HMJ_TEXT_TOKEN }}</span></span></code></pre></div><h2 id="_4、查看部署结果" tabindex="-1">4、查看部署结果 <a class="header-anchor" href="#_4、查看部署结果" aria-label="Permalink to &quot;4、查看部署结果&quot;">​</a></h2><p>在代码上传后，在github actions中查看部署结果，后续报错需要自己点进行查看问题代码。 <img${ssrRenderAttr("src", _imports_3)} style="${ssrRenderStyle({ "zoom": "50%" })}"> 然后在setting中查看部署结果,在部署完成后会有个gh-pages分支，然后有个项目地址,就可以给其他人查看啦。 <img${ssrRenderAttr("src", _imports_4)} style="${ssrRenderStyle({ "zoom": "50%" })}"></p><h2 id="_4、可能碰到的问题" tabindex="-1">4、可能碰到的问题 <a class="header-anchor" href="#_4、可能碰到的问题" aria-label="Permalink to &quot;4、可能碰到的问题&quot;">​</a></h2><p>1.首页图片部署后加载不出来,那是因为一定需要把图片放在 根目录-docs-public下面才行，具体问题查看官方文档<a href="https://vitepress.dev/guide/asset-handling#the-public-directory%E3%80%82" target="_blank" rel="noreferrer">https://vitepress.dev/guide/asset-handling#the-public-directory。</a></p><p>2.部署后点击路由404,那是因为进入路由的绝对路径不对,可能在开发环境可以访问,但是部署后访问不了,link设置为&#39;/linklocation/learn-vitepress&#39;,如果设置为&#39;../linklocation/learn-vitepress&#39; 会造成路由查找错误。</p><p>3.这个问题很奇怪,我有个图片名字随便设置的，名字为vueList,然后github pages部署后,报错找不到图片。但是我改了个名称就可以了，很奇怪。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("linklocation/githubDeployment.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const githubDeployment = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  githubDeployment as default
};
