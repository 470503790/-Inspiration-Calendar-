<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 灵感日历 (Inspiration Calendar)

[English](#english) | [中文](#中文)

---

## 中文

### 📖 项目简介

灵感日历是一个每日灵感生成器，能够为任意日期创建个性化的美学海报，结合精选名言和 AI 生成的艺术作品。通过 Google Gemini API 的强大能力，为您的每一天带来独特的视觉灵感和思想启迪。

### ✨ 主要特性

- 🎨 **多种主题风格** - 支持极简主义、赛博朋克、水彩画等多种视觉风格
- 🤖 **AI 驱动内容** - 使用 Gemini API 生成每日名言和配套的艺术作品
- 📅 **日期自定义** - 为任意日期生成专属的灵感海报
- 💾 **一键保存** - 轻松下载生成的海报图片
- 🌓 **深色模式** - 支持明暗两种界面主题
- 📱 **响应式设计** - 完美适配各种设备屏幕

### 🚀 本地运行

**前置要求：** Node.js

1. 安装依赖：
   ```bash
   npm install
   ```

2. 配置 API 密钥：
   - 复制 `.env.local.example` 为 `.env.local`
   - 在 `.env.local` 中设置你的 `GEMINI_API_KEY`
   - 获取 API 密钥：https://aistudio.google.com/apikey

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

4. 在浏览器中打开：`http://localhost:5173`

### 🌐 部署到 GitHub Pages

本应用可以通过 GitHub Actions 自动部署到 GitHub Pages。

#### 部署步骤：

1. **启用 GitHub Pages：**
   - 进入仓库的 Settings → Pages
   - 在 "Build and deployment" 下，选择 "Source: GitHub Actions"

2. **配置 API 密钥（重要！）：**
   - 用户需要在使用部署后的应用时提供自己的 GEMINI_API_KEY
   - 应用会在浏览器中提示用户输入 API 密钥
   - 或者用户可以在浏览器的 localStorage 中设置密钥

3. **执行部署：**
   - 推送代码到 `main` 分支
   - GitHub Actions 会自动构建并部署应用
   - 部署后的访问地址：`https://470503790.github.io/-Inspiration-Calendar-/`

#### 手动部署：

如需手动部署到其他平台：
```bash
npm run build
# 将 dist/ 文件夹的内容上传到你的托管服务
```

### 🛠️ 技术栈

- **前端框架：** React 19 + TypeScript
- **构建工具：** Vite
- **AI 服务：** Google Gemini API
- **UI 组件：** Lucide React (图标库)
- **样式：** CSS-in-JS

### 📂 项目结构

```
├── components/          # React 组件
├── services/           # API 服务（Gemini 集成）
├── utils/              # 工具函数
├── public/             # 静态资源
├── App.tsx             # 主应用组件
├── types.ts            # TypeScript 类型定义
└── constants.ts        # 常量配置
```

### 🔗 相关链接

- AI Studio 查看应用：https://ai.studio/apps/drive/10KeEgFyJxW4bwWsMpDV5iQ_1gALxOHSD
- 在线演示：https://470503790.github.io/-Inspiration-Calendar-/

---

## English

### 📖 About

Inspiration Calendar is a daily inspiration generator that creates personalized, aesthetic posters with curated quotes and AI-generated artwork for any date. Powered by Google Gemini API, it brings unique visual inspiration and thoughtful insights to every day.

### ✨ Features

- 🎨 **Multiple Theme Styles** - Supports minimalist, cyberpunk, watercolor, and more visual styles
- 🤖 **AI-Powered Content** - Uses Gemini API to generate daily quotes and matching artwork
- 📅 **Date Customization** - Generate unique inspiration posters for any date
- 💾 **One-Click Save** - Easily download generated poster images
- 🌓 **Dark Mode** - Supports both light and dark interface themes
- 📱 **Responsive Design** - Perfectly adapts to various device screens

### 🚀 Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure API Key:
   - Copy `.env.local.example` to `.env.local`
   - Set your `GEMINI_API_KEY` in `.env.local`
   - Get API key at: https://aistudio.google.com/apikey

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open in browser: `http://localhost:5173`

### 🌐 Deploy to GitHub Pages

This app can be automatically deployed to GitHub Pages using GitHub Actions.

#### Deployment Steps:

1. **Enable GitHub Pages:**
   - Go to your repository Settings → Pages
   - Under "Build and deployment", select "Source: GitHub Actions"

2. **Set up API Key (Important!):**
   - Users will need to provide their own GEMINI_API_KEY when using the deployed app
   - The app will prompt users to enter their API key in the browser
   - Alternatively, users can set it in their browser's localStorage

3. **Deploy:**
   - Push to the `main` branch
   - GitHub Actions will automatically build and deploy the app
   - The app will be available at: `https://470503790.github.io/-Inspiration-Calendar-/`

#### Manual Deployment:

To deploy manually to other platforms:
```bash
npm run build
# Upload the contents of the dist/ folder to your hosting service
```

### 🛠️ Tech Stack

- **Frontend Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **AI Service:** Google Gemini API
- **UI Components:** Lucide React (icon library)
- **Styling:** CSS-in-JS

### 📂 Project Structure

```
├── components/          # React components
├── services/           # API services (Gemini integration)
├── utils/              # Utility functions
├── public/             # Static assets
├── App.tsx             # Main app component
├── types.ts            # TypeScript type definitions
└── constants.ts        # Constants configuration
```

### 🔗 Links

- View app in AI Studio: https://ai.studio/apps/drive/10KeEgFyJxW4bwWsMpDV5iQ_1gALxOHSD
- Live Demo: https://470503790.github.io/-Inspiration-Calendar-/

