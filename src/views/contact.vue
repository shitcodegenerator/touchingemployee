<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";

import { addContact, getContact } from "@/request/apis/index";
import { showNotify } from "vant";
import { workplaceOptions } from "../config";

const fornData = reactive({
  name: "",
  title: "",
  mobile: "",
  workplace: "新店B單元",
  line: "",
  note: "",
});

const onSubmit = async () => {
  await addContact(fornData);
  showNotify({ type: "success", message: "新增成功" });
  getList();
  //   getContact();
  // 在這裡發送API請求到後端
};

const list = ref([]);

const getList = async () => {
  const { data } = await getContact();
  list.value = data.data;
};

onMounted(() => {
  getList();
});

const showWorkplacePicker = ref(false);

const onConfirmWorkplace = (value) => {
  fornData.workplace = value.selectedValues[0];
  showWorkplacePicker.value = false;
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <van-form @submit="onSubmit">
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
          v-model="fornData.workplace"
          placeholder="選擇工作地點"
          @click="showWorkplacePicker = true"
        />

        <van-field
          input-align="right"
          v-model="fornData.name"
          label="姓名"
          required
        />
        <van-field
          input-align="right"
          v-model="fornData.title"
          label="稱謂"
          required
        />
        <van-field
          input-align="right"
          v-model="fornData.mobile"
          label="聯絡電話"
          required
        />

        <van-field
          input-align="right"
          v-model="fornData.line"
          label="LINE"
          required
        />
        <van-field
          input-align="right"
          v-model="fornData.note"
          label="備註"
          required
        />
      </van-cell-group>

      <van-button
        color="#2488c7"
        size="large"
        icon="plus"
        class="mt-10"
        @click="onSubmit"
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
      >關係人名單</van-divider
    >
    <div v-for="i in list" :key="i._id" class="list">
      <van-tag class="tag" type="primary" size="medium">{{
        i.workplace
      }}</van-tag>
      <div>名稱：{{ i.name }}{{ i.title ? `(${i.title})` : "" }}</div>
      <a :href="`tel:${i.mobile}`">電話：{{ i.mobile }}</a>
      <div>LINE：{{ i.line }}</div>
      <div class="bg-gray-50 p-2 text-gray-500 text-xs rounded">
        備註：{{ i.note }}
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.tag {
  @apply absolute bg-[#d4f6c2] text-[#1da90c] right-0 top-2 w-20 text-center rounded-r-none;
}
</style>
