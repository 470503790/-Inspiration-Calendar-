<template>
  <view class="app-wrapper" :class="{ dark: isDark }">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isDark = ref(false)

// The actual dark-mode toggle is controlled inside pages via events.
// Expose a setter on the global instance if needed by pages.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (typeof getApp === 'function') {
  const app = getApp({ allowDefault: true })
  if (app) {
    // Provide a hook so pages can sync app-level theme state
    // without relying on browser APIs.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.setDarkMode = (value: boolean) => {
      isDark.value = value
    }
  }
}
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  background-color: #f3f4f6;
}

.app-wrapper.dark {
  background-color: #0f172a;
  color: #e2e8f0;
}
</style>
