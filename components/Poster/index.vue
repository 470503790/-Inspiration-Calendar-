<template>
  <view class="poster-card" :class="themeClass.wrapper">
    <view v-if="loading" class="poster-placeholder">
      <view class="dot" />
      <text class="placeholder-text">正在生成灵感海报...</text>
    </view>

    <view v-else-if="!data" class="poster-empty">
      <uni-icons type="star" color="#9ca3af" size="48" />
      <text class="empty-title">等待生成</text>
      <text class="empty-desc">选择日期与主题后生成今日灵感</text>
    </view>

    <view v-else class="poster-content">
      <view class="poster-image" :class="themeClass.imageWrapper">
        <image
          v-if="data.imageUrl"
          :src="data.imageUrl"
          mode="aspectFill"
          class="poster-img"
        />
        <view class="poster-overlay" :class="themeClass.overlay" />
      </view>

      <view class="poster-body" :class="themeClass.container">
        <view class="poster-header" :class="themeClass.header">
          <view class="date-block">
            <text class="date-day" :class="themeClass.fontDate">{{ formatted.day }}</text>
            <text class="meta" :class="themeClass.fontMeta">{{ formatted.monthEn }} · {{ formatted.year }}</text>
          </view>
          <view class="meta-block" :class="themeClass.fontMeta">
            <text class="weekday">{{ formatted.weekdayZh }}</text>
            <view class="theme-tag">
              <uni-icons type="heart" size="18" />
              <text>{{ themeShort }}</text>
            </view>
          </view>
        </view>

        <view class="quote" :class="themeClass.fontQuote">
          <text class="quote-mark">“</text>
          <text class="quote-text">{{ data.quote }}</text>
          <text class="quote-author">— {{ data.author }} —</text>
        </view>

        <view class="poster-footer" :class="themeClass.footer">
          <view class="footer-row">
            <view class="footer-item">
              <uni-icons type="flag" size="18" color="#2563eb" />
              <text class="footer-label">宜</text>
              <text class="footer-value">{{ data.yi }}</text>
            </view>
            <view class="footer-item">
              <uni-icons type="closeempty" size="18" color="#ef4444" />
              <text class="footer-label">忌</text>
              <text class="footer-value">{{ data.ji }}</text>
            </view>
          </view>
          <view class="footer-row">
            <view class="footer-item">
              <uni-icons type="gift" size="18" color="#f59e0b" />
              <text class="footer-label">幸运物</text>
              <text class="footer-value">{{ data.luckyItem }}</text>
            </view>
            <view class="footer-item">
              <uni-icons type="circle" size="18" color="#10b981" />
              <text class="footer-label">幸运色</text>
              <text class="footer-value">{{ data.luckyColor }}</text>
            </view>
          </view>
          <view class="footer-row">
            <text class="footer-meta">{{ data.lunarDate }} · {{ data.solarTerm }}</text>
            <button class="share-btn" size="mini" @click="emit('share')">
              <uni-icons type="paperplane" size="16" />
              分享
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PosterData, PosterTheme } from '../../types'
import { formatDateComponents } from '../../utils/dateUtils'

const props = defineProps<{
  data: PosterData | null
  loading: boolean
}>()

const emit = defineEmits(['share'])

const formatted = computed(() => {
  if (!props.data) return { day: '', monthEn: '', year: '', weekdayZh: '' }
  return formatDateComponents(new Date(props.data.date))
})

const themeShort = computed(() => {
  if (!props.data) return ''
  const [label] = props.data.theme.split(' ')
  return label
})

const themeClass = computed(() => {
  const base = {
    wrapper: 'theme-default',
    container: 'container-default',
    imageWrapper: 'image-default',
    overlay: 'overlay-default',
    header: 'header-default',
    fontDate: 'font-date-default',
    fontMeta: 'font-meta-default',
    fontQuote: 'font-quote-default',
    footer: 'footer-default'
  }

  if (!props.data) return base

  switch (props.data.theme) {
    case PosterTheme.CYBERPUNK:
      return {
        ...base,
        wrapper: 'theme-cyber',
        fontDate: 'font-date-cyber',
        fontMeta: 'font-meta-cyber'
      }
    case PosterTheme.WATERCOLOR:
      return {
        ...base,
        wrapper: 'theme-watercolor',
        overlay: 'overlay-watercolor'
      }
    case PosterTheme.INK_WASH:
      return {
        ...base,
        wrapper: 'theme-ink'
      }
    case PosterTheme.RETRO_POP:
      return {
        ...base,
        wrapper: 'theme-retro',
        fontDate: 'font-date-retro',
        fontQuote: 'font-quote-retro'
      }
    default:
      return base
  }
})
</script>

<style scoped>
.poster-card {
  width: 100%;
  min-height: 640rpx;
  border-radius: 32rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 40rpx rgba(0, 0, 0, 0.08);
  overflow: hidden;
  position: relative;
}

.poster-placeholder,
.poster-empty {
  min-height: 640rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  color: #9ca3af;
}

.poster-empty .empty-title {
  font-size: 32rpx;
  font-weight: 600;
}

.poster-empty .empty-desc {
  font-size: 24rpx;
  color: #a1a1aa;
}

.dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: linear-gradient(90deg, #60a5fa, #a855f7, #22d3ee);
  animation: pulse 1.2s infinite ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.6;
  }
}

.poster-content {
  position: relative;
  min-height: 640rpx;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.94));
}

.poster-image {
  width: 100%;
  height: 320rpx;
  position: relative;
  overflow: hidden;
}

.poster-img {
  width: 100%;
  height: 100%;
}

.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.poster-body {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.poster-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.date-block {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.date-day {
  font-size: 72rpx;
  font-weight: 800;
}

.meta {
  font-size: 24rpx;
  color: #6b7280;
}

.meta-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.meta-block .weekday {
  font-size: 28rpx;
  font-weight: 600;
}

.theme-tag {
  padding: 8rpx 12rpx;
  background: rgba(37, 99, 235, 0.08);
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #1d4ed8;
  font-size: 24rpx;
}

.quote {
  background: #111827;
  color: #e5e7eb;
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  position: relative;
}

.quote-mark {
  font-size: 48rpx;
  opacity: 0.4;
}

.quote-text {
  font-size: 32rpx;
  line-height: 1.6;
}

.quote-author {
  font-size: 24rpx;
  opacity: 0.8;
}

.poster-footer {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
}

.footer-item {
  background: #f8fafc;
  padding: 12rpx 16rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex: 1;
  color: #334155;
}

.footer-label {
  font-weight: 700;
  font-size: 24rpx;
}

.footer-value {
  font-size: 24rpx;
}

.footer-meta {
  font-size: 24rpx;
  color: #475569;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  color: #fff;
  border-radius: 999rpx;
  border: none;
  font-size: 24rpx;
}

.theme-default .quote {
  background: linear-gradient(135deg, #0f172a, #1e293b);
}

.theme-cyber {
  background: radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.14), rgba(6, 182, 212, 0));
}

.theme-cyber .quote {
  background: linear-gradient(135deg, #0f172a, #0ea5e9);
  box-shadow: 0 0 24rpx rgba(6, 182, 212, 0.32);
}

.theme-watercolor .poster-img {
  filter: saturate(1.2);
}

.theme-watercolor .overlay-watercolor {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.4));
}

.theme-ink {
  background: #f4f4f5;
}

.theme-ink .quote {
  background: #f5f5f4;
  color: #111827;
}

.theme-retro {
  background: linear-gradient(135deg, #fbbf24, #ef4444);
}

.theme-retro .quote {
  background: #111827;
  border: 4rpx solid #000;
  color: #fef3c7;
}

.font-date-cyber {
  color: #22d3ee;
  text-shadow: 0 0 12rpx rgba(34, 211, 238, 0.4);
}

.font-meta-cyber {
  color: #7dd3fc;
}

.font-date-retro {
  transform: rotate(-2deg);
  color: #1f2937;
}

.font-quote-retro {
  color: #fef3c7;
}
</style>
