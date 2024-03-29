<script lang="ts" setup>
import { watch } from "vue";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
const active = ref("");
const route = useRoute();

watch(
  () => route,
  (v) => {
    console.log(v);
    active.value = v.name;
  },
  {
    deep: true,
  }
);
</script>
<template>
  <van-tabbar v-model="active" class="">
    <van-tabbar-item icon="location-o" name="home" replace to="/"
      >打卡</van-tabbar-item
    >
    <van-tabbar-item icon="records-o" name="work" replace to="/work"
      >工作</van-tabbar-item
    >
    <van-tabbar-item icon="friends-o" name="contact" replace to="contact"
      >聯絡</van-tabbar-item
    >
    <van-tabbar-item icon="user-o" replace to="profile">個人</van-tabbar-item>
  </van-tabbar>
</template>
