<template>
	<a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
		<template #extra>
			<a-button type="primary" @click="router.push('/home')">Back Home</a-button>
		</template>
	</a-result>
</template>

<script setup lang="ts">
import router from "../router";
</script>
