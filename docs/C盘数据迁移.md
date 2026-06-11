# 2026-06-11 本地开发环境目录迁移记录

## 今天处理了什么

今天主要整理了几个占用 `C` 盘空间的开发工具目录，并把部分目录迁移到 `D` 盘。核心目标是减少 `C` 盘占用，同时保证原工具仍然能按原路径正常访问。

涉及目录：

- `C:\Users\PC\.vagrant.d`
- `C:\Users\PC\VirtualBox VMs`
- `C:\Users\PC\.m2`
- `C:\Users\PC\.android`
- `C:\Users\PC\.lingma`

## 各目录用途

### `.vagrant.d`

`C:\Users\PC\.vagrant.d` 是 Vagrant 的全局目录。

常见内容：

- `boxes`：Vagrant 下载的基础虚拟机镜像缓存
- `plugins`：Vagrant 插件
- `tmp`：临时文件
- 全局配置和缓存

今天查到的文件：

```text
C:\Users\PC\.vagrant.d\boxes\generic-VAGRANTSLASH-ubuntu2204\4.3.12\amd64\virtualbox\generic-ubuntu2204-virtualbox-x64-disk001.vmdk
```

这个文件是 `generic/ubuntu2204` 的 Vagrant box 基础镜像，大小约 `2GB`。

### `VirtualBox VMs`

`C:\Users\PC\VirtualBox VMs` 是 VirtualBox 虚拟机实例目录。

今天查到的文件：

```text
C:\Users\PC\VirtualBox VMs\PC_default_1773644707280_74529\generic-ubuntu2204-virtualbox-x64-disk001.vmdk
```

这个文件是实际创建出来的 Ubuntu 22.04 虚拟机磁盘，大小约 `10GB`。

它和 `.vagrant.d` 的关系：

```text
Vagrant box 基础镜像 -> 创建 VirtualBox 虚拟机 -> 生成实际虚拟机磁盘
```

当前 Vagrant 虚拟机状态已从 `running` 停止为：

```text
poweroff
```

对应命令：

```powershell
vagrant halt 68a55b8
vagrant global-status
```

### `.m2`

`C:\Users\PC\.m2` 是 Maven 使用的目录，Java 项目常见。

常见内容：

- `repository`：Maven 本地依赖仓库，最占空间
- `settings.xml`：Maven 配置文件

如果 IDEA 使用的是内置 Maven，本地可能没有全局 `mvn` 命令。这种情况下仍然可以通过 IDEA 的 Maven 设置或 `settings.xml` 配置本地仓库位置。

### `.android`

`C:\Users\PC\.android` 是 Android 开发工具使用的用户目录。

常见内容：

- `debug.keystore`：Android 调试签名证书
- `adbkey` / `adbkey.pub`：ADB 连接设备用的密钥
- `avd`：Android 模拟器目录，通常最占空间

今天迁移的是：

```text
C:\Users\PC\.android\avd
```

迁移目标：

```text
D:\Android\.android\avd
```

### `.lingma`

`C:\Users\PC\.lingma` 是通义灵码 / Lingma 相关工具的本地目录。

可能包含：

- 登录态
- 插件缓存
- 日志
- 本地索引
- 会话缓存

今天已迁移到：

```text
D:\Lingma\.lingma
```

并在原路径创建了 Junction：

```text
C:\Users\PC\.lingma -> D:\Lingma\.lingma
```

注意：现在 `C:\Users\PC\.lingma` 里看到的文件，实际是 `D:\Lingma\.lingma` 的内容，不要从 C 盘入口清空。

## 今天执行过的迁移

### 迁移 Android AVD

创建目标目录：

```powershell
New-Item -ItemType Directory -Path "D:\Android\.android" -Force
```

复制 AVD：

```powershell
Copy-Item -Path "C:\Users\PC\.android\avd" -Destination "D:\Android\.android\avd" -Recurse
```

设置环境变量：

```powershell
setx ANDROID_AVD_HOME "D:\Android\.android\avd"
```

验证用户环境变量是否写入：

```powershell
[Environment]::GetEnvironmentVariable("ANDROID_AVD_HOME", "User")
```

说明：

- `setx` 不会影响当前 PowerShell
- 需要重新打开 PowerShell 才能通过 `$env:ANDROID_AVD_HOME` 看到新值

重新打开 PowerShell 后验证：

```powershell
echo $env:ANDROID_AVD_HOME
```

### 迁移 Lingma

创建目标目录：

```powershell
New-Item -ItemType Directory -Path "D:\Lingma" -Force
```

移动原目录：

```powershell
Move-Item -Path "C:\Users\PC\.lingma" -Destination "D:\Lingma\.lingma"
```

创建 Junction：

```powershell
New-Item -ItemType Junction -Path "C:\Users\PC\.lingma" -Target "D:\Lingma\.lingma"
```

验证是否为 Junction：

```powershell
Get-Item "C:\Users\PC\.lingma"
```

如果 `Mode` 显示类似：

```text
d----l
```

说明它已经是链接目录。

验证目标路径：

```powershell
(Get-Item "C:\Users\PC\.lingma").Target
```

期望输出：

```text
D:\Lingma\.lingma
```

## 后续可选迁移

### 迁移 Vagrant 全局目录

如果后续要把 Vagrant 的全局缓存放到 D 盘，可以设置：

```powershell
setx VAGRANT_HOME "D:\Vagrant\.vagrant.d"
```

如果要迁移旧数据，推荐流程：

```powershell
vagrant halt 68a55b8
New-Item -ItemType Directory -Path "D:\Vagrant" -Force
Copy-Item -Path "C:\Users\PC\.vagrant.d" -Destination "D:\Vagrant\.vagrant.d" -Recurse
setx VAGRANT_HOME "D:\Vagrant\.vagrant.d"
```

重新打开 PowerShell 后验证：

```powershell
echo $env:VAGRANT_HOME
vagrant box list
```

确认没问题后，再考虑把旧目录改名备份：

```powershell
Rename-Item "C:\Users\PC\.vagrant.d" ".vagrant.d.bak"
```

确认一段时间无问题后再删除备份。

### 清理或迁移 VirtualBox 虚拟机

当前虚拟机 ID：

```text
68a55b8
```

如果不再需要这个虚拟机，可以删除实例：

```powershell
vagrant destroy 68a55b8
```

这通常会删除：

```text
C:\Users\PC\VirtualBox VMs\PC_default_1773644707280_74529
```

如果只是想迁移到 D 盘，不建议直接剪切 `.vmdk` 文件。推荐在 VirtualBox 中移动或克隆虚拟机。

### 迁移 Maven 本地仓库

创建 D 盘仓库：

```powershell
New-Item -ItemType Directory -Path "D:\Maven\repository" -Force
```

复制旧仓库：

```powershell
Copy-Item -Path "C:\Users\PC\.m2\repository\*" -Destination "D:\Maven\repository" -Recurse
```

修改：

```text
C:\Users\PC\.m2\settings.xml
```

加入：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings>
  <localRepository>D:/Maven/repository</localRepository>
</settings>
```

如果原来已有 `settings.xml`，不要覆盖整文件，只在 `<settings>` 内加入：

```xml
<localRepository>D:/Maven/repository</localRepository>
```

如果 IDEA 使用内置 Maven，可以在 IDEA 里检查：

```text
File -> Settings -> Build, Execution, Deployment -> Build Tools -> Maven
```

重点检查：

- `User settings file`
- `Local repository`

## 恢复方法

### 恢复 Android AVD

关闭 Android Studio 和模拟器。

删除用户环境变量：

```powershell
[Environment]::SetEnvironmentVariable("ANDROID_AVD_HOME", $null, "User")
```

把 AVD 移回 C 盘：

```powershell
Move-Item -Path "D:\Android\.android\avd" -Destination "C:\Users\PC\.android\avd"
```

重新打开 Android Studio，确认 Device Manager 正常。

### 恢复 Lingma

关闭 IDEA / VSCode / Lingma 相关进程。

删除 C 盘 Junction：

```powershell
Remove-Item "C:\Users\PC\.lingma"
```

把真实目录移回 C 盘：

```powershell
Move-Item "D:\Lingma\.lingma" "C:\Users\PC\.lingma"
```

注意：`Remove-Item "C:\Users\PC\.lingma"` 在当前状态下删除的是 Junction 入口，不是 D 盘真实数据。

### 恢复 Vagrant 全局目录

删除用户环境变量：

```powershell
[Environment]::SetEnvironmentVariable("VAGRANT_HOME", $null, "User")
```

如果之前把 `.vagrant.d` 移到了 D 盘，可以移回：

```powershell
Move-Item "D:\Vagrant\.vagrant.d" "C:\Users\PC\.vagrant.d"
```

重新打开 PowerShell 后检查：

```powershell
vagrant box list
vagrant global-status
```

### 恢复 Maven 本地仓库

编辑：

```text
C:\Users\PC\.m2\settings.xml
```

删除或注释：

```xml
<localRepository>D:/Maven/repository</localRepository>
```

Maven 会恢复使用默认位置：

```text
C:\Users\PC\.m2\repository
```

如果需要把依赖缓存移回：

```powershell
Copy-Item -Path "D:\Maven\repository\*" -Destination "C:\Users\PC\.m2\repository" -Recurse
```

## 注意事项

- 不要直接清空 `C:\Users\PC\.lingma`，它现在是 Junction，里面显示的是 D 盘真实文件。
- `setx` 设置环境变量后，要重新打开 PowerShell 或 IDE 才能生效。
- 迁移前要关闭相关软件，比如 Android Studio、IDEA、VSCode、VirtualBox。
- 删除旧目录前，优先改名为 `.bak`，确认几天无问题后再删除。
- VirtualBox 的 `.vmdk` 不建议直接手动剪切，优先使用 VirtualBox 的移动、克隆或 Vagrant 的销毁重建流程。
