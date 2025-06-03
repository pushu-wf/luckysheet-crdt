<!-- 为了简化代码，新建文件|新建文件夹|重命名文件|重命名文件夹 等仅有一个输入框的模态框，应该封装为一个独立组件，为了能拓展，应该提供必要的插槽 -->

<template>
	<a-modal :open="visible" :title="title" :okText="okText || '创建'" :cancelText="cancelText || '取消'" @ok="confirm" @cancel="cancel">
		<a-input
			:placeholder="placeholder || 'Input value...'"
			ref="inputRef"
			allowClear
			v-model:value="inputValue"
			@pressEnter="confirm" />
		<!-- 其他插槽 -->
		<slot></slot>
	</a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from "vue";

// 定义模态框状态
const { visible, title, okText, cancelText, placeholder, value } = defineProps<{
	visible: boolean;
	title: string;
	okText?: string;
	cancelText?: string;
	placeholder?: string;
	value?: string;
}>();

// 定义 emit
const emit = defineEmits(["confirm", "cancel"]);

// 监听 visible 实现 input focus
watch(
	() => visible,
	(val) => {
		if (val) {
			nextTick(() => {
				inputValue.value = value || "";
				inputRef.value.focus();
			});
		}
	}
);

// 定义 input v-model
const inputValue = ref("");

// 定义 input ref
const inputRef = ref();

// 确认事件
function confirm() {
	emit("confirm", inputValue.value);
	inputValue.value = "";
}

// 取消事件
function cancel() {
	inputValue.value = "";
	emit("cancel");
}
</script>
