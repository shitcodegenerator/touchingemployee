<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
</script>
<template>
  <div>
    <van-nav-bar class="bg-red-500" :title="route.meta?.title" />
    <div class="px-4 pt-8 pb-20 bg-gray-100 min-h-[100dvh] overflow-y-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-nav-bar {
  @apply bg-main text-white;
}
:deep(.van-nav-bar__title) {
  @apply text-white tracking-wider text-base;
}
</style>
