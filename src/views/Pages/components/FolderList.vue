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
							<a-menu-item key="rename"> <FormOutlined /> 重命名 </a-menu-item>
							<a-divider />
							<a-menu-item key="delete-file" v-if="item.type === 'file'" :style="{ color: token.colorError }">
								<DeleteOutlined />
								删除记录
							</a-menu-item>
							<a-menu-item key="delete-folder" v-if="item.type === 'folder'" :style="{ color: token.colorError }">
								<DeleteOutlined />
								删除文件夹
							</a-menu-item>
						</a-menu>
					</template>
				</a-dropdown>
			</a-space>
		</div>
	</div>
</template>

<script setup lang="ts">
import router from "../../../router";
import { FolderItem } from "../../../interface";
import { encode, getHighlightHtml } from "../../../utils";
import { MenuProps, message, Modal, theme } from "ant-design-vue";
import { API_deleteFile, API_deleteFolder, API_getFolderList } from "../../../axios";
import { createVNode, h, onMounted, reactive, toRaw, watch } from "vue";
import { useFolderBreadCrumbStore } from "../../../store/FolderBreadCrumb";
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

// 右键菜单操作
async function handleSheetOperate(e: MenuProps["onClick"], item: FolderItem) {
	// @ts-ignore
	const { key } = e!;
	if (key === "delete-file") handleDeleteFile(item.label, item.file_map_id!, item.gridKey!);
	else if (key === "delete-folder") handleDeleteFolder(item.folderid!);
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
