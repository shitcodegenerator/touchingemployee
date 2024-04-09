<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";
import lineIcon from "@/assets/line.svg";
import { addWork, getWork, getContact } from "../../request/apis/index";
import dayjs from "dayjs";
import { workplaceOptions } from "../../config";
import { showNotify } from "vant";

const worklist = reactive({
  content: "",
  workplace: "新店B單元",
  target: "",
  contact: "",
});
const endTime = ref();
const showStartTimePicker = ref(false);
const showEndTimePicker = ref(false);
const showWorkplacePicker = ref(false);
const startTime = ref();
const formRef = ref();

const duration = computed(() => {
  if (!startTime.value || !endTime.value) return "-";
  // 将时间数组转换为Date对象
  const startDate = new Date();
  startDate.setHours(
    parseInt(startTime.value[0]),
    parseInt(startTime.value[1]),
    0
  );

  const endDate = new Date();
  endDate.setHours(parseInt(endTime.value[0]), parseInt(endTime.value[1]), 0);

  // 如果结束时间小于开始时间，则假定它是第二天
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  // 计算时间差，结果以毫秒为单位
  const diff = endDate - startDate;

  // 将时间差转换为分钟
  const diffInMinutes = diff / 1000 / 60;

  // 将时间差转换为小时，保留两位小数
  const diffInHours = (diff / 1000 / 60 / 60).toFixed(2);

  return `${diffInMinutes}分鐘 (${diffInHours}小時)`;
});

const clearData = () => {
  worklist.content = "";
  worklist.workplace = "新店B單元";
  worklist.target = "";
  worklist.contact = "";
  startTime.value = "";
  endTime.value = "";
};

const onSubmit = async () => {
  // 實現提交邏輯
  const data = {
    ...worklist,
    startTime: startTime.value.join(":"),
    endTime: endTime.value.join(":"),
  };

  if (!data.contact) {
    delete data.contact;
  }

  await addWork(data);
  clearData();
  showNotify({ type: "success", message: "新增成功" });
  getWorkList();
  // 在這裡發送API請求到後端
};

const onConfirmStartTime = (value) => {
  startTime.value = value.selectedValues;
  showStartTimePicker.value = false;

  formRef.value.validate("endTime");
};

const onConfirmEndTime = (value) => {
  endTime.value = value.selectedValues;
  showEndTimePicker.value = false;
  formRef.value.validate("startTime");
};

const onConfirmWorkplace = (value) => {
  console.log(value);
  worklist.workplace = value.selectedValues[0];
  showWorkplacePicker.value = false;
};

const formatter = (type, option) => {
  if (type === "hour") {
    option.text += "點";
  }
  if (type === "minute") {
    option.text += "分";
  }
  return option;
};

const filter = (type, options) => {
  if (type === "minute") {
    return options.filter((option) => Number(option.value) % 10 === 0);
  }
  return options;
};

const list = ref([]);

const getWorkList = async () => {
  const { data } = await getWork();
  list.value = data.data;
};

const getTime = (val) => {
  if (!val) return "請選擇";
  if (typeof val !== "string") {
    return `${val.join("點")}分`;
  }
  return `${val.replace(",", "點")}分`;
};

const isContactShow = ref(false);

const showContact = () => {
  isContactShow.value = !isContactShow.value;
};

const contactList = ref([]);

const getContactList = async () => {
  const { data } = await getContact();
  contactList.value = data.data;
};

const selectContact = (i) => {
  worklist.contact = i._id;
  worklist.target = i.name;
  showContact();
};

const clearContact = () => {
  worklist.contact = "";
};

onMounted(async () => {
  await getWorkList();
  getContactList();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <van-form ref="formRef" @submit="onSubmit" validate-trigger="onChange">
      <van-cell-group class="mb-4">
        <van-popup v-model:show="showWorkplacePicker" round position="bottom">
          <van-picker
            confirm-button-text="確認"
            cancel-button-text="取消"
            title="選擇工作地點"
            :columns="workplaceOptions"
            @confirm="onConfirmWorkplace"
            @cancel="showWorkplacePicker = false"
          />
        </van-popup>

        <van-field
          readonly
          clickable
          required
          label="工作地點"
          input-align="right"
          v-model="worklist.workplace"
          placeholder="選擇工作地點"
          @click="showWorkplacePicker = true"
        />
        <van-popup v-model:show="showWorkplacePicker" round position="bottom">
          <van-picker
            confirm-button-text="確認"
            cancel-button-text="取消"
            title="選擇工作地點"
            :columns="workplaceOptions"
            @confirm="onConfirmWorkplace"
            @cancel="showWorkplacePicker = false"
          />
        </van-popup>

        <van-field
          required
          label="開始時間"
          readonly
          name="startTime"
          clickable
          input-align="right"
          :placeholder="getTime(startTime)"
          @click="showStartTimePicker = true"
          :rules="[
            {
              validator: () => {
                return !!startTime;
              },
              message: '請選擇開始時間',
            },
            {
              trigger: 'onChange',
              validator: () => {
                console.log(startTime);
                const [startHour, startMin] = startTime;
                const [endHour, endMin] = endTime;

                if (startHour > endHour) return false;
                if (startHour === endHour && endMin < startMin) return false;
                return true;
              },
              message: '開始時間不得小於結束時間',
            },
          ]"
        />
        <van-popup v-model:show="showStartTimePicker" round position="bottom">
          <van-time-picker
            confirm-button-text="確認"
            cancel-button-text="取消"
            title="選擇開始時間"
            :formatter="formatter"
            :filter="filter"
            @confirm="onConfirmStartTime"
          />
        </van-popup>

        <van-field
          required
          label="結束時間"
          readonly
          clickable
          name="endTime"
          class="text-main"
          input-align="right"
          :placeholder="getTime(endTime)"
          :filter="filter"
          @click="showEndTimePicker = true"
          :rules="[
            {
              validator: () => {
                return !!endTime;
              },
              message: '請選擇結束時間',
            },
            {
              trigger: 'onChange',
              validator: () => {
                console.log(startTime);
                const [startHour, startMin] = startTime;
                const [endHour, endMin] = endTime;

                if (startHour > endHour) return false;
                if (startHour === endHour && endMin < startMin) return false;
                return true;
              },
              message: '開始時間不得小於結束時間',
            },
          ]"
        />
        <van-popup v-model:show="showEndTimePicker" round position="bottom">
          <van-time-picker
            confirm-button-text="確認"
            cancel-button-text="取消"
            title="選擇結束時間"
            :formatter="formatter"
            :filter="filter"
            @confirm="onConfirmEndTime"
          />
        </van-popup>

        <van-field
          input-align="right"
          type="text"
          readonly
          label="持續時間"
          :placeholder="duration"
        />

        <van-field
          input-align="right"
          v-model="worklist.target"
          @input="clearContact"
          class="flex items-center"
          label="對象"
          placeholder="無交涉對象請留白"
          required
        >
          <template #button>
            <van-button size="small" @click="showContact" type="primary"
              >選擇聯絡人</van-button
            >
          </template></van-field
        >

        <van-action-sheet v-model:show="isContactShow" title="聯絡人">
          <div class="p-4">
            <div
              v-for="i in contactList"
              :key="i._id"
              @click="selectContact(i)"
              class="relative"
            >
              <van-tag class="tag" type="primary" size="medium">{{
                i.workplace
              }}</van-tag>
              <p class="flex flex-row gap-2 text-gray-600 items-center">
                <van-icon name="user"></van-icon>{{ i.name }}{{ i.title }}
              </p>
              <p class="flex flex-row gap-2 text-gray-600 items-center">
                <van-icon name="phone"></van-icon>{{ i.mobile }}
              </p>
              <p class="flex flex-row gap-2 text-gray-600 items-center">
                <img :src="lineIcon" class="w-4 inline" />{{ i.line }}
              </p>
              <van-divider />
            </div>
          </div>
        </van-action-sheet>

        <van-field
          v-model="worklist.content"
          label="工作內容"
          input-align="right"
          required
          rows="3"
          type="textarea"
          autosize
          maxlength="200"
          placeholder="工作內容，上限200字"
          :rules="[
            {
              required: true,
              message: '請輸入工作內容',
            },
          ]"
          show-word-limit
        />
      </van-cell-group>

      <van-button
        color="#2488c7"
        size="large"
        icon="plus"
        class="mt-10"
        native-type="submit"
        >新增日報表</van-button
      >
    </van-form>

    <van-divider
      color
      dashed
      :style="{
        color: '#4d4d4d',
        borderColor: '#4d4d4d',
      }"
      >今日記錄</van-divider
    >
    <div v-for="i in list" :key="i._id" class="list">
      <div>時間：{{ i.startTime }} ~ {{ i.endTime }}</div>
      <div>對象：{{ i.target }}</div>
      <div>內容：{{ i.content }}</div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.van-field__control:read-only::placeholder) {
  @apply text-main;
}

.tag {
  @apply absolute bg-[#d4f6c2] text-[#1da90c] right-0 top-0 w-20 text-center rounded-r-none;
}
</style>
