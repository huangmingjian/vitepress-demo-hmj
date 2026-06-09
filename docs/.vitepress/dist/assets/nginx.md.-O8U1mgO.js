import{_ as a,c as n,o as e,ae as i,j as t}from"./chunks/framework.CEJdHl6x.js";const c=JSON.parse('{"title":"nginx配置文件","description":"","frontmatter":{},"headers":[],"relativePath":"nginx.md","filePath":"nginx.md"}'),l={name:"nginx.md"};function p(h,s,r,k,o,d){return e(),n("div",null,s[0]||(s[0]=[i(`<h1 id="nginx配置文件" tabindex="-1">nginx配置文件 <a class="header-anchor" href="#nginx配置文件" aria-label="Permalink to &quot;nginx配置文件&quot;">​</a></h1><p>main：全局配置，如进程数、日志。 events：连接模型、单进程最大连接数。 http：HTTP 相关总配置，网站配置都在这。 server：一个虚拟主机，一个站点。 location：按路径匹配请求，决定怎么处理。</p><h3 id="main-最外一层基础配置文件" tabindex="-1">main:最外一层基础配置文件 <a class="header-anchor" href="#main-最外一层基础配置文件" aria-label="Permalink to &quot;main:最外一层基础配置文件&quot;">​</a></h3><p>user：指定工作进程运行用户 worker_processes：指定工作进程数量 error_log：全局错误日志 pid：主进程 PID 文件位置 worker_rlimit_nofile：提高单进程可打开文件数上限 daemon：是否后台运行 master_process：是否开启 master 进程 load_module：加载动态模块，有些nginx功能需要动态模块，比如：ngx_http_auth_request_module，具体模块具体学习 working_directory：指定工作目录, env：传递环境变量 timer_resolution：定时器精度 pcre_jit：是否启用 PCRE JIT 优化</p><h4 id="例子" tabindex="-1">例子： <a class="header-anchor" href="#例子" aria-label="Permalink to &quot;例子：&quot;">​</a></h4><p>user nginx; // 指定工作进程运行用户,使用nginx用户 worker_processes auto; //指定工作进程数量，auto表示系统自动计算 error_log /var/log/nginx/error.log warn; // 全局错误日志 pid /run/nginx.pid; // 主进程 PID 文件位置，一般用于保存nginx进程的PID，启动时会创建 worker_rlimit_nofile 65535; // 提高单进程可打开文件数上限 daemon on; // 是否后台运行</p><h4 id="日志等级-由小到大依次为" tabindex="-1">日志等级，由小到大依次为： <a class="header-anchor" href="#日志等级-由小到大依次为" aria-label="Permalink to &quot;日志等级，由小到大依次为：&quot;">​</a></h4><p>debug：调试级别，用于开发阶段，显示所有信息 info：信息级别，显示所有信息，除debug级别外 notice：注意级别，显示所有信息，除debug、info级别外 warn：警告级别，显示所有信息，除debug、info、notice级别外 error：错误级别，显示所有信息，除debug、info、notice、warn级别外 crit：关键级别，显示所有信息，除debug、info、notice、warn、error级别外 alert：紧急级别，显示所有信息，除debug、info、notice、warn、error、crit级别外 emerg：紧急级别，显示所有信息，除debug、info、notice、warn、error、crit、alert级别外</p><h3 id="event-事件配置文件" tabindex="-1">event:事件配置文件 <a class="header-anchor" href="#event-事件配置文件" aria-label="Permalink to &quot;event:事件配置文件&quot;">​</a></h3><p>worker_connections：指定单个工作进程能处理的最大连接数,如果你前面在 main 层写了worker_processes 4,那理论最大连接数大约就是：4 × 1024 = 4096 events { use epoll; // 使用 epoll 模型 worker_connections 4096; // 每个 worker 最多支持 4096 个连接 multi_accept on; // 允许多个请求同时建立连接 accept_mutex on; // 允许多个 worker 进程同时处理请求 }</p><h3 id="http-http-层配置文件" tabindex="-1">http:http 层配置文件 <a class="header-anchor" href="#http-http-层配置文件" aria-label="Permalink to &quot;http:http 层配置文件&quot;">​</a></h3><p>http { include mime.types; // 引入 mime.types 文件 default_type application/octet-stream; // 默认类型</p><pre><code>log_format main &#39;$remote_addr - $remote_user [$time_local] &quot;$request&quot; &#39;
                &#39;$status $body_bytes_sent &quot;$http_referer&quot; &#39;
                &#39;&quot;$http_user_agent&quot;&#39;; // 自定义日志格式

access_log /var/log/nginx/access.log main; // 访问日志
error_log  /var/log/nginx/error.log warn; // 错误日志

sendfile on;// 开启 sendfile,让 nginx 直接高效发送文件，减少用户态和内核态拷贝，静态文件性能更好。
tcp_nopush on;// 开启 tcp_nopush,优化大文件发送，尽量合并数据包。
tcp_nodelay on;// 开启 tcp_nodelay,优化小文件发送，尽量合并数据包。减少小包延迟，适合交互型请求。

keepalive_timeout 65; // 设置 keepalive 超时时间,一个 HTTP 长连接空闲多久后关闭。
keepalive_requests 100; // 设置 keepalive 请求数,一个长连接最多处理多少次请求。。

client_max_body_size 50m; // 设置客户端请求体大小限制,超过限制会返回 413,客户端请求体最大允许多大，常影响文件上传
client_body_buffer_size 128k; // 设置客户端请求体缓冲区大小
client_header_buffer_size 1k; // 设置客户端请求头缓冲区大小
large_client_header_buffers 4 8k; // 配置多个缓冲区，提高性能,大请求头时使用的额外缓冲区.

gzip on; // 开启 gzip,压缩静态文件，提高性能。
gzip_types text/plain text/css application/json application/javascript; // 压缩哪些文件
gzip_min_length 1k; // 小于1k的文件不压缩

upstream backend { //后端服务组,定义一个后端服务集群,给 proxy_pass 使用,做负载均衡
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
}

server { // 服务器配置
    listen 80; // 监听 80 端口
    server_name example.com; // 域名

    location / { //静态文件处理,表示把请求的静态文件返回给用户。
        root /www/site;
        index index.html;
    }

    location /api/ { //代理请求，表示把请求转发给 backend 这组服务器。所以 upstream 常放在 http 层，是因为多个站点都可能复用它。
        proxy_pass http://backend;
    }
}
</code></pre><p>}</p><h3 id="server-虚拟主机配置文件" tabindex="-1">server:虚拟主机配置文件 <a class="header-anchor" href="#server-虚拟主机配置文件" aria-label="Permalink to &quot;server:虚拟主机配置文件&quot;">​</a></h3><h4 id="反向代理" tabindex="-1">反向代理 <a class="header-anchor" href="#反向代理" aria-label="Permalink to &quot;反向代理&quot;">​</a></h4><p>listen：80; // 监听 80 端口 access_log /var/log/nginx/example_access.log; // 访问日志 error_log /var/log/nginx/example_error.log warn; // 错误日志 charset utf-8; // 设置字符集 error_page 404 /404.html; // 404 错误页面 error_page 500 502 503 504 /50x.html; // 50x 错误页面 client_max_body_size 100m; // 设置客户端请求体大小限制,超过限制会返回 413,客户端请求体最大允许多大，常影响文件上传 server_name example.com;// 域名 root /www/site; // 静态文件目录,www/site是静态文件目录，index.html是默认文件 index index.html index.htm; // 默认文件,当访问<a href="http://example.com/" target="_blank" rel="noreferrer">http://example.com/</a> 时，会去寻找 index.html 文件 也可以通过location配置，比如: location / { root /var/www/html; index index.html; } deny 192.168.1.10; // 拒绝192.168.1.10访问 allow 192.168.1.0/24; // 允许192.168.1.0/24访问 deny all; // 拒绝所有访问</p><h4 id="http-跳-https" tabindex="-1">HTTP 跳 HTTPS <a class="header-anchor" href="#http-跳-https" aria-label="Permalink to &quot;HTTP 跳 HTTPS&quot;">​</a></h4><p>server { listen 80; server_name example.com www.example.com; return 301 https://$host$request_uri; // 所有 HTTP 请求直接重定向到 HTTPS }</p><h4 id="配置-https-站点" tabindex="-1">配置 HTTPS 站点 <a class="header-anchor" href="#配置-https-站点" aria-label="Permalink to &quot;配置 HTTPS 站点&quot;">​</a></h4><p>server { listen 443 ssl; // 监听 443 端口，ssl 表示启用 SSL server_name example.com;</p><pre><code>ssl_certificate     /etc/nginx/ssl/fullchain.pem; // 证书文件
ssl_certificate_key /etc/nginx/ssl/private.key; // 密钥文件

location / {
    root /www/site;
    index index.html;
}
</code></pre><p>}</p><h4 id="示例" tabindex="-1">示例 <a class="header-anchor" href="#示例" aria-label="Permalink to &quot;示例&quot;">​</a></h4><p>http { upstream backend { server 127.0.0.1:8080; server 127.0.0.1:8081; }</p><pre><code>server {
    listen 80;
    server_name example.com www.example.com;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl; // 监听 443 端口，ssl 表示启用 SSL
    server_name example.com www.example.com; // 域名

    ssl_certificate     /etc/nginx/ssl/example.com.pem; // 证书文件
    ssl_certificate_key /etc/nginx/ssl/example.com.key; // 密钥文件

    access_log /var/log/nginx/example.access.log; // 访问日志
    error_log  /var/log/nginx/example.error.log warn; // 错误日志

    root /www/example; // 静态文件目录
    index index.html index.htm;// 默认文件

    client_max_body_size 50m; // 客户端请求体大小限制

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /upload/ {
        proxy_pass http://127.0.0.1:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        client_max_body_size 200m;
    }

    location /static/ {
        expires 30d;
        add_header Cache-Control &quot;public&quot;;
    }

    error_page 404 /404.html; // 404 错误页面
    location = /404.html { // 内部错误页面
        internal;
    }

    error_page 500 502 503 504 /50x.html; // 50x 错误页面
    location = /50x.html {// 内部错误页面
        internal;
    }
}
</code></pre><p>}</p><h3 id="location-路由配置文件" tabindex="-1">location: //路由配置文件 <a class="header-anchor" href="#location-路由配置文件" aria-label="Permalink to &quot;location: //路由配置文件&quot;">​</a></h3>`,28),t("p",{"静态文件处理,表示把请求的静态文件返回给用户。":""},"location /",-1),i(`<p>location / { // 匹配所有以 / 开头的请求，去 /www/site 里找文件，目录默认首页是 index.html root /www/site; index index.html; } 普通前缀匹配：location /api/ { // 匹配 /api/ 开头的请求 } 正则匹配：location ~ /api/(.<em>)/ { // 匹配 /api/ 开头的请求，并把 /api/ 后面的部分作为参数传递给后端 } 匹配任意字符：location ~</em> /api/(.*) { // 匹配 /api/ 开头的请求，并把 /api/ 后面的部分作为参数传递给后端 } 精确匹配：location = /api/ { // 匹配 /api/ 请求，只有路径完全一致才会匹配，例如 /login 匹配，/login/ 不匹配，/login?id=1 路径部分仍是 /login，能匹配 } 优先级，多个路由匹配：</p><ol><li>= 精确匹配</li><li>^~ 前缀匹配</li><li>正则匹配 ~ / ~*</li><li>普通前缀匹配，选最长的那个</li><li>/ 兜底</li></ol><h4 id="root-alias-proxy-pass" tabindex="-1">root / alias / proxy_pass <a class="header-anchor" href="#root-alias-proxy-pass" aria-label="Permalink to &quot;root / alias / proxy_pass&quot;">​</a></h4><p>root /www/site; // 静态文件目录,www/site是静态文件目录，index.html是默认文件，请求/img/a.png时，会去寻找 /www/site/img/a.png 文件 alias /www/site; // 静态文件目录,www/site是静态文件目录，index.html是默认文件 location /img/ { // 请求/img/a.png，会去寻找 /data/images/a.png 文件 alias /data/images/; } proxy_pass <a href="http://127.0.0.1:8080" target="_blank" rel="noreferrer">http://127.0.0.1:8080</a>; // 代理请求，表示把请求转发给 127.0.0.1:8080 这个服务器。</p><h4 id="示例-1" tabindex="-1">示例 <a class="header-anchor" href="#示例-1" aria-label="Permalink to &quot;示例&quot;">​</a></h4><p>server { listen 80; // 监听 80 端口 server_name example.com; // 域名</p><pre><code>root /www/example; // 静态文件目录
index index.html index.htm; // 默认文件

location = /health { // 健康检查
    access_log off; // 关闭日志
    return 200 &quot;ok&quot;; // 返回 ok
}

location = /favicon.ico {// 图标
    log_not_found off; // 关闭图标的日志
    access_log off; // 关闭图标的日志
}

location / { // 静态文件处理,表示把请求的静态文件返回给用户。
    try_files $uri $uri/ /index.html; // 尝试匹配静态文件，并返回给用户。
}

location ^~ /static/ { // 静态文件缓存处理,表示把请求的静态文件缓存，并设置缓存时间为 30 天，并添加 Cache-Control 头部，表示缓存文件是公共的。
    expires 30d; // 缓存时间
    add_header Cache-Control &quot;public&quot;; // 添加 Cache-Control 头部，表示缓存文件是公共的。
    access_log off; // 关闭日志
}

location /api/ { // 匹配 /api/ 开头的请求，并把 /api/ 后面的部分作为参数传递给后端
    proxy_pass http://127.0.0.1:8080; // 代理请求，表示把请求转发给 127.0.0.1:8080 这个服务器。
    proxy_set_header Host $host; // 设置 Host 头部，表示把请求的 Host 头部传递给后端。
    proxy_set_header X-Real-IP $remote_addr; // 添加 X-Real-IP 头部，表示把请求的 IP 地址传递给后端。
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; // 添加 X-Forwarded-For 头部，表示把请求的 IP 地址传递给后端。
    proxy_set_header X-Forwarded-Proto $scheme; // 添加 X-Forwarded-Proto 头部，表示把请求的协议传递给后端。
    proxy_connect_timeout 5s; // 设置代理请求超时时间，5 秒
    proxy_send_timeout 60s; // 设置代理请求超时时间，60 秒
    proxy_read_timeout 60s; // 设置读取后端响应超时时间，60 秒
}

location /upload/ { // 匹配 /upload/ 开头的请求，并把 /upload/ 后面的部分作为参数传递给后端
    proxy_pass http://127.0.0.1:8090; // 代理请求，表示把请求转发给 127.0.0.1:8090 这个服务器。
    client_max_body_size 200m; // 设置客户端请求体大小限制，200M
    proxy_set_header Host $host; // 添加 Host 头部，表示把请求的 Host 头部传递给后端。
    proxy_set_header X-Real-IP $remote_addr; // 添加 X-Real-IP 头部，表示把请求的 IP 地址传递给后端。
}

location ~* \\.(jpg|jpeg|png|gif|webp)$ { // 匹配图片文件
    valid_referers none blocked example.com *.example.com; // 设置 Referer 验证
    if ($invalid_referer) { // 如果请求的 Referer 不是 example.com 或者 *.example.com，则返回 403
        return 403;
    }

    expires 7d; // 缓存图片文件，缓存时间为 7 天
    access_log off; // 关闭日志
}

location = /404.html { // 匹配 404 错误页面
    internal; // 内部错误页面
}

location = /50x.html { // 匹配 50x 错误页面
    internal; // 内部错误页面
}

error_page 404 /404.html; // 404 错误页面
error_page 500 502 503 504 /50x.html;   // 50x 错误页面
</code></pre><p>}</p><h3 id="项目中常用但上面还没展开的配置" tabindex="-1">项目中常用但上面还没展开的配置 <a class="header-anchor" href="#项目中常用但上面还没展开的配置" aria-label="Permalink to &quot;项目中常用但上面还没展开的配置&quot;">​</a></h3><h4 id="websocket-反向代理" tabindex="-1">WebSocket 反向代理 <a class="header-anchor" href="#websocket-反向代理" aria-label="Permalink to &quot;WebSocket 反向代理&quot;">​</a></h4><p>项目里如果有 websocket、socket.io、SSE 网关，通常不能只写 <code>proxy_pass</code>，还要处理 HTTP/1.1 升级头。</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> /ws/ </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_pass </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">http://127.0.0.1:8080;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_http_version </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Upgrade $http_upgrade; </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Connection </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;upgrade&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Host $host; </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Real-IP $remote_addr;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Forwarded-For $proxy_add_x_forwarded_for;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_read_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3600s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="代理超时、缓冲与大响应" tabindex="-1">代理超时、缓冲与大响应 <a class="header-anchor" href="#代理超时、缓冲与大响应" aria-label="Permalink to &quot;代理超时、缓冲与大响应&quot;">​</a></h4><p>后端接口慢、导出文件、流式返回时，经常要单独调这些参数，不然容易出现 <code>502</code>、<code>504</code> 或响应被截断。</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> /api/ </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_pass </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">http://backend;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_connect_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">   // 与后端建立连接超时</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_send_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">60s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     // 向后端发送请求超时</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_read_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">60s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     // 读取后端响应超时</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_buffering </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">         // 普通接口通常开启缓冲</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_buffers </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 16k</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_buffer_size </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16k</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> /export/ </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_pass </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">http://backend;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_request_buffering </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">off</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 大文件上传/转发时常关闭请求缓冲</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_buffering </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">off</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;         // 流式下载、</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">SSE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 时常关闭响应缓冲</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_read_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">300s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="获取真实客户端-ip" tabindex="-1">获取真实客户端 IP <a class="header-anchor" href="#获取真实客户端-ip" aria-label="Permalink to &quot;获取真实客户端 IP&quot;">​</a></h4><p>如果 nginx 前面还有一层 SLB、CDN、Ingress，不配真实 IP，后端拿到的通常只是上一跳代理地址。</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">set_real_ip_from </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">10.0.0.0/8;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">set_real_ip_from </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">172.16.0.0/12;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">set_real_ip_from </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">192.168.0.0/16;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">real_ip_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Forwarded-For;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">real_ip_recursive </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><p>常见用途：</p><ol><li>后端日志记录真实用户 IP</li><li>登录风控、限流、防刷</li><li>审计系统按来源地址排查问题</li></ol><h4 id="安全响应头" tabindex="-1">安全响应头 <a class="header-anchor" href="#安全响应头" aria-label="Permalink to &quot;安全响应头&quot;">​</a></h4><p>这类配置在正式环境很常见，用来减少信息泄露和浏览器侧风险。</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">server_tokens </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">off</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">; // 隐藏 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">nginx</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 版本号</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Frame-Options </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;SAMEORIGIN&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> always;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Content-Type-Options </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;nosniff&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> always;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Referrer-Policy </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;strict-origin-when-cross-origin&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> always;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Permissions-Policy </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;geolocation=(), microphone=(), camera=()&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> always;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Strict-Transport-Security </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;max-age=31536000; includeSubDomains&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> always;</span></span></code></pre></div><p>补充说明：</p><ol><li><code>Strict-Transport-Security</code> 只建议在 HTTPS 站点里开</li><li>如果有第三方 iframe 嵌入需求，<code>X-Frame-Options</code> 要结合业务调整</li></ol><h4 id="cors-跨域" tabindex="-1">CORS 跨域 <a class="header-anchor" href="#cors-跨域" aria-label="Permalink to &quot;CORS 跨域&quot;">​</a></h4><p>前后端分离项目经常会遇到跨域，尤其是本地开发、测试环境和多域名部署。</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> /api/ </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ($request_method </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">= </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">OPTIONS) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Access-Control-Allow-Origin $http_origin always;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Access-Control-Allow-Credentials </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> always;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Access-Control-Allow-Methods </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;GET,POST,PUT,DELETE,OPTIONS&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> always;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Access-Control-Allow-Headers </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Content-Type,Authorization,X-Requested-With&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> always;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Access-Control-Max-Age </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">86400</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> always;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 204</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Access-Control-Allow-Origin $http_origin always;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Access-Control-Allow-Credentials </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> always;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    proxy_pass </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">http://backend;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>注意：</p><ol><li>如果要带 cookie，<code>Access-Control-Allow-Origin</code> 不能写 <code>*</code></li><li>生产环境最好限制允许的源，而不是直接回显所有 <code>Origin</code></li></ol><h4 id="限流与并发限制" tabindex="-1">限流与并发限制 <a class="header-anchor" href="#限流与并发限制" aria-label="Permalink to &quot;限流与并发限制&quot;">​</a></h4><p>登录、短信、验证码、公开查询接口，通常会配基本限流，先挡一层低成本恶意流量。</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">http</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    limit_req_zone </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$binary_remote_addr zone=api_limit:10m rate=10r/s;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    limit_conn_zone </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$binary_remote_addr zone=conn_limit:10m;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> /api/ </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            limit_req </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">zone=api_limit burst=20 nodelay;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            limit_conn </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">conn_limit </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">50</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            proxy_pass </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">http://backend;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> /login/ </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            limit_req </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">zone=api_limit burst=5 nodelay;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            proxy_pass </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">http://backend;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="upstream-常用策略" tabindex="-1">upstream 常用策略 <a class="header-anchor" href="#upstream-常用策略" aria-label="Permalink to &quot;upstream 常用策略&quot;">​</a></h4><p>项目里常见的不只是“写多个 server”，还会带上负载策略、失败重试和长连接。</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">upstream</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> backend </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    least_conn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 优先分配给当前连接数更少的节点</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 127.0.0.1:8080 </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">max_fails</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fail_timeout=30s;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 127.0.0.1:8081 </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">max_fails</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> fail_timeout=30s;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    keepalive </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">32</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 与上游保持长连接</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>如果后端地址不是固定 IP，而是域名或容器服务名，通常还会补：</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">resolver </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">8.8.8.8</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 1.1.1.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> valid=300s;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">resolver_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h4 id="拦截隐藏文件和敏感路径" tabindex="-1">拦截隐藏文件和敏感路径 <a class="header-anchor" href="#拦截隐藏文件和敏感路径" aria-label="Permalink to &quot;拦截隐藏文件和敏感路径&quot;">​</a></h4><p>这是很常见的一层兜底，避免 <code>.git</code>、<code>.env</code>、备份文件被直接访问。</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">location</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ~</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;"> /\\.(git|svn|ht) </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    deny </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">all</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">location</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ~*</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;"> \\.(env|log|sql|bak|swp)$ </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    deny </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">all</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h4 id="单页应用、管理后台、后端接口的常见组合" tabindex="-1">单页应用、管理后台、后端接口的常见组合 <a class="header-anchor" href="#单页应用、管理后台、后端接口的常见组合" aria-label="Permalink to &quot;单页应用、管理后台、后端接口的常见组合&quot;">​</a></h4><p>前端项目部署时，最常见的就是 <code>try_files + /api 反代 + 静态资源缓存</code> 这个组合。</p><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    listen </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">443</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ssl http2;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    server_name </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">admin.example.com;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    ssl_certificate </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    /etc/nginx/ssl/admin.example.com.pem;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    ssl_certificate_key </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/etc/nginx/ssl/admin.example.com.key;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    root </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/www/admin;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    index </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">index.html;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> / </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        try_files </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$uri $uri/ /index.html; // 尝试访问 index.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">html</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    location</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> ^~</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;"> /assets/ </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        expires </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">30d</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        add_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Cache-Control </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;public, max-age=2592000, immutable&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 缓存静态资源</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        access_log </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">off</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> // 关闭日志</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> /api/ </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        proxy_pass </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">http://backend; // 反代</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        proxy_http_version </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">1.1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;// 使用 HTTP/1.</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">1</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">Host $host; // 设置 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">Host</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 头</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Real-IP $remote_addr; // 设置真实 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">IP</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Forwarded-For $proxy_add_x_forwarded_for; // 设置代理 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">IP</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        proxy_set_header </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">X-Forwarded-Proto $scheme; // 设置协议</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        proxy_connect_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;// 与后端建立连接超时</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        proxy_send_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">60s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;// 向后端发送请求超时</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        proxy_read_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">60s</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div>`,44)]))}const g=a(l,[["render",p]]);export{c as __pageData,g as default};
