<template>
  <teleport to="body">
    <div
      class="fixed top-0 w-full flex items-center justify-center bg-[#00000050] h-screen z-50"
    >
      <van-loading
        class="flex flex-col justify-center gap-4 items-center"
        type="spinner"
        size="60"
        text-color="white"
      >
        <span class="ml-0">努力載入中</span>
      </van-loading>
    </div>
  </teleport>
</template>
<style lang="scss" scoped>
:deep(.van-loading__text) {
  @apply ml-0;
}
</style>
