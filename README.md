# 灵感日历 · Inspiration Calendar

跨端的 AI 生成灵感海报应用，基于 **uni-app + uniCloud + uni-ai** 架构实现：前端一次开发多端发布，云函数托管推理与安全配置，提供保存/分享等端能力适配。

## 功能特性
- 多主题每日灵感：支持极简、水彩、赛博朋克等多种美术风格的海报生成。
- 云端 AI 生成：`generatePoster` 云函数使用 uni-ai 调用模型生成文案与插画，客户端无需暴露 API Key。
- 多端适配：H5、小程序、App 端统一代码，按端使用对应的保存/分享能力。
- 深色模式：页面支持主题切换，自动同步到全局应用包装。

## 目录与关键模块
- `pages/index/index.vue`：主页，提供日期/主题选择、生成与保存/分享操作。
- `components/Controls` / `components/Poster`：表单与海报展示组件。
- `services/posterService.ts`：前端调用 `generatePoster` 云函数的封装。
- `uniCloud-aliyun/cloudfunctions/generatePoster`：云端文本与图片生成逻辑，包含主题提示词与参数校验。

## 前置要求
- Node.js 18+。
- npm 8+（或 pnpm/yarn，请自行将命令替换）。
- 已安装 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 或 `@dcloudio/uni-app` CLI（用于本地运行/打包）。
- 在云服务空间或本地 uniCloud 模拟器中配置 `BAIDU_ACCESS_TOKEN` 环境变量（云函数读取，或通过 uni-admin 配置覆盖）。

## 本地运行
1. 安装依赖：
   ```bash
   npm install
   ```
2. 确认云函数可访问到 `BAIDU_ACCESS_TOKEN`：
   - 线上空间：在 uniCloud 控制台 > 环境变量 中添加。
   - 本地调试：在 uniCloud 本地运行面板设置环境变量，或通过命令行注入。
3. 启动 H5 预览（或在 HBuilderX 中选择目标平台运行）：
   ```bash
   npm run dev
   ```
   默认使用 `uni` CLI 打包；如需指定平台，可使用 `npx uni -p h5` / `npx uni -p mp-weixin` 等参数。

## 云函数部署
- 在 HBuilderX 的 uniCloud 面板上传 `generatePoster` 云函数，或使用 CLI：
  ```bash
  npx uniCloud upload generatePoster
  ```
- 确保部署环境已配置 `BAIDU_ACCESS_TOKEN`（或在 uni-admin 中设置），否则云函数会返回 `Missing BAIDU_ACCESS_TOKEN` 错误。

## uni-admin 后端集成
- 生成的海报会同步写入 `ic-poster-records` 集合，方便在 uni-admin 控制台中按主题/时间回溯与审核。
- 海报生成相关的配置（Access Token、图片尺寸、主题提示词）通过 uni-admin 维护：导入 `uniCloud-aliyun/database/ic-poster-config.schema.json` 后在管理页新增一条记录即可生效；未配置 Access Token 时继续读取环境变量 `BAIDU_ACCESS_TOKEN`。
- 如果使用 schema2code，请在 uniCloud 数据库中导入 `uniCloud-aliyun/database/ic-poster-records.schema.json` 以生成对应的管理页。

## 生产构建
根据目标端选择命令，例如：
- H5：`npx uni build -p h5`
- 微信小程序：`npx uni build -p mp-weixin`
- App（需 HBuilderX）：在 IDE 中选择 App 平台打包。

## 故障排查
- **生成失败**：检查云函数日志，确认环境变量和模型可用性；请求参数需通过日期与主题校验。
- **无法保存/分享**：当前端可能未适配，请在 H5 使用下载，或在小程序/App 端使用系统保存/分享能力。
- **暗色模式无效**：确认页面调用了切换函数，且未被平台条件编译去除。
