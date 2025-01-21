<script lang="ts" setup>
import { useCurrentTime } from "@/utils/useCurrentTime";
import { showSuccessToast, showNotify } from "vant";
import dayjs from "dayjs";
import { clockin } from "../request/apis/index";
import { convertToUtc } from "../utils/timeFormat";
import { Loader } from "@googlemaps/js-api-loader";
import { onMounted, ref, computed } from "vue";
import pageStore from "../store/page";
import axios from "axios";

const page = pageStore();

const props = defineProps<{
  list: { start: string; end: string; _id: string }[];
}>();

const emit = defineEmits(["success"]);
const { currentTime } = useCurrentTime();
const location = ref("");
const latLng = ref<{ lat: number; lng: number } | null>(null);

const googleMap = ref();
const apiKey = "AIzaSyBytmX_W9NAAa50Y1Rk-3rbD3557wstnCs"; // 替換成你的Google Maps API金鑰

// 使用 HTML5 Geolocation API 獲取位置信息
const getGps = async () => {
  if (!navigator.geolocation) {
    showNotify({
      type: "danger",
      message: "瀏覽器不支援定位功能。",
    });
    page.loading = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Latitude:", latitude, "Longitude:", longitude);

      latLng.value = { lat: latitude, lng: longitude };
      setGooglePosition(latitude, longitude);

      // 使用 Google Maps Geocoding API 獲取地址
      try {
        const geocodeResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        if (
          geocodeResponse.data.results &&
          geocodeResponse.data.results.length > 0
        ) {
          location.value = geocodeResponse.data.results[0].formatted_address;
        } else {
          location.value = "無法取得地址";
        }
      } catch (error) {
        console.error("反向地理編碼失敗", error);
        location.value = "無法取得地址";
      }

      page.loading = false;
    },
    (error) => {
      console.error("GPS取得失敗", error.message);
      showNotify({
        type: "danger",
        message: "無法獲取位置信息，請檢查權限或網絡連接。",
      });
      page.loading = false;
    },
    {
      enableHighAccuracy: true, // 啟用高精度
      timeout: 10000, // 最長等待時間
      maximumAge: 0, // 不使用緩存
    }
  );
};

// 設置 Google 地圖
const setGooglePosition = async (lat: number, lng: number) => {
  const loader = new Loader({
    apiKey,
    version: "weekly",
    libraries: ["places"],
  });

  const { Map } = await loader.importLibrary("maps");
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");

  const mapOptions = {
    center: { lat, lng },
    mapId: "53669c146a65f7cd",
    zoom: 16,
    draggable: false,
  };

  const myMap = new Map(googleMap.value, mapOptions);
  googleMap.value.style.width = "100%";
  googleMap.value.style.height = "240px";
  googleMap.value.style.borderRadius = "8px";

  new AdvancedMarkerElement({
    position: mapOptions.center,
    map: myMap,
    title: "您的位置",
  });
};

const startClockIn = async () => {
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  if (!location.value) {
    showNotify({
      type: "danger",
      message: "無法獲得當前的GPS定位，請重新整理，並聯繫管理員。",
    });
    return;
  }

  await clockin({
    start: convertToUtc(currentTime),
    end: "",
    location: location.value,
  });

  showSuccessToast({
    message: "上班打卡\n加油加油！",
    icon: "fire",
    iconSize: "80px",
    className: "toast",
    closeOnClick: true,
    duration: 1500,
  });
  emit("success");
};

const endClockIn = async () => {
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  if (!location.value) {
    showNotify({
      type: "danger",
      message: "無法獲得當前的GPS定位，請重新整理，並聯繫管理員。",
    });
    return;
  }

  await clockin({
    start: "",
    end: convertToUtc(currentTime),
    location: location.value,
  });

  showSuccessToast({
    message: "下班打卡\n辛苦了！",
    icon: "smile",
    iconSize: "80px",
    className: "toast",
    closeOnClick: true,
    duration: 1500,
  });
  emit("success");
};

const lastTypeClockIn = computed(() => {
  if (!props.list || !props.list.length) return false;
  return !!props.list[0].start;
});

onMounted(async () => {
  page.loading = true;
  await getGps();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="w-full m-auto p-4 mb-4 bg-white rounded-lg shadow-lg text-black-500"
    >
      <div ref="googleMap" class="google-map" style="height: 300px"></div>
      <p class="my-2 text-blue-500 text-sm text-center">
        <van-icon name="location-o" />
        {{ location }}
      </p>
      <p class="font-bold text-black flex justify-center">
        {{ currentTime.toLocaleDateString() }}
      </p>
      <p class="font-bold text-black text-center text-3xl leading-[3rem]">
        {{ currentTime.toLocaleTimeString() }}
      </p>
    </div>

    <!-- 上班打卡按钮 -->
    <van-button
      v-if="!lastTypeClockIn"
      color="#2488c7"
      @click="startClockIn"
      size="large"
      icon="play"
      >上班打卡</van-button
    >

    <!-- 下班打卡按钮 -->
    <van-button
      v-else
      color="#38d360"
      @click="endClockIn"
      size="large"
      icon="wap-home"
      >下班打卡</van-button
    >
  </div>
</template>
