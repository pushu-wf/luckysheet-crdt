<template>
	<div class="sheets-container-btns">
		<a-radio-group v-model:value="filterType" button-style="solid">
			<a-radio-button v-for="item in filterTypes" :value="item.value" :key="item.value">{{ item.name }}</a-radio-button>
		</a-radio-group>
		<a-button type="primary" @click="openCreateFileModal" style="margin-left: auto" :icon="h(PlusOutlined)">新建</a-button>
		<a-button type="default" style="margin-left: 20px" :icon="h(CloudUploadOutlined)">导入</a-button>
	</div>
	<div class="choose-files">
		<span v-show="checkedNumber">
			已选择 <code>{{ checkedNumber }}</code> 个文件
		</span>
		<a-button
			v-for="item in outerFileOperateBtns"
			:type="item.type"
			@click="emit('handleOuterFileOperate', item.operation)"
			size="small"
			:disabled="!checkedNumber"
			:style="{ marginLeft: item.marginLeft }"
			:danger="item.type === 'primary' ? true : false"
			:icon="h(item.icon)">
			{{ item.label }}
		</a-button>
		<a-popconfirm
			:disabled="!checkedNumber"
			title="您正在批量删除文件，请确认操作！"
			okText="确定"
			cancelText="取消"
			arrowPointAtCenter
			placement="left"
			@confirm="emit('handleOuterFileOperate', 'delete')">
			<template #icon><question-circle-outlined style="color: red" /></template>
			<a-button style="margin-left: 10px" :disabled="!checkedNumber" type="primary" size="small" danger> 批量删除 </a-button>
		</a-popconfirm>
	</div>

	<!-- 新建文件弹窗 -->
	<a-modal v-model:open="createFileVisible" title="创建工作簿" okText="创建" cancelText="取消" @ok="createFileConfirm">
		<a-input
			placeholder="请输入工作簿名称"
			ref="createFileNameRef"
			allowClear
			v-model:value="createFileName"
			@pressEnter="createFileConfirm" />
	</a-modal>
</template>

<script setup lang="ts">
import { ref, h, watch, nextTick } from "vue";
import { message, theme } from "ant-design-vue";
import { API_createWorkerBook } from "../../../axios";
import { PlusOutlined, CloudUploadOutlined, BranchesOutlined, CloudDownloadOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue";

// 选中几个文件
const { checkedNumber } = defineProps({ checkedNumber: { type: Number, default: 0 } });

// 定义 emit
const emit = defineEmits(["updateFileList", "handleOuterFileOperate"]);

const { token } = theme.useToken();

// 定义按钮组列表
const filterTypes = [
	{ name: "全部", value: "all" },
	{ name: "最近", value: "recent" },
	{ name: "共享", value: "share" },
	{ name: "收藏", value: "favor" },
];
const filterType = ref("all");
watch(
	() => filterType.value,
	() => emit("updateFileList", { filterType: filterType.value })
);

// 定义文件多选操作
const outerFileOperateBtns = [
	{ label: "分享", marginLeft: "auto", type: "default", icon: BranchesOutlined, operation: "share" },
	{ label: "导出", marginLeft: "10px", type: "default", icon: CloudDownloadOutlined, operation: "export" },
	// { label: "删除", marginLeft: "10px", type: "primary", icon: DeleteOutlined, operation: "delete" },
];

// 新建文件弹窗
const createFileVisible = ref(false);
// 新建工作簿名称
const createFileName = ref("");

// 创建文件输入框
const createFileNameRef = ref();

// 打卡创建文件模态框
function openCreateFileModal() {
	createFileVisible.value = true;
	nextTick(() => {
		createFileNameRef.value.focus();
	});
}
// 新建文件确认回调
async function createFileConfirm() {
	if (!createFileName.value) return message.warn("请输入工作簿名称");

	// 调用 createWorkerBooks API
	await API_createWorkerBook(createFileName.value);

	message.success("创建成功");
	createFileVisible.value = false;
	createFileName.value = "";

	// 更新文件列表
	emit("updateFileList");
}
</script>

<style lang="less" scoped>
.sheets-container-btns {
	display: flex;
	align-items: center;
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
