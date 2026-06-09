---
outline: deep
---

# Docker 学习笔记（Ubuntu 运维整理版）

这篇笔记把 Docker 学习过程中常用的 Ubuntu 运维命令、Docker 安装配置、镜像容器操作、数据卷、网络、Dockerfile，以及常见服务部署命令整理到一起，方便后续快速查阅。

## 1. Ubuntu 基础环境

### 1.1 查看系统信息

```sh
# 查看内核版本
uname -r

# 查看系统版本
cat /etc/os-release
```

### 1.2 APT 软件源

下面示例以 Ubuntu 22.04 `jammy` 为例。其他版本请把 `jammy` 替换为对应代号，例如 Ubuntu 24.04 使用 `noble`。

#### 阿里源

```text
deb http://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
# deb-src http://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
# deb-src http://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse
# deb-src http://mirrors.aliyun.com/ubuntu/ jammy-backports main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
# deb-src http://mirrors.aliyun.com/ubuntu/ jammy-security main restricted universe multiverse
```

#### 清华源

默认注释了源码仓库，如需下载源码包，可以取消 `deb-src` 前面的注释。

```text
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse

deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
```

### 1.3 SSH 常用命令

```sh
# 编辑 authorized_keys，把公钥写入该文件
sudo -H gedit ~/.ssh/authorized_keys

# 查看 SSH 公钥登录配置
sudo grep -i "PubkeyAuthentication" /etc/ssh/sshd_config
sudo grep -i "AuthorizedKeysFile" /etc/ssh/sshd_config

# 修改 SSH 配置
sudo -H gedit /etc/ssh/sshd_config

# 测试 SSH 配置是否正确
sudo sshd -t

# 查看 SSH 主机密钥
ls -la /etc/ssh/ssh_host_*

# 重新生成 SSH 主机密钥
sudo rm -f /etc/ssh/ssh_host_*
sudo ssh-keygen -A
sudo systemctl restart ssh
```

### 1.4 UFW 防火墙

```sh
# 查看防火墙状态
sudo ufw status verbose

# 启用防火墙
sudo ufw enable

# 允许 SSH / HTTP / HTTPS
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow http
sudo ufw allow https

# 限制 SSH 暴力破解
sudo ufw limit ssh

# 只允许指定 IP 访问 SSH
sudo ufw allow from 192.168.1.100 to any port 22

# 以编号形式查看规则
sudo ufw status numbered

# 删除规则
sudo ufw delete 规则编号
sudo ufw delete allow 80
```

## 2. Docker 安装与配置

### 2.1 配置 Docker CE 阿里源

```sh
sudo rm -f /etc/apt/sources.list.d/docker.*
sudo apt update
sudo apt install -y ca-certificates curl

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://mirrors.aliyun.com/docker-ce/linux/ubuntu
Suites: noble
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update
```

> 如果你的 Ubuntu 版本不是 24.04，请把 `Suites: noble` 改成对应版本代号。

### 2.2 配置镜像加速

```sh
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.1ms.run",
    "https://docker.m.daocloud.io",
    "https://lispy.org",
    "https://docker-0.unsee.tech",
    "https://docker.xuanyuan.me"
  ]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

也可以使用自己的阿里云镜像加速地址：

```sh
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://1jsmrx34.mirror.aliyuncs.com"]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 3. Docker 基础命令

### 3.1 查看 Docker 信息

```sh
# 查看 Docker 版本
docker version

# 查看 Docker 详细信息
docker info

# 查看当前镜像
docker images

# 只查看镜像 ID
docker images -q
```

### 3.2 拉取镜像

```sh
# 拉取指定版本镜像
docker pull mysql:8.4

# 不写 tag 时，默认使用 latest
docker pull mysql
```

拉取镜像时会看到类似信息：

```text
Using default tag: latest
latest: Pulling from library/mysql
013be34edccd: Pull complete
...
Digest: sha256:xxxx
Status: Downloaded newer image for mysql:latest
docker.io/library/mysql:latest
```

说明：

- `latest`：默认标签，不一定代表真正的最新稳定版本。
- `Pull complete`：镜像分层下载完成。
- `Digest`：镜像内容签名摘要。
- `docker.io/library/mysql:latest`：镜像真实地址。

### 3.3 运行容器

```sh
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

说明：

- `OPTIONS`：容器启动参数，放在镜像名前面，用来控制容器怎么启动。
- `IMAGE`：镜像名，表示使用哪个镜像创建容器，例如 `nginx`、`mysql:8.4`。
- `COMMAND`：容器启动后执行的命令，放在镜像名后面；不写则使用镜像默认命令。
- `ARG`：传给 `COMMAND` 的参数，例如 `echo hello` 中的 `hello`。

OPTIONS常用参数：

| 参数 | 说明 |
| --- | --- |
| `--name 容器名` | 给容器设置名称 |
| `-d` | 后台运行，不占用当前终端 |
| `-i` | 保持标准输入打开，常和 `-t` 一起使用 |
| `-t` | 分配一个终端，常和 `-i` 组成 `-it` |
| `-it` | 交互式运行，常用于进入 Linux shell |
| `--rm` | 容器退出后自动删除，适合临时测试 |
| `-p 宿主机端口:容器端口` | 端口映射，例如 `-p 8080:80` |
| `-P` | 随机映射容器暴露的端口 |
| `-v 宿主机路径:容器路径` | 目录挂载，例如 `-v /data:/var/lib/mysql` |
| `-v 卷名:容器路径` | Docker 数据卷挂载，例如 `-v mysql-data:/var/lib/mysql` |
| `--mount` | 更清晰的挂载写法，适合复杂挂载 |
| `-e 变量名=变量值` | 设置环境变量 |
| `--env-file 文件路径` | 从文件读取多个环境变量 |
| `--restart=always` | Docker 启动后自动重启容器 |
| `--restart=unless-stopped` | 除非手动停止，否则自动重启 |
| `--network 网络名` | 指定容器网络 |
| `--hostname 主机名` | 设置容器内部主机名 |
| `--add-host 域名:IP` | 给容器添加 hosts 解析 |
| `-w 容器内目录` | 指定容器工作目录 |
| `-u 用户名或UID` | 指定容器内运行用户 |
| `--entrypoint 命令` | 覆盖镜像默认入口命令 |
| `--privileged=true` | 使用特权模式运行，权限很高，谨慎使用 |
| `--cpus=数量` | 限制 CPU 使用量，例如 `--cpus=1` |
| `-m 内存大小` | 限制内存使用量，例如 `-m 512m` |

示例：

```sh
# 启动 CentOS 并进入 bash
# -it 是 OPTIONS，centos:7 是 IMAGE，/bin/bash 是 COMMAND
docker run -it centos:7 /bin/bash

# 后台运行 nginx，并把宿主机 3344 端口映射到容器 80 端口
# -d、--name、-p 是 OPTIONS，nginx 是 IMAGE，没有写 COMMAND，使用镜像默认命令
docker run -d --name nginx01 -p 3344:80 nginx

# 启动 Ubuntu，在容器里执行 echo hello，执行完后容器退出
# --rm 是 OPTIONS，ubuntu:24.04 是 IMAGE，echo 是 COMMAND，hello 是 ARG
docker run --rm ubuntu:24.04 echo hello

# 启动 MySQL，设置密码、端口映射和数据目录
# mysql:8.4 是 IMAGE，后面没有 COMMAND，使用 MySQL 镜像默认启动命令
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=root \
  -v /mydata/mysql/data:/var/lib/mysql \
  --restart=always \
  mysql:8.4

# 覆盖 nginx 镜像默认命令，只查看 nginx 版本，不启动服务
# nginx 是 IMAGE，nginx -v 是 COMMAND
docker run --rm nginx nginx -v

# 进入正在运行的 nginx 容器
docker exec -it nginx01 /bin/bash
```

注意：`OPTIONS` 要写在 `IMAGE` 前面；`IMAGE` 后面的内容会被当成容器内部的 `COMMAND` 或 `ARG`。

退出方式：

```sh
# 退出容器，并停止当前前台进程
exit

# 退出容器，但不停止容器运行
Ctrl + P + Q
```

### 3.4 容器生命周期

```sh
# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 查看最近 N 个容器
docker ps -n=3

# 启动容器
docker start 容器ID或容器名

# 停止容器
docker stop 容器ID或容器名

# 重启容器
docker restart 容器ID或容器名

# 强制停止容器
docker kill 容器ID或容器名

# 删除容器
docker rm 容器ID或容器名

# 强制删除所有容器
docker rm -f $(docker ps -aq)
```

注意：如果容器没有持续运行的前台进程，使用 `-d` 后台运行也会很快退出。

### 3.5 容器排查命令

```sh
# 查看容器日志
docker logs 容器ID或容器名

# 查看容器进程
docker top 容器ID或容器名

# 查看容器详细信息
docker inspect 容器ID或容器名

# 查看容器资源占用
docker stats

# 进入容器，开启一个新的 shell
docker exec -it 容器ID或容器名 /bin/bash

# 附加到容器当前主进程
docker attach 容器ID或容器名
```

`docker top` 常见字段：

| 字段 | 说明 |
| --- | --- |
| `UID` | 用户 ID |
| `PID` | 进程 ID |
| `PPID` | 父进程 ID |
| `C` | CPU 使用率 |
| `STIME` | 启动时间 |
| `TTY` | 终端 |
| `TIME` | 运行时间 |
| `CMD` | 命令名 |

### 3.6 镜像管理

```sh
# 删除镜像
docker rmi 镜像ID或镜像名

# 根据容器创建新镜像
docker commit -a "hmj" -m "测试" fcda587206cf tomcat-hmj

# 说明：
# docker commit：把当前容器保存成一个新镜像
# -a "hmj"：设置镜像作者
# -m "测试"：设置提交说明
# fcda587206cf：要提交的容器 ID
# tomcat-hmj：生成的新镜像名

# 这个命令表示：
# 把容器 fcda587206cf 当前的文件系统状态保存成一个名为 tomcat-hmj 的新镜像

# 示例：先进入容器安装软件，再提交为新镜像
# docker run -it centos:7 /bin/bash
# 在容器中安装 vim、java 等
# exit
# docker commit -a "hmj" -m "安装基础环境" 容器ID my-centos-env:1.0

# 提交完成后，可以直接使用新镜像启动容器
# docker run -it my-centos-env:1.0 /bin/bash

# 查看镜像构建历史
docker history 镜像名
```

### 3.7 容器与宿主机复制文件

```sh
# 从容器复制到宿主机
docker cp 容器ID:/容器内文件路径 宿主机目标路径

# 示例
docker cp f9eb94732e48:/home/hmj.java ./download

# 从宿主机复制到容器
docker cp 宿主机文件路径 容器ID:/容器内目标路径

# 示例
docker cp hmj.java f9eb94732e48:/home
```

### 3.8 Docker 命令结构

Docker 命令一般由三部分组成：

```sh
docker 对象 操作 [参数]
```

例如：

```sh
# 对 container 容器对象执行 run 运行操作
docker container run -d --name nginx nginx

# 对 image 镜像对象执行 ls 查看操作
docker image ls

# 对 volume 数据卷对象执行 ls 查看操作
docker volume ls
```

常见对象：

| 对象 | 说明 | 示例 |
| --- | --- | --- |
| `container` | 容器相关操作 | `docker container ls` |
| `image` | 镜像相关操作 | `docker image ls` |
| `volume` | 数据卷相关操作 | `docker volume ls` |
| `network` | 网络相关操作 | `docker network ls` |
| `system` | Docker 整体信息和清理 | `docker system df` |

很多命令都有简写形式：

| 完整命令 | 常用简写 |
| --- | --- |
| `docker container ls` | `docker ps` |
| `docker image ls` | `docker images` |
| `docker container rm` | `docker rm` |
| `docker image rm` | `docker rmi` |

### 3.9 常用命令速查

#### 镜像命令

| 命令 | 说明 |
| --- | --- |
| `docker images` | 查看本地镜像列表 |
| `docker image ls` | 查看本地镜像列表，和 `docker images` 类似 |
| `docker pull 镜像名:版本` | 从远程仓库拉取镜像 |
| `docker push 镜像名:版本` | 推送镜像到远程仓库 |
| `docker search 关键词` | 在 Docker Hub 搜索镜像 |
| `docker rmi 镜像ID或镜像名` | 删除本地镜像 |
| `docker image inspect 镜像名` | 查看镜像详细信息 |
| `docker tag 原镜像 新镜像名:版本` | 给镜像重新打标签 |
| `docker build -t 镜像名:版本 .` | 根据 Dockerfile 构建镜像 |
| `docker history 镜像名` | 查看镜像构建历史 |

示例：

```sh
# 拉取 nginx 指定版本
docker pull nginx:1.29.6

# 给镜像打标签
docker tag nginx:1.29.6 my-nginx:1.0

# 删除镜像
docker rmi my-nginx:1.0
```

#### 容器命令

| 命令 | 说明 |
| --- | --- |
| `docker ps` | 查看正在运行的容器 |
| `docker ps -a` | 查看所有容器，包括已停止容器 |
| `docker run 镜像名` | 根据镜像创建并启动容器 |
| `docker create 镜像名` | 只创建容器，不启动 |
| `docker start 容器名` | 启动已存在的容器 |
| `docker stop 容器名` | 正常停止容器 |
| `docker restart 容器名` | 重启容器 |
| `docker kill 容器名` | 强制停止容器 |
| `docker rm 容器名` | 删除已停止的容器 |
| `docker rm -f 容器名` | 强制删除容器 |
| `docker rename 旧名 新名` | 重命名容器 |
| `docker logs 容器名` | 查看容器日志 |
| `docker exec -it 容器名 /bin/bash` | 进入运行中的容器 |
| `docker inspect 容器名` | 查看容器详细信息 |
| `docker stats` | 查看容器资源占用 |
| `docker top 容器名` | 查看容器内进程 |

示例：

```sh
# 后台启动 nginx
docker run -d --name nginx01 -p 8080:80 nginx

# 查看最近 100 行日志，并持续输出
docker logs -f --tail=100 nginx01

# 进入容器
docker exec -it nginx01 /bin/bash

# 停止并删除容器
docker stop nginx01
docker rm nginx01
```

#### 数据卷命令

| 命令 | 说明 |
| --- | --- |
| `docker volume ls` | 查看数据卷 |
| `docker volume create 卷名` | 创建数据卷 |
| `docker volume inspect 卷名` | 查看数据卷详情 |
| `docker volume rm 卷名` | 删除数据卷 |
| `docker volume prune` | 清理没有被容器使用的数据卷 |

示例：

```sh
# 创建数据卷
docker volume create mysql-data

# 使用数据卷启动 MySQL
docker run -d \
  --name mysql \
  -v mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  mysql:8.4
```

#### 网络命令

| 命令 | 说明 |
| --- | --- |
| `docker network ls` | 查看 Docker 网络 |
| `docker network create 网络名` | 创建网络 |
| `docker network inspect 网络名` | 查看网络详情 |
| `docker network connect 网络名 容器名` | 把容器加入网络 |
| `docker network disconnect 网络名 容器名` | 把容器移出网络 |
| `docker network rm 网络名` | 删除网络 |
| `docker network prune` | 清理没有被使用的网络 |

示例：

```sh
# 创建自定义网络
docker network create mynet

# 启动容器时加入网络
docker run -d --name nginx01 --network mynet nginx

# 把已有容器加入网络
docker network connect mynet mysql
```

### 3.10 `docker run` 参数补充

| 参数 | 说明 |
| --- | --- |
| `--name` | 指定容器名称 |
| `-d` | 后台运行容器 |
| `-it` | 交互式运行，常用于进入 shell |
| `-p` | 端口映射，格式为 `宿主机端口:容器端口` |
| `-P` | 随机映射容器暴露的端口 |
| `-v` | 挂载目录或数据卷 |
| `--mount` | 更清晰的挂载写法，适合生产环境 |
| `-e` | 设置环境变量 |
| `--env-file` | 从文件读取环境变量 |
| `--restart` | 设置容器重启策略 |
| `--network` | 指定容器网络 |
| `--hostname` | 设置容器主机名 |
| `--privileged` | 使用特权模式运行 |
| `--rm` | 容器退出后自动删除 |
| `--cpus` | 限制 CPU 使用量 |
| `-m` | 限制内存使用量 |

示例：

```sh
# 容器退出后自动删除，适合临时测试
docker run --rm -it ubuntu:24.04 bash

# 限制容器最多使用 1 个 CPU 和 512M 内存
docker run -d \
  --name nginx-limit \
  --cpus=1 \
  -m 512m \
  nginx

# 使用 --mount 挂载目录
docker run -d \
  --name nginx-mount \
  --mount type=bind,source=/mydata/nginx/html,target=/usr/share/nginx/html \
  -p 80:80 \
  nginx
```

### 3.11 日志与排查技巧

```sh
# 持续查看日志
docker logs -f 容器名

# 查看最后 100 行日志
docker logs --tail=100 容器名

# 查看最近 10 分钟日志
docker logs --since=10m 容器名

# 查看日志并显示时间
docker logs -t 容器名

# 查看容器退出状态码
docker inspect 容器名 --format='{{.State.ExitCode}}'

# 查看容器 IP 地址
docker inspect 容器名 --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'

# 查看容器挂载信息
docker inspect 容器名 --format='{{json .Mounts}}'
```

`docker logs` 常用参数说明：

| 参数 | 说明 |
| --- | --- |
| `-f` / `--follow` | 持续追踪日志输出，类似 `tail -f` |
| `--tail=100` | 只显示最后 100 行日志 |
| `--tail=0` | 不显示历史日志，只看后续新增日志 |
| `--since=10m` | 只查看最近 10 分钟的日志 |
| `--since="2026-04-23T09:00:00"` | 从指定时间开始查看日志 |
| `--until=10m` | 只查看某个时间点之前的日志 |
| `-t` / `--timestamps` | 显示日志时间戳 |
| `--details` | 显示更详细的日志元信息 |

示例说明：

```sh
docker logs -f --tail=100 nginx01
```

这条命令的意思是：

- `docker logs`：查看容器日志
- `-f`：持续输出后续新增日志
- `--tail=100`：先显示当前已有日志的最后 `100` 行
- `nginx01`：目标容器名

也就是说，它会先显示 `nginx01` 最近 `100` 行日志，然后继续实时输出新日志。

常见排查思路：

1. 先用 `docker ps -a` 看容器是否已经退出。
2. 再用 `docker logs 容器名` 查看启动报错。
3. 如果端口访问失败，用 `docker port 容器名` 查看端口映射。
4. 如果容器间无法访问，检查是否在同一个 Docker 网络。
5. 如果数据没有持久化，检查 `-v` 或 `--mount` 是否挂载正确。

### 3.12 导入、导出、备份

#### 镜像保存与加载

```sh
# 保存镜像到 tar 文件
docker save -o nginx.tar nginx:1.29.6

# 从 tar 文件加载镜像
docker load -i nginx.tar
```

适合场景：离线迁移镜像，保留镜像历史和标签。

#### 容器导出与导入

```sh
# 导出容器文件系统
docker export -o nginx-container.tar nginx01

# 导入为新镜像
docker import nginx-container.tar nginx-import:1.0
```

适合场景：只迁移容器当前文件系统，不保留镜像构建历史。

区别：

| 命令 | 对象 | 是否保留镜像历史 | 常用场景 |
| --- | --- | --- | --- |
| `docker save/load` | 镜像 | 保留 | 镜像备份、离线迁移 |
| `docker export/import` | 容器文件系统 | 不保留 | 导出容器当前状态 |

### 3.13 清理命令

清理命令会删除本地资源，执行前建议先确认是否还需要这些容器、镜像、卷或网络。

```sh
# 查看 Docker 磁盘占用
docker system df

# 清理停止的容器、未使用的网络、悬空镜像、构建缓存
docker system prune

# 清理更多未使用镜像
docker system prune -a

# 清理停止的容器
docker container prune

# 清理悬空镜像
docker image prune

# 清理未使用的数据卷
docker volume prune

# 清理未使用的网络
docker network prune

# 清理构建缓存
docker builder prune
```

常见批量删除命令：

```sh
# 删除所有已停止容器
docker rm $(docker ps -aq -f status=exited)

# 删除所有容器
docker rm -f $(docker ps -aq)

# 删除所有悬空镜像
docker rmi $(docker images -f "dangling=true" -q)
```

注意：`docker volume prune` 可能删除数据库数据卷，执行前一定要确认。

## 4. 数据卷与挂载

### 4.1 挂载方式

```sh
# 绑定挂载：宿主机目录 -> 容器目录
-v /host/path:/container/path

# 只读挂载
-v /host/path:/container/path:ro

# 读写挂载
-v /host/path:/container/path:rw

# 命名卷
-v volume_name:/container/path

# 匿名卷
-v /container/path
```

说明：

- `ro`：只读，容器内无法修改挂载内容。
- `rw`：读写，容器内可以修改挂载内容。
- 命名卷删除容器后数据仍会保留，除非手动删除卷。

### 4.2 数据卷命令

```sh
# 查看 Docker 卷
docker volume ls

# 查看 Docker 卷详细信息
docker volume inspect 卷名
```

### 4.3 查看容器挂载信息

可以通过 `docker inspect 容器名` 查看挂载信息：

```json
{
  "Mounts": [
    {
      "Type": "bind",
      "Source": "/home",
      "Destination": "/home",
      "Mode": "",
      "RW": true,
      "Propagation": "rprivate"
    }
  ]
}
```

## 5. Docker 网络

### 5.1 查看网络

```sh
docker network ls
```

### 5.2 创建自定义网络

```sh
docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 mynet
docker network create --driver bridge --subnet 172.30.10.0/24 --gateway 172.30.10.1 mynet
```

说明：

- `--driver bridge`：使用桥接网络模式。
- `--subnet`：指定子网。
- `--gateway`：指定网关。
- 同一个自定义网络中的容器可以通过容器名互相访问。

### 5.3 使用自定义网络启动容器

```sh
docker run -d \
  --name nginx01 \
  --network mynet \
  -p 3344:80 \
  nginx
```

### 5.4 把已有容器加入网络

```sh
docker network connect mynet tomcat01
```

### 5.5 Linux 手动配置网卡

```sh
# 启用 eth1 网卡
sudo ip link set eth1 up

# 手动配置 IP 地址
sudo ip addr add 192.168.56.10/24 dev eth1

# 验证配置
ip addr show eth1
```

## 6. Dockerfile

### 6.1 简单示例

```dockerfile
FROM centos:7

VOLUME ["volume0", "volume1"]

CMD echo "-----end------"
CMD /bin/bash
```

构建镜像：

```sh
docker build -f /home/dockerfile01 -t hmj/centos:8 .
```

参数说明：

- `-f`：指定 Dockerfile 文件路径。
- `-t`：指定镜像名称和标签。
- `.`：指定构建上下文为当前目录。

### 6.2 Dockerfile 常用指令

```dockerfile
FROM centos:7
LABEL maintainer="hmj"

RUN yum -y install wget
RUN mkdir /home/hmj
RUN wget https://www.baidu.com -O /home/hmj/baidu.html

COPY hmj.java /home/hmj/hmj.java
ADD app.zip /home/hmj

WORKDIR /home/hmj

ENV JAVA_HOME=/usr/local/jdk1.8
ENV PORT=8080
ARG PORT=8080

EXPOSE 8080 8081
VOLUME ["/home/hmj/volume0", "/home/hmj/volume1"]

CMD echo "-----end------"
CMD /bin/bash
CMD ["ls", "-l"]

ENTRYPOINT ["/bin/bash", "-c"]
```

常用指令说明：

| 指令 | 说明 |
| --- | --- |
| `FROM` | 指定基础镜像 |
| `LABEL` | 设置镜像元数据，例如作者 |
| `RUN` | 构建镜像时执行命令 |
| `COPY` | 复制文件到镜像 |
| `ADD` | 复制文件，压缩包会自动解压 |
| `WORKDIR` | 设置工作目录 |
| `ENV` | 设置环境变量 |
| `ARG` | 设置构建参数 |
| `EXPOSE` | 声明容器监听端口 |
| `VOLUME` | 声明挂载目录 |
| `CMD` | 容器启动默认命令，多个 `CMD` 只有最后一个生效 |
| `ENTRYPOINT` | 容器启动入口命令，常用于固定执行程序 |

### 6.3 共享数据卷

```sh
docker run --volumes-from 数据卷容器名 新容器镜像
```

说明：`--volumes-from` 可以继承其他容器的数据卷。即使删除容器，只要卷没有删除，数据仍然保留。

## 7. 常见服务部署示例

### 7.1 MySQL

#### Linux

```sh
docker rm -f mysql

docker run -d --name mysql -p 3306:3306 -v /mydata/mysql/log:/var/log/mysql -v /mydata/mysql/data:/var/lib/mysql -v /mydata/mysql/conf.d:/etc/mysql/conf.d -e MYSQL_ROOT_PASSWORD=root -e TZ=Asia/Shanghai -e MYSQL_INITDB_SKIP_TZINFO=1 --restart=always mysql:8.4
```

#### Windows

```sh
docker run -d --name mysql -p 3306:3306 -v "D:\mydata\mysql\log:/var/log/mysql" -v "D:\mydata\mysql\data:/var/lib/mysql" -v "D:\mydata\mysql\conf.d:/etc/mysql/conf.d" -e MYSQL_ROOT_PASSWORD=root -e TZ=Asia/Shanghai -e MYSQL_INITDB_SKIP_TZINFO=1 --network mynet --restart=always mysql:8.4
```

检查 MySQL 状态：

```sh
docker exec mysql service mysql status
```

DBeaver 连接参数：

```text
allowPublicKeyRetrieval=true
useSSL=false
serverTimezone=Asia/Shanghai
```

### 7.2 Nacos

#### Linux 单机模式

```sh
docker run -d \
  --name nacos-quick \
  -e MODE=standalone \
  -p 8849:8848 \
  -v /mydata/nacos/conf:/home/nacos/conf \
  -v /mydata/nacos/data:/home/nacos/data \
  -v /mydata/nacos/logs:/home/nacos/logs \
  nacos/nacos-server:2.0.2
```

#### Windows 连接 MySQL

```sh
docker run -d --name nacos-quick -e MODE=standalone -e SPRING_DATASOURCE_PLATFORM=mysql -e MYSQL_SERVICE_HOST=mysql -e MYSQL_SERVICE_PORT=3306 -e MYSQL_SERVICE_DB_NAME=nacos_config -e MYSQL_SERVICE_USER=root -e MYSQL_SERVICE_PASSWORD=root -p 8849:8848 -v "D:\mydata\nacos\conf:/home/nacos/conf" -v "D:\mydata\nacos\data:/home/nacos/data" -v "D:\mydata\nacos\logs:/home/nacos/logs" --network mynet nacos/nacos-server:v2.2.3
```

注意：Nacos 连接 MySQL 时，两个容器需要加入同一个 Docker 网络。

### 7.3 Nginx

```sh
docker run -d --name nginx -v "D:\mydata\nginx\conf\nginx:/etc/nginx" -v "D:\mydata\nginx\log\nginx:/var/log/nginx" -v "D:\mydata\nginx\html:/usr/share/nginx/html" -p 80:80 --network mynet nginx:1.29.6
```

### 7.4 Elasticsearch

#### 使用 Docker 卷

```sh
docker run -d \
  --name elasticsearch \
  -v elasticsearch-config:/usr/share/elasticsearch/config \
  -v elasticsearch-data:/usr/share/elasticsearch/data \
  -v elasticsearch-plugins:/usr/share/elasticsearch/plugins \
  --net mynet \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  elasticsearch:8.19.13
```

#### 使用宿主机目录

```sh
docker run -d \
  --name elasticsearch \
  -v "D:\mydata\elasticsearch\config:/usr/share/elasticsearch/config" \
  -v "D:\mydata\elasticsearch\data:/usr/share/elasticsearch/data" \
  -v "D:\mydata\elasticsearch\plugins:/usr/share/elasticsearch/plugins" \
  --net mynet \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  elasticsearch:8.19.13
```

### 7.5 Kibana

#### 使用 Docker 卷

```sh
docker run -d \
  --name kibana \
  -v kibana-data:/usr/share/kibana/data \
  -v kibana-config:/usr/share/kibana/config \
  -v kibana-plugins:/usr/share/kibana/plugins \
  --net mynet \
  -p 5601:5601 \
  kibana:8.19.13
```

#### 使用宿主机目录

```sh
docker run -d \
  --name kibana \
  -v "D:\mydata\kibana\data:/usr/share/kibana/data" \
  -v "D:\mydata\kibana\config:/usr/share/kibana/config" \
  -v "D:\mydata\kibana\plugins:/usr/share/kibana/plugins" \
  --net mynet \
  -p 5601:5601 \
  kibana:8.19.13
```

### 7.6 Redis

```sh
# 创建 Redis 配置和数据目录
mkdir -p /myredis/conf /myredis/data

# 下载 Redis 配置文件
wget https://raw.githubusercontent.com/redis/redis/7.2/redis.conf -O /myredis/conf/redis.conf

# 启动 Redis
docker run -d \
  --name myredis \
  -v /myredis/conf:/usr/local/etc/redis \
  -v /myredis/data:/data \
  redis:latest \
  redis-server /usr/local/etc/redis/redis.conf
```

docker run -d --name redis -v "D:\mydata\redis\conf:/usr/local/etc/redis/conf" -v "D:\mydata\redis\data:/data" -v "D:\mydata\redis\log:/var/log/redis/log" --network mynet redis:8.6.3 /usr/local/etc/redis/conf/redis.conf

## 8. 常见问题记录

### 8.1 为什么容器启动后马上退出？

Docker 容器需要有一个持续运行的前台进程。如果镜像启动命令执行完就退出，容器也会随之停止。

例如：

```sh
docker run -d centos:7
```

`centos:7` 默认没有持续运行的前台服务，所以会很快退出。可以改成：

```sh
docker run -it centos:7 /bin/bash
```

### 8.2 `docker exec` 和 `docker attach` 的区别

| 命令 | 说明 |
| --- | --- |
| `docker exec -it 容器名 /bin/bash` | 进入容器并创建一个新的 shell，推荐使用 |
| `docker attach 容器名` | 附加到容器主进程，退出方式不当可能会影响容器运行 |

### 8.3 `CMD` 和 `ENTRYPOINT` 的区别

| 指令 | 说明 |
| --- | --- |
| `CMD` | 提供默认启动命令，运行容器时可以被覆盖 |
| `ENTRYPOINT` | 固定容器入口，运行容器时传入的参数通常会追加到入口后面 |

### maplibre 可用的字体文件生成,otf和ttf都可，字体文件查看推荐：https://www.fonts.net.cn/commercial-free/fonts-zh-1.html
docker run --name fontswap -v C:\Users\PC\Desktop\fontswap:/fonts/input -v C:\Users\PC\Desktop\fontswap:/fonts/out jmbarbier/fontnik /fonts/input /fonts/out