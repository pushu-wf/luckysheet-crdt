<template>
	<div class="sheets-container-btns">
		<a-radio-group v-model:value="filterType" button-style="solid" v-show="!isFolder">
			<a-radio-button v-for="item in filterTypes" :value="item.value" :key="item.value">{{ item.name }}</a-radio-button>
		</a-radio-group>
		<a-button type="primary" @click="createFileVisible = true" style="margin-left: auto" :icon="h(PlusOutlined)">新建</a-button>
		<a-button
			type="default"
			v-show="isFolder"
			@click="createFolderVisible = true"
			style="margin-left: 20px"
			:icon="h(FolderAddOutlined)">
			新建文件夹
		</a-button>

		<a-tooltip placement="left">
			<template #title>切换至{{ isFolder ? "列表" : "网格" }}模式</template>
			<a-button
				@click="emit('update:isFolder')"
				type="text"
				style="margin-left: 20px"
				:icon="h(isFolder ? UnorderedListOutlined : AppstoreOutlined)" />
		</a-tooltip>

		<!-- 导入暂未实现 -->
		<!-- <a-button type="default" @click="ImportFile" style="margin-left: 20px" :icon="h(CloudUploadOutlined)">导入</a-button> -->
	</div>
	<div class="choose-files" v-show="!isFolder">
		<span v-show="checkedNumber">
			已选择 <code>{{ checkedNumber }}</code> 个文件
		</span>
		<a-button
			@click="emit('handleOuterFileOperate', 'favor')"
			size="small"
			:disabled="!checkedNumber"
			style="margin-left: auto"
			:icon="h(StarOutlined)">
			收藏
		</a-button>
		<a-popconfirm
			:disabled="!checkedNumber"
			title="您正在批量删除文件，请确认操作！"
			okText="确定"
			cancelText="取消"
			arrowPointAtCenter
			placement="left"
			@confirm="emit('handleOuterFileOperate', 'delete')">
			<a-button style="margin-left: 10px" :disabled="!checkedNumber" type="primary" size="small" danger> 批量删除 </a-button>
		</a-popconfirm>
	</div>

	<!-- 新建文件弹窗 -->
	<InputModal :visible="createFileVisible" title="新建文件" @confirm="createFileConfirm" @cancel="createFileVisible = false" />

	<!-- 新建文件夹弹窗 -->
	<InputModal :visible="createFolderVisible" title="新建文件夹" @confirm="createFolderConfirm" @cancel="createFolderVisible = false" />
</template>

<script setup lang="ts">
import { ref, h, watch } from "vue";
import { useBtnGroupHook } from "../config";
import { message, theme } from "ant-design-vue";
import InputModal from "../../../components/InputModal.vue";
import { API_createFolder, API_createWorkerBook } from "../../../axios";
import { useFolderBreadCrumbStore } from "../../../store/FolderBreadCrumb";
import { PlusOutlined, StarOutlined, UnorderedListOutlined, AppstoreOutlined, FolderAddOutlined } from "@ant-design/icons-vue";

const { token } = theme.useToken();
const { getLastItem } = useFolderBreadCrumbStore();
const { filterType, filterTypes } = useBtnGroupHook();

// 选中几个文件 当前数据展示模式
const { checkedNumber, isFolder } = defineProps<{ checkedNumber: number; isFolder: boolean }>();

// 定义 emit
const emit = defineEmits(["updateFileList", "handleOuterFileOperate", "update:isFolder", "updateFolderList"]);

// 监听按钮组事件，实现数据列表的过滤
watch(filterType, () => emit("updateFileList", filterType.value));

// 新建文件弹窗
const createFileVisible = ref(false);

// 新建文件夹弹窗
const createFolderVisible = ref(false);

// 新建文件确认回调
async function createFileConfirm(fileName: string) {
	if (!fileName) return message.warn("请输入工作簿名称");

	// 调用 createWorkerBooks API
	// 判断最后一个节点是否存在
	const lastItem = getLastItem();
	await API_createWorkerBook(fileName, lastItem?.folderid);

	message.success("创建成功");
	createFileVisible.value = false;

	// 更新文件列表
	emit("updateFileList");
}

// 创建文件夹确认回调
async function createFolderConfirm(value: string) {
	if (!value) return message.warn("请输入文件夹名称");

	// 调用 createFolder API 父级ID 通过 store 获取
	// 判断最后一个节点是否存在
	const lastItem = getLastItem();
	await API_createFolder({ foldername: value, parentid: lastItem?.folderid });

	message.success("创建成功");
	createFolderVisible.value = false;

	// 刷新文件列表
	emit("updateFolderList");
}
</script>

<style lang="less" scoped>
.sheets-container-btns {
	display: flex;
	align-items: center;
	user-select: none;
}
.choose-files {
	display: flex;
	align-items: center;
	margin: 20px 0;
	height: 42px;
	line-height: 42px;
	background-color: v-bind("token.colorFillTertiary");
	border-radius: 6px;
	padding: 0 8px;
	span {
		font-size: 14px;
		user-select: none;
	}
}
</style>
