<template>
  <view class="controls-card">
    <view class="controls-header">
      <text class="title">灵感日历</text>
      <view class="header-actions">
        <button class="icon-btn" @click="emit('toggleDark')">
          <uni-icons :type="isDark ? 'sun' : 'moon'" size="20" />
          <text>{{ isDark ? '亮色' : '暗色' }}</text>
        </button>
      </view>
    </view>

    <view class="control-row">
      <text class="label">选择日期</text>
      <picker mode="date" :value="date" @change="onDateChange">
        <view class="picker-value">
          <uni-icons type="calendar" size="18" />
          <text>{{ date }}</text>
        </view>
      </picker>
    </view>

    <view class="control-row">
      <text class="label">选择主题</text>
      <scroll-view scroll-x class="theme-scroll">
        <view
          class="theme-chip"
          v-for="option in themeOptions"
          :key="option"
          :class="{ active: option === theme }"
          @click="emit('update:theme', option)"
        >
          <uni-icons type="color" size="16" />
          <text class="chip-text">{{ option }}</text>
        </view>
      </scroll-view>
    </view>

    <view class="control-actions">
      <button class="primary" :loading="isGenerating" :disabled="isGenerating" @click="emit('generate')">
        <uni-icons type="star-filled" size="18" />
        <text>{{ isGenerating ? '生成中...' : '生成今日灵感' }}</text>
      </button>
      <button class="ghost" :disabled="disableSave" @click="emit('save')">
        <uni-icons type="download" size="18" />
        保存/分享
      </button>
    </view>

    <view class="status" v-if="statusTip">
      <uni-icons type="info" size="16" />
      <text>{{ statusTip }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PosterTheme, GenerationStatus } from '../../types'

const props = defineProps<{
  date: string
  theme: PosterTheme
  isDark: boolean
  status: GenerationStatus
  hasPoster: boolean
}>()

const emit = defineEmits(['update:date', 'update:theme', 'generate', 'save', 'toggleDark'])

const themeOptions = Object.values(PosterTheme)

const isGenerating = computed(() => ['generating_text', 'generating_image', 'finalizing'].includes(props.status))

const disableSave = computed(() => !props.hasPoster || props.status === 'saving')

const statusTip = computed(() => {
  switch (props.status) {
    case 'generating_text':
      return '正在获取灵感文案...'
    case 'generating_image':
      return '正在绘制主题背景...'
    case 'finalizing':
      return '正在整理海报...'
    case 'saving':
      return '正在保存或分享...'
    case 'error':
      return '生成失败，请重试'
    default:
      return ''
  }
})

const onDateChange = (e: any) => {
  emit('update:date', e.detail.value)
}
</script>

<style scoped>
.controls-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 36rpx;
  font-weight: 800;
}

.header-actions {
  display: flex;
  gap: 12rpx;
}

.icon-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 16rpx;
  border-radius: 16rpx;
  background: #f1f5f9;
  color: #0f172a;
  border: none;
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.label {
  font-size: 28rpx;
  color: #475569;
}

.picker-value {
  display: flex;
  align-items: center;
  gap: 12rpx;
  background: #f8fafc;
  padding: 16rpx;
  border-radius: 14rpx;
  color: #0f172a;
}

.theme-scroll {
  display: flex;
  width: 100%;
}

.theme-chip {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 16rpx;
  background: #f8fafc;
  border-radius: 999rpx;
  margin-right: 12rpx;
  color: #0f172a;
  border: 2rpx solid transparent;
}

.theme-chip.active {
  border-color: #2563eb;
  box-shadow: 0 8rpx 20rpx rgba(37, 99, 235, 0.2);
  color: #1d4ed8;
  background: rgba(37, 99, 235, 0.08);
}

.control-actions {
  display: flex;
  gap: 16rpx;
}

.primary,
.ghost {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 16rpx;
  border-radius: 16rpx;
  border: none;
  font-size: 28rpx;
}

.primary {
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  color: #fff;
}

.ghost {
  background: #e2e8f0;
  color: #0f172a;
}

.status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 14rpx;
  background: #f1f5f9;
  border-radius: 12rpx;
  color: #475569;
  font-size: 24rpx;
}
</style>
