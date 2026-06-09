---
outline: deep
---

# 学习笔记目录

这里作为学习笔记的总入口，把分散在不同目录里的内容按主题整理。后续新增笔记时，优先放进对应分类，避免文件越写越散。

## 后端与中间件

| 主题 | 内容 | 链接 |
| --- | --- | --- |
| Gateway 网关 | Spring Cloud Gateway 路由、Path 匹配、转发、限流、熔断、跨域 | [查看笔记](/linklocation/getway.html) |
| Redis | Redis 常用命令、数据结构、缓存场景 | [查看笔记](/linklocation/redis.html) |
| MySQL | SQL 语句、查询、表结构、常用整理 | [查看笔记](/mysql.html) |

## 运维与部署

| 主题 | 内容 | 链接 |
| --- | --- | --- |
| Nginx | main、events、http、server、location、反向代理、HTTPS | [查看笔记](/nginx.html) |
| Ubuntu | Linux 运维、Docker、SSH、UFW、防火墙、常用命令 | [查看笔记](/linklocation/ubuntu.html) |
| GitHub 部署 | VitePress 项目 GitHub Pages 部署流程 | [查看笔记](/linklocation/githubDeployment.html) |

## VitePress 建站

| 主题 | 内容 | 链接 |
| --- | --- | --- |
| 项目创建 | VitePress 项目初始化和基础使用 | [查看笔记](/linklocation/learn-vitepress.html) |
| 导航栏配置 | nav 配置、顶部菜单配置 | [查看笔记](/linklocation/navigationbar.html) |
| 侧边栏配置 | sidebar 配置、目录分组 | [查看笔记](/linklocation/sidebar.html) |

## 前端与浏览器能力

| 主题 | 内容 | 链接 |
| --- | --- | --- |
| OffscreenCanvas | Canvas 多线程渲染、Worker 优化思路 | [查看笔记](/OffscreenCanvas渲染多线程优化.html) |


## 后续整理规则

1. 新增学习笔记时，先判断属于哪个主题，再放入对应分类。
2. 和 VitePress 本身相关的内容放到 `docs/linklocation/`。
3. 后端中间件类内容可以继续放在 `docs/linklocation/` 或根目录，目录页统一收口。
4. 新增文件后，同时更新本页和 `docs/.vitepress/config.mts` 的侧边栏。
5. 文件名尽量使用英文或拼音，中文标题写在 Markdown 一级标题里，避免链接编码过长。
