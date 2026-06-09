---
outline: deep
---

# MySQL 学习笔记

这份笔记按原有内容重新排版，保留原来的命令、说明、建表示例、联表示例、聚合函数、事务、索引等内容，并补充一些日常常用命令。

## Docker / SSH 连接记录

### 删除旧的 SSH 指纹记录

服务器重装或 SSH 指纹变化时，可能会出现连接警告，可以先删除旧记录：

```bash
ssh-keygen -R 121.40.22.192
```

### 重新连接服务器

```bash
ssh root@121.40.22.192
```

输入 `yes` 接受新的指纹。

## MySQL 基础命令

### 登录 MySQL

```bash
mysql -uroot -p
```

本地学习时也可能直接写密码：

```bash
mysql -uroot -p123456
```

生产环境不建议把密码直接写在命令里，容易被历史记录或进程列表看到。

### 修改 root 密码

旧版本 MySQL 常见写法：

```sql
UPDATE mysql.user
SET authentication_string = PASSWORD('123456')
WHERE user = 'root' AND host = 'localhost';

FLUSH PRIVILEGES; -- 刷新权限
```

MySQL 8 更常见写法：

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
FLUSH PRIVILEGES;
```

### 数据库常用命令

```sql
SHOW DATABASES; -- 显示所有数据库

CREATE DATABASE test; -- 创建数据库

CREATE DATABASE IF NOT EXISTS test; -- 如果数据库不存在才创建

DROP DATABASE IF EXISTS test; -- 如果数据库存在则删除

USE test; -- 使用数据库

SHOW TABLES; -- 显示当前数据库的所有表

DESCRIBE users; -- 显示表结构，也可以写 DESC users

EXIT; -- 退出 MySQL
```

SQL 注释：

```sql
-- 单行注释

/* 多行注释 */
```

## 数据类型

### 数值类型

| 类型 | 字节 | 范围 / 说明 |
| --- | --- | --- |
| `TINYINT` | 1 | `-128 ~ 127`，常用于状态、类型 |
| `SMALLINT` | 2 | `-32768 ~ 32767` |
| `MEDIUMINT` | 3 | `-8388608 ~ 8388607` |
| `INT` | 4 | `-2147483648 ~ 2147483647` |
| `BIGINT` | 8 | 大整数 |
| `FLOAT` | 4 | 单精度浮点数 |
| `DOUBLE` | 8 | 双精度浮点数 |
| `DECIMAL` | 变长 | 高精度定点数，可指定精度和位数 |

金额字段建议使用 `DECIMAL`：

```sql
price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '价格'
```

### 字符串类型

| 类型 | 说明 |
| --- | --- |
| `CHAR` | 固定长度字符串，长度 `0 ~ 255` |
| `VARCHAR` | 可变长度字符串，最大长度和字符集、行大小有关 |
| `VARCHAR(255)` | 常见可变长度字符串 |
| `TINYTEXT` | 短文本 |
| `TEXT` | 长文本 |

### 日期和时间类型

| 类型 | 说明 |
| --- | --- |
| `DATE` | 日期，格式 `YYYY-MM-DD` |
| `TIME` | 时间，格式 `HH:mm:ss` |
| `DATETIME` | 日期时间，常用于业务时间 |
| `TIMESTAMP` | 时间戳，范围约 `1970-01-01` 到 `2038-01-19`，受时区影响 |
| `YEAR` | 年份 |

常用时间字段：

```sql
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
```

### NULL

```sql
NULL -- 空值
```

建议业务字段尽量设置 `NOT NULL DEFAULT ...`，减少空值判断。

## 字段属性

| 属性 | 说明 |
| --- | --- |
| `UNSIGNED` | 无符号，不能输入负数 |
| `ZEROFILL` | 零填充，数字前面补 0 |
| `AUTO_INCREMENT` | 自增 |
| `NOT NULL` | 不能为空 |
| `DEFAULT` | 默认值 |
| `COMMENT` | 注释 |
| `PRIMARY KEY` | 主键 |
| `UNIQUE KEY` | 唯一索引 |
| `KEY` | 普通索引 |
| `FOREIGN KEY` | 外键 |

示例：

```sql
id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
status TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '状态：1启用，0禁用'
```

## 创建表

### 语法

```sql
CREATE TABLE IF NOT EXISTS `表名` (
  `字段名` 数据类型 [字段属性] [索引] [注释],
  `字段名` 数据类型 [字段属性] [索引] [注释]
) [ENGINE=引擎] [DEFAULT CHARSET=字符集] [COMMENT='注释'];
```

### 示例

```sql
CREATE TABLE IF NOT EXISTS `test` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'id',
  `age` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '年龄',
  `name` VARCHAR(255) NOT NULL DEFAULT '' COMMENT '名称',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='测试表';
```

说明：

| 配置 | 说明 |
| --- | --- |
| `ENGINE=InnoDB` | 存储引擎 |
| `DEFAULT CHARSET=utf8mb4` | 默认字符集 |
| `COMMENT` | 表注释或字段注释 |
| `PRIMARY KEY` | 主键 |

### 获取建表 / 建库语句

```sql
SHOW CREATE TABLE `表名`; -- 获取创建表的语句

SHOW CREATE DATABASE `数据库名`; -- 获取数据库创建语句

DESC `表名`; -- 获取表结构
```

## 存储引擎

| 引擎 | 说明 |
| --- | --- |
| `InnoDB` | 默认推荐，支持事务、外键、行级锁，安全性高 |
| `MyISAM` | 旧引擎，不支持事务和外键 |
| `MEMORY` | 内存引擎，数据存储在内存中，重启会丢失 |
| `ARCHIVE` | 归档引擎，适合写入多、查询少的压缩存储 |
| `FEDERATED` | 联邦引擎，用于访问远程 MySQL 表 |
| `NDB Cluster` | 集群引擎，适合分布式高可用场景 |
| `TokuDB` | 面向压缩和大数据量写入优化的引擎 |
| `Mroonga` | 基于 Groonga 的全文搜索引擎 |

日常业务表优先使用：

```sql
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
```

补充说明：

1. `OceanBase`、`Percona` 更常见是数据库产品或发行版，不是普通 MySQL 里直接指定的独立存储引擎。
2. `geometry`、`spatial` 通常指空间数据类型和空间索引，不是常规的 `ENGINE=...` 写法。

## 修改表

```sql
ALTER TABLE `表名` RENAME TO `新表名`; -- 修改表名

ALTER TABLE `表名`
ADD COLUMN `字段名` 数据类型 [字段属性] [索引] [注释]; -- 添加字段

ALTER TABLE `表名`
MODIFY COLUMN `字段名` 数据类型 [字段属性] [索引] [注释]; -- 修改字段类型或约束

ALTER TABLE `表名`
CHANGE COLUMN `旧字段名` `新字段名` 数据类型 [字段属性] [索引] [注释]; -- 修改字段名

ALTER TABLE `表名`
DROP COLUMN `字段名`; -- 删除字段
```

添加外键：

```sql
ALTER TABLE `表名`
ADD CONSTRAINT `约束名`
FOREIGN KEY (`字段名`) REFERENCES `关联表名`(`关联字段名`);
```

说明：

| 关键字 | 说明 |
| --- | --- |
| `CONSTRAINT` | 约束名 |
| `FOREIGN KEY` | 自己表里的字段 |
| `REFERENCES` | 关联的表和字段 |

## 插入数据

```sql
INSERT INTO `表名` (`字段名`, `字段名`)
VALUES ('值', '值'); -- 插入数据

INSERT INTO `表名`
VALUES ('值', '值'), ('值', '值'), ('值', '值'); -- 批量插入数据
```

推荐指定字段插入：

```sql
INSERT INTO users (name, age)
VALUES ('张三', 20);
```

## 修改数据

```sql
UPDATE `表名`
SET `字段名` = '值', `字段名` = '值'
WHERE `条件`; -- 修改数据
```

执行 `UPDATE` 时一定要注意 `WHERE`，避免误改整张表。

## WHERE 条件

```sql
WHERE `字段名` = '值'; -- 等于

WHERE `字段名` <> '值'; -- 不等于

WHERE `字段名` > '值'; -- 大于

WHERE `字段名` >= '值'; -- 大于等于

WHERE `字段名` < '值'; -- 小于

WHERE `字段名` <= '值'; -- 小于等于

WHERE `字段名` LIKE '%值'; -- 模糊匹配，% 表示任意字符，_ 匹配一个字符

WHERE `字段名` IN ('值', '值', '值'); -- 批量匹配

WHERE `字段名` BETWEEN '值' AND '值'; -- 范围匹配

WHERE `字段名` IS NULL; -- 为 NULL

WHERE `字段名` IS NOT NULL; -- 不为 NULL
```

排序、分页、分组：

```sql
ORDER BY `字段名` ASC; -- 升序

ORDER BY `字段名` DESC; -- 降序

LIMIT 0, 10; -- 从第 0 条开始，查询 10 条

LIMIT 10 OFFSET 10; -- 跳过 10 条，再查询 10 条

GROUP BY `字段名`; -- 分组

WHERE `字段名` REGEXP '正则表达式'; -- 正则匹配
```

时间范围查询：

```sql
WHERE `字段名` BETWEEN '2021-01-01' AND '2021-12-31';
```

更推荐左闭右开写法：

```sql
WHERE created_at >= '2021-01-01'
  AND created_at < '2022-01-01';
```

多条件匹配：

```sql
WHERE created_at >= '2021-01-01'
  AND created_at < '2022-01-01'
  AND `字段名` = '值';

WHERE (created_at >= '2021-01-01' AND created_at < '2022-01-01')
   OR `字段名` = '值'
LIMIT 10 OFFSET 10;
```

## 删除数据

```sql
DELETE FROM `表名` WHERE `条件`; -- 删除指定数据

DELETE FROM `表名`; -- 删除所有数据

TRUNCATE TABLE `表名`; -- 清空表，自增通常会重置
```

区别：

| 命令 | 说明 |
| --- | --- |
| `DELETE` | 可以带 `WHERE`，按行删除 |
| `TRUNCATE` | 清空整表，速度快，自增值通常会重置 |

## 查询数据 DQL

```sql
SELECT * FROM `表名`; -- 查询所有字段

SELECT `字段名`, `字段名` FROM `表名`; -- 查询指定字段

SELECT `字段名` AS `别名`, `字段名` AS `别名2` FROM `表名`; -- 字段别名

SELECT `字段名`, `字段名`
FROM `表名`
WHERE `条件`; -- 带条件查询

SELECT `字段名`, `字段名`
FROM `表名`
WHERE `条件`
GROUP BY `字段名`; -- 分组查询

SELECT `字段名`, `字段名`
FROM `表名`
WHERE `条件`
GROUP BY `字段名`
HAVING `条件`; -- 分组后过滤

SELECT `字段名`, `字段名`
FROM `表名`
WHERE `条件`
ORDER BY `字段名` ASC; -- 排序

SELECT `字段名`, `字段名`
FROM `表名`
WHERE `条件`
LIMIT 10 OFFSET 10; -- 分页
```

SQL 大致执行顺序：

```text
FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT
```

## 联表查询

### JOIN 基础语法

```sql
SELECT *
FROM `表名1`
JOIN `表名2` ON `表名1`.`字段名` = `表名2`.`字段名`;
```

说明：

| JOIN 类型 | 说明 |
| --- | --- |
| `INNER JOIN` | 内连接，只返回两张表都匹配的数据 |
| `LEFT JOIN` | 左连接，以左表为主，右表没有匹配时显示 `NULL` |
| `RIGHT JOIN` | 右连接，以右表为主，左表没有匹配时显示 `NULL` |
| `FULL JOIN` | MySQL 不支持原生 FULL JOIN，可用 UNION 模拟 |

### INNER JOIN 示例

```sql
SELECT a.`字段名`, b.`字段名`
FROM `表名1` AS a
INNER JOIN `表名2` AS b
ON a.`字段名` = b.`字段名`;
```

只返回两张表都有匹配的数据。

### LEFT JOIN 示例

```sql
SELECT a.`字段名`, b.`字段名`
FROM `表名1` AS a
LEFT JOIN `表名2` AS b
ON a.`字段名` = b.`字段名`;
```

返回左表所有数据，右表没有匹配时显示 `NULL`。

### RIGHT JOIN 示例

```sql
SELECT a.`字段名`, b.`字段名`
FROM `表名1` AS a
RIGHT JOIN `表名2` AS b
ON a.`字段名` = b.`字段名`;
```

返回右表所有数据，左表没有匹配时显示 `NULL`。

### FULL JOIN 替代写法

MySQL 不支持原生 `FULL JOIN`，可以用 `LEFT JOIN + UNION + RIGHT JOIN` 模拟：

```sql
SELECT s.name, s.age, c.course_name, c.score
FROM students s
LEFT JOIN courses c ON s.id = c.student_id

UNION

SELECT s.name, s.age, c.course_name, c.score
FROM students s
RIGHT JOIN courses c ON s.id = c.student_id;
```

## 联表查询实例

### 创建学生表

```sql
CREATE TABLE students2 (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  age TINYINT UNSIGNED DEFAULT 0 COMMENT '年龄',
  class VARCHAR(20) DEFAULT '' COMMENT '班级'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生表';
```

### 插入学生数据

```sql
INSERT INTO students2 (name, age, class) VALUES
('张三', 20, '计算机1班'),
('李四', 21, '计算机2班'),
('王五', 19, '数学系'),
('赵六', 22, '物理系'),
('钱七', 20, '化学系');
```

### 创建课程成绩表

```sql
CREATE TABLE courses (
  course_id INT PRIMARY KEY AUTO_INCREMENT,
  course_name VARCHAR(100) NOT NULL,
  student_id INT,
  score DECIMAL(5,2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程成绩表';
```

### 插入课程数据

```sql
INSERT INTO courses (course_name, student_id, score) VALUES
('高等数学', 1, 85.5),
('线性代数', 1, 92.0),
('大学物理', 2, 78.5),
('计算机基础', 3, 88.0),
('数据结构', 1, 95.0);
```

### 查询示例

```sql
SELECT id, name, age, score, course_name
FROM students2 AS s
INNER JOIN courses c ON s.id = c.student_id;
```

```sql
SELECT id, name, age, score, course_name
FROM students2 AS s
LEFT JOIN courses c ON s.id = c.student_id

UNION

SELECT id, name, age, score, course_name
FROM students2 AS s
RIGHT JOIN courses c ON s.id = c.student_id;
```

## 聚合函数

```sql
SELECT COUNT(*); -- 总记录数，查询全部行，不忽略 NULL

SELECT COUNT(`字段名`); -- 字段记录数，忽略 NULL

SELECT COUNT(1); -- 总记录数

SELECT COUNT(DISTINCT `字段名`); -- 去重计数

SELECT SUM(`字段名`) FROM `表名`; -- 求和

SELECT AVG(`字段名`) FROM `表名`; -- 平均值

SELECT MAX(`字段名`) FROM `表名`; -- 最大值

SELECT MIN(`字段名`) FROM `表名`; -- 最小值

SELECT DISTINCT `字段名` FROM `表名`; -- 去重

SELECT CONCAT(`字段名`, `字段名`) AS `别名` FROM `表名`; -- 拼接字段

SELECT VERSION(); -- 查询数据库版本

SELECT 100 + 200 AS `结果`; -- 计算

SELECT @@auto_increment_increment; -- 查询自增步长
```

## 分组和过滤

```sql
SELECT `字段名`, COUNT(*) AS total
FROM `表名`
WHERE `条件`
GROUP BY `字段名`;
```

```sql
SELECT `字段名`, COUNT(*) AS total
FROM `表名`
WHERE `条件`
GROUP BY `字段名`
HAVING total > 10;
```

说明：

| 关键字 | 作用 |
| --- | --- |
| `WHERE` | 分组前过滤 |
| `HAVING` | 分组后过滤 |

## 加密

```sql
SELECT MD5('密码');

UPDATE `表名`
SET `字段名` = MD5('密码')
WHERE `条件`;

SELECT *
FROM `表名`
WHERE `字段名` = MD5('密码');
```

说明：`MD5` 不适合现代生产密码存储，真实项目建议使用专门的密码哈希算法，例如 bcrypt、Argon2。

## 事务

```sql
SET autocommit = 0; -- 关闭自动提交，1 自动提交，0 手动提交

START TRANSACTION; -- 开启事务

COMMIT; -- 提交事务

ROLLBACK; -- 回滚事务

SET autocommit = 1; -- 开启自动提交
```

示例：

```sql
SET autocommit = 0;
START TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
-- ROLLBACK;

SET autocommit = 1;
```

## 索引

```sql
CREATE INDEX `索引名` ON `表名`(`字段名`); -- 创建索引

DROP INDEX `索引名` ON `表名`; -- 删除索引

EXPLAIN SELECT *
FROM `表名`
WHERE `字段名` = '值'; -- 查看执行计划

SHOW INDEX FROM `表名`; -- 显示索引信息
```

索引建议：

1. 经常作为 `WHERE` 条件的字段适合建索引。
2. 经常用于 `JOIN ON` 的关联字段适合建索引。
3. 区分度低的字段不一定适合单独建索引，比如性别、布尔状态。
4. 索引会提升查询速度，但会增加写入成本。
5. 联合索引要注意最左前缀原则。

## 用户与权限

```sql
SELECT user, host FROM mysql.user; -- 查看用户

CREATE USER 'app_user'@'%' IDENTIFIED BY 'StrongPassword_123'; -- 创建用户

GRANT SELECT, INSERT, UPDATE, DELETE ON app_db.* TO 'app_user'@'%'; -- 授权

SHOW GRANTS FOR 'app_user'@'%'; -- 查看授权

REVOKE DELETE ON app_db.* FROM 'app_user'@'%'; -- 回收权限

DROP USER 'app_user'@'%'; -- 删除用户

FLUSH PRIVILEGES; -- 刷新权限
```

## 备份与恢复

```bash
# 备份单个数据库
mysqldump -uroot -p app_db > app_db.sql

# 备份指定表
mysqldump -uroot -p app_db users orders > app_tables.sql

# 备份所有数据库
mysqldump -uroot -p --all-databases > all.sql

# 恢复数据库
mysql -uroot -p app_db < app_db.sql
```

## 慢查询日志

```sql
SHOW VARIABLES LIKE 'slow_query_log';

SHOW VARIABLES LIKE 'slow_query_log_file';

SHOW VARIABLES LIKE 'long_query_time';

SET GLOBAL slow_query_log = ON;

SET GLOBAL long_query_time = 2;
```

配置文件示例：

```ini
[mysqld]
slow_query_log=ON
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2
log_queries_not_using_indexes=ON
```

## 常用排查命令

```sql
SHOW PROCESSLIST;

SHOW FULL PROCESSLIST;

KILL 12345;

SHOW VARIABLES LIKE 'max_connections';

SHOW VARIABLES LIKE 'character_set%';

SHOW VARIABLES LIKE 'time_zone';

SHOW STATUS LIKE 'Threads_connected';

SHOW STATUS LIKE 'Slow_queries';

SHOW STATUS LIKE 'Questions';

SHOW ENGINE INNODB STATUS\G

SELECT * FROM information_schema.innodb_trx;

SELECT * FROM information_schema.innodb_lock_waits;
```
