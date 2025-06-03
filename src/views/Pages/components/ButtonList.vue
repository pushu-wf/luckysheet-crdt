<template>
	<div class="sheets-container-btns">
		<a-radio-group v-model:value="filterType" button-style="solid" v-show="!isFolder">
			<a-radio-button v-for="item in filterTypes" :value="item.value" :key="item.value">{{ item.name }}</a-radio-button>
		</a-radio-group>
		<a-button type="primary" @click="openCreateFileModal" style="margin-left: auto" :icon="h(PlusOutlined)">新建</a-button>
		<a-button type="default" v-show="isFolder" @click="openCreateFolderModal" style="margin-left: 20px" :icon="h(FolderAddOutlined)">
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
	<a-modal
		v-model:open="createFileVisible"
		title="创建工作簿"
		okText="创建"
		cancelText="取消"
		@ok="createFileConfirm"
		@cancel="createFileName = ''">
		<a-input
			placeholder="请输入工作簿名称"
			ref="createFileInputRef"
			allowClear
			v-model:value="createFileName"
			@pressEnter="createFileConfirm" />
	</a-modal>

	<!-- 新建文件夹弹窗 -->
	<a-modal
		v-model:open="createFolderVisible"
		title="创建文件夹"
		okText="创建"
		cancelText="取消"
		@ok="createFolderConfirm"
		@cancel="createFolderName = ''">
		<a-input
			placeholder="请输入工作簿名称"
			ref="createFolderInputRef"
			allowClear
			v-model:value="createFolderName"
			@pressEnter="createFolderConfirm" />
	</a-modal>
</template>

<script setup lang="ts">
import { ref, h, watch, nextTick } from "vue";
import { message, theme } from "ant-design-vue";
import { API_createFolder, API_createWorkerBook } from "../../../axios";
import { useFolderBreadCrumbStore } from "../../../store/FolderBreadCrumb";
import { PlusOutlined, StarOutlined, UnorderedListOutlined, AppstoreOutlined, FolderAddOutlined } from "@ant-design/icons-vue";

const { getLastItem } = useFolderBreadCrumbStore();

// 选中几个文件 当前数据展示模式
const { checkedNumber, isFolder } = defineProps({
	checkedNumber: { type: Number, default: 0 },
	isFolder: { type: Boolean, default: false },
});

// 定义 emit
const emit = defineEmits(["updateFileList", "handleOuterFileOperate", "update:isFolder", "updateFolderList"]);

const { token } = theme.useToken();

// 定义按钮组列表
const filterTypes = [
	{ name: "全部", value: "all" },
	{ name: "我的", value: "mine" },
	{ name: "共享", value: "share" },
	{ name: "收藏", value: "favor" },
];
const filterType = ref("all");
watch(
	() => filterType.value,
	() => emit("updateFileList", filterType.value)
);

// 新建文件弹窗
const createFileVisible = ref(false);
// 新建工作簿名称
const createFileName = ref("");
// 创建文件输入框
const createFileInputRef = ref();

// 新建文件夹弹窗
const createFolderVisible = ref(false);
// 创建文件夹名称
const createFolderName = ref("");
// 创建文件夹输入框
const createFolderInputRef = ref();

// 打开创建文件模态框
function openCreateFileModal() {
	createFileVisible.value = true;
	nextTick(() => {
		createFileInputRef.value.focus();
	});
}

// 打开创建文件夹模态框
function openCreateFolderModal() {
	createFolderVisible.value = true;
	nextTick(() => {
		createFolderInputRef.value.focus();
	});
}

// 新建文件确认回调
async function createFileConfirm() {
	if (!createFileName.value) return message.warn("请输入工作簿名称");

	// 调用 createWorkerBooks API
	// 判断最后一个节点是否存在
	const lastItem = getLastItem();
	await API_createWorkerBook(createFileName.value, lastItem.folderid);

	message.success("创建成功");
	createFileVisible.value = false;
	createFileName.value = "";

	// 更新文件列表
	emit("updateFileList");
}

// 创建文件夹确认回调
async function createFolderConfirm() {
	if (!createFolderName.value) return message.warn("请输入文件夹名称");

	// 调用 createFolder API 父级ID 通过 store 获取
	// 判断最后一个节点是否存在
	const lastItem = getLastItem();
	await API_createFolder({ foldername: createFolderName.value, parentid: lastItem.folderid });

	message.success("创建成功");
	createFolderVisible.value = false;
	createFolderName.value = "";

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
