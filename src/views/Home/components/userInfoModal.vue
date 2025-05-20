<template>
	<a-modal v-model:open="modalVisible" title="" width="100%" :footer="null" :closable="false" wrap-class-name="full-modal">
		<a-page-header title="个人信息" @back="modalVisible = false" />
	</a-modal>
</template>
<script setup lang="ts">
import { ref } from "vue";

const modalVisible = ref(true);
</script>

<style lang="less">
.full-modal {
	.ant-modal {
		max-width: 100%;
		top: 0;
		padding-bottom: 0;
		margin: 0;
	}
	.ant-modal-content {
		display: flex;
		flex-direction: column;
		height: calc(100vh);
	}
	.ant-modal-body {
		flex: 1;
	}
}
</style>
