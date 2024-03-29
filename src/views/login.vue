<script lang="ts" setup>
import { ref } from "vue";
import { login } from "@/request/apis/index";
import { useUserStore } from "../store/user";
import { useRouter } from "vue-router";
import { showNotify } from "vant";
import logo from "@/assets/logo.png";

const username = ref("");
const password = ref("");
const user = useUserStore();
const router = useRouter();

const onSubmit = async () => {
  const { data } = await login({
    username: username.value,
    password: password.value,
  });
  user.data = data.data;
  localStorage.setItem("token", data.token);
  user.login = true;
  showNotify({ type: "success", message: "登入成功" });
  router.push("/");
};
</script>

<template>
  <div class="flex items-center justify-center flex-col h-[70dvh]">
    <img :src="logo" class="w-40 drop-shadow-xl" />
    <h1 class="mb-4 text-4xl font-bold tracking-widest text-gray-700 mt-4">
      踏取打卡系統
    </h1>
    <van-form class="mx-auto w-full gap-4" @submit="onSubmit">
      <van-cell-group inset class="shadow-lg border w-full py-4">
        <van-field
          v-model="username"
          name="員工編號"
          label="員工編號"
          placeholder="員工編號"
          :rules="[{ required: true, message: '請填寫員工編號' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密碼"
          label="密碼"
          placeholder="密碼"
          @keyup.enter="onSubmit"
          :rules="[{ required: true, message: '請填寫密碼' }]"
        />
      </van-cell-group>
      <div class="mt-4">
        <van-button block type="primary" native-type="submit">
          登入
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.van-cell-group {
  @apply ml-0;
}
</style>
