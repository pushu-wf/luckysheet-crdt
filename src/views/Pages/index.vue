<template>
	<div class="pages-box">
		<HeaderVue @search="(value: string) => (searchKeyWord = value)" @updateFileList="updateFileList" />
		<div class="pages-sheets-container">
			<!-- 拆分功能页面，将按钮与列表独立出来 -->
			<ButtonList
				:isFolder="isFolder"
				:checkedNumber="checkedNumber"
				@update:isFolder="() => (isFolder = !isFolder)"
				@updateFileList="updateFileList"
				@handleOuterFileOperate="handleOuterFileOperate"
				@updateFolderList="updateFolderList" />
			<fileList
				v-if="!isFolder"
				ref="fileListRef"
				@updateCheckedNumber="(number: number) => (checkedNumber = number)"
				:searchKeyWord="searchKeyWord" />

			<folderList ref="folderListRef" :searchKeyWord="searchKeyWord" v-else />
		</div>
		<div class="pages-footer">
			<span>© 2025 Luckysheet-CRDT 在线协同编辑系统</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { theme } from "ant-design-vue";
import HeaderVue from "./components/Header.vue";
import fileList from "./components/FileList.vue";
import { disableContextMenu } from "../../utils";
import folderList from "./components/FolderList.vue";
import ButtonList from "./components/ButtonList.vue";

const { token } = theme.useToken();

// 搜索关键词
const searchKeyWord = ref("");

// 数据展示模式 - 为true时，展示文件夹模式
const isFolder = ref(false);

// 当前有几个文件被选中
const checkedNumber = ref(0);

const fileListRef = ref<typeof fileList>();
const folderListRef = ref<typeof folderList>();

// 外层按钮对多选文件的操作
function handleOuterFileOperate(operation: string) {
	if (!fileListRef.value) return;
	fileListRef.value.handleOuterFileOperate(operation);
}

// 更新数据列表
function updateFileList(filterType: string) {
	// 如果当前模式是文件夹列表，则同步请求文件夹数据
	updateFolderList();

	if (!fileListRef.value) return;
	fileListRef.value.queryFileList(filterType);
}

// 更新folder list
function updateFolderList() {
	if (!folderListRef.value) return;
	folderListRef.value.queryFolderList();
}

// 此页面禁止右键菜单
onMounted(() => disableContextMenu(".pages-box"));
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
	overflow: hidden;
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
