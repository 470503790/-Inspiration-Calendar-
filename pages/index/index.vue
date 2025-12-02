<template>
  <view class="page" :class="{ dark: isDark }">
    <view class="hero">
      <text class="headline">灵感日历 · Daily Inspiration</text>
      <text class="subtitle">跨端生成主题海报，随时保存与分享</text>
    </view>

    <view class="grid">
      <view class="left">
        <Controls
          :date="date"
          :theme="theme"
          :isDark="isDark"
          :status="status"
          :hasPoster="!!poster"
          @update:date="date = $event"
          @update:theme="theme = $event"
          @generate="handleGenerate"
          @save="handleSave"
          @toggleDark="toggleDark"
        />

        <view v-if="error" class="error">
          <uni-icons type="close" color="#ef4444" size="18" />
          <text>{{ error }}</text>
        </view>
      </view>

      <view class="right">
        <Poster :data="poster" :loading="isGenerating" @share="handleShare" />
        <view class="tip">内容由云端 Gemini 模型生成，可能存在偏差</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Controls from '../../components/Controls/index.vue'
import Poster from '../../components/Poster/index.vue'
import { GenerationStatus, PosterData, PosterTheme } from '../../types'
import { requestPosterFromCloud } from '../../services/geminiService'

const date = ref(new Date().toISOString().slice(0, 10))
const theme = ref<PosterTheme>(PosterTheme.MINIMALIST)
const status = ref<GenerationStatus>('idle')
const error = ref('')
const poster = ref<PosterData | null>(null)
const isDark = ref(false)

const isGenerating = computed(() => ['generating_text', 'generating_image', 'finalizing'].includes(status.value))

const toggleDark = () => {
  isDark.value = !isDark.value
  if (typeof getApp === 'function') {
    const app = getApp({ allowDefault: true }) as any
    app?.setDarkMode?.(isDark.value)
  }
}

const handleGenerate = async () => {
  status.value = 'generating_text'
  error.value = ''
  try {
    const data = await requestPosterFromCloud(date.value, theme.value)
    status.value = 'finalizing'
    await new Promise((resolve) => setTimeout(resolve, 600))
    poster.value = data
    status.value = 'complete'
  } catch (err: any) {
    error.value = err?.message || '生成失败，请稍后再试'
    status.value = 'error'
  }
}

const ensureImagePath = async (): Promise<string> => {
  if (!poster.value?.imageUrl) throw new Error('没有可以保存的图片')

  // #ifdef H5
  return poster.value.imageUrl
  // #endif

  const base64 = poster.value.imageUrl.split(',')[1]

  // #ifdef MP-WEIXIN
  const fs = uni.getFileSystemManager()
  const filePath = `${wx.env.USER_DATA_PATH}/poster-${Date.now()}.png`
  await new Promise<void>((resolve, reject) =>
    fs.writeFile({ filePath, data: base64, encoding: 'base64', success: () => resolve(), fail: reject })
  )
  return filePath
  // #endif

  // #ifdef APP-PLUS
  const bitmap = new plus.nativeObj.Bitmap('poster-bmp')
  const filePath = `_doc/poster-${Date.now()}.png`
  await new Promise<void>((resolve, reject) => {
    bitmap.loadBase64Data(
      base64,
      () => {
        bitmap.save(
          filePath,
          { overwrite: true, format: 'png' },
          () => {
            bitmap.clear()
            resolve()
          },
          (e) => reject(e)
        )
      },
      (e) => reject(e)
    )
  })
  return filePath
  // #endif

  // #ifndef H5 || MP-WEIXIN || APP-PLUS
  throw new Error('当前平台暂未适配保存能力')
  // #endif
}

const handleSave = async () => {
  if (!poster.value) return
  status.value = 'saving'
  try {
    const filePath = await ensureImagePath()
    // #ifdef H5
    const link = document.createElement('a')
    link.href = filePath
    link.download = `inspiration-${date.value}.png`
    link.click()
    // #endif

    // #ifdef MP-WEIXIN || APP-PLUS
    await uni.saveImageToPhotosAlbum({ filePath })
    uni.showToast({ title: '已保存到相册', icon: 'success' })
    // #endif

    // #ifndef H5 || MP-WEIXIN || APP-PLUS
    uni.showToast({ title: '请在支持的端使用保存功能', icon: 'none' })
    // #endif
    status.value = 'complete'
  } catch (err: any) {
    error.value = err?.message || '保存失败'
    status.value = 'error'
  }
}

const handleShare = async () => {
  if (!poster.value) return
  status.value = 'saving'
  try {
    const filePath = await ensureImagePath()
    // #ifdef APP-PLUS
    await uni.shareWithSystem({
      type: 'image',
      summary: `灵感日历 · ${date.value}`,
      href: filePath
    })
    // #endif

    // #ifdef MP-WEIXIN
    uni.showToast({ title: '请使用小程序分享面板', icon: 'none' })
    // #endif

    // #ifdef H5
    const link = document.createElement('a')
    link.href = filePath
    link.download = `inspiration-${date.value}.png`
    link.click()
    // #endif

    // #ifndef H5 || MP-WEIXIN || APP-PLUS
    uni.showToast({ title: '当前端暂不支持分享，已为你准备图片文件', icon: 'none' })
    // #endif
    status.value = 'complete'
  } catch (err: any) {
    error.value = err?.message || '分享失败'
    status.value = 'error'
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32rpx;
  background: linear-gradient(180deg, #e0f2fe, #eef2ff);
}

.page.dark {
  background: #0f172a;
  color: #e2e8f0;
}

.hero {
  margin-bottom: 24rpx;
}

.headline {
  font-size: 40rpx;
  font-weight: 900;
}

.subtitle {
  color: #475569;
  font-size: 26rpx;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.left,
.right {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

@media (min-width: 960px) {
  .grid {
    flex-direction: row;
  }
  .left {
    width: 36%;
  }
  .right {
    width: 64%;
  }
}

.error {
  margin-top: 12rpx;
  background: #fef2f2;
  color: #b91c1c;
  padding: 12rpx 16rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
}

.tip {
  text-align: center;
  color: #94a3b8;
  font-size: 22rpx;
}
</style>
