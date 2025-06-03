<template>
	<div class="file-grid">
		<div class="file-grid-breadcrumb">
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
		<div class="file-grid-list">
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
						<a-menu>
							<a-menu-item key="rename"> <FormOutlined /> 重命名 </a-menu-item>
							<a-divider />
							<a-menu-item key="delete" v-if="item.type === 'file'" :style="{ color: token.colorError }">
								<DeleteOutlined />
								删除记录
							</a-menu-item>
							<a-menu-item key="delete" v-if="item.type === 'folder'" :style="{ color: token.colorError }">
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
import { theme } from "ant-design-vue";
import router from "../../../router";
import { FolderItem } from "../../../interface";
import { API_getFolderList } from "../../../axios";
import { encode, getHighlightHtml } from "../../../utils";
import { h, onMounted, reactive, toRaw, watch } from "vue";
import { useFolderBreadCrumbStore } from "../../../store/FolderBreadCrumb";
import { HomeOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons-vue";

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
.file-grid {
	height: calc(100% - 32px - 82px);
	width: 100%;
	overflow: hidden;
}
.file-grid-breadcrumb {
	.ant-btn-link {
		padding: 4px;
	}
}

.file-grid-list {
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
