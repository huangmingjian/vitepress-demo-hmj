---
outline: deep
---

# Redis 学习笔记

Redis 是一个基于内存的高性能 Key-Value 数据库，常用于缓存、分布式锁、计数器、排行榜、消息发布订阅、限流等场景。

## 1. 基础概念

### 1.1 Redis 特点

- **内存存储**：读写速度快。
- **Key-Value 结构**：通过 key 操作不同类型的数据。
- **支持多种数据类型**：String、List、Set、Hash、ZSet、Bitmap、Geo、Stream 等。
- **支持持久化**：RDB 快照和 AOF 日志。
- **支持主从复制、哨兵、集群**：用于高可用和扩展。

### 1.2 默认数据库

Redis 默认有 `16` 个逻辑数据库，编号为 `0` 到 `15`。

```sh
# 切换到 3 号数据库
select 3

# 切回 0 号数据库
select 0
```

注意：

- 默认连接的是 `0` 号数据库。
- 不同数据库之间 key 相互隔离。
- 生产环境更推荐通过 key 前缀区分业务，而不是依赖多个逻辑库。

## 2. 连接和性能测试

### 2.1 启动 redis-cli

```sh
# 连接本机默认 Redis
redis-cli

# 指定主机和端口
redis-cli -h 127.0.0.1 -p 6379

# 如果 Redis 设置了密码
redis-cli -h 127.0.0.1 -p 6379 -a 密码
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `redis-cli` | `redis-cli` | Redis 命令行客户端 |
| `redis-cli -h 127.0.0.1 -p 6379` | `-h` | host，指定 Redis 服务器地址 |
| `redis-cli -h 127.0.0.1 -p 6379` | `127.0.0.1` | Redis 服务器 IP，本机地址 |
| `redis-cli -h 127.0.0.1 -p 6379` | `-p` | port，指定 Redis 端口 |
| `redis-cli -h 127.0.0.1 -p 6379` | `6379` | Redis 默认端口 |
| `redis-cli -a 密码` | `-a` | auth，指定连接密码 |

### 2.2 测试服务是否正常

```redis
127.0.0.1:6379> ping
PONG
```

说明：

- 返回 `PONG` 表示 Redis 服务正常。
- 如果连接失败，先检查 Redis 是否启动、端口是否正确、防火墙是否放行。

命令拆解：

| 命令 | 单词 | 说明 |
| --- | --- | --- |
| `ping` | `ping` | 向 Redis 发送心跳测试命令 |
| `PONG` | `PONG` | Redis 返回的正常响应 |

### 2.3 性能测试

```sh
redis-benchmark -h localhost -p 6379 -c 100 -n 100000
```

参数说明：

| 参数 | 说明 |
| --- | --- |
| `-h localhost` | Redis 主机地址 |
| `-p 6379` | Redis 端口 |
| `-c 100` | 并发连接数 |
| `-n 100000` | 请求总数 |

示例含义：使用 `100` 个并发连接，总共发送 `100000` 次请求测试 Redis 性能。

命令拆解：

| 单词 / 参数 | 说明 |
| --- | --- |
| `redis-benchmark` | Redis 自带的性能测试工具 |
| `-h localhost` | 指定 Redis 地址为本机 |
| `-p 6379` | 指定 Redis 端口为 `6379` |
| `-c 100` | 模拟 `100` 个并发客户端 |
| `-n 100000` | 总共执行 `100000` 次请求 |

## 3. Key 通用命令

Key 通用命令适用于所有数据类型。

### 3.1 基础操作

```redis
# 查看所有 key，学习时可以用，生产环境慎用
keys *

# 推荐使用 scan 分批扫描 key，避免阻塞 Redis
scan 0 match user:* count 100

# 判断 key 是否存在，存在返回 1，不存在返回 0
exists name

# 删除 key
del name

# 异步删除 key，适合删除大 key
unlink bigkey

# 查看 key 类型
type name

# 重命名 key
rename oldKey newKey

# 仅当 newKey 不存在时才重命名
renamenx oldKey newKey
```

示例：

```redis
127.0.0.1:6379> set name redis
OK
127.0.0.1:6379> exists name
(integer) 1
127.0.0.1:6379> type name
string
127.0.0.1:6379> del name
(integer) 1
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `keys *` | `keys` | 查看匹配规则的 key |
| `keys *` | `*` | 通配符，表示匹配所有 key |
| `scan 0 match user:* count 100` | `scan` | 分批扫描 key |
| `scan 0 match user:* count 100` | `0` | 游标，从 `0` 开始扫描 |
| `scan 0 match user:* count 100` | `match user:*` | 只匹配 `user:` 开头的 key |
| `scan 0 match user:* count 100` | `count 100` | 建议每次扫描约 `100` 条 |
| `exists name` | `exists` | 判断 key 是否存在 |
| `exists name` | `name` | 要判断的 key 名 |
| `del name` | `del` | 删除 key |
| `unlink bigkey` | `unlink` | 异步删除 key，适合大 key |
| `type name` | `type` | 查看 key 的数据类型 |
| `rename oldKey newKey` | `rename` | 重命名 key |
| `rename oldKey newKey` | `oldKey` | 原来的 key |
| `rename oldKey newKey` | `newKey` | 新的 key |

### 3.2 过期时间

```redis
# 设置 key 10 秒后过期
expire name 10

# 设置 key 在指定 Unix 时间戳过期
expireat name 1735689600

# 查看剩余过期时间，单位秒
ttl name

# 查看剩余过期时间，单位毫秒
pttl name

# 移除过期时间，变成永久 key
persist name
```

`ttl` 返回值说明：

| 返回值 | 说明 |
| --- | --- |
| 正数 | 剩余过期时间，单位秒 |
| `-1` | key 存在，但没有设置过期时间 |
| `-2` | key 不存在 |

示例：

```redis
127.0.0.1:6379> set code 123456
OK
127.0.0.1:6379> expire code 10
(integer) 1
127.0.0.1:6379> ttl code
(integer) 8
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `expire name 10` | `expire` | 给 key 设置过期时间 |
| `expire name 10` | `name` | 要设置过期时间的 key |
| `expire name 10` | `10` | 10 秒后过期 |
| `expireat name 1735689600` | `expireat` | 指定 Unix 时间戳过期 |
| `ttl name` | `ttl` | 查看 key 剩余过期时间，单位秒 |
| `pttl name` | `pttl` | 查看 key 剩余过期时间，单位毫秒 |
| `persist name` | `persist` | 移除过期时间，让 key 永久存在 |

### 3.3 清空数据库

```redis
# 清空当前数据库
flushdb

# 清空所有数据库
flushall
```

注意：`flushdb` 和 `flushall` 是危险命令，会删除数据，生产环境谨慎使用。

命令拆解：

| 命令 | 单词 | 说明 |
| --- | --- | --- |
| `flushdb` | `flushdb` | flush database，清空当前数据库 |
| `flushall` | `flushall` | flush all，清空所有数据库 |

## 4. String 字符串

String 是 Redis 最基础的数据类型，可以保存字符串、数字、JSON 字符串等。

常见场景：

- 缓存普通文本或 JSON。
- 计数器。
- 短信验证码。
- 分布式锁的锁值。

### 4.1 基础命令

```redis
# 设置 key
set name redis

# 获取 key
get name

# 追加字符串，如果 key 不存在则创建
append name "-study"

# 获取字符串长度
strlen name

# 获取并设置新值，返回旧值
getset name newRedis
```

示例：

```redis
127.0.0.1:6379> set name redis
OK
127.0.0.1:6379> get name
"redis"
127.0.0.1:6379> append name "-study"
(integer) 11
127.0.0.1:6379> get name
"redis-study"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `set name redis` | `set` | 设置 String 类型的 key |
| `set name redis` | `name` | key 名 |
| `set name redis` | `redis` | value 值 |
| `get name` | `get` | 获取 String 类型的 value |
| `append name "-study"` | `append` | 在原 value 后追加内容 |
| `append name "-study"` | `"-study"` | 要追加的字符串 |
| `strlen name` | `strlen` | string length，获取字符串长度 |
| `getset name newRedis` | `getset` | 先获取旧值，再设置新值 |

### 4.2 数字自增自减

```redis
# 自增 1
incr count

# 自减 1
decr count

# 自增指定值
incrby count 10

# 自减指定值
decrby count 5

# 浮点数自增
incrbyfloat score 1.5
```

示例：

```redis
127.0.0.1:6379> set count 10
OK
127.0.0.1:6379> incr count
(integer) 11
127.0.0.1:6379> incrby count 10
(integer) 21
127.0.0.1:6379> decrby count 5
(integer) 16
```

注意：自增自减要求 value 必须是数字字符串，否则会报错。

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `incr count` | `incr` | increment，自增 1 |
| `incr count` | `count` | 要自增的 key |
| `decr count` | `decr` | decrement，自减 1 |
| `incrby count 10` | `incrby` | 按指定步长自增 |
| `incrby count 10` | `10` | 自增的数量 |
| `decrby count 5` | `decrby` | 按指定步长自减 |
| `incrbyfloat score 1.5` | `incrbyfloat` | 按浮点数自增 |

### 4.3 范围操作

```redis
# 获取字符串指定范围，0 到 -1 表示全部
getrange name 0 4

# 从指定位置开始覆盖字符串
setrange name 1 abc
```

示例：

```redis
127.0.0.1:6379> set name redis
OK
127.0.0.1:6379> getrange name 0 2
"red"
127.0.0.1:6379> setrange name 1 xxx
(integer) 5
127.0.0.1:6379> get name
"rxxxs"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `getrange name 0 2` | `getrange` | 获取字符串指定范围 |
| `getrange name 0 2` | `name` | key 名 |
| `getrange name 0 2` | `0` | 起始下标，从 0 开始 |
| `getrange name 0 2` | `2` | 结束下标，包含该位置 |
| `setrange name 1 xxx` | `setrange` | 从指定下标开始覆盖字符串 |
| `setrange name 1 xxx` | `1` | 从第 1 个下标开始覆盖 |
| `setrange name 1 xxx` | `xxx` | 覆盖的新内容 |

### 4.4 设置过期和不存在才设置

```redis
# 设置 key，并设置 20 秒过期
setex code 20 123456

# 只有 key 不存在时才设置
setnx lock order-1

# set 推荐写法：不存在才设置，并设置过期时间
set lock:order:1 uuid-value nx ex 30
```

说明：

- `setex key seconds value`：设置值和过期时间。
- `setnx key value`：只有 key 不存在时才设置成功。
- `set key value nx ex seconds`：常用于分布式锁的基础写法。

示例：

```redis
127.0.0.1:6379> setex code 20 123456
OK
127.0.0.1:6379> ttl code
(integer) 18
127.0.0.1:6379> setnx code abc
(integer) 0
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `setex code 20 123456` | `setex` | set with expire，设置值并设置过期时间 |
| `setex code 20 123456` | `code` | key 名 |
| `setex code 20 123456` | `20` | 20 秒后过期 |
| `setex code 20 123456` | `123456` | value 值 |
| `setnx lock order-1` | `setnx` | set if not exists，不存在才设置 |
| `set lock:order:1 uuid-value nx ex 30` | `set` | 设置 key |
| `set lock:order:1 uuid-value nx ex 30` | `lock:order:1` | 锁的 key |
| `set lock:order:1 uuid-value nx ex 30` | `uuid-value` | 锁的 value，用于标识锁归属 |
| `set lock:order:1 uuid-value nx ex 30` | `nx` | key 不存在才设置成功 |
| `set lock:order:1 uuid-value nx ex 30` | `ex 30` | 设置 30 秒过期时间 |

### 4.5 批量操作

```redis
# 批量设置
mset n1 redis n2 mysql n3 java

# 批量获取
mget n1 n2 n3

# 批量设置，只有所有 key 都不存在时才成功
msetnx n4 docker n5 linux
```

示例：

```redis
127.0.0.1:6379> mset user:1:name tom user:1:age 18
OK
127.0.0.1:6379> mget user:1:name user:1:age
1) "tom"
2) "18"
```

命名建议：

```text
业务名:对象名:id:字段名
```

例如：

```text
user:1:name
user:1:age
order:1001:status
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `mset n1 redis n2 mysql` | `mset` | multi set，批量设置多个 key |
| `mset n1 redis n2 mysql` | `n1 redis` | 第一组 key 和 value |
| `mset n1 redis n2 mysql` | `n2 mysql` | 第二组 key 和 value |
| `mget n1 n2 n3` | `mget` | multi get，批量获取多个 key |
| `mget n1 n2 n3` | `n1 n2 n3` | 要获取的多个 key |
| `msetnx n4 docker n5 linux` | `msetnx` | 所有 key 都不存在时才批量设置成功 |

## 5. List 列表

List 是有序列表，可以从左侧或右侧插入、弹出元素。

常见场景：

- 消息队列。
- 最新消息列表。
- 任务队列。

### 5.1 添加和查询

```redis
# 从左侧插入
lpush list a b c

# 从右侧插入
rpush list d e

# 查看指定范围，0 到 -1 表示全部
lrange list 0 -1

# 查看指定索引元素
lindex list 0

# 查看列表长度
llen list
```

示例：

```redis
127.0.0.1:6379> lpush list 1 2 3
(integer) 3
127.0.0.1:6379> lrange list 0 -1
1) "3"
2) "2"
3) "1"
127.0.0.1:6379> rpush list 4
(integer) 4
127.0.0.1:6379> lrange list 0 -1
1) "3"
2) "2"
3) "1"
4) "4"
```

说明：

- `lpush` 是从左边插入，后插入的元素会排在更左边。
- `rpush` 是从右边插入。

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `lpush list a b c` | `lpush` | left push，从列表左侧插入元素 |
| `lpush list a b c` | `list` | 列表 key 名 |
| `lpush list a b c` | `a b c` | 要插入的多个元素 |
| `rpush list d e` | `rpush` | right push，从列表右侧插入元素 |
| `lrange list 0 -1` | `lrange` | list range，获取列表指定范围 |
| `lrange list 0 -1` | `0` | 起始下标 |
| `lrange list 0 -1` | `-1` | 最后一个元素 |
| `lindex list 0` | `lindex` | list index，获取指定下标的元素 |
| `llen list` | `llen` | list length，获取列表长度 |

### 5.2 弹出元素

```redis
# 从左侧弹出
lpop list

# 从右侧弹出
rpop list

# 阻塞式左侧弹出，最多等待 10 秒
blpop list 10

# 阻塞式右侧弹出，最多等待 10 秒
brpop list 10
```

示例：

```redis
127.0.0.1:6379> lrange list 0 -1
1) "3"
2) "2"
3) "1"
127.0.0.1:6379> lpop list
"3"
127.0.0.1:6379> rpop list
"1"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `lpop list` | `lpop` | left pop，从列表左侧弹出一个元素 |
| `lpop list` | `list` | 列表 key 名 |
| `rpop list` | `rpop` | right pop，从列表右侧弹出一个元素 |
| `blpop list 10` | `blpop` | blocking left pop，阻塞式左侧弹出 |
| `blpop list 10` | `10` | 最多等待 10 秒 |
| `brpop list 10` | `brpop` | blocking right pop，阻塞式右侧弹出 |

### 5.3 修改和删除

```redis
# 修改指定索引的值
lset list 0 redis

# 删除列表中指定值
lrem list count value

# 截取列表，只保留指定范围
ltrim list 0 9

# 在指定元素前或后插入
linsert list before redis java
linsert list after redis mysql
```

`lrem list count value` 中 `count` 的含义：

| count | 说明 |
| --- | --- |
| `count > 0` | 从左到右删除指定数量 |
| `count < 0` | 从右到左删除指定数量 |
| `count = 0` | 删除所有匹配元素 |

示例：

```redis
127.0.0.1:6379> rpush list a b a c a
(integer) 5
127.0.0.1:6379> lrem list 2 a
(integer) 2
127.0.0.1:6379> lrange list 0 -1
1) "b"
2) "c"
3) "a"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `lset list 0 redis` | `lset` | list set，修改列表指定下标的元素 |
| `lset list 0 redis` | `0` | 要修改的下标 |
| `lset list 0 redis` | `redis` | 新值 |
| `lrem list count value` | `lrem` | list remove，删除列表中匹配的元素 |
| `lrem list count value` | `count` | 删除数量和方向 |
| `lrem list count value` | `value` | 要删除的元素值 |
| `ltrim list 0 9` | `ltrim` | list trim，只保留指定范围 |
| `linsert list before redis java` | `linsert` | list insert，插入元素 |
| `linsert list before redis java` | `before` | 插入到目标元素前面 |
| `linsert list after redis mysql` | `after` | 插入到目标元素后面 |

### 5.4 移动元素

```redis
# 从 source 右侧弹出元素，并推入 destination 左侧
rpoplpush source destination
```

示例：

```redis
127.0.0.1:6379> rpush list a b c
(integer) 3
127.0.0.1:6379> rpoplpush list backup
"c"
127.0.0.1:6379> lrange backup 0 -1
1) "c"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `rpoplpush source destination` | `rpoplpush` | 从源列表右侧弹出，推入目标列表左侧 |
| `rpoplpush source destination` | `source` | 源列表 key |
| `rpoplpush source destination` | `destination` | 目标列表 key |

## 6. Set 集合

Set 是无序且元素不重复的集合。

常见场景：

- 标签。
- 去重。
- 共同好友、共同关注。
- 抽奖。

### 6.1 基础命令

```redis
# 添加元素
sadd user:tags java redis docker

# 查看所有元素
smembers user:tags

# 判断元素是否存在
sismember user:tags redis

# 查看元素数量
scard user:tags

# 删除元素
srem user:tags docker
```

示例：

```redis
127.0.0.1:6379> sadd set 11 12 13
(integer) 3
127.0.0.1:6379> smembers set
1) "11"
2) "12"
3) "13"
127.0.0.1:6379> sismember set 12
(integer) 1
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `sadd user:tags java redis docker` | `sadd` | set add，向集合添加元素 |
| `sadd user:tags java redis docker` | `user:tags` | 集合 key 名 |
| `sadd user:tags java redis docker` | `java redis docker` | 要添加的元素 |
| `smembers user:tags` | `smembers` | set members，查看集合所有元素 |
| `sismember user:tags redis` | `sismember` | set is member，判断元素是否在集合中 |
| `scard user:tags` | `scard` | set cardinality，统计集合元素个数 |
| `srem user:tags docker` | `srem` | set remove，删除集合元素 |

### 6.2 随机元素

```redis
# 随机获取一个元素，不删除
srandmember set

# 随机获取并删除一个元素
spop set
```

示例：

```redis
127.0.0.1:6379> sadd prize user1 user2 user3
(integer) 3
127.0.0.1:6379> spop prize
"user2"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `srandmember set` | `srandmember` | set random member，随机取一个元素但不删除 |
| `srandmember set` | `set` | 集合 key 名 |
| `spop set` | `spop` | set pop，随机取出并删除一个元素 |

### 6.3 集合运算

```redis
# 差集：set1 有、set2 没有的元素
sdiff set1 set2

# 交集：两个集合都有的元素
sinter set1 set2

# 并集：两个集合合并去重
sunion set1 set2

# 把元素从一个集合移动到另一个集合
smove set1 set2 value
```

示例：

```redis
127.0.0.1:6379> sadd set1 1 2 3
(integer) 3
127.0.0.1:6379> sadd set2 3 4 5
(integer) 3
127.0.0.1:6379> sdiff set1 set2
1) "1"
2) "2"
127.0.0.1:6379> sinter set1 set2
1) "3"
127.0.0.1:6379> sunion set1 set2
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `sdiff set1 set2` | `sdiff` | set difference，差集 |
| `sdiff set1 set2` | `set1` | 第一个集合 |
| `sdiff set1 set2` | `set2` | 第二个集合 |
| `sinter set1 set2` | `sinter` | set intersection，交集 |
| `sunion set1 set2` | `sunion` | set union，并集 |
| `smove set1 set2 value` | `smove` | 把元素从一个集合移动到另一个集合 |
| `smove set1 set2 value` | `value` | 要移动的元素 |

## 7. Hash 哈希

Hash 适合保存对象结构，一个 key 下面有多个 field。

常见场景：

- 用户信息。
- 商品信息。
- 配置项。

### 7.1 基础命令

```redis
# 设置单个字段
hset user:1 name tom

# 获取单个字段
hget user:1 name

# 设置多个字段
hset user:1 age 18 city beijing

# 获取多个字段
hmget user:1 name age city

# 获取所有字段和值
hgetall user:1

# 删除字段
hdel user:1 city
```

示例：

```redis
127.0.0.1:6379> hset user:1 name tom age 18
(integer) 2
127.0.0.1:6379> hget user:1 name
"tom"
127.0.0.1:6379> hmget user:1 name age
1) "tom"
2) "18"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `hset user:1 name tom` | `hset` | hash set，设置哈希字段 |
| `hset user:1 name tom` | `user:1` | hash key 名 |
| `hset user:1 name tom` | `name` | field 字段名 |
| `hset user:1 name tom` | `tom` | field 对应的 value |
| `hget user:1 name` | `hget` | hash get，获取哈希字段值 |
| `hmget user:1 name age` | `hmget` | hash multi get，获取多个字段 |
| `hgetall user:1` | `hgetall` | 获取 hash 中所有 field 和 value |
| `hdel user:1 city` | `hdel` | 删除 hash 中的字段 |

### 7.2 判断、统计、遍历

```redis
# 判断字段是否存在
hexists user:1 name

# 获取字段数量
hlen user:1

# 获取所有字段名
hkeys user:1

# 获取所有字段值
hvals user:1

# 给数字字段递增
hincrby user:1 age 1

# 字段不存在时才设置
hsetnx user:1 email tom@example.com
```

示例：

```redis
127.0.0.1:6379> hincrby user:1 age 1
(integer) 19
127.0.0.1:6379> hget user:1 age
"19"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `hexists user:1 name` | `hexists` | hash exists，判断字段是否存在 |
| `hlen user:1` | `hlen` | hash length，统计字段数量 |
| `hkeys user:1` | `hkeys` | 获取 hash 中所有 field 名 |
| `hvals user:1` | `hvals` | 获取 hash 中所有 value |
| `hincrby user:1 age 1` | `hincrby` | hash increment by，让数字字段自增 |
| `hincrby user:1 age 1` | `age` | 要自增的字段 |
| `hincrby user:1 age 1` | `1` | 自增步长 |
| `hsetnx user:1 email tom@example.com` | `hsetnx` | 字段不存在时才设置 |

## 8. ZSet 有序集合

ZSet 是带分数的集合，元素不重复，但每个元素都有一个 score，Redis 会按 score 排序。

常见场景：

- 排行榜。
- 热门文章。
- 延迟队列。

### 8.1 基础命令

```redis
# 添加元素和分数
zadd rank 100 user1 90 user2 80 user3

# 按分数从小到大查询
zrange rank 0 -1 withscores

# 按分数从大到小查询
zrevrange rank 0 -1 withscores

# 查看元素分数
zscore rank user1

# 查看元素排名，从 0 开始，分数从小到大
zrank rank user1

# 查看元素倒序排名，从 0 开始，分数从大到小
zrevrank rank user1
```

示例：

```redis
127.0.0.1:6379> zadd rank 100 tom 90 jack 80 rose
(integer) 3
127.0.0.1:6379> zrevrange rank 0 -1 withscores
1) "tom"
2) "100"
3) "jack"
4) "90"
5) "rose"
6) "80"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `zadd rank 100 user1` | `zadd` | sorted set add，向有序集合添加元素 |
| `zadd rank 100 user1` | `rank` | 有序集合 key 名 |
| `zadd rank 100 user1` | `100` | score 分数 |
| `zadd rank 100 user1` | `user1` | member 成员 |
| `zrange rank 0 -1 withscores` | `zrange` | 按 score 从小到大查询 |
| `zrange rank 0 -1 withscores` | `0 -1` | 查询全部排名范围 |
| `zrange rank 0 -1 withscores` | `withscores` | 同时返回分数 |
| `zrevrange rank 0 -1 withscores` | `zrevrange` | 按 score 从大到小查询 |
| `zscore rank user1` | `zscore` | 查看成员分数 |
| `zrank rank user1` | `zrank` | 查看正序排名 |
| `zrevrank rank user1` | `zrevrank` | 查看倒序排名 |

### 8.2 分数操作

```redis
# 给元素分数加 10
zincrby rank 10 user1

# 按分数范围查询
zrangebyscore rank 80 100 withscores

# 统计分数范围内元素数量
zcount rank 80 100

# 删除元素
zrem rank user1

# 删除指定排名范围的元素
zremrangebyrank rank 0 1

# 删除指定分数范围的元素
zremrangebyscore rank 0 60
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `zincrby rank 10 user1` | `zincrby` | zset increment by，给成员分数增加指定值 |
| `zincrby rank 10 user1` | `10` | 分数增加值 |
| `zrangebyscore rank 80 100 withscores` | `zrangebyscore` | 按分数范围查询 |
| `zrangebyscore rank 80 100 withscores` | `80 100` | 最小分数和最大分数 |
| `zcount rank 80 100` | `zcount` | 统计分数范围内的成员数量 |
| `zrem rank user1` | `zrem` | 删除指定成员 |
| `zremrangebyrank rank 0 1` | `zremrangebyrank` | 按排名范围删除 |
| `zremrangebyscore rank 0 60` | `zremrangebyscore` | 按分数范围删除 |

## 9. Bitmap 位图

Bitmap 本质上是 String 的位操作，适合记录大量布尔状态。

常见场景：

- 用户签到。
- 是否在线。
- 是否访问过。

### 9.1 基础命令

```redis
# 设置指定偏移量的 bit，只能是 0 或 1
setbit sign:1001 1 1

# 获取指定偏移量的 bit
getbit sign:1001 1

# 统计值为 1 的 bit 数量
bitcount sign:1001
```

示例：记录用户 `1001` 这个月第 `1` 天和第 `3` 天签到。

```redis
127.0.0.1:6379> setbit sign:1001 1 1
(integer) 0
127.0.0.1:6379> setbit sign:1001 3 1
(integer) 0
127.0.0.1:6379> getbit sign:1001 1
(integer) 1
127.0.0.1:6379> bitcount sign:1001
(integer) 2
```

注意：`setbit key offset value` 中的 `value` 只能是 `0` 或 `1`。

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `setbit sign:1001 1 1` | `setbit` | 设置指定偏移量上的二进制位 |
| `setbit sign:1001 1 1` | `sign:1001` | bitmap 的 key，表示用户签到记录 |
| `setbit sign:1001 1 1` | `1` | offset 偏移量，这里表示第 1 天 |
| `setbit sign:1001 1 1` | 最后一个 `1` | bit 值，只能是 `0` 或 `1` |
| `getbit sign:1001 1` | `getbit` | 获取指定偏移量上的 bit 值 |
| `bitcount sign:1001` | `bitcount` | 统计 key 中值为 `1` 的 bit 数量 |

## 10. Geo 地理位置

Geo 用于存储经纬度，并计算位置、距离和范围。

常见场景：

- 附近的人。
- 附近门店。
- 城市距离计算。

### 10.1 添加和查询位置

```redis
# 添加一个城市，经度在前，纬度在后
geoadd china:city 116.40 39.90 beijing

# 一次添加多个城市
geoadd china:city 121.47 31.23 shanghai 113.26 23.13 guangzhou

# 查看城市坐标
geopos china:city beijing

# 计算两个城市之间的距离，单位 km
geodist china:city beijing shanghai km
```

示例：

```redis
127.0.0.1:6379> geoadd china:city 116.40 39.90 beijing
(integer) 1
127.0.0.1:6379> geopos china:city beijing
1) 1) "116.39999896287918091"
   2) "39.90000009167092543"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `geoadd china:city 116.40 39.90 beijing` | `geoadd` | 添加地理位置 |
| `geoadd china:city 116.40 39.90 beijing` | `china:city` | Geo 数据的 key |
| `geoadd china:city 116.40 39.90 beijing` | `116.40` | 经度 |
| `geoadd china:city 116.40 39.90 beijing` | `39.90` | 纬度 |
| `geoadd china:city 116.40 39.90 beijing` | `beijing` | 成员名称 |
| `geopos china:city beijing` | `geopos` | 获取成员经纬度 |
| `geodist china:city beijing shanghai km` | `geodist` | 计算两个成员之间的距离 |
| `geodist china:city beijing shanghai km` | `km` | 距离单位，表示公里 |

### 10.2 查询附近位置

推荐使用 `geosearch`：

```redis
# 以坐标为中心，查询 500km 内的城市
geosearch china:city fromlonlat 116.40 39.90 byradius 500 km withdist

# 以已有成员为中心，查询 500km 内的城市
geosearch china:city frommember beijing byradius 500 km withdist withcoord
```

旧命令也可以了解：

```redis
# 根据坐标查半径内元素
georadius china:city 116.40 39.90 500 km withdist

# 根据成员查半径内元素
georadiusbymember china:city beijing 500 km withdist
```

说明：Geo 底层使用 ZSet 存储，所以可以使用 `zrange`、`zrem` 查看和删除成员。

```redis
zrange china:city 0 -1
zrem china:city beijing
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `geosearch china:city fromlonlat 116.40 39.90 byradius 500 km withdist` | `geosearch` | 查询附近地理位置 |
| `geosearch ... fromlonlat 116.40 39.90` | `fromlonlat` | 以指定经纬度为中心 |
| `geosearch ... frommember beijing` | `frommember` | 以已有成员为中心 |
| `geosearch ... byradius 500 km` | `byradius` | 按半径查询 |
| `geosearch ... byradius 500 km` | `500 km` | 半径 500 公里 |
| `geosearch ... withdist` | `withdist` | 返回距离 |
| `geosearch ... withcoord` | `withcoord` | 返回经纬度 |
| `georadius` | `georadius` | 旧版按坐标半径查询命令 |
| `georadiusbymember` | `georadiusbymember` | 旧版按成员半径查询命令 |

## 11. HyperLogLog 基数统计

HyperLogLog 用于估算不重复元素数量，占用内存很小，但结果有少量误差。

常见场景：

- UV 统计。
- 大量用户去重计数。

```redis
# 添加元素
pfadd uv:2026-04-23 user1 user2 user3

# 统计不重复数量
pfcount uv:2026-04-23

# 合并多个 HyperLogLog
pfmerge uv:total uv:2026-04-23 uv:2026-04-24
```

示例：

```redis
127.0.0.1:6379> pfadd uv user1 user2 user2 user3
(integer) 1
127.0.0.1:6379> pfcount uv
(integer) 3
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `pfadd uv user1 user2` | `pfadd` | 向 HyperLogLog 添加元素 |
| `pfadd uv user1 user2` | `uv` | HyperLogLog 的 key |
| `pfadd uv user1 user2` | `user1 user2` | 要统计去重的元素 |
| `pfcount uv` | `pfcount` | 估算不重复元素数量 |
| `pfmerge uv:total uv:2026-04-23 uv:2026-04-24` | `pfmerge` | 合并多个 HyperLogLog |
| `pfmerge ...` | `uv:total` | 合并后的目标 key |

## 12. Stream 消息流

Stream 是 Redis 5.0 后提供的消息流数据结构，适合做消息队列。

### 12.1 基础命令

```redis
# 添加消息，* 表示自动生成消息 ID
xadd mq:order * orderId 1001 status created

# 从头读取消息
xread count 10 streams mq:order 0

# 读取最新消息，阻塞 5 秒
xread block 5000 streams mq:order $

# 查看消息长度
xlen mq:order
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `xadd mq:order * orderId 1001 status created` | `xadd` | 向 Stream 添加消息 |
| `xadd mq:order * orderId 1001 status created` | `mq:order` | Stream 的 key |
| `xadd mq:order * ...` | `*` | 自动生成消息 ID |
| `xadd mq:order * orderId 1001` | `orderId 1001` | 消息字段和值 |
| `xread count 10 streams mq:order 0` | `xread` | 读取 Stream 消息 |
| `xread count 10 ...` | `count 10` | 最多读取 10 条 |
| `xread ... streams mq:order 0` | `streams` | 后面跟 Stream key 和起始 ID |
| `xread ... mq:order 0` | `0` | 从最早消息开始读 |
| `xread block 5000 streams mq:order $` | `block 5000` | 阻塞等待 5000 毫秒 |
| `xread ... $` | `$` | 从最新消息之后开始读 |
| `xlen mq:order` | `xlen` | 查看 Stream 消息数量 |

### 12.2 消费者组

```redis
# 创建消费者组，从 0 开始消费历史消息
xgroup create mq:order group1 0 mkstream

# 消费者 c1 读取消息
xreadgroup group group1 c1 count 1 streams mq:order >

# 确认消息已处理
xack mq:order group1 消息ID
```

说明：

- `>` 表示读取还没有投递给其他消费者的新消息。
- 消费者组适合多个消费者共同处理同一个队列。

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `xgroup create mq:order group1 0 mkstream` | `xgroup create` | 创建消费者组 |
| `xgroup create mq:order group1 0 mkstream` | `mq:order` | Stream key |
| `xgroup create mq:order group1 0 mkstream` | `group1` | 消费者组名称 |
| `xgroup create mq:order group1 0 mkstream` | `0` | 从历史第一条消息开始消费 |
| `xgroup create ... mkstream` | `mkstream` | Stream 不存在时自动创建 |
| `xreadgroup group group1 c1 count 1 streams mq:order >` | `xreadgroup` | 按消费者组读取消息 |
| `xreadgroup ... group group1 c1` | `group` | 后面跟消费者组名和消费者名 |
| `xreadgroup ... c1` | `c1` | 消费者名称 |
| `xreadgroup ... >` | `>` | 读取未投递过的新消息 |
| `xack mq:order group1 消息ID` | `xack` | 确认消息已经处理完成 |

## 13. 事务

Redis 事务通过 `multi`、`exec`、`discard` 实现。

特点：

- `multi` 后的命令不会立即执行，而是进入队列。
- `exec` 时按顺序执行队列中的命令。
- `discard` 可以取消事务。
- Redis 事务不支持传统数据库那种自动回滚。

### 13.1 基础事务

```redis
multi
set k1 ss
set k2 de
get k1
exec
```

示例：

```redis
127.0.0.1:6379> multi
OK
127.0.0.1:6379> set k1 ss
QUEUED
127.0.0.1:6379> set k2 de
QUEUED
127.0.0.1:6379> get k1
QUEUED
127.0.0.1:6379> exec
1) OK
2) OK
3) "ss"
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `multi` | `multi` | 开启事务，后续命令进入队列 |
| `set k1 ss` | `set` | 设置 key |
| `set k1 ss` | `k1` | key 名 |
| `set k1 ss` | `ss` | value 值 |
| `get k1` | `get` | 获取 key 的值 |
| `exec` | `exec` | 执行事务队列中的所有命令 |

### 13.2 取消事务

```redis
multi
set k1 value
discard
```

### 13.3 watch 乐观锁

`watch` 用于监听 key。如果事务执行前被监听的 key 被其他客户端修改，事务执行会失败。

```redis
# 客户端 A
watch value
multi
incrby value 10
exec
```

如果 `exec` 前 `value` 被其他客户端修改，则返回：

```redis
(nil)
```

取消监听：

```redis
unwatch
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `discard` | `discard` | 放弃事务队列中的命令 |
| `watch value` | `watch` | 监听 key，用于乐观锁 |
| `watch value` | `value` | 被监听的 key |
| `unwatch` | `unwatch` | 取消所有 watch 监听 |

## 14. 发布订阅

发布订阅用于消息广播，订阅者在线时才能收到消息，不保证消息持久化。

### 14.1 订阅频道

客户端 A：

```redis
subscribe channel
```

返回：

```redis
1) "subscribe"
2) "channel"
3) (integer) 1
```

### 14.2 发布消息

客户端 B：

```redis
publish channel "hello redis"
```

返回值表示收到消息的订阅者数量：

```redis
(integer) 1
```

### 14.3 订阅多个频道

```redis
subscribe channel1 channel2 channel3
```

### 14.4 模式订阅

```redis
psubscribe news:*
```

注意：发布订阅不适合需要可靠消费的业务，如果需要消息确认和持久化，优先考虑 Stream 或专业消息队列。

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `subscribe channel` | `subscribe` | 订阅频道 |
| `subscribe channel` | `channel` | 频道名称 |
| `publish channel "hello redis"` | `publish` | 向频道发布消息 |
| `publish channel "hello redis"` | `channel` | 目标频道 |
| `publish channel "hello redis"` | `"hello redis"` | 发布的消息内容 |
| `subscribe channel1 channel2 channel3` | `channel1 channel2 channel3` | 同时订阅多个频道 |
| `psubscribe news:*` | `psubscribe` | 按模式订阅频道 |
| `psubscribe news:*` | `news:*` | 匹配所有 `news:` 开头的频道 |

## 15. 持久化：RDB 和 AOF

### 15.1 RDB

RDB 是快照机制，会定期把内存中的数据保存到磁盘文件。

特点：

- 文件体积小。
- 恢复速度快。
- 可能丢失最后一次快照之后的数据。
- 适合做冷备份。

### 15.2 AOF

AOF 是追加日志机制，会把写命令追加到日志文件。

特点：

- 数据更安全。
- 可读性更好。
- 文件体积通常比 RDB 大。
- 恢复速度通常比 RDB 慢。
- 可以使用 AOF rewrite 重写压缩日志。

### 15.3 对比

| 方式 | 优点 | 缺点 | 适合场景 |
| --- | --- | --- | --- |
| RDB | 文件小，恢复快 | 可能丢失部分数据 | 备份、容灾 |
| AOF | 数据更安全 | 文件大，恢复慢 | 对数据安全要求更高 |

常见命令：

```redis
# 手动触发 RDB 保存，会阻塞 Redis
save

# 后台触发 RDB 保存，推荐
bgsave

# 查看持久化相关信息
info persistence
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `save` | `save` | 前台生成 RDB 快照，会阻塞 Redis |
| `bgsave` | `bgsave` | background save，后台生成 RDB 快照 |
| `info persistence` | `info` | 查看 Redis 信息 |
| `info persistence` | `persistence` | 只查看持久化相关信息 |

## 16. 主从复制

主从复制用于把主节点数据同步到从节点。

常见作用：

- 读写分离。
- 数据备份。
- 高可用基础。

### 16.1 查看复制信息

```redis
info replication
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `info replication` | `info` | 查看 Redis 信息 |
| `info replication` | `replication` | 只查看主从复制相关信息 |

常见字段：

| 字段 | 说明 |
| --- | --- |
| `role:master` | 当前节点是主节点 |
| `role:slave` / `role:replica` | 当前节点是从节点 |
| `connected_slaves` | 当前主节点连接的从节点数量 |
| `master_host` | 从节点连接的主节点地址 |
| `master_port` | 从节点连接的主节点端口 |
| `master_link_status` | 主从连接状态 |

### 16.2 配置从节点

Redis 新版本推荐使用 `replicaof`，旧命令 `slaveof` 也常见。

```redis
# 把当前节点配置为 127.0.0.1:6379 的从节点
replicaof 127.0.0.1 6379

# 旧命令
slaveof 127.0.0.1 6379

# 取消从节点身份，让自己变成主节点
replicaof no one
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `replicaof 127.0.0.1 6379` | `replicaof` | 把当前节点设置为某个主节点的从节点 |
| `replicaof 127.0.0.1 6379` | `127.0.0.1` | 主节点 IP |
| `replicaof 127.0.0.1 6379` | `6379` | 主节点端口 |
| `slaveof 127.0.0.1 6379` | `slaveof` | 旧版命令，作用同 `replicaof` |
| `replicaof no one` | `no one` | 不再复制任何主节点，自己变成主节点 |

### 16.3 主从读写特点

```redis
# 主节点可以写
127.0.0.1:6379> set name redis
OK

# 从节点可以读到主节点数据
127.0.0.1:6380> get name
"redis"

# 从节点默认不能写
127.0.0.1:6380> set name mysql
(error) READONLY You can't write against a read only replica.
```

### 16.4 复制过程

- 从节点连接主节点后，会发送同步请求。
- 首次同步通常是全量复制。
- 主节点生成数据快照并发送给从节点。
- 后续主节点的写命令会继续同步给从节点，属于增量复制。

说明：

- 主节点宕机后，从节点仍可读取已有数据。
- 如果没有哨兵或集群，从节点不会自动升级为主节点。
- 可以手动执行 `replicaof no one` 让从节点变成主节点。

## 17. 哨兵 Sentinel

哨兵用于监控主从节点，并在主节点故障时自动选举新的主节点。

### 17.1 基础配置

创建 `sentinel.conf`：

```conf
port 26379
daemonize yes
logfile "sentinel.log"
dir "/tmp"

sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 10000
sentinel parallel-syncs mymaster 1
```

配置说明：

| 配置 | 说明 |
| --- | --- |
| `sentinel monitor mymaster 127.0.0.1 6379 2` | 监控主节点，名称为 `mymaster`，至少 2 个哨兵同意才认为主观下线有效 |
| `down-after-milliseconds` | 多久没有响应后认为节点下线 |
| `failover-timeout` | 故障转移超时时间 |
| `parallel-syncs` | 故障转移后同时向新主节点同步的从节点数量 |

如果 Redis 有密码：

```conf
sentinel auth-pass mymaster yourpassword
```

命令拆解：

| 配置 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `port 26379` | `port` | 设置哨兵服务端口 |
| `port 26379` | `26379` | 哨兵默认常用端口 |
| `daemonize yes` | `daemonize` | 是否以守护进程方式运行 |
| `daemonize yes` | `yes` | 表示后台运行 |
| `logfile "sentinel.log"` | `logfile` | 指定日志文件 |
| `dir "/tmp"` | `dir` | 指定运行目录 |
| `sentinel monitor mymaster 127.0.0.1 6379 2` | `sentinel monitor` | 让哨兵监控一个主节点 |
| `sentinel monitor mymaster 127.0.0.1 6379 2` | `mymaster` | 主节点别名 |
| `sentinel monitor mymaster 127.0.0.1 6379 2` | `127.0.0.1` | 主节点 IP |
| `sentinel monitor mymaster 127.0.0.1 6379 2` | `6379` | 主节点端口 |
| `sentinel monitor mymaster 127.0.0.1 6379 2` | `2` | 至少 2 个哨兵同意才进行故障判断 |
| `sentinel down-after-milliseconds mymaster 5000` | `down-after-milliseconds` | 超过多久无响应认为节点下线 |
| `sentinel failover-timeout mymaster 10000` | `failover-timeout` | 故障转移超时时间 |
| `sentinel parallel-syncs mymaster 1` | `parallel-syncs` | 同时向新主节点同步的从节点数量 |
| `sentinel auth-pass mymaster yourpassword` | `auth-pass` | 配置主节点访问密码 |

启动哨兵：

```sh
redis-sentinel sentinel.conf
```

或：

```sh
redis-server sentinel.conf --sentinel
```

### 17.2 查看哨兵信息

```redis
# 查看所有被监控的主节点
sentinel masters

# 查看指定主节点信息
sentinel master mymaster

# 查看从节点
sentinel replicas mymaster

# 查看其他哨兵
sentinel sentinels mymaster
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `redis-sentinel sentinel.conf` | `redis-sentinel` | 启动哨兵的命令 |
| `redis-sentinel sentinel.conf` | `sentinel.conf` | 哨兵配置文件 |
| `redis-server sentinel.conf --sentinel` | `redis-server` | Redis 服务启动命令 |
| `redis-server sentinel.conf --sentinel` | `--sentinel` | 以哨兵模式启动 |
| `sentinel masters` | `sentinel masters` | 查看所有被监控主节点 |
| `sentinel master mymaster` | `master mymaster` | 查看指定主节点信息 |
| `sentinel replicas mymaster` | `replicas mymaster` | 查看指定主节点的从节点 |
| `sentinel sentinels mymaster` | `sentinels mymaster` | 查看监控该主节点的其他哨兵 |

## 18. 集群 Cluster

Redis Cluster 用于数据分片和高可用。

特点：

- 数据按槽位分布，Redis Cluster 一共有 `16384` 个槽。
- 每个主节点负责一部分槽。
- 每个主节点可以配置从节点。
- 主节点故障时，从节点可以自动提升为主节点。

常用命令：

```sh
# 连接集群模式 Redis
redis-cli -c -h 127.0.0.1 -p 6379
```

```redis
# 查看集群信息
cluster info

# 查看节点信息
cluster nodes

# 查看 key 属于哪个槽
cluster keyslot user:1
```

说明：普通主从复制不是 Redis Cluster。主从解决复制和高可用基础，Cluster 解决分片和容量扩展。

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `redis-cli -c -h 127.0.0.1 -p 6379` | `redis-cli` | Redis 命令行客户端 |
| `redis-cli -c ...` | `-c` | cluster，开启集群模式，支持自动重定向 |
| `redis-cli ... -h 127.0.0.1` | `-h` | 指定 Redis 节点地址 |
| `redis-cli ... -p 6379` | `-p` | 指定 Redis 节点端口 |
| `cluster info` | `cluster` | 集群相关命令 |
| `cluster info` | `info` | 查看集群整体信息 |
| `cluster nodes` | `nodes` | 查看集群所有节点 |
| `cluster keyslot user:1` | `keyslot` | 查看 key 属于哪个槽 |
| `cluster keyslot user:1` | `user:1` | 要计算槽位的 key |

## 19. 缓存常见问题

### 19.1 缓存穿透

含义：请求的数据在缓存中没有，在数据库中也不存在，大量请求直接打到数据库。

示例：大量请求不存在的用户 ID，例如 `user:-1`、`user:999999999`。

解决方案：

- 使用布隆过滤器，提前拦截不存在的数据。
- 查询数据库为空时，把空结果短时间缓存起来。
- 对参数做合法性校验。

空值缓存示例：

```text
查询 user:100 不存在 -> 缓存 user:100 = 空对象，过期时间 1 分钟
```

### 19.2 缓存雪崩

含义：大量缓存同一时间失效，导致请求同时打到数据库。

解决方案：

- 设置过期时间时增加随机值，避免同一时间集中失效。
- 热点数据提前预热。
- 使用限流、降级、熔断保护数据库。
- 搭建 Redis 高可用，避免 Redis 整体不可用。

示例：

```text
商品缓存基础过期时间 30 分钟，再随机增加 0~5 分钟
```

### 19.3 缓存击穿

含义：某个热点 key 失效，大量请求同时访问这个 key，全部打到数据库。

示例：秒杀商品详情缓存突然过期，大量用户同时请求。

解决方案：

- 热点 key 不设置过期时间，后台异步刷新。
- 使用互斥锁，只允许一个请求查询数据库并重建缓存。
- 提前续期热点 key。

互斥锁思路：

```text
查缓存 -> 缓存不存在 -> 尝试获取锁 -> 获取成功查数据库并写缓存 -> 释放锁
其他请求获取锁失败 -> 等待后重试缓存
```

### 19.4 缓存与数据库一致性

常见策略：

```text
先更新数据库，再删除缓存
```

说明：

- 不推荐先更新缓存再更新数据库。
- 删除缓存失败时，可以通过重试队列、消息队列或订阅 binlog 补偿。
- 对强一致要求极高的场景，不应只依赖缓存。

## 20. 常用场景示例

### 20.1 验证码

```redis
# 设置验证码，5 分钟过期
setex login:code:13800000000 300 123456

# 获取验证码
get login:code:13800000000
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `setex login:code:13800000000 300 123456` | `setex` | 设置值并设置过期时间 |
| `setex login:code:13800000000 300 123456` | `login:code:13800000000` | 验证码 key，包含业务和手机号 |
| `setex login:code:13800000000 300 123456` | `300` | 300 秒后过期 |
| `setex login:code:13800000000 300 123456` | `123456` | 验证码内容 |
| `get login:code:13800000000` | `get` | 获取验证码 |

### 20.2 访问计数

```redis
# 文章阅读数 +1
incr article:1001:views

# 获取阅读数
get article:1001:views
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `incr article:1001:views` | `incr` | 自增 1 |
| `incr article:1001:views` | `article:1001:views` | 文章 `1001` 的阅读数 key |
| `get article:1001:views` | `get` | 获取当前阅读数 |

### 20.3 排行榜

```redis
# 增加用户积分
zincrby rank:score 10 user1
zincrby rank:score 20 user2

# 查看前 10 名
zrevrange rank:score 0 9 withscores
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `zincrby rank:score 10 user1` | `zincrby` | 给有序集合成员分数增加指定值 |
| `zincrby rank:score 10 user1` | `rank:score` | 排行榜 key |
| `zincrby rank:score 10 user1` | `10` | 增加 10 分 |
| `zincrby rank:score 10 user1` | `user1` | 用户成员 |
| `zrevrange rank:score 0 9 withscores` | `zrevrange` | 按分数从高到低查询 |
| `zrevrange rank:score 0 9 withscores` | `0 9` | 查询第 1 到第 10 名 |
| `zrevrange rank:score 0 9 withscores` | `withscores` | 返回成员时同时返回分数 |

### 20.4 用户签到

```redis
# 用户 1001 第 1 天签到
setbit sign:1001 1 1

# 用户 1001 第 2 天签到
setbit sign:1001 2 1

# 查看签到次数
bitcount sign:1001
```

命令拆解：

| 命令 | 单词 / 参数 | 说明 |
| --- | --- | --- |
| `setbit sign:1001 1 1` | `setbit` | 设置 bitmap 中某一位 |
| `setbit sign:1001 1 1` | `sign:1001` | 用户 `1001` 的签到 key |
| `setbit sign:1001 1 1` | 中间的 `1` | 第 1 天的位置 |
| `setbit sign:1001 1 1` | 最后的 `1` | 设置为已签到 |
| `bitcount sign:1001` | `bitcount` | 统计签到次数 |

### 20.5 简单分布式锁

加锁：

```redis
set lock:order:1001 uuid-value nx ex 30
```

解锁时需要判断 value 是否是自己加的锁，避免误删别人的锁。生产环境一般使用 Lua 脚本保证判断和删除的原子性。

命令拆解：

| 单词 / 参数 | 说明 |
| --- | --- |
| `set` | 设置 key |
| `lock:order:1001` | 锁 key，表示订单 `1001` 的锁 |
| `uuid-value` | 锁 value，通常使用唯一 ID 标识加锁人 |
| `nx` | key 不存在时才设置成功，防止重复加锁 |
| `ex 30` | 设置 30 秒过期时间，防止死锁 |

Lua 解锁逻辑：

```lua
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
```

## 21. 命令速查

| 类型 | 常用命令 |
| --- | --- |
| Key | `keys`、`scan`、`exists`、`del`、`expire`、`ttl`、`type` |
| String | `set`、`get`、`incr`、`decr`、`mset`、`mget`、`setnx` |
| List | `lpush`、`rpush`、`lpop`、`rpop`、`lrange`、`llen` |
| Set | `sadd`、`srem`、`smembers`、`sismember`、`sinter`、`sunion` |
| Hash | `hset`、`hget`、`hmget`、`hgetall`、`hdel`、`hincrby` |
| ZSet | `zadd`、`zrange`、`zrevrange`、`zscore`、`zincrby` |
| Bitmap | `setbit`、`getbit`、`bitcount` |
| Geo | `geoadd`、`geopos`、`geodist`、`geosearch` |
| Stream | `xadd`、`xread`、`xgroup`、`xreadgroup`、`xack` |
| 事务 | `multi`、`exec`、`discard`、`watch`、`unwatch` |
| 发布订阅 | `subscribe`、`publish`、`psubscribe` |
| 持久化 | `save`、`bgsave`、`info persistence` |
| 复制 | `info replication`、`replicaof` |
