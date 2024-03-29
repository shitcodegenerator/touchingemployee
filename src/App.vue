<script setup lang="ts">
import Loading from "./components/Loading.vue";
import Navbar from "./components/Navbar.vue";
import usePage from "./store/page";
const page = usePage();
</script>

<template>
  <Navbar />
  <Loading v-if="page.loading" />
  <router-view></router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
