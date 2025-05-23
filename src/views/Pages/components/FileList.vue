<template>
	<a-list bordered :pagination="pagination" :data-source="fileList">
		<template #header>
			<div class="sheet-header">
				<a-checkbox @change="toggleCheckedAll"></a-checkbox>
				<span class="sheet-filename">文件名</span>
				<span class="sheet-createtime">创建时间</span>
				<span class="sheet-updatetime">更新时间</span>
				<span class="sheet-owner">所有者</span>
				<span class="sheet-operator"></span>
			</div>
		</template>
		<template #renderItem="{ item }">
			<a-list-item class="sheet-item">
				<a-checkbox v-model:checked="item.checked"></a-checkbox>
				<span class="sheet-filename">
					<img src="/file-icon.png" alt="" />
					<p>{{ item.workerbook.title }}</p>
					<a-button
						@click="toggleFavor(item)"
						type="text"
						:style="{ color: item.favor ? '#ffbb12' : null }"
						:icon="h(item.favor ? StarFilled : StarOutlined)"></a-button>
				</span>
				<span class="sheet-createtime">{{ item.workerbook.createAt }}</span>
				<span class="sheet-updatetime">{{ item.workerbook.updatedAt }}</span>
				<span class="sheet-owner">{{ item.owner.username }}</span>
				<span class="sheet-operator">
					<a-dropdown :trigger="['click']">
						<EllipsisOutlined />
						<template #overlay>
							<a-menu @click="(e:MenuProps['onClick']) => handleSheetOperate(e, item)">
								<a-menu-item key="open">
									<FileAddOutlined />
									新窗口打开
								</a-menu-item>
								<a-divider />
								<a-menu-item key="share">
									<BranchesOutlined />
									分享表格
								</a-menu-item>
								<a-menu-item key="favor">
									<StarOutlined />
									{{ item.favor ? "取消收藏" : "收藏表格" }}
								</a-menu-item>
								<a-menu-item key="export">
									<CloudDownloadOutlined />
									导出文件
								</a-menu-item>
								<a-divider />
								<a-menu-item key="delete" :style="{ color: token.colorError }">
									<DeleteOutlined />
									删除记录
								</a-menu-item>
							</a-menu>
						</template>
					</a-dropdown>
				</span>
			</a-list-item>
		</template>
		<a-skeleton :loading="loading" active :rows="5"> </a-skeleton>
		<a-empty v-if="!loading && !fileList.length" description="暂无数据" />
	</a-list>
</template>

<script setup lang="ts">
import { message, theme } from "ant-design-vue";
import { API_getFileList } from "../../../axios";
import { MenuProps } from "ant-design-vue/es/menu";
import { SheetListItem } from "../../../interface";
import { ref, h, onMounted, reactive, toRaw } from "vue";
import { API_toggleFavor, API_deleteFile } from "../../../axios/index";
import { BranchesOutlined, DeleteOutlined, CloudDownloadOutlined } from "@ant-design/icons-vue";
import { StarFilled, EllipsisOutlined, StarOutlined, FileAddOutlined } from "@ant-design/icons-vue";

// 有些数据需要外部传入
const { filterType } = defineProps({
	filterType: { type: String, default: "all" },
});

const { token } = theme.useToken();

// 是否正在加载
const loading = ref(true);

// 分页器
const pagination = {
	current: 1,
	pageSize: 5,
	total: 0,
	onChange: (page: number) => {
		pagination.current = page || 1;
		getFileList();
	},
};

// 列表数据
const fileList: SheetListItem[] = reactive([]);

// 切换全选状态
function toggleCheckedAll(e: Event) {
	// 当前状态
	const { checked } = e.target as HTMLInputElement;
	fileList.forEach((i) => (i.checked = checked));
}

// 切换收藏状态
async function toggleFavor(item: SheetListItem) {
	// API_toggleFavor
	// 解析当前的 favor filemapid
	const { file_map_id, favor } = toRaw(item);
	try {
		const { data } = await API_toggleFavor({ favor: !favor, filemapid: file_map_id });
		if (data.code === 200) {
			message.success(!favor ? "已收藏" : "已取消收藏");
			item.favor = !favor;
		}
	} catch (error) {
		console.error(error);
	}
}

// 删除文件
async function handleDeleteFile(item: SheetListItem) {
	try {
		const { data } = await API_deleteFile({ filemapid: item.file_map_id, gridKey: item.workerbook.gridKey });
		if (data.code === 200) message.success("删除成功");
		getFileList();
	} catch (error) {
		console.error(error);
	}
}

// 表格操作 - 分享 | 删除 | 收藏 ....
async function handleSheetOperate(e: MenuProps["onClick"], item: SheetListItem) {
	// @ts-ignore
	const { key } = e!;
	// open
	// share
	// export

	if (key === "favor") {
		toggleFavor(item);
	} else if (key === "delete") {
		handleDeleteFile(item);
	}
}

// 请求文件列表
async function getFileList() {
	try {
		loading.value = true;
		fileList.length = 0;
		pagination.total = 0;
		const { data } = await API_getFileList({
			current: pagination.current,
			pageSize: pagination.pageSize,
			filterType: filterType,
		});

		// 解析参数
		const { list, total } = data.data;
		pagination.total = total;
		list.forEach((i: SheetListItem) => fileList.push({ ...i, checked: false }));
		loading.value = false;
	} catch (error) {
		loading.value = false;
	}
}

onMounted(getFileList);
</script>

<style lang="less" scoped>
.ant-list-items .ant-list-item:hover {
	cursor: pointer;
	background-color: v-bind("token.colorFillTertiary");
}

// 保持 Header 与 内容相同宽度
.sheet-header,
.sheet-item {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;

	& > span {
		display: inline-block;
		height: 32px;
		line-height: 32px;
		user-select: none;
	}
	img {
		height: 30px;
	}
	.sheet-filename,
	.sheet-createtime,
	.sheet-updatetime {
		position: relative;
		width: 220px;
		// 单行省略号
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 0 8px;
		color: #18181b;
	}
	.sheet-filename {
		width: 380px;
		display: flex;
		align-items: center;
		margin-right: auto;
		margin-left: 20px;
		img {
			height: 28px;
		}
		p {
			max-width: calc(100% - 16px - 56px);
			display: inline-block;
			margin: 0 8px;
			flex-wrap: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			cursor: pointer;
			&:hover {
				color: #1890ff;
			}
		}
	}

	.sheet-owner {
		width: 80px;
	}

	.sheet-operator {
		width: 20px;
	}
}

.ant-list {
	height: calc(100% - 48px - 32px - 20px - 20px);
	:deep .ant-spin-nested-loading {
		height: calc(100% - 56px - 46px);
	}
	:deep .ant-list-pagination {
		margin: 0px 24px;
	}
}
</style>
