<script lang="ts" setup>
import { useUserStore } from "../store/user";
import { useRouter } from "vue-router";

const user = useUserStore();
const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push({ name: "login" });
};
</script>

<template>
  <div>
    <div
      class="bg-white rounded-lg shadow-lg p-4 mb-4 gap-4 flex flex-col text-gray-700"
    >
      <div>姓名：{{ user.data.name }}</div>
      <div>員工編號：{{ user.data.username }}</div>
    </div>
    <van-button type="danger" class="w-full" @click="logout">登出</van-button>
  </div>
</template>
