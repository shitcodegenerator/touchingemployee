<script lang="ts" setup>
import { useCurrentTime } from "@/utils/useCurrentTime";
import { showSuccessToast } from "vant";
const { currentTime } = useCurrentTime();
import dayjs from "dayjs";
import { clockin } from "../request/apis/index";
import { showNotify } from "vant";
import { convertToUtc } from "../utils/timeFormat";

const emit = defineEmits(["success"]);

const startClockIn = async () => {
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  await clockin({
    start: convertToUtc(currentTime),
    end: "",
  });

  showSuccessToast({
    message: "上班打卡成功！\n一起努力加油加油！",
    icon: "fire",
    iconSize: "60px",
    className: "toast",
    closeOnClick: true,
  });
  emit("success");
};
const endClockIn = async () => {
  const currentTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  await clockin({
    start: "",
    end: convertToUtc(currentTime),
  });

  showSuccessToast({
    message: "下班打卡成功！\n忙碌的一天，辛苦了！",
    icon: "smile",
    iconSize: "60px",
    className: "toast",
    closeOnClick: true,
  });
  emit("success");
};
</script>
<template>
  <div class="flex flex-col gap-4">
    <div
      class="w-full m-auto p-7 mb-4 bg-white rounded-2xl shadow-lg text-black-500"
    >
      <p class="font-bold text-black mb-1 flex justify-center mr-3 mb-4">
        {{ currentTime.toLocaleDateString() }}
      </p>
      <p class="font-bold text-black text-center text-5xl leading-[4rem]">
        {{ currentTime.toLocaleTimeString() }}
      </p>
    </div>

    <!-- BTN -->
    <van-button color="#2488c7" @click="startClockIn" size="large" icon="play"
      >上班打卡</van-button
    >

    <!-- BTN -->
    <van-button color="#38d360" @click="endClockIn" size="large" icon="wap-home"
      >下班打卡</van-button
    >
  </div>
</template>
