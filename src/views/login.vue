<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { login } from "@/request/apis/index";
import { useUserStore } from "../store/user";
import { useRouter } from "vue-router";
import { showNotify } from "vant";
import logo from "@/assets/logo.png";
import axios from "axios";

const username = ref("");
const password = ref("");
const user = useUserStore();
const router = useRouter();

const apiKey = "AIzaSyBytmX_W9NAAa50Y1Rk-3rbD3557wstnCs"; // 替換成你的Google Maps API金鑰

// 使用Google Maps Geolocation API
const getGps = async () => {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`
    );
    const location = response.data.location;
    const lat = location.lat;
    const lng = location.lng;
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    isLoginDisabled.value = false;
  } catch (error) {
    console.error(error);
    isLoginDisabled.value = true;
    showNotify({
      type: "danger",
      message: "無法取得GPS定位，請檢查您的連接並重試。",
    });
  }
};

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

const isLoginDisabled = ref(true);

onMounted(() => {
  getGps();
});
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
        <van-button
          :disabled="isLoginDisabled"
          block
          type="primary"
          native-type="submit"
        >
          {{ isLoginDisabled ? "GPS檢驗中" : "登入" }}
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
