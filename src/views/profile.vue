<script lang="ts" setup>
import { useUserStore } from "../store/user";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { getClockinListHours } from "../request/apis/index";

const user = useUserStore();
const router = useRouter();

const logout = () => {
  localStorage.removeItem("token");
  router.push({ name: "login" });
};

const activeCollapse = ref(["1"]);
const workHours = ref([]);
const timeTitle = ref("");

onMounted(async () => {
  const { data } = await getClockinListHours();
  workHours.value = data.list;
  timeTitle.value = `總工作時數 ${data.totalHours.toFixed(2)} 小時（${
    data.totalMins
  } 分鐘）`;
});
</script>

<template>
  <div>
    <van-collapse
      v-model="activeCollapse"
      class="shadow-lg mb-4 rounded-lg overflow-hidden"
    >
      <van-collapse-item title="基本資料" name="1">
        <div>姓名：{{ user.data.name }}</div>
        <div>員工編號：{{ user.data.username }}</div>
      </van-collapse-item>
      <van-collapse-item :title="timeTitle" name="2">
        時數記錄：
        <div v-for="(value, key) in workHours" class="flex gap-2">
          <div v-if="value" class="flex gap-2">
            <span>
              <el-tag type="info" rounded effect="plain">{{
                key
              }}</el-tag> </span
            >:
            <span class="text-gray-dark"> {{ value }}分鐘 </span>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>
    <van-button
      color="#ff6767"
      class="w-full bg-red-400 text-white"
      @click="logout"
      >登出</van-button
    >
  </div>
</template>
