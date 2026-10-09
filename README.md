# FXTransaction · 外汇交易系统

> 基于 **Spring Cloud 微服务架构** 的外汇交易平台，提供账户与资金、外汇交易、实时行情、汇率预测、风险控制、消息通知等能力；配套 **React + Ant Design** 前端与 **Python AI 服务**（人脸识别登录 / 汇率预测）。

---

## 目录

- [功能特性](#功能特性)
- [系统架构](#系统架构)
- [服务与端口](#服务与端口)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [快速开始](#快速开始)
- [安全提示](#安全提示)
- [说明](#说明)

---

## 功能特性

| 模块 | 说明 |
| --- | --- |
| 👤 认证与授权 | 账号密码登录、邮箱验证码、**人脸识别登录**、JWT 签发与校验 |
| 💰 账户与资金 | 多币种账户、入金/出金、保证金、交易结算 |
| 📈 外汇交易 | 下单、成交、持仓与订单管理 |
| 🌐 实时行情 | 定时从汇率 API 拉取实时/历史汇率并落库 |
| 🔮 汇率预测 | 调用 Python AI 服务对目标货币对进行走势预测与操作建议 |
| 🛡️ 风险控制 | 独立的 risk-service 提供风控规则与敞口检查 |
| 🔔 消息通知 | 基于 Kafka + WebSocket 的实时消息推送 |
| 🖥️ 管理前端 | 看板、行情详情、交易、统计、权限管理、实时消息等页面 |

---

## 系统架构

采用 Spring Cloud 微服务架构：`discovery-service`（Eureka）负责服务注册与发现，`config-service`（Spring Cloud Config）统一管理配置（后端 Git 仓库），`gateway-service` 作为统一入口并做 JWT 鉴权，各业务服务通过 Feign / Kafka 协作，配置与消息经 Redis / Kafka 流转。

```text
                        ┌────────────────────┐
         浏览器 ───────▶ │  FrontEnd (React)   │ :3000
                        └─────────┬──────────┘
                                  │ /api 代理
                                  ▼
                        ┌────────────────────┐
                        │ gateway-service     │ :9002  (JWT 鉴权 + 路由)
                        └─────────┬──────────┘
              ┌───────────────┬───┴────┬───────────────┐
              ▼               ▼        ▼               ▼
        auth-service   account-service  trade-service  marketAnalysis-service
        risk-service   notification-service   flask-service ──▶ Python AI :5000
              ▲               ▲
              └──────┬────────┘
                     │ 注册/发现 & 配置
        ┌────────────┴─────────────┐
        ▼                          ▼
  discovery-service :8761    config-service :8888 ──▶ (Gitee 配置仓库)
                     │
        MySQL / Redis / Kafka(+Zookeeper)
```

---

## 服务与端口

| 服务 | 说明 | 端口 |
| --- | --- | --- |
| `FrontEnd` | React 管理前端 | 3000 |
| `gateway-service` | API 网关（路由 + JWT 鉴权） | 9002 |
| `discovery-service` | Eureka 服务注册中心 | 8761 |
| `config-service` | Spring Cloud Config 配置中心 | 8888 |
| `auth-service` | 认证鉴权、邮箱验证码、人脸登录换 token | 9000* |
| `account-service` | 账户与资金 | * |
| `trade-service` | 交易下单与结算 | 9006* |
| `marketAnalysis-service` | 行情采集与汇率预测 | 8081* |
| `risk-service` | 风险控制 | * |
| `notification-service` | Kafka/WebSocket 消息通知 | * |
| `flask-service` | 对接 Python AI 服务（人脸 / 预测） | 9010 |
| MySQL / Redis / Kafka / Zookeeper | 基础设施（docker-compose） | 3307 / 6379 / 9092 / 2181 |

> `*` 端口部分由配置中心（config-service 的远端 Git 仓库）提供，上表为网关路由与 docker-compose 中标注的约定值。

---

## 技术栈

**后端（Spring Cloud 微服务）**

- Spring Boot 3.4.4 · Spring Cloud 2024.0.1 · **Java 17**
- Eureka（服务发现）· Spring Cloud Gateway（网关）· Spring Cloud Config（配置中心）· Spring Cloud Bus
- Spring Data JPA · MySQL 8 · Redis
- Kafka + Zookeeper（消息）· WebSocket（推送）· OpenFeign（服务调用）
- Auth0 `java-jwt`（JWT）· Lombok · Maven 多模块 · Docker Compose

**前端**

- React 17（自定义 Webpack 脚手架）· Ant Design 4 · axios · react-redux
- react-router · `@stomp/stompjs`（WebSocket）· env-cmd · loadable-components

**AI 服务（外部依赖）**

- Python Flask，默认 `http://localhost:5000`
- `/detect_faceid`：人脸识别（登录）
- `/predict`：汇率走势预测

---

## 目录结构

```text
FXTransaction/
├── .gitignore
├── BackEnd/
│   └── FXTransaction/               # Spring Cloud 多模块工程
│       ├── pom.xml                  # 父 POM（聚合 9 个微服务）
│       ├── docker-compose.yml       # MySQL/Redis/Kafka/Zookeeper + 服务编排
│       ├── .env.example             # 环境变量模板（复制为 .env）
│       ├── discovery-service/       # 服务注册与发现
│       ├── config-service/          # 配置中心
│       ├── gateway-service/         # API 网关
│       ├── auth-service/            # 认证鉴权
│       ├── account-service/         # 账户资金
│       ├── trade-service/           # 交易
│       ├── marketAnalysis-service/  # 行情与预测
│       ├── risk-service/            # 风控
│       ├── notification-service/    # 消息通知
│       └── flask-service/           # 对接 Python AI
└── FrontEnd/                        # React 前端
    ├── package.json
    ├── .env.example                 # 前端环境变量模板
    ├── config/ scripts/ public/
    └── src/
        ├── api/ common/ components/ layout/ router/ store/ utils/
        └── pages/                   # login/board/trade/statistics/xiangqing/websocket...
```

---

## 快速开始

### 环境要求

| 组件 | 版本建议 |
| --- | --- |
| JDK | 17 |
| Maven | 3.8+ |
| Node.js | 16 / 18 |
| MySQL / Redis / Kafka | 由 `docker-compose.yml` 提供 |
| Docker | 20+（含 Compose） |

### 1. 配置环境变量（脱敏）

敏感配置已从源码 / 配置文件中抽离，改由环境变量注入。docker compose 会自动读取本目录下的 `.env`：

```bash
cd BackEnd/FXTransaction
cp .env.example .env
# 编辑 .env：填入 MySQL 口令、JWT 密钥、邮箱授权码、汇率 API Key 等
```

`.env` 已被 `.gitignore` 忽略，**不会提交**；`.env.example` 作为变量清单提交。可用变量：

| 变量 | 说明 |
| --- | --- |
| `MYSQL_ROOT_PASSWORD` / `MYSQL_DATABASE` / `MYSQL_PASSWORD` | docker-compose 中 MySQL 的初始化 |
| `JWT_KEY` | **各服务共用的 JWT 签名密钥**（必须保持一致） |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | auth-service 发送验证码的邮箱 |
| `EXCHANGE_RATE_API_KEY` | marketAnalysis-service 使用的 exchangerate-api.com 密钥 |
| `CURRENCY_DB_URL` / `CURRENCY_DB_USER` / `CURRENCY_DB_PASSWORD` | 行情服务独立数据库连接 |

> 本地运行 Spring 服务时，`.env` 会被 `springboot3-dotenv` 自动加载（工作目录需包含 `.env`）。
> 若 `.env` 不在工作目录，可通过 `-Dspringdotenv.directory=<路径>` 或环境变量 `SPRINGDOTENV_DIRECTORY` 指定；
> 也可直接导出变量：`set -a; source .env; set +a`。

### 2. 启动基础设施

```bash
cd BackEnd/FXTransaction
docker compose up -d mysql redis zookeeper kafka
```

### 3. 启动后端微服务

按依赖顺序启动（先 Eureka，再配置中心，最后业务服务与网关）：

```bash
cd BackEnd/FXTransaction

./mvnw -pl discovery-service spring-boot:run     # 或 mvn -pl ...
./mvnw -pl config-service spring-boot:run
./mvnw -pl auth-service,account-service,trade-service,marketAnalysis-service,risk-service,notification-service,flask-service spring-boot:run
./mvnw -pl gateway-service spring-boot:run
```

> 也可在 IDE 中分别启动各服务的 `*Application` 主类。
> 首次构建会从 Maven 中央仓库下载 `springboot3-dotenv` 等依赖。

### 4. 启动前端

```bash
cd FrontEnd
npm install
cp .env.example .env.development     # 按需填写，或直接使用默认值
npm start                            # http://localhost:3000
```

### 5. Python AI 服务（可选，人面识别 / 汇率预测所需）

`flask-service` 默认请求 `http://localhost:5000`，请另行启动提供 `/detect_faceid`、`/predict` 的 Python Flask 服务。

---

## 安全提示

- ✅ **配置脱敏**：MySQL 口令、JWT 密钥、邮箱授权码、汇率 API Key 等已从源码 / `application*.yml` / `docker-compose.yml` 中移除，统一通过环境变量 / `.env` 注入；仓库仅保留 `.env.example` 模板。
- ⚠️ **历史记录**：脱敏前真实凭据已进入 Git 历史（另有大量 `target/` 构建产物）。若仓库曾公开，建议**立即轮换/作废**相关凭据（数据库口令、JWT 密钥、邮箱授权码、汇率 API Key）。
- 🧹 **构建产物**：`target/`、`*.iml` 等此前被提交，建议按下方命令取消跟踪。
- 🔗 **外部依赖**：`config-service` 从 Gitee 配置仓库拉取配置，请确认该仓库本身不含敏感信息或已妥善保护。

---

## 说明

- 本项目为课程 / 创新实践项目，仅用于学习交流。
- `docker-compose.yml` 中部分服务的 `Dockerfile` 缺失（如 `trade-service`），构建相关服务前请先补齐。
