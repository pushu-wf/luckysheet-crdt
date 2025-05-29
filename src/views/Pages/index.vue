<template>
	<div class="pages-box">
		<HeaderVue @search="(value: string) => (searchKeyWord = value)" @updateFileList="updateFileList" />
		<div class="pages-sheets-container">
			<!-- 拆分功能页面，将按钮与列表独立出来 -->
			<ButtonList :checkedNumber="checkedNumber" @updateFileList="updateFileList" @handleOuterFileOperate="handleOuterFileOperate" />
			<fileList
				ref="fileListRef"
				@updateCheckedNumber="(number: number) => (checkedNumber = number)"
				:searchKeyWord="searchKeyWord" />
		</div>
		<div class="pages-footer">
			<span>© 2025 Luckysheet-CRDT 在线协同编辑系统</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { theme } from "ant-design-vue";
import { chatRoom } from "../../chatroom";
import HeaderVue from "./components/Header.vue";
import fileList from "./components/FileList.vue";
import { disableContextMenu } from "../../utils";
import ButtonList from "./components/ButtonList.vue";

const { token } = theme.useToken();

const searchKeyWord = ref("");

// 当前有几个文件被选中
const checkedNumber = ref(0);

const fileListRef = ref<typeof fileList>();

// 外层按钮对多选文件的操作
function handleOuterFileOperate(operation: string) {
	if (!fileListRef.value) return;
	fileListRef.value.handleOuterFileOperate(operation);
}

// 更新数据列表
function updateFileList(filterType: string) {
	if (!fileListRef.value) return;
	fileListRef.value.queryFileList(filterType);
}

onMounted(() => {
	// 连接聊天室
	chatRoom.connect();
	// 此页面禁止右键菜单
	disableContextMenu(".pages-box");
});
</script>

<style lang="less" scoped>
.pages-box {
	height: 100%;
	width: 100%;
	overflow: hidden;
}

.pages-sheets-container {
	height: calc(100% - 64px - 52px);
	padding: 20px;
}

.pages-footer {
	color: v-bind("token.colorTextSecondary");
	font-size: 14px;
	border-top: solid v-bind("token.colorBorder") 1px;
	height: 52px;
	display: flex;
	align-items: center;
	padding: 0 20px;
}
</style>
