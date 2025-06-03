<template>
	<div class="folder-box">
		<div class="folder-box-breadcrumb">
			<a-breadcrumb>
				<a-breadcrumb-item>
					<a-button type="link" @click="clearBreadCrumbList" :icon="h(HomeOutlined)">根路径</a-button>
				</a-breadcrumb-item>
				<a-breadcrumb-item v-for="item in breadCrumbList" :key="item.folderid">
					<a-button type="link" @click="handleClickBreadCrumb(item)">{{ item.foldername }}</a-button>
				</a-breadcrumb-item>
			</a-breadcrumb>
		</div>

		<!-- 循环列表 -->
		<div class="folder-box-list">
			<a-empty v-if="!dataList || !dataList.length" style="margin: auto">
				<template #description>
					<span style="user-select: none"> 暂无文件 </span>
				</template>
			</a-empty>

			<!-- 循环列表 -->
			<a-space size="large" v-else>
				<a-dropdown :trigger="['contextmenu']" v-for="item in dataList.filter((i) => i.label.includes(searchKeyWord))">
					<a-card hoverable @dblclick="handleDoubleClick(item)">
						<template #cover>
							<img alt="file" :src="item.type === 'file' ? '/file-icon.png' : 'folder-icon.png'" />
						</template>
						<div class="title" :title="item.label" v-html="getHighlightHtml(item.label, searchKeyWord)"></div>
						<div class="description">{{ item.updatedAt }}</div>
					</a-card>
					<template #overlay>
						<a-menu @click="(e:MenuProps['onClick']) => handleSheetOperate(e, item)">
							<template v-if="item.type === 'file'">
								<a-menu-item key="rename-file"> <FormOutlined /> 重命名 </a-menu-item>
								<a-divider />
								<a-menu-item key="delete-file" :style="{ color: token.colorError }">
									<DeleteOutlined />
									删除记录
								</a-menu-item>
							</template>
							<template v-else>
								<a-menu-item key="rename-folder"> <FormOutlined /> 重命名 </a-menu-item>
								<a-divider />
								<a-menu-item key="delete-folder" :style="{ color: token.colorError }">
									<DeleteOutlined />
									删除文件夹
								</a-menu-item>
							</template>
						</a-menu>
					</template>
				</a-dropdown>
			</a-space>
		</div>
	</div>

	<!-- 文件重命名弹窗 -->
	<InputModal
		title="重命名文件"
		placeholder="请输入工作簿名称"
		:value="renamePlaceholder"
		v-bind:visible="renameVisible"
		@confirm="renameConfirm"
		@cancel="renameVisible = false" />
</template>

<script setup lang="ts">
import router from "../../../router";
import { FolderItem } from "../../../interface";
import { encode, getHighlightHtml } from "../../../utils";
import InputModal from "../../../components/InputModal.vue";
import { MenuProps, message, Modal, theme } from "ant-design-vue";
import { useFolderBreadCrumbStore } from "../../../store/FolderBreadCrumb";
import { createVNode, h, onMounted, reactive, ref, toRaw, watch } from "vue";
import { API_deleteFile, API_deleteFolder, API_getFolderList, API_renameFile, API_renameFolder } from "../../../axios";
import { HomeOutlined, FormOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";

// 解析面包屑相关方法
const { breadCrumbList, handleClickBreadCrumb, clearBreadCrumbList, pushItem, getLastItem } = useFolderBreadCrumbStore();

// 监听面包屑实现数据更新
watch(() => breadCrumbList, queryFolderList, { deep: true });

const { token } = theme.useToken();

// 顶部搜索关键字
const { searchKeyWord } = defineProps({ searchKeyWord: { type: String, default: "" } });

// 定义数据列表
const dataList: FolderItem[] = reactive([]);

// 文件重命名相关参数
const renameType = ref("");
const renameKey = ref("");
const renamePlaceholder = ref("");
const renameVisible = ref(false);

// 双击数据项
function handleDoubleClick(item: FolderItem) {
	// 解析数据
	const { type, label, folderid, file_map_id } = toRaw(item);

	// 如果是文件夹，则更新面包屑数据
	if (type === "folder") return pushItem({ folderid: folderid!, foldername: label });

	// 不然直接打开文件即可
	router.push(`/excel/${encode(encode(file_map_id!))}`);
}

// 删除文件
async function handleDeleteFile(bookname: string, filemapid: string, gridKey: string) {
	Modal.confirm({
		title: "温馨提示",
		icon: createVNode(ExclamationCircleOutlined),
		content: `确认删除文件：${bookname}.xlsx ?`,
		okText: "删除",
		okType: "danger",
		cancelText: "取消",
		async onOk() {
			try {
				const { data } = await API_deleteFile({ filemapid, gridKey });
				if (data.code === 200) message.success(data.message || "删除成功");
				queryFolderList();
			} catch (error) {
				console.error(error);
			}
		},
	});
}

// 删除文件夹
async function handleDeleteFolder(folderid: string) {
	Modal.confirm({
		title: "敏感操作！",
		icon: createVNode(ExclamationCircleOutlined),
		content: `确认删除该文件夹？（内部文件或将一并删除且不可恢复！）`,
		okText: "删除",
		okType: "danger",
		cancelText: "取消",
		async onOk() {
			try {
				const { data } = await API_deleteFolder({ folderid });
				if (data.code === 200) message.success(data.message || "删除成功");
				queryFolderList();
			} catch (error) {
				console.error(error);
			}
		},
	});
}

// 文件重命名
async function renameConfirm(value: string) {
	const isFile = renameType.value === "file";

	if (!value) return message.warn(`请输入${isFile ? "文件" : "文件夹"}名称`);

	// 确定请求的方法
	const request = isFile ? API_renameFile : API_renameFolder;

	// 确定请求的参数
	const params = isFile ? { gridKey: renameKey.value, newName: value } : { folderid: renameKey.value, foldername: value };

	try {
		// @ts-ignore
		const { data } = await request(params);

		if (data.code === 200) {
			message.success("重命名成功");
			// 使用 void 0 定义 undefined
			let current: FolderItem | undefined = void 0;

			if (isFile) current = dataList.find((i) => i.gridKey === renameKey.value);
			else current = dataList.find((i) => i.folderid === renameKey.value);

			if (current) current.label = value;

			renameVisible.value = false;
			renameKey.value = "";
		}
	} catch (error) {
		console.error(error);
	}
}

// 右键菜单操作
async function handleSheetOperate(e: MenuProps["onClick"], item: FolderItem) {
	// @ts-ignore
	const { key } = e!;
	if (key === "delete-file") handleDeleteFile(item.label, item.file_map_id!, item.gridKey!);
	else if (key === "delete-folder") handleDeleteFolder(item.folderid!);
	else if (key === "rename-file") {
		renameType.value = "file";
		renameVisible.value = true;
		renamePlaceholder.value = item.label;
		renameKey.value = item.gridKey!;
	} else if (key === "rename-folder") {
		renameType.value = "folder";
		renameVisible.value = true;
		renamePlaceholder.value = item.label;
		renameKey.value = item.folderid!;
	}
}

// 获取数据
async function queryFolderList() {
	dataList.length = 0;
	try {
		// 判断最后一个节点是否存在
		const lastItem = getLastItem();
		const { data } = await API_getFolderList(lastItem?.folderid);
		if (data.code !== 200) return;
		data.data.forEach((i: FolderItem) => dataList.push(i));
	} catch (error) {
		console.error(error);
	}
}

onMounted(queryFolderList);

// 向外暴露方法
defineExpose({ queryFolderList });
</script>

<style lang="less" scoped>
.folder-box {
	height: calc(100% - 42px);
	width: 100%;
	overflow: hidden;
}
.folder-box-breadcrumb {
	.ant-btn-link {
		padding: 4px;
	}
}

.folder-box-list {
	height: calc(100% - 20px);
	margin-top: 20px;
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	flex-wrap: wrap;
	overflow: hidden;

	.ant-space {
		padding: 10px;
		height: calc(100% - 40px);
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		flex-wrap: wrap;
		overflow: hidden;
		overflow-y: auto;
	}
	.ant-card {
		user-select: none;
		transition: all 0.3s;
		width: 160px;
		height: auto;
		// 添加一个小阴影
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.01);
		&:hover {
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
			:deep .ant-card-cover {
				transform: scale(1.2);
			}
		}
		:deep .ant-card-cover {
			transition: all 0.3s;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 20px;
			img {
				width: 60%;
			}
		}
		:deep .ant-card-body {
			.title {
				margin-bottom: 8px;
				color: rgba(0, 0, 0, 0.88);
				font-weight: 600;
				font-size: 16px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>
