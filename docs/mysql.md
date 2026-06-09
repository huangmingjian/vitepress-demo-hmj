### docker mysql
# 1. 删除旧的错误记录
ssh-keygen -R 121.40.22.192

# 2. 重新连接并接受新指纹
ssh root@121.40.22.192
# 输入 yes 接受新指纹

### mysql数据库
// 进入mysql
mysql -uroot -p123456 
// 修改数据库密码
updata mysql.user set authentication_string=password('123456') where user='root' and host='localhost'; 
flush privileges; // 刷新权限
show databases; // 显示所有数据库
create database test; // 创建数据库
use test; // 使用数据库
show tables; // 显示所有表
describe test; // 显示表结构
exit; // 退出
-- 单行注释
/* 多行注释 */
create database if not exists test; // 创建数据库，如果数据库已存在则不创建
drop database if exists test; // 删除数据库，如果数据库不存在则不删除
create table if not exists test; // 创建表
drop table if exists test; // 删除表

### 数值
tinyint // 1字节 范围 -128 ~ 127
smallint // 2字节 范围 -32768 ~ 32767
mediumint // 3字节 范围 -8388608 ~ 8388607
int // 4字节 范围 -2147483648 ~ 2147483647
bigint // 8字节 范围 -9223372036854775808 ~ 9223372036854775807
float // 单精度浮点数  4字节
double // 双精度浮点数  8字节
decimal // 高精度定点数  可指定精度和位数

### 字符串
char // 固定长度的字符串 0 ~ 255
varchar // 可变长字符串 0 ~ 65535
varchar(255) // 可变长字符串
tinytext // 短文本字符串 0 ~ 255
text // 长文本字符串 0 ~ 65535

### 日期和时间
date // 日期 0000-00-00 ~ 9999-12-31
time // 时间 00:00:00 ~ 23:59:59
datetime // 日期和时间 0000-00-00 00:00:00 ~ 9999-12-31 23:59:59
timestamp // 时间戳 1970-01-01 00:00:00 ~ 2038-01-19 03:14:07
year // 年份 1901 ~ 2155

### null
null // 空值

### 字段属性
UNSIGNED // 无符号,不能输入负数 unsigned
ZEROFILL // 零填充,数字前面补0 zerofill
AUTO_INCREMENT // 自增 auto_increment
NOT NULL // 不能为空 not null
DEFAULT '值' // 默认值 default '值'
COMMENT '注释' // 注释 comment '注释'
PRIMARY KEY // 主键 primary key
UNIQUE KEY // 唯一索引 unique key
KEY // 索引 key
FOREIGN KEY // 外键 foreign key

### 创建表

#### 语法
create table if not exists `表名` (
    `字段名` 数据类型 [属性] [索引] [注释],
    `字段名` 数据类型 [属性] [索引] [注释]
) [引擎] [字符集] [注释];
#### 示例
create table if not exists `test` ( -- 表名
    `id` int unsigned not null auto_increment comment 'id', 
    -- 字段名   数据类型:整数类型 unsigned:无符号 not null:不能为空 default:默认值 comment:注释
    `age` tinyint unsigned not null default 0 comment '年龄',
    -- 字段名   数据类型:字符串类型 not null:不能为空 default:默认值 comment:注释
    `name` varchar(255) not null default '' comment '名称',
    -- 字段名   数据类型:日期和时间类型 not null:不能为空 default:默认值 comment:注释
    `create_time` datetime not null default CURRENT_TIMESTAMP comment '创建时间',
    -- 字段名   数据类型:日期和时间类型 not null:不能为空 default:默认值 comment:注释
    `update_time` timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP comment '更新时间',
    -- 字段名   数据类型:日期和时间类型 not null:不能为空 default:默认值 comment:注释
    primary key (`id`)
    -- 主键
)engine=innodb default charset=utf8mb4 comment='测试表'; 
-- 表结构 engine:存储引擎 default:默认值 charset:字符集 comment:注释

#### 语句获取
show create table `表名`; // 获取创建表的语句
show create database `数据库名`; // 获取数据库创建的语句
desc `表名`; // 获取表结构

#### 引擎
engine=innodb; // innodb引擎 支持事务,外键,行级锁,安全性高(默认)
engine=myisam; // myisam引擎 不支持事务,外键,行级锁,安全性低
engine=memory; // memory引擎 内存引擎,数据存储在内存中,性能高,数据丢失
engine=aria; // aria引擎 兼容myisam引擎,支持事务,外键,行级锁,安全性高
engine=tokudb; // tokudb引擎 兼容innodb引擎,支持事务,外键,行级锁,安全性高


engine=ndbcluster; 
// ndbcluster引擎 兼容innodb引擎,支持事务,外键,行级锁,安全性高 主要用于分布式数据库
- NDB Cluster 引擎 专为集群环境设计,支持分布式数据库,提供高可用性和分区容忍性,适用于需要水平扩展的应用场景


engine=oceanbase; 
// oceanbase引擎 兼容innodb引擎,支持事务,外键,行级锁,安全性高 主要用于分布式数据库
- OceanBase 引擎,阿里巴巴开发的分布式关系型数据库,兼容 MySQL 协议，支持分布式事务,主要用于大规模分布式数据库场景
percona - Percona 引擎


engine=percona; 
// percona引擎 兼容innodb引擎,支持事务,外键,行级锁,安全性高 主要用于分布式数据库
-Percona 公司优化的 MySQL 版本,性能增强和高级监控功能,实际上不是一个独立的存储引擎，而是 MySQL 的发行版,搜索和空间索引引擎


engine=mroonga; 
// mroonga引擎 兼容innodb引擎,支持事务,外键,行级锁,安全性高 全文搜索
- Groonga 集成引擎,针对全文搜索优化,基于 Groonga 搜索库,提供比 MySQL 内置全文索引更好的搜索性能,geometry 和 spatial - 空间数据引擎

engine=geometry; 
// geometry引擎 兼容innodb引擎,支持事务,外键,行级锁,安全性高 空间索引
- 专门处理地理空间数据,支持空间索引，提高地理位置查询效率,用于 GIS（地理信息系统）应用


engine=spatial; // spatial引擎 兼容innodb引擎,支持事务,外键,行级锁,安全性高 空间索引
engine=federated; // federated引擎 兼容innodb引擎,支持事务,外键,行级锁,安全性高 跨数据库查询
engine=archive; // archive引擎 兼容innodb引擎,支持事务,外键,行级锁,安全性高 压缩存储

### 修改表
alter table `表名` rename to `新表名`; // 修改表名
alter table `表名` add column `字段名` 数据类型 [属性] [索引] [注释]; // 添加字段
alter table `表名` modify column `字段名` 数据类型 [属性] [索引] [注释]; // 修改字段约束
alter table `表名` change column `字段名` `新字段名` 数据类型 [属性] [索引] [注释]; // 修改字段名
alter table `表名` drop column `字段名`; // 删除字段
alter table `表名` add  constraint `约束名` foreign key (`字段名`) references `关联表名`(`关联字段名`); // 添加外键 foreign key: 自己的字段名 references: 关联的表名关联的字段名 constraint: 约束名
### 插入数据
insert into `表名` (`字段名1`, `字段名2`) values (`值1`, `值2`); // 插入数据
insert into `表名` values (`值1`, `值2`),(`值1`, `值2`),(`值1`, `值2`); // 批量插入数据
### 修改数据
update `表名` set `字段名1` = `值1`, `字段名2` = `值2` where `条件`; // 修改数据
### where 条件
where `字段名` = `值`; // 等于
where `字段名` <> `值`; // 不等于
where `字段名` > `值`; // 大于
where `字段名` >= `值`; // 大于等于
where `字段名` < `值`; // 小于
where `字段名` <= `值`; // 小于等于
where `字段名` like '%值%'; // 模糊匹配 % 表示任意字符 _ 匹配一个字符
where `字段名` in (`值1`, `值2`, `值3`); // 批量匹配
where `字段名` between `值1` and `值2`; // 范围匹配
where `字段名` is null; // 为 null
where `字段名` is not null; // 不为 null
order by `字段名` asc; // 升序
limit 0,10; //第1页数据，10条数据
group by `字段名`; // 分组
where `字段名` regexp '正则表达式'; // 正则匹配
where `字段名` between '2021-01-01' and '2021-12-31'; // 时间范围匹配
where `字段名` between '2021-01-01' and '2021-12-31' and `字段名2` = '值2'; // 多条件匹配
where `字段名` between '2021-01-01' and '2021-12-31' or `字段名2` = '值2'; // 多条件匹配
where `字段名` between '2021-01-01' and '2021-12-31' and `字段名2` = '值2' or `字段名3` = '值3'; // 多条件匹配
where `字段名` between '2021-01-01' and '2021-12-31' and `字段名2` = '值2' or `字段名3` = '值3' limit 10; // 多条件匹配 limit: 限制条数
where `字段名` between '2021-01-01' and '2021-12-31' and `字段名2` = '值2' or `字段名3` = '值3' limit 10 offset 10; // 多条件匹配 limit: 限制条数 offset: 跳过条数
where `字段名` between '2021-01-01' and '2021-12-31' and `字段名2` = '值2' or `字段名3` = '值3' limit 10 offset 10 order by `字段名` asc; // 多条件匹配 limit: 限制条数 offset: 跳过条数 order by: 排序 asc: 升序 desc: 降序
### 删除数据
delete from `表名` where `条件`; // 删除数据
delete from `表名`; // 删除所有数据 
truncate table `表名`; // 删除所有数据 不影响事务 自增重置
### 查询数据 DQL
select * from `表名`; // 查询所有数据
select `字段名1`, `字段名2` from `表名`; // 查询指定字段
select `字段名1` as `别名`, `字段名2` as `别名2` from `表名`;
select `字段名1`, `字段名2` from `表名` where `条件`; // 查询指定字段 条件
select `字段名1`, `字段名2` from `表名` where `条件` group by `字段名1`; // 查询指定字段 批量条件 group by: 分组
select `字段名1`, `字段名2` from `表名` where `条件` group by `字段名1` having `条件`; // 批量条件 having: 分组条件
select `字段名1`, `字段名2` from `表名` where `条件` order by `字段名1` asc; // 批量条件 排序 asc: 升序 desc: 降序
select `字段名1`, `字段名2` from `表名` where `条件` limit 10; // 批量条件 limit: 限制条数
select `字段名1`, `字段名2` from `表名` where `条件` limit 10 offset 10; // 批量条件 limit: 限制条数 offset: 跳过条数
select `字段名1`, `字段名2` from `表名` where `条件` limit 10 offset 10 order by `字段名1` asc; // 批量条件 limit: 限制条数 offset: 跳过条数 order by: 排序 asc: 升序 desc: 降序
### 联表查询
select * from `表名1` join `表名2` on `表名1`.`字段名1` = `表名2`.`字段名2`; 
// 联表查询 join: 内连接 left join: 左连接 right join: 右连接 full join: 全连接  on: 连接条件
// inner join: 内连接
#### 例如 inner join
select `别名1`.`字段名`,`字段名2`,`字段名3` 
from `表名1` as `别名1` 
inner join `表名2` as `别名2` 
on `表名1`.`字段名1` = `表名2`.`字段名2`;
// 查寻2个表的的字段，只有两个表有相同字段时才会返回,两个表都必须有相同字段的匹配值才会返回,如果某条记录在任一表中找不到对应匹配，则不会出现在结果中,以少的表为基准

#### 例如 left join
select `别名1`.`字段名`,`字段名2`,`字段名3` 
from `表名1` as `别名1` 
left join `表名2` as `别名2` 
on `表名1`.`字段名1` = `表名2`.`字段名2`;
// 查询2个表，返回第一个表所有字段，第二个表有相同字段时返回，以表名1为基准,表名2不存在的字段返回null
#### 例如 right join
select `别名1`.`字段名`,`字段名2`,`字段名3` 
from `表名1` as `别名1` 
right join `表名2` as `别名2` 
on `表名1`.`字段名1` = `表名2`.`字段名2`;
// 查询2个表，返回第二个表所有字段，第一个表有相同字段时返回,以表名2为基准,表名1不存在的字段返回null
#### 例如 full join
select `别名1`.`字段名`,`字段名2`,`字段名3` 
from `表名1` as `别名1` 
full join `表名2` as `别名2` 
on `表名1`.`字段名1` = `表名2`.`字段名2`;
// 批量查询，返回2个表所有字段，有相同字段时返回,返回两个表的所有字段，不管是否匹配,对于没有匹配的字段会显示为 NULL,以多个表时，返回所有字段，不管是否匹配,对于没有匹配的字段会显示为 NULL,以多个表为基准
//MySQL 不支持原生 FULL JOIN 使用下面 UNION
SELECT s.name, s.age, c.course_name, c.score
FROM students s
LEFT JOIN courses c ON s.id = c.student_id
UNION
SELECT s.name, s.age, c.course_name, c.score
FROM students s
RIGHT JOIN courses c ON s.id = c.student_id;
### 联表查询实例
CREATE TABLE students2 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    age TINYINT UNSIGNED DEFAULT 0 COMMENT '年龄',
    class VARCHAR(20) DEFAULT '' COMMENT '班级'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生表';

INSERT INTO students2 (name, age, class) VALUES 
('张三', 20, '计算机1班'),
('李四', 21, '计算机2班'),
('王五', 19, '数学系'),
('赵六', 22, '物理系'),
('钱七', 20, '化学系');

INSERT INTO students2 (name, age, class) VALUES 
('张三', 20, '计算机1班');

CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100) NOT NULL,
    student_id INT,
    score DECIMAL(5,2)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程成绩表';

-- 插入课程数据
INSERT INTO courses (course_name, student_id, score) VALUES 
('高等数学', 1, 85.5),
('线性代数', 1, 92.0),
('大学物理', 2, 78.5),
('计算机基础', 3, 88.0),
('数据结构', 1, 95.0);

INSERT INTO courses (course_name, student_id, score) VALUES 
('高等数学sss', 88, 85.5);

select id,name,age,score,course_name
from students2 as s
inner join courses c 
on s.id = c.student_id 


select id,name,age,score,course_name
from students2 as s
left join courses c 
on s.id = c.student_id 
UNION
select id,name,age,score,course_name
from students2 as s
right join courses c 
on s.id = c.student_id
### 聚合函数
select count(*); // 总记录数,查全部行,不忽略null
select count(`字段名`); // 字段记录数,查全部行,忽略null
select count(1); // 总记录数,查全部行,不忽略null
select count(distinct `字段名`); // 字段记录数,查全部行,忽略null,去重
select sum(`字段名`) from `表名`; // 查询字段求和
select avg(`字段名`) from `表名`; // 批量条件 查询字段平均值
select max(`字段名`) from `表名`; // 批量条件 查询字段最大值
select min(`字段名`) from `表名`; // 批量条件 查询字段最小值
select distinct `字段名` from `表名`; // 批量条件 查询字段去重
select concat(`字段名1`, `字段名2`) as `别名` from `表名`; // 拼接字段为一列
select VERSION(); // 查询数据库版本
select 100 + 200 as `结果`; // 计算
select @@auto_increment_increment; // 查询自增步长
select `字段名`+1 from `表名` where `字段名` = '值' // 字段加1
### 分组和过滤
select `字段名1`, `字段名2` from `表名` where `条件` group by `字段名1`; // 批量条件
select `字段名1`, `字段名2` from `表名` where `条件` group by `字段名1` having `条件`; // 批量条件 having: 过滤,分组后的条件过滤，where:分组前的条件过滤
### 加密
select md5('密码');
update `表名` set `字段名` = md5('密码') where `条件`;
select * from `表名` where `字段名` = md5('密码');

### 事务
set autocommit = 0; // 关闭自动提交 1：自动提交 0：手动提交
start transaction; // 开启事务
commit; // 提交事务
rollback; // 回滚事务
set autocommit = 1; // 开启自动提交
### 索引
create index `索引名` on `表名`(`字段名`); // 创建索引
drop index `索引名` on `表名`; // 删除索引
explain select * from `表名` where `字段名` = '值'; // 索引查询
show index from `表名`; // 显示索引信息
