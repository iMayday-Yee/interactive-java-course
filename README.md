# Interactive Java Course · Java 交互课

一个面向有编程基础学习者的交互式 Java 课程：一屏一步，先看目标，再读概念、运行代码、动手写，最后把结论抽象成可迁移的规则。

课程默认以 **Java 17** 为运行基线，前端按 Java 15 语法兼容，覆盖从运行机制到 JVM 内存的 15 章内容。

## 课程内容

当前共 **15 章 / 49 节 / 354 步 / 49 个示例 / 49 个编码练习 / 57 张对照表**。

| 章 | 主题 | 节数 |
|---|---|---|
| 0 | Java 运行机制 | 4 |
| 1 | 基础语法速通 | 4 |
| 2 | String 与包装类 | 4 |
| 3 | 面向对象基础 | 4 |
| 4 | 继承与多态 | 5 |
| 5 | Object 类 | 2 |
| 6 | 异常 | 3 |
| 7 | 集合框架 | 4 |
| 8 | 泛型 | 3 |
| 9 | 枚举与注解 | 3 |
| 10 | Lambda 与函数式接口 | 3 |
| 11 | Stream API | 3 |
| 12 | 多线程基础 | 3 |
| 13 | IO 基础 | 2 |
| 14 | JVM 与内存 | 2 |

每节课固定按 7 类步骤推进：

**目标 → 概念 → 代码示例（2 个场景 + 逐行解读）→ 交互练习 → 编码练习 → 小结 → 常见错误**

## 功能

- **步骤式学习**：每次只显示一个步骤，支持跳过；小结会标记未完成的步骤。
- **逐行解读**：点击示例代码的任意一行，在侧边查看该行解释。
- **交互练习**：选择、判断、填空、排序四种题型。
- **编码练习**：Monaco 编辑器 + 真实编译运行；测试用例覆盖正常 / 边界 / 易错三类。
- **三类反馈**：编译错误、运行时异常、输出不符分别展示，并给出对应建议。
- **分级提示**：三级提示逐级展开；参考答案默认隐藏。
- **进度保存**：完成状态、答题结果、代码草稿保存在 `localStorage`。
- **离线降级**：执行服务不可用时明确提示，只展示测试用例与静态检查。
- **响应式界面**：可折叠章节目录、章节 / 小节进度条、可随窗口高度调整的编辑器。

## 技术栈

- Vite + React 18 + TypeScript
- `@monaco-editor/react` + 本地 Monaco 打包（无 CDN 依赖）
- Express + 本机 `javac` / `java` 执行服务
- 字体：IBM Plex Sans / Serif / Mono（本地 `@fontsource`）

## 快速开始

环境要求：

- Node.js 22+
- JDK 17（`java` 与 `javac` 都在 `PATH` 中）

```bash
npm install
npm run dev
```

- 前端开发服务器：`http://127.0.0.1:5173`（端口被占用时会自动顺延）
- 执行后端：`http://127.0.0.1:3001`

`npm run dev` 通过 `concurrently` 同时启动 Vite 与 Node 后端；Vite 将 `/api` 代理到后端，因此浏览器侧不需要处理跨域。

## 可用命令

```bash
npm run dev                # 同时启动前端与执行后端
npm run build              # 类型检查 + 生产构建
npm start                  # 构建后运行：静态站点 + 执行 API（默认 3001）
npm run lint:content       # 校验课程结构、双场景、小结一般规则、错误表述等
npm run validate:exercises # 用后端真实执行所有编码练习的参考答案（需先启动后端）
```

内容校验和练习验证都已通过：

- `lint:content`：15 章 / 49 节 / 354 步，无错误
- `validate:exercises`：49 / 49 个练习通过，每组 3～4 个用例

## 代码执行

前端只依赖 `/api` 抽象接口，后端实现为本地 `javac` / `java`：

| 接口 | 作用 |
|---|---|
| `GET /api/health` | 返回本机 JDK 状态 |
| `POST /api/execute` | 编译并运行一段 Java |
| `POST /api/execute-batch` | 编译一次，按组运行测试用例 |

限制与隔离：

- 编译、运行各 5 秒超时，超时杀掉进程组
- 输出截断 64KB，Java 堆上限 256MB
- 每次执行使用独立临时目录，执行后删除
- 并发执行上限 4，单批最多 20 个用例
- 拒绝空代码、超大代码与 `package` 声明

> 本地后端不是内核级沙箱，只适合运行学习者自己的代码。不要把它直接暴露到公网；需要执行不受信任代码时应使用容器化沙箱。

### 关于 Piston

PRD 原计划优先使用 Piston 公共 API。实测该接口自 2026-02-15 起仅限白名单，`execute` 返回 401，因此默认改用本地 JDK 执行。执行层保持独立，后续可替换为自托管 Piston、远程沙箱或其他实现。

## 项目结构

```text
src/
  content/        课程内容（与渲染解耦）
  components/     布局、步骤视图、通用 UI
  execution/      执行层抽象、API 客户端、环境检测
  pages/          课程目录与课堂页
  state/          进度 Context + localStorage
  styles/         设计 token、基础样式与主题
  lib/            语法高亮、Monaco 配置、章节配色
  types/          内容与进度类型
server/           Express + javac/java 执行器
scripts/          内容校验与练习答案验证
```

## 部署说明

`npm run build` 生成 `dist/`，`npm start` 由 Express 同时托管静态页面与执行 API。

- **GitHub Pages / 纯静态托管**：只能部署 `dist/`。因为没有 Java 后端，编码练习会进入离线模式。
- **完整功能**：需要把后端部署到可运行 Node + JDK 的主机（VPS、Render、Railway 等），并注意执行代码的安全边界。

## 进度存储

进度、上次位置、答题结果与代码草稿保存在浏览器 `localStorage`，键名为 `java-lesson-progress-v1`。首页底部可以清除进度。
