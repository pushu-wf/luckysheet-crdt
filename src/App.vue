<template>
	<a-config-provider :theme="configProvideTheme">
		<router-view />
	</a-config-provider>
</template>

<script setup lang="ts">
// 配置主题
import { configProvideTheme } from "./theme/index";
</script>
