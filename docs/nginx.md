# nginx配置文件

main：全局配置，如进程数、日志。
events：连接模型、单进程最大连接数。
http：HTTP 相关总配置，网站配置都在这。
server：一个虚拟主机，一个站点。
location：按路径匹配请求，决定怎么处理。

### main:最外一层基础配置文件
user：指定工作进程运行用户
worker_processes：指定工作进程数量
error_log：全局错误日志
pid：主进程 PID 文件位置
worker_rlimit_nofile：提高单进程可打开文件数上限
daemon：是否后台运行
master_process：是否开启 master 进程
load_module：加载动态模块，有些nginx功能需要动态模块，比如：ngx_http_auth_request_module，具体模块具体学习
working_directory：指定工作目录,
env：传递环境变量
timer_resolution：定时器精度
pcre_jit：是否启用 PCRE JIT 优化

#### 例子：
user nginx;   // 指定工作进程运行用户,使用nginx用户
worker_processes auto;   //指定工作进程数量，auto表示系统自动计算
error_log /var/log/nginx/error.log warn; // 全局错误日志
pid /run/nginx.pid; // 主进程 PID 文件位置，一般用于保存nginx进程的PID，启动时会创建
worker_rlimit_nofile 65535; // 提高单进程可打开文件数上限
daemon on; // 是否后台运行

#### 日志等级，由小到大依次为：
debug：调试级别，用于开发阶段，显示所有信息
info：信息级别，显示所有信息，除debug级别外
notice：注意级别，显示所有信息，除debug、info级别外
warn：警告级别，显示所有信息，除debug、info、notice级别外
error：错误级别，显示所有信息，除debug、info、notice、warn级别外
crit：关键级别，显示所有信息，除debug、info、notice、warn、error级别外
alert：紧急级别，显示所有信息，除debug、info、notice、warn、error、crit级别外
emerg：紧急级别，显示所有信息，除debug、info、notice、warn、error、crit、alert级别外

### event:事件配置文件
worker_connections：指定单个工作进程能处理的最大连接数,如果你前面在 main 层写了worker_processes 4,那理论最大连接数大约就是：4 × 1024 = 4096
events {
    use epoll; // 使用 epoll 模型
    worker_connections 4096; // 每个 worker 最多支持 4096 个连接
     multi_accept on; // 允许多个请求同时建立连接
      accept_mutex on; // 允许多个 worker 进程同时处理请求
}

### http:http 层配置文件
http {
    include       mime.types; // 引入 mime.types 文件
    default_type  application/octet-stream; // 默认类型

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent"'; // 自定义日志格式

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
}

### server:虚拟主机配置文件
#### 反向代理
listen：80; // 监听 80 端口
access_log /var/log/nginx/example_access.log; // 访问日志
error_log  /var/log/nginx/example_error.log warn; // 错误日志
charset utf-8; // 设置字符集
error_page 404 /404.html; // 404 错误页面
error_page 500 502 503 504 /50x.html; // 50x 错误页面
client_max_body_size 100m; // 设置客户端请求体大小限制,超过限制会返回 413,客户端请求体最大允许多大，常影响文件上传
server_name example.com;// 域名
root /www/site; // 静态文件目录,www/site是静态文件目录，index.html是默认文件
index index.html index.htm; // 默认文件,当访问http://example.com/ 时，会去寻找 index.html 文件
也可以通过location配置，比如:
location / {
    root /var/www/html;
    index index.html;
}
deny 192.168.1.10; // 拒绝192.168.1.10访问
allow 192.168.1.0/24; // 允许192.168.1.0/24访问
deny all; // 拒绝所有访问
#### HTTP 跳 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri; // 所有 HTTP 请求直接重定向到 HTTPS
}

#### 配置 HTTPS 站点
server {
    listen 443 ssl; // 监听 443 端口，ssl 表示启用 SSL
    server_name example.com;

    ssl_certificate     /etc/nginx/ssl/fullchain.pem; // 证书文件
    ssl_certificate_key /etc/nginx/ssl/private.key; // 密钥文件

    location / {
        root /www/site;
        index index.html;
    }
}
#### 示例
http {
    upstream backend {
        server 127.0.0.1:8080;
        server 127.0.0.1:8081;
    }

    server {
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
            add_header Cache-Control "public";
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
}




### location: //路由配置文件
location / { //静态文件处理,表示把请求的静态文件返回给用户。}

location / { // 匹配所有以 / 开头的请求，去 /www/site 里找文件，目录默认首页是 index.html
    root /www/site;
    index index.html;
}
普通前缀匹配：location /api/ { // 匹配 /api/ 开头的请求 }
正则匹配：location ~ /api/(.*)/ { // 匹配 /api/ 开头的请求，并把 /api/ 后面的部分作为参数传递给后端 }
匹配任意字符：location ~* /api/(.*) { // 匹配 /api/ 开头的请求，并把 /api/ 后面的部分作为参数传递给后端 }
精确匹配：location = /api/ { // 匹配 /api/ 请求，只有路径完全一致才会匹配，例如 /login 匹配，/login/ 不匹配，/login?id=1 路径部分仍是 /login，能匹配 }
优先级，多个路由匹配：
1. = 精确匹配
2. ^~ 前缀匹配
3. 正则匹配 ~ / ~*
4. 普通前缀匹配，选最长的那个
5. / 兜底

#### root / alias / proxy_pass
root /www/site; // 静态文件目录,www/site是静态文件目录，index.html是默认文件，请求/img/a.png时，会去寻找 /www/site/img/a.png 文件
alias /www/site; // 静态文件目录,www/site是静态文件目录，index.html是默认文件
location /img/ { // 请求/img/a.png，会去寻找 /data/images/a.png 文件
    alias /data/images/;
}
proxy_pass http://127.0.0.1:8080; // 代理请求，表示把请求转发给 127.0.0.1:8080 这个服务器。

#### 示例
server {
    listen 80; // 监听 80 端口
    server_name example.com; // 域名

    root /www/example; // 静态文件目录
    index index.html index.htm; // 默认文件

    location = /health { // 健康检查
        access_log off; // 关闭日志
        return 200 "ok"; // 返回 ok
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
        add_header Cache-Control "public"; // 添加 Cache-Control 头部，表示缓存文件是公共的。
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

    location ~* \.(jpg|jpeg|png|gif|webp)$ { // 匹配图片文件
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
}

### 项目中常用但上面还没展开的配置

#### WebSocket 反向代理
项目里如果有 websocket、socket.io、SSE 网关，通常不能只写 `proxy_pass`，还要处理 HTTP/1.1 升级头。

```nginx
location /ws/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade; 
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host; 
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 3600s;
}
```

#### 代理超时、缓冲与大响应
后端接口慢、导出文件、流式返回时，经常要单独调这些参数，不然容易出现 `502`、`504` 或响应被截断。

```nginx
location /api/ {
    proxy_pass http://backend;
    proxy_connect_timeout 5s;   // 与后端建立连接超时
    proxy_send_timeout 60s;     // 向后端发送请求超时
    proxy_read_timeout 60s;     // 读取后端响应超时

    proxy_buffering on;         // 普通接口通常开启缓冲
    proxy_buffers 8 16k;
    proxy_buffer_size 16k;
}

location /export/ {
    proxy_pass http://backend;
    proxy_request_buffering off; // 大文件上传/转发时常关闭请求缓冲
    proxy_buffering off;         // 流式下载、SSE 时常关闭响应缓冲
    proxy_read_timeout 300s;
}
```

#### 获取真实客户端 IP
如果 nginx 前面还有一层 SLB、CDN、Ingress，不配真实 IP，后端拿到的通常只是上一跳代理地址。

```nginx
set_real_ip_from 10.0.0.0/8;
set_real_ip_from 172.16.0.0/12;
set_real_ip_from 192.168.0.0/16;
real_ip_header X-Forwarded-For;
real_ip_recursive on;
```

常见用途：
1. 后端日志记录真实用户 IP
2. 登录风控、限流、防刷
3. 审计系统按来源地址排查问题

#### 安全响应头
这类配置在正式环境很常见，用来减少信息泄露和浏览器侧风险。

```nginx
server_tokens off; // 隐藏 nginx 版本号

add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

补充说明：
1. `Strict-Transport-Security` 只建议在 HTTPS 站点里开
2. 如果有第三方 iframe 嵌入需求，`X-Frame-Options` 要结合业务调整

#### CORS 跨域
前后端分离项目经常会遇到跨域，尤其是本地开发、测试环境和多域名部署。

```nginx
location /api/ {
    if ($request_method = OPTIONS) {
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Credentials true always;
        add_header Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type,Authorization,X-Requested-With" always;
        add_header Access-Control-Max-Age 86400 always;
        return 204;
    }

    add_header Access-Control-Allow-Origin $http_origin always;
    add_header Access-Control-Allow-Credentials true always;

    proxy_pass http://backend;
}
```

注意：
1. 如果要带 cookie，`Access-Control-Allow-Origin` 不能写 `*`
2. 生产环境最好限制允许的源，而不是直接回显所有 `Origin`

#### 限流与并发限制
登录、短信、验证码、公开查询接口，通常会配基本限流，先挡一层低成本恶意流量。

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    server {
        location /api/ {
            limit_req zone=api_limit burst=20 nodelay;
            limit_conn conn_limit 50;
            proxy_pass http://backend;
        }

        location /login/ {
            limit_req zone=api_limit burst=5 nodelay;
            proxy_pass http://backend;
        }
    }
}
```

#### upstream 常用策略
项目里常见的不只是“写多个 server”，还会带上负载策略、失败重试和长连接。

```nginx
upstream backend {
    least_conn; // 优先分配给当前连接数更少的节点
    server 127.0.0.1:8080 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:8081 max_fails=3 fail_timeout=30s;
    keepalive 32; // 与上游保持长连接
}
```

如果后端地址不是固定 IP，而是域名或容器服务名，通常还会补：

```nginx
resolver 8.8.8.8 1.1.1.1 valid=300s;
resolver_timeout 5s;
```

#### 拦截隐藏文件和敏感路径
这是很常见的一层兜底，避免 `.git`、`.env`、备份文件被直接访问。

```nginx
location ~ /\.(git|svn|ht) {
    deny all;
}

location ~* \.(env|log|sql|bak|swp)$ {
    deny all;
}
```

#### 单页应用、管理后台、后端接口的常见组合
前端项目部署时，最常见的就是 `try_files + /api 反代 + 静态资源缓存` 这个组合。

```nginx
server {
    listen 443 ssl http2;
    server_name admin.example.com;

    ssl_certificate     /etc/nginx/ssl/admin.example.com.pem;
    ssl_certificate_key /etc/nginx/ssl/admin.example.com.key;

    root /www/admin;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html; // 尝试访问 index.html
    }

    location ^~ /assets/ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable"; // 缓存静态资源
        access_log off; // 关闭日志
    }

    location /api/ {
        proxy_pass http://backend; // 反代
        proxy_http_version 1.1;// 使用 HTTP/1.1
        proxy_set_header Host $host; // 设置 Host 头
        proxy_set_header X-Real-IP $remote_addr; // 设置真实 IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; // 设置代理 IP
        proxy_set_header X-Forwarded-Proto $scheme; // 设置协议
        proxy_connect_timeout 5s;// 与后端建立连接超时
        proxy_send_timeout 60s;// 向后端发送请求超时
        proxy_read_timeout 60s;
    }
}
```
