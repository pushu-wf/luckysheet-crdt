<template>
	<div class="es-switch" :class="currentState" :style="switchStyle" @click="switchChange">
		<!-- 按钮 -->
		<div class="es-switch-control" :style="controlStyle">
			<!-- 通过插槽实现内部的自定义 icon -->
			<slot v-if="props.value" name="activeIcon"></slot>
			<slot v-else name="inactiveIcon"></slot>
		</div>
		<!-- 灰色背景显示层 -->
		<div class="es-switch-content" :style="contentStyle">
			<!-- 插槽实现 -->
			<slot v-if="props.value" name="activeContent"></slot>
			<slot v-else name="inactiveContent"></slot>
		</div>
	</div>
</template>

<script setup lang="ts" name="Switch">
/**
 * @description Switch 组件
 * @author pushu
 * @example
 *  import Switch from '@/components/Switch.vue';
 *  <Switch v-model:value="theme" />
 */

import { computed, withDefaults } from "vue";

// 通过 v-model:value 实现 checked
const emit = defineEmits(["update:value", "change"]);

// 定义 props 类型
interface Props {
	width?: number;
	height?: number;
	value: boolean;
	disabled?: boolean;
	active?: {
		switchBorderColor?: string;
		switchBackgroundColor?: string;
		switchHoverColor?: string;
		controlTextColor?: string;
		controlBorderColor?: string;
		controlBackgroundColor?: string;
		contentTextColor?: string;
	};
	inactive?: {
		switchBorderColor?: string;
		switchBackgroundColor?: string;
		switchHoverColor?: string;
		controlTextColor?: string;
		controlBorderColor?: string;
		controlBackgroundColor?: string;
		contentTextColor?: string;
	};
}

// 定义 props 默认值
const props = withDefaults(defineProps<Props>(), {
	width: 44,
	height: 22,
	value: false,
	disabled: false,
	active: () => ({
		switchBorderColor: "transparent",
		switchBackgroundColor: "var(--colorPrimary)",
		switchHoverColor: "transparent",
		controlTextColor: "transparent",
		controlBorderColor: "transparent",
		controlBackgroundColor: "#fff",
		contentTextColor: "#fff",
	}),
	inactive: () => ({
		switchBorderColor: "#d9d9d9",
		switchBackgroundColor: "#EFF0F3",
		switchHoverColor: "transparent",
		controlTextColor: "transparent",
		controlBorderColor: "transparent",
		controlBackgroundColor: "#fff",
		contentTextColor: "#fff",
	}),
});

// 定义当前应该应用的样式
const currentState = computed(() => (props.value ? "es-active" : "es-inactive"));

/**
 * 定义 switch 样式
 *  borderRadius: 高度的一半; // 保证始终是椭圆形（直接用 50% 的话，会导致使用宽度衡量，导致变形）
 *  width/height 使用传入的宽高
 *  borderColor switchBorderColor 区分 active/inactive
 *  backgroundColor switchBackgroundColor 区分 active/inactive
 */
const switchStyle = computed(() => ({
	borderRadius: props.height / 2 + "px",
	width: props.width + "px",
	height: props.height + "px",
	borderColor: props.value ? props.active?.switchBorderColor : props.inactive?.switchBorderColor,
	backgroundColor: props.value ? props.active?.switchBackgroundColor : props.inactive.switchBackgroundColor,
}));

// 定义 control 样式 - 逻辑与 switch 类似
const controlStyle = computed(() => ({
	width: props.height - 2 + "px",
	height: props.height - 2 + "px",
	borderColor: props.value ? props.active.controlBorderColor : props.inactive.controlBorderColor,
	backgroundColor: props.value ? props.active.controlBackgroundColor : props.inactive.controlBackgroundColor,
}));

// 定义 content 样式 - 逻辑与 switch 类似
const contentStyle = computed(() => ({
	height: props.height - 2 + "px",
	color: props.value ? props.active.contentTextColor : props.inactive.contentTextColor,
}));

// 定义 switch 切换事件
function switchChange() {
	// 如果 disabled 为 true，则直接返回
	if (props.disabled) return;
	emit("update:value", !props.value);
	emit("change", !props.value);
}
</script>

<style lang="less" scoped>
.es-switch {
	transition: all 0.3s;
	min-width: 44px;
	min-height: 22px;
	position: relative;
	display: flex;
	align-items: center;
	padding: 1px;
	border: solid transparent 1px;
	cursor: pointer;
}
// 控制器
.es-switch-control {
	z-index: 9;
	transition: all 0.3s;
	border-radius: 50%;
	border: solid transparent 1px;
	display: flex;
	align-items: center;
	justify-content: center;
}
// 内容区
// 通过动画实现 switch 切换
.es-switch-content {
	transition: all 0.3s;
	flex: auto;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	font-size: 12px;
}

// 定义 slot 内容区颜色
.es-switch-control {
	color: rgba(0, 0, 0, 0.88);
}

.es-active {
	.es-switch-content {
		transform: translateX(-100%);
	}
	.es-switch-control {
		transform: translateX(100%);
	}
}

.es-switch-disabled {
	cursor: no-drop;
	opacity: 0.5;
}
</style>
