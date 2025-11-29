<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10KeEgFyJxW4bwWsMpDV5iQ_1gALxOHSD

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This app is automatically deployed to GitHub Pages using GitHub Actions.

### Setup Instructions:

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

### Manual Deployment:

To deploy manually:
```bash
npm run build
# Upload the contents of the dist/ folder to your hosting service
```

### Build Output:

The build process creates:
- Static HTML files with embedded styles
- JavaScript bundles with all app logic
- Assets are served with the base path `/-Inspiration-Calendar-/`

