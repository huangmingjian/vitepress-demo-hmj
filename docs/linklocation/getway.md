# Gateway 网关配置示例

> 这里的 Gateway 指 `Spring Cloud Gateway`。网关常用于统一入口、路由转发、鉴权、限流、跨域、灰度发布、日志追踪等场景。

## 基础依赖

Spring Cloud Gateway 基于 WebFlux，项目中不要同时引入 `spring-boot-starter-web`，否则容易和 Servlet 容器冲突。

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>

<!-- 如果使用 Nacos 服务发现 -->
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

## 最小可用配置

```yaml
server:
  port: 9000

spring:
  application:
    name: gateway-service
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: http://127.0.0.1:8081
          predicates:
            - Path=/user/**
          filters:
            - StripPrefix=1
```

请求 `http://localhost:9000/user/list` 会转发到 `http://127.0.0.1:8081/list`。

## routes 路由配置详解

`routes` 是 Gateway 最核心的配置，意思是“路由列表”。一个网关可以配置多条路由，每一条路由负责判断一个请求是否应该转发到某个后端服务。

一条路由通常由 4 部分组成：

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service-route
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=2
```

字段说明：

| 字段 | 作用 | 示例 |
| --- | --- | --- |
| `id` | 路由唯一标识，方便日志、排查、Actuator 查看 | `user-service-route` |
| `uri` | 请求最终转发到哪里 | `http://127.0.0.1:8081`、`lb://user-service` |
| `predicates` | 路由匹配条件，全部满足才会命中这条路由 | `Path=/api/user/**` |
| `filters` | 命中路由后，对请求或响应做处理 | `StripPrefix=2` |
| `metadata` | 路由元数据，常用于单独设置超时等扩展信息 | `response-timeout: 5000` |
| `order` | 路由优先级，值越小优先级越高 | `order: -1` |

Gateway 处理请求的大致流程：

1. 客户端请求进入网关，例如 `/api/user/list`。
2. Gateway 从上到下检查 `routes` 中的路由。
3. 判断每条路由的 `predicates` 是否全部满足。
4. 命中后执行这条路由的 `filters`。
5. 按 `uri` 转发到后端服务。
6. 后端响应回来后，再经过响应过滤器返回给客户端。

### id：路由唯一名称

`id` 不参与路径匹配，但它很重要。日志排查、Actuator 查看路由、动态刷新路由时都会用到它。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service-route
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
```

建议命名规则：

```text
业务名-service-route
业务名-api-route
环境-业务名-route
```

例如：

```text
user-service-route
order-service-route
admin-api-route
gray-order-route
```

### uri：转发目标地址

`uri` 表示网关把请求转发到哪里，常见写法有 4 种。

#### 固定 HTTP 地址

适合本地开发、单体服务、没有接注册中心的项目。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-http-route
          uri: http://127.0.0.1:8081
          predicates:
            - Path=/user/**
```

请求：

```text
GET http://localhost:9000/user/list
```

转发到：

```text
GET http://127.0.0.1:8081/user/list
```

#### lb:// 服务名

适合微服务项目。`lb` 是 load balance 的意思，Gateway 会从注册中心选择一个服务实例。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-lb-route
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=2
```

请求：

```text
GET http://localhost:9000/api/user/list
```

匹配和转发过程：

```text
/api/user/list 命中 Path=/api/user/**
StripPrefix=2 去掉 /api/user
最终转发到 user-service 的 /list
```

#### ws:// WebSocket 地址

适合转发 WebSocket 连接。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: ws-route
          uri: ws://127.0.0.1:8082
          predicates:
            - Path=/ws/**
```

#### lb:ws:// WebSocket 服务名

适合 WebSocket 服务也注册到 Nacos、Eureka 等注册中心的场景。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: message-ws-route
          uri: lb:ws://message-service
          predicates:
            - Path=/ws/message/**
          filters:
            - StripPrefix=1
```

### predicates：路由匹配条件

`predicates` 是“断言”，也就是判断请求是否符合这条路由。多个断言同时存在时，必须全部满足才会命中。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-post-route
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
            - Method=POST
            - Header=X-Client-Type, app
```

这条路由的含义是：

```text
路径必须以 /api/user/ 开头
请求方法必须是 POST
请求头 X-Client-Type 必须匹配 app
三个条件都满足才会转发到 user-service
```

常见断言组合示例：

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: admin-route
          uri: lb://admin-service
          predicates:
            - Host=admin.example.com
            - Path=/api/admin/**

        - id: open-api-route
          uri: lb://open-api-service
          predicates:
            - Path=/open/**
            - Query=appId

        - id: mobile-route
          uri: lb://mobile-service
          predicates:
            - Path=/api/**
            - Header=User-Agent, .*Mobile.*
```

### filters：请求和响应处理

`filters` 会在路由命中后执行，常用于路径改写、添加请求头、限流、熔断、重试等。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-filter-route
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=2
            - AddRequestHeader=X-Gateway-Source, gateway-service
            - AddResponseHeader=X-Response-From, gateway
```

请求 `/api/user/list` 的变化：

```text
原始路径：/api/user/list
StripPrefix=2 后：/list
请求头增加：X-Gateway-Source: gateway-service
响应头增加：X-Response-From: gateway
```

### metadata：单条路由的额外配置

`metadata` 常用于给某条路由单独配置超时时间。比如导出接口、文件接口可能比普通接口慢，就可以单独放宽。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: export-route
          uri: lb://report-service
          predicates:
            - Path=/api/report/export/**
          filters:
            - StripPrefix=2
          metadata:
            connect-timeout: 3000
            response-timeout: 60000
```

含义：

```text
connect-timeout: 建立连接最多等待 3000 毫秒
response-timeout: 等待后端响应最多 60000 毫秒
```

### order：路由优先级

当多条路由都可能匹配同一个请求时，可以通过 `order` 控制优先级。值越小，越先匹配。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-detail-route
          uri: lb://user-detail-service
          order: -1
          predicates:
            - Path=/api/user/detail/**

        - id: user-route
          uri: lb://user-service
          order: 0
          predicates:
            - Path=/api/user/**
```

请求 `/api/user/detail/1` 同时符合两条路由，但 `user-detail-route` 的 `order` 更小，所以会优先命中。

### 多 routes 示例

实际项目中通常会按服务拆分多条路由。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-route
          uri: lb://auth-service
          predicates:
            - Path=/auth/**
          filters:
            - StripPrefix=1

        - id: user-route
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=2

        - id: order-route
          uri: lb://order-service
          predicates:
            - Path=/api/order/**
          filters:
            - StripPrefix=2

        - id: file-route
          uri: lb://file-service
          predicates:
            - Path=/api/file/**
          filters:
            - StripPrefix=2
          metadata:
            response-timeout: 60000
```

访问效果：

| 外部请求 | 命中路由 | 转发服务 | 转发路径 |
| --- | --- | --- | --- |
| `/auth/login` | `auth-route` | `auth-service` | `/login` |
| `/api/user/list` | `user-route` | `user-service` | `/list` |
| `/api/order/create` | `order-route` | `order-service` | `/create` |
| `/api/file/upload` | `file-route` | `file-service` | `/upload` |

### 常见 routes 配置错误

#### StripPrefix 数量写错

```yaml
predicates:
  - Path=/api/user/**
filters:
  - StripPrefix=1
```

请求 `/api/user/list` 只去掉了 `/api`，后端收到的是 `/user/list`。如果后端接口实际是 `/list`，这里应该写：

```yaml
filters:
  - StripPrefix=2
```

#### 路由顺序太宽泛

```yaml
routes:
  - id: api-route
    uri: lb://api-service
    predicates:
      - Path=/api/**

  - id: user-route
    uri: lb://user-service
    predicates:
      - Path=/api/user/**
```

`/api/user/list` 可能先被 `/api/**` 这条宽泛路由命中。更推荐把更具体的路由放前面，或者配置 `order`：

```yaml
routes:
  - id: user-route
    uri: lb://user-service
    order: -1
    predicates:
      - Path=/api/user/**

  - id: api-route
    uri: lb://api-service
    order: 0
    predicates:
      - Path=/api/**
```

#### lb:// 服务名写错

```yaml
uri: lb://user
```

如果注册中心里的服务名是 `user-service`，这里就必须写：

```yaml
uri: lb://user-service
```

否则网关通常会返回 `503 Service Unavailable`。

## 通过服务名转发

使用注册中心时，`uri` 可以写成 `lb://服务名`，Gateway 会通过负载均衡选择服务实例。

```yaml
spring:
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
      routes:
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/order/**
          filters:
            - StripPrefix=1
```

## Nacos 配置示例

```yaml
spring:
  application:
    name: gateway-service
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
        namespace: public
        group: DEFAULT_GROUP
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=2
```

请求 `/api/user/profile` 会转发到 `user-service` 的 `/profile`。

## 常用 Predicate 断言

### Path 路径匹配

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: path-route
          uri: http://127.0.0.1:8080
          predicates:
            - Path=/api/**
```

### Path 匹配规则和转发路径变化

`Path` 只负责判断请求路径是否能命中当前路由，它本身不会修改路径。真正改变转发路径的是 `filters`，常见的是 `StripPrefix`、`PrefixPath`、`RewritePath`。

先记住一句话：

```text
Path 负责匹配
StripPrefix 负责去除前缀
PrefixPath 负责增加前缀
RewritePath 负责按正则重写路径
```

#### Path 的基本匹配规则

```yaml
predicates:
  - Path=/api/user/**
```

匹配结果：

| 请求路径 | 是否匹配 | 说明 |
| --- | --- | --- |
| `/api/user/list` | 匹配 | `/api/user/` 后面可以有任意多级路径 |
| `/api/user/detail/1` | 匹配 | `**` 可以匹配多级路径 |
| `/api/order/list` | 不匹配 | 前缀不是 `/api/user/` |
| `/api/user` | 通常不匹配 | 少了最后的 `/`，建议按实际需要补一条精确匹配 |

如果既要匹配 `/api/user`，又要匹配 `/api/user/list`，可以这样写：

```yaml
predicates:
  - Path=/api/user,/api/user/**
```

多个路径也可以写在同一个 `Path` 中：

```yaml
predicates:
  - Path=/api/user/**,/api/member/**
```

#### 不加 filter：原路径完整转发

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-route
          uri: http://127.0.0.1:8081
          predicates:
            - Path=/api/user/**
```

路径变化：

| 外部请求 | 后端实际收到 |
| --- | --- |
| `/api/user/list` | `/api/user/list` |
| `/api/user/detail/1` | `/api/user/detail/1` |

说明：`Path=/api/user/**` 只是命中路由，不会自动把 `/api/user` 去掉。

#### StripPrefix：转发时去除前几段路径

`StripPrefix=N` 表示从路径开头去掉 `N` 段。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-route
          uri: http://127.0.0.1:8081
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=2
```

路径分段：

```text
/api/user/list
 1   2    3
```

`StripPrefix=2` 去掉 `/api/user`，后端实际收到 `/list`。

| 外部请求 | StripPrefix | 后端实际收到 |
| --- | --- | --- |
| `/api/user/list` | `2` | `/list` |
| `/api/user/detail/1` | `2` | `/detail/1` |
| `/api/user/address/page` | `2` | `/address/page` |

如果写成 `StripPrefix=1`：

```yaml
filters:
  - StripPrefix=1
```

路径变化会变成：

| 外部请求 | 后端实际收到 |
| --- | --- |
| `/api/user/list` | `/user/list` |
| `/api/user/detail/1` | `/user/detail/1` |

所以 `StripPrefix` 写几，取决于后端接口实际从哪一级开始接收。

常见对应关系：

| 网关访问路径 | 后端接口路径 | 推荐配置 |
| --- | --- | --- |
| `/api/user/list` | `/api/user/list` | 不写 `StripPrefix` |
| `/api/user/list` | `/user/list` | `StripPrefix=1` |
| `/api/user/list` | `/list` | `StripPrefix=2` |

#### PrefixPath：转发时增加前缀

`PrefixPath` 用于给后端请求路径前面加一段路径。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-route
          uri: http://127.0.0.1:8081
          predicates:
            - Path=/user/**
          filters:
            - PrefixPath=/api
```

路径变化：

| 外部请求 | 后端实际收到 |
| --- | --- |
| `/user/list` | `/api/user/list` |
| `/user/detail/1` | `/api/user/detail/1` |

适合这种情况：

```text
前端希望访问：/user/list
后端实际接口：/api/user/list
```

#### StripPrefix + PrefixPath：先去除再增加

有些项目外部路径和后端路径不是简单一致，可以组合使用。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-route
          uri: http://127.0.0.1:8081
          predicates:
            - Path=/gateway/user/**
          filters:
            - StripPrefix=2
            - PrefixPath=/api/user
```

路径变化：

```text
外部请求：/gateway/user/list
StripPrefix=2 后：/list
PrefixPath=/api/user 后：/api/user/list
```

最终后端收到：

```text
/api/user/list
```

#### RewritePath：精确控制路径重写

`RewritePath` 更灵活，适合复杂路径替换。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-route
          uri: http://127.0.0.1:8081
          predicates:
            - Path=/api/user/**
          filters:
            - RewritePath=/api/user/(?<segment>.*), /$\{segment}
```

路径变化：

| 外部请求 | 后端实际收到 |
| --- | --- |
| `/api/user/list` | `/list` |
| `/api/user/detail/1` | `/detail/1` |

`(?<segment>.*)` 表示把 `/api/user/` 后面的内容保存成 `segment`，`/$\{segment}` 表示转发时只保留这一段。

也可以把路径改成另一套后端前缀：

```yaml
filters:
  - RewritePath=/api/user/(?<segment>.*), /internal/user/$\{segment}
```

路径变化：

| 外部请求 | 后端实际收到 |
| --- | --- |
| `/api/user/list` | `/internal/user/list` |
| `/api/user/detail/1` | `/internal/user/detail/1` |

#### uri 后面的路径不会自动拼接

很多人会误以为 `uri` 写了路径后，Gateway 会自动按自己想象的方式拼接。更推荐把路径变化交给 `filters` 明确处理。

不推荐这样表达复杂转发：

```yaml
uri: http://127.0.0.1:8081/api
predicates:
  - Path=/user/**
```

更清晰的写法是：

```yaml
uri: http://127.0.0.1:8081
predicates:
  - Path=/user/**
filters:
  - PrefixPath=/api
```

这样一眼就能看出：

```text
/user/list -> /api/user/list
```

#### 常用路径转发表

| 目标 | Path | filters | 转发效果 |
| --- | --- | --- | --- |
| 保留完整路径 | `/api/user/**` | 不写 | `/api/user/list -> /api/user/list` |
| 去掉 `/api` | `/api/user/**` | `StripPrefix=1` | `/api/user/list -> /user/list` |
| 去掉 `/api/user` | `/api/user/**` | `StripPrefix=2` | `/api/user/list -> /list` |
| 增加 `/api` | `/user/**` | `PrefixPath=/api` | `/user/list -> /api/user/list` |
| 改成内部路径 | `/api/user/**` | `RewritePath=/api/user/(?<segment>.*), /internal/user/$\{segment}` | `/api/user/list -> /internal/user/list` |

### Method 请求方法匹配

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: method-route
          uri: http://127.0.0.1:8080
          predicates:
            - Path=/api/**
            - Method=GET,POST
```

### Header 请求头匹配

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: header-route
          uri: http://127.0.0.1:8080
          predicates:
            - Header=X-Request-Source, app
```

### Query 参数匹配

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: query-route
          uri: http://127.0.0.1:8080
          predicates:
            - Query=token
            - Query=version, v1
```

### Host 域名匹配

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: host-route
          uri: http://127.0.0.1:8080
          predicates:
            - Host=api.example.com
```

### 时间匹配

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: time-route
          uri: http://127.0.0.1:8080
          predicates:
            - After=2026-01-01T00:00:00+08:00[Asia/Shanghai]
            - Before=2026-12-31T23:59:59+08:00[Asia/Shanghai]
```

## 常用 Filter 过滤器

### StripPrefix 去除路径前缀

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: strip-prefix-route
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=2
```

`/api/user/list` 转发后变成 `/list`。

### PrefixPath 添加路径前缀

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: prefix-path-route
          uri: http://127.0.0.1:8080
          predicates:
            - Path=/user/**
          filters:
            - PrefixPath=/api
```

`/user/list` 转发后变成 `/api/user/list`。

### RewritePath 重写路径

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: rewrite-path-route
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - RewritePath=/api/user/(?<segment>.*), /$\{segment}
```

`/api/user/list` 转发后变成 `/list`。

### AddRequestHeader 添加请求头

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: add-header-route
          uri: lb://user-service
          predicates:
            - Path=/user/**
          filters:
            - AddRequestHeader=X-Gateway-Source, gateway-service
```

### AddRequestParameter 添加参数

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: add-param-route
          uri: lb://user-service
          predicates:
            - Path=/user/**
          filters:
            - AddRequestParameter=from, gateway
```

### RemoveRequestHeader 移除请求头

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: remove-header-route
          uri: lb://user-service
          predicates:
            - Path=/user/**
          filters:
            - RemoveRequestHeader=Cookie
```

### SetStatus 修改响应状态码

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: set-status-route
          uri: lb://user-service
          predicates:
            - Path=/disabled/**
          filters:
            - SetStatus=403
```

## 全局跨域配置

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOriginPatterns:
              - "http://localhost:*"
              - "https://*.example.com"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders:
              - "*"
            allowCredentials: true
            maxAge: 3600
      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Origin Access-Control-Allow-Credentials
```

如果 `allowCredentials: true`，不要把允许来源配置成固定的 `"*"`。

## 默认过滤器

`default-filters` 会对所有路由生效，适合放通用请求头、响应头、去重等配置。

```yaml
spring:
  cloud:
    gateway:
      default-filters:
        - AddRequestHeader=X-Gateway-Name, gateway-service
        - AddResponseHeader=X-Response-From, spring-cloud-gateway
        - DedupeResponseHeader=Access-Control-Allow-Origin Access-Control-Allow-Credentials
```

## Redis 限流

### 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
</dependency>
```

### 配置

```yaml
spring:
  data:
    redis:
      host: 127.0.0.1
      port: 6379
  cloud:
    gateway:
      routes:
        - id: limit-route
          uri: lb://user-service
          predicates:
            - Path=/user/**
          filters:
            - name: RequestRateLimiter
              args:
                key-resolver: "#{@ipKeyResolver}"
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
                redis-rate-limiter.requestedTokens: 1
```

### KeyResolver

```java
package com.example.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
                exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
        );
    }
}
```

## 熔断降级

### 依赖

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-reactor-resilience4j</artifactId>
</dependency>
```

### 配置

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: fallback-route
          uri: lb://user-service
          predicates:
            - Path=/user/**
          filters:
            - name: CircuitBreaker
              args:
                name: userCircuitBreaker
                fallbackUri: forward:/fallback/user
```

### 降级接口

```java
package com.example.gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
public class FallbackController {

    @GetMapping("/fallback/user")
    public Mono<Map<String, Object>> userFallback() {
        return Mono.just(Map.of(
                "code", 503,
                "message", "user-service temporarily unavailable"
        ));
    }
}
```

## 超时配置

```yaml
spring:
  cloud:
    gateway:
      httpclient:
        connect-timeout: 5000
        response-timeout: 10s
      routes:
        - id: timeout-route
          uri: lb://user-service
          predicates:
            - Path=/user/**
          metadata:
            connect-timeout: 3000
            response-timeout: 5000
```

## WebSocket 转发

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: websocket-route
          uri: lb:ws://message-service
          predicates:
            - Path=/ws/**
          filters:
            - StripPrefix=1
```

如果不是服务发现，也可以写成：

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: websocket-route
          uri: ws://127.0.0.1:8082
          predicates:
            - Path=/ws/**
```

## 静态资源转发

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: static-route
          uri: http://127.0.0.1:8080
          predicates:
            - Path=/static/**
          filters:
            - AddResponseHeader=Cache-Control, public,max-age=2592000
```

## 文件上传配置

```yaml
spring:
  codec:
    max-in-memory-size: 10MB
  cloud:
    gateway:
      httpclient:
        response-timeout: 60s
      routes:
        - id: upload-route
          uri: lb://file-service
          predicates:
            - Path=/file/upload/**
          filters:
            - StripPrefix=1
```

大文件上传时，后端服务本身也要配置上传大小限制。

## Token 鉴权全局过滤器

```java
package com.example.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        if (path.startsWith("/auth/login") || path.startsWith("/public/")) {
            return chain.filter(exchange);
        }

        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null || token.isBlank()) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
```

## 请求日志全局过滤器

```java
package com.example.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class AccessLogGlobalFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long start = System.currentTimeMillis();
        String method = exchange.getRequest().getMethod().name();
        String path = exchange.getRequest().getURI().getRawPath();

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            int status = exchange.getResponse().getStatusCode() == null
                    ? 200
                    : exchange.getResponse().getStatusCode().value();
            log.info("gateway access: method={}, path={}, status={}, cost={}ms",
                    method, path, status, System.currentTimeMillis() - start);
        }));
    }

    @Override
    public int getOrder() {
        return -90;
    }
}
```

## 自定义局部过滤器

过滤器名称为类名去掉 `GatewayFilterFactory` 后缀，例如 `RequestTimeGatewayFilterFactory` 在配置中写 `RequestTime`。

```java
package com.example.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Component
public class RequestTimeGatewayFilterFactory
        extends AbstractGatewayFilterFactory<RequestTimeGatewayFilterFactory.Config> {

    public RequestTimeGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public List<String> shortcutFieldOrder() {
        return List.of("enabled");
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            long start = System.currentTimeMillis();
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                if (config.enabled) {
                    log.info("request cost {} ms", System.currentTimeMillis() - start);
                }
            }));
        };
    }

    public static class Config {
        private boolean enabled;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }
    }
}
```

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: request-time-route
          uri: lb://user-service
          predicates:
            - Path=/user/**
          filters:
            - RequestTime=true
```

## 灰度发布

### 按 Header 灰度

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: order-gray
          uri: lb://order-service-gray
          predicates:
            - Path=/order/**
            - Header=X-Version, gray
          filters:
            - StripPrefix=1

        - id: order-prod
          uri: lb://order-service
          predicates:
            - Path=/order/**
          filters:
            - StripPrefix=1
```

灰度路由要放在正式路由前面，否则请求会先命中正式路由。

### 按权重灰度

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: order-v1
          uri: lb://order-service-v1
          predicates:
            - Path=/order/**
            - Weight=order-group, 90

        - id: order-v2
          uri: lb://order-service-v2
          predicates:
            - Path=/order/**
            - Weight=order-group, 10
```

## 动态路由配置

如果路由放在 Nacos 配置中心，可以把下面内容作为配置文件，例如 `gateway-routes.yaml`。

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=2

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/order/**
          filters:
            - StripPrefix=2
```

启动配置示例：

```yaml
spring:
  application:
    name: gateway-service
  config:
    import:
      - optional:nacos:gateway-routes.yaml
  cloud:
    nacos:
      config:
        server-addr: 127.0.0.1:8848
        file-extension: yaml
```

## Actuator 查看路由

### 依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

### 配置

```yaml
management:
  endpoints:
    web:
      exposure:
        include: gateway,health,info
  endpoint:
    gateway:
      enabled: true
```

常用接口：

```text
GET /actuator/gateway/routes
GET /actuator/gateway/routes/{id}
POST /actuator/gateway/refresh
```

## 完整 application.yml 示例

```yaml
server:
  port: 9000

spring:
  application:
    name: gateway-service
  data:
    redis:
      host: 127.0.0.1
      port: 6379
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
    gateway:
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true
      httpclient:
        connect-timeout: 5000
        response-timeout: 10s
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOriginPatterns:
              - "http://localhost:*"
              - "https://*.example.com"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders:
              - "*"
            allowCredentials: true
            maxAge: 3600
      default-filters:
        - AddRequestHeader=X-Gateway-Name, gateway-service
        - DedupeResponseHeader=Access-Control-Allow-Origin Access-Control-Allow-Credentials
      routes:
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/auth/**
          filters:
            - StripPrefix=1

        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=2
            - name: RequestRateLimiter
              args:
                key-resolver: "#{@ipKeyResolver}"
                redis-rate-limiter.replenishRate: 20
                redis-rate-limiter.burstCapacity: 40

        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/order/**
          filters:
            - StripPrefix=2
            - name: CircuitBreaker
              args:
                name: orderCircuitBreaker
                fallbackUri: forward:/fallback/order

        - id: file-service
          uri: lb://file-service
          predicates:
            - Path=/api/file/**
          filters:
            - StripPrefix=2

        - id: message-websocket
          uri: lb:ws://message-service
          predicates:
            - Path=/ws/**
          filters:
            - StripPrefix=1

management:
  endpoints:
    web:
      exposure:
        include: gateway,health,info
  endpoint:
    gateway:
      enabled: true
```

## 常见问题

### 404

1. 检查 `Path` 是否匹配。
2. 检查 `StripPrefix` 是否把路径裁剪过多。
3. 检查路由顺序，精确路由和灰度路由要放前面。

### 503

1. 使用 `lb://服务名` 时，检查服务是否已经注册到 Nacos。
2. 检查服务名大小写，建议打开 `lower-case-service-id`。
3. 检查注册中心命名空间和分组是否一致。

### 跨域失败

1. 不要同时在后端服务和网关重复设置冲突的 CORS 响应头。
2. 携带 cookie 时，`Access-Control-Allow-Origin` 不能是 `*`。
3. 预检请求 `OPTIONS` 要允许通过。

### 网关启动冲突

Gateway 使用 WebFlux，普通 Spring MVC 项目常用的 `spring-boot-starter-web` 不建议和 Gateway 同时引入。
