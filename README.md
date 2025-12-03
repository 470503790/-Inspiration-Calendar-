# 灵感日历 (Inspiration Calendar)

跨端的 AI 海报生成应用，使用 **uni-app + uniCloud** 架构完成：前端一次开发即可运行在 H5/小程序/App，云端负责文案与插画生成，端能力按平台自动适配。

## 项目亮点
- 云函数生成灵感海报：前端通过 `uniCloud.callFunction` 调用 `generatePoster`，无须在客户端暴露模型或密钥。【F:frontend/services/posterService.ts†L7-L23】
- 多主题可选：极简、水彩、赛博朋克等 9 种风格提示词内置，方便快速切换。【F:frontend/types.ts†L1-L28】【F:frontend/constants.ts†L1-L22】
- 跨端保存/分享：根据 H5、微信小程序、App 端自动选择下载、保存到相册或系统分享等实现。【F:frontend/pages/index/index.vue†L49-L115】
- 深色模式：页面状态与全局应用同步，支持一键切换。【F:frontend/pages/index/index.vue†L31-L48】

## 仓库结构
- `frontend/`：uni-app 前端工程。
  - `pages/index/index.vue`：主页，包含生成、保存、分享、暗色切换等交互。【F:frontend/pages/index/index.vue†L1-L115】
  - `components/Controls`、`components/Poster`：表单与海报展示组件。
  - `services/posterService.ts`：封装对 `generatePoster` 云函数的调用逻辑。【F:frontend/services/posterService.ts†L7-L23】
  - `constants.ts`、`types.ts`：主题枚举与提示词配置。【F:frontend/types.ts†L1-L28】【F:frontend/constants.ts†L1-L22】
- `backend/uni-admin/`：官方 uni-admin 后台工程骨架，可在此目录下关联同一云服务空间、上传云函数与数据库资源。

## 快速开始（前端体验）
以下步骤可快速在本地启动 H5 预览，验证页面与交互逻辑。

1. 安装依赖：
   ```bash
   cd frontend
   npm install
   ```
2. 启动开发服务器（默认 H5 预览，可在 HBuilderX 中选择其他平台运行）：
   ```bash
   npm run dev
   ```
   该命令使用 `uni` CLI 启动 Vite 开发环境；如需指定平台，可执行 `npx uni -p h5`、`npx uni -p mp-weixin` 等。【F:frontend/package.json†L1-L18】

> 提示：未连接真实云函数时，页面仍可加载但生成按钮会因缺少 `generatePoster` 响应而报错。

## 云端准备（完整体验）
要生成真实的灵感海报，需要在 uniCloud 中提供 `generatePoster` 云函数并配置模型访问凭证。

1. **开通并登录云服务空间**：在 HBuilderX/uniCloud 控制台创建阿里云或腾讯云空间。
2. **配置环境变量**：在云控制台或本地模拟器中设置模型调用所需的 Access Token（示例：`BAIDU_ACCESS_TOKEN`）。
3. **创建 `generatePoster` 云函数**：
   - 建议在 `backend/uni-admin/uniCloud-aliyun/cloudfunctions/` 下新建同名目录并上传。
   - 入参：`date`（YYYY-MM-DD 字符串）、`theme`（对应 `types.ts` 中的 `PosterTheme` 枚举）。【F:frontend/services/posterService.ts†L7-L23】【F:frontend/types.ts†L1-L28】
   - 预期返回：`{ code: 0, data: { text: DailyContent, image: 'data:image/png;base64,...' } }`，其中 `DailyContent` 字段包括金句、作者、农历/节气、宜/忌等信息。【F:frontend/services/posterService.ts†L14-L23】【F:frontend/types.ts†L13-L30】
   - 文本提示词可复用前端的 `THEME_PROMPTS`，按主题拼接模型提示语。【F:frontend/constants.ts†L1-L22】
4. **部署并测试**：通过 HBuilderX 的 uniCloud 面板或 `npx uniCloud upload generatePoster` 上传云函数，确保返回结构符合预期后，再在前端页面点击生成进行验证。

## 生产打包
- 通用构建：
  ```bash
  cd frontend
  npm run build
  ```
  等价于执行 `uni build`，可在命令行参数中指定目标平台（如 `-p h5`、`-p mp-weixin`）。【F:frontend/package.json†L1-L18】
- App 打包：请在 HBuilderX 中打开前端工程，选择 App 平台并按向导完成签名与发布。

## 常见问题
- **生成失败 / 返回空数据**：检查云函数日志，确认环境变量、模型密钥及返回结构是否正确，与前端期望的 `code`、`data` 字段保持一致。【F:frontend/services/posterService.ts†L14-L23】
- **保存或分享无响应**：不同端的能力不一致，H5 默认触发下载，小程序/App 需具备保存到相册或系统分享权限。【F:frontend/pages/index/index.vue†L49-L115】
- **暗色模式未生效**：确保使用全局 `getApp().setDarkMode` 同步状态，且未被平台条件编译指令过滤。【F:frontend/pages/index/index.vue†L31-L48】

欢迎你在熟悉 uni-app/uniCloud 的基础上，按以上步骤快速体验并拓展灵感海报的更多主题与风格！
