<script lang="ts" setup>
import { useCurrentTime } from "@/utils/useCurrentTime";
import { showSuccessToast, showNotify } from "vant";
import dayjs from "dayjs";
import { clockin } from "../request/apis/index";
import { convertToUtc } from "../utils/timeFormat";
import { Loader } from "@googlemaps/js-api-loader";
import { onMounted, ref, computed } from "vue";
import { list } from "postcss";
import pageStore from "../store/page";
import axios from "axios";
const page = pageStore();

const props = defineProps<{
  list: { start: string; end: string; _id: string }[];
}>();

const emit = defineEmits(["success"]);
const { currentTime } = useCurrentTime();
const apiKey = ref("AIzaSyCSSU0_Mf_14700irQVfZo3eTESzlm2AVo");
const location = ref("");

const getGps = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // console.log("Latitude is :", lat);
        // console.log("Longitude is :", lng);

        setGooglePosition(lat, lng);
        const { data } = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey.value}`
        );
        console.info(data);

        if (!data || !data.results || !data.results.length) {
          location.value = "";
        }
        console.log("data.results[0]", data.results[0]);
        location.value = data.results[0].formatted_address ?? "";
        page.loading = false;
      },
      function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
        page.loading = false;
      },
      {
        enableHighAccuracy: true, // 是否要求高精度的位置資訊
        timeout: 5000, // 等待位置資訊的最長時間
        maximumAge: 0, // 定位資訊的有效期
      }
    );
  } else {
    /* 地理位置服務不可用 */
    page.loading = false;
  }
};

const startClockIn = async () => {
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  if (!location.value) {
    showNotify({
      type: "danger",
      message: "無法獲得當前的GPS定位，請重新整理，並聯繫董小姐。",
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
  if (!location.value) {
    showNotify({
      type: "danger",
      message: "無法獲得當前的GPS定位，請重新整理，並聯繫董小姐。",
    });
    return;
  }
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  await clockin({
    start: "",
    end: convertToUtc(currentTime),
    location: location.value,
  });

  showSuccessToast({
    message: "下班打卡\n忙了一天\n辛苦了！",
    icon: "smile",
    iconSize: "80px",
    className: "toast",
    closeOnClick: true,
    duration: 1500,
  });
  emit("success");
};

const googleMap = ref();

const setGooglePosition = async (lat, lng) => {
  const loader = new Loader({
    apiKey: apiKey.value, // 请替换为您的API密钥
    version: "weekly",
    libraries: ["places"],
  });

  const { Map } = await loader.importLibrary("maps");
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");

  const mapOptions = {
    center: { lat, lng }, // 以台北101为例
    mapId: "53669c146a65f7cd",
    mapTypeControl: false,
    zoomControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    draggable: false,
    zoom: 16,
    featureType: "poi.business",
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
        style="
           {
            height: 300px;
          }
        "
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

    <!-- BTN -->
    <van-button
      v-if="!lastTypeClockIn"
      color="#2488c7"
      @click="startClockIn"
      size="large"
      icon="play"
      >上班打卡</van-button
    >

    <!-- BTN -->
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

<style lang="scss">
.google-map {
  width: 300px;
}
</style>
