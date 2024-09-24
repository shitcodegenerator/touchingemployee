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
const apiKey = ref("AIzaSyBytmX_W9NAAa50Y1Rk-3rbD3557wstnCs"); // 请替换为您的Google Maps API金鑰
const location = ref("");

// 使用Google Geolocation API來取得GPS位置
const getGps = async () => {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey.value}`
    );
    const { lat, lng } = response.data.location;

    setGooglePosition(lat, lng);

    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCSSU0_Mf_14700irQVfZo3eTESzlm2AVo`
    );
    if (geocodeResponse.data.results && geocodeResponse.data.results.length > 0) {
      location.value = geocodeResponse.data.results[0].formatted_address;
    } else {
      location.value = "無法取得地址";
    }

    page.loading = false;
  } catch (error) {
    console.error("GPS取得失敗", error);
    showNotify({
      type: "danger",
      message: "無法取得GPS定位，請檢查網絡連接並重試。",
    });
    page.loading = false;
  }
};

// 設定 Google 地圖
const setGooglePosition = async (lat, lng) => {
  const loader = new Loader({
    apiKey: apiKey.value,
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

const googleMap = ref();

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
      <div
        ref="googleMap"
        class="google-map"
        style="height: 300px;"
      ></div>
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
</template
