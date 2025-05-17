<!-- 验证码组件 -->
<template>
	<canvas ref="canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { verificationCode } from "../utils/VerificationCode";

// 定义 props
const { width, height } = defineProps({
	width: { type: Number, default: 100 },
	height: { type: Number, default: 40 },
});

const code = ref("");
const canvas = ref<HTMLCanvasElement>();

// 提供校验方法
function checkCode(val: string) {
	if (val === code.value) return true;
	generateCode();
	return false;
}

// 生成验证码
function generateCode() {
	// 获取验证码
	code.value = verificationCode.getVerificationCode();
	// 绘制到 canvas 上
	verificationCode.drawVerificationCode(canvas.value!, code.value);
}

onMounted(() => {
	// 1. 初始化 canvas 宽高
	canvas.value!.width = width;
	canvas.value!.height = height;
	generateCode();
	// 4. 监听点击事件
	canvas.value!.addEventListener("click", generateCode);
});

defineExpose({ checkCode, generateCode });
</script>
