<script setup lang="ts">
import { reactive } from "vue";
import Loading from "./components/Loading.vue";
import Navbar from "./components/Navbar.vue";
import usePage from "./store/page";
import { onMounted } from "vue";
const page = usePage();

const states = reactive({
  deferredPrompt: null,
});
onMounted(() => {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    states.deferredPrompt = e;
  });
  window.addEventListener("appinstalled", () => {
    states.deferredPrompt = null;
  });
});
const askClick = () => {
  if (states.deferredPrompt) {
    states.deferredPrompt.prompt();
    states.deferredPrompt = null;
  }
};
</script>

<template>
  <Navbar />
  <Loading v-if="page.loading" />
  <div @click="askClick">
    <router-view></router-view>
  </div>
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
