<script lang="ts" setup>
import Clock from "@/components/Clock.vue";
import { onMounted } from "vue";
// import axios from "axios";
import { getClockinList } from "@/request/apis/index";
import { ref } from "vue";
import dayjs from "dayjs";

// import { useUserStore } from "../../store/user";

// const user = useUserStore();

const list = ref([
  {
    start: "",
    end: "",
    _id: "",
  },
]);

const getList = async () => {
  const { data } = await getClockinList();
  list.value = data.data;
};

onMounted(() => {
  getList();
  console.log;
});
</script>
<template>
  <!-- <div class="mb-4 rounded">
    Hello, <span>{{ user.data.name }}</span>
  </div> -->
  <Clock @success="getList" :list="list" />
  <van-divider
    color
    dashed
    :style="{
      color: '#4d4d4d',
      borderColor: '#4d4d4d',
    }"
    >今日打卡記錄</van-divider
  >
  <div class="flex flex-col gap-4 mt-4" v-if="list.length">
    <div
      v-for="i in list"
      :key="i._id"
      class="bg-white rounded flex flex-col border-l-4 p-4"
      :class="[{ 'border-main': i.start }, { 'border-green-500': i.end }]"
    >
      <p :class="{ 'text-main': i.start, 'text-green-500': i.end }">
        <span class="font-bold">
          {{ i.start ? "上班卡：" : "下班卡：" }}
        </span>
        {{ dayjs(i.start ?? i.end).format("HH:mm:ss") }}
      </p>
    </div>
  </div>

  <div v-else class="mt-20 text-gray-400 text-center">今天還沒有打卡喔！</div>
</template>
