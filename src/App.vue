<template>
	<a-config-provider :theme="configProvideTheme">
		<router-view />
	</a-config-provider>
</template>

<script setup lang="ts">
import { configProvideTheme } from "./theme/index";
</script>
