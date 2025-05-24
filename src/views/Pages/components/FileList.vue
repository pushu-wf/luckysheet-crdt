<template>
	<a-list bordered :pagination="pagination" :data-source="fileList">
		<template #header>
			<div class="sheet-header">
				<a-checkbox @change="toggleCheckedAll" v-model:checked="checkedAll"></a-checkbox>
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
								<a-menu-item key="rename">
									<FormOutlined />
									文件重命名
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

	<!-- 重命名弹窗 -->
	<a-modal v-model:open="renameModalVisible" title="重命名文件" okText="确认" cancelText="取消" @ok="renameConfirm">
		<a-input
			placeholder="请输入工作簿名称"
			ref="renameInputRef"
			allowClear
			v-model:value="renameInputValue"
			@pressEnter="renameConfirm" />
	</a-modal>
</template>

<script setup lang="ts">
import { MenuProps } from "ant-design-vue/es/menu";
import { SheetListItem } from "../../../interface";
import { message, Modal, theme } from "ant-design-vue";
import { API_queryFileList, API_renameFile } from "../../../axios";
import { API_toggleFavor, API_deleteFile } from "../../../axios/index";
import { ref, h, onMounted, reactive, toRaw, watch, createVNode, nextTick } from "vue";
import { StarFilled, EllipsisOutlined, StarOutlined, FormOutlined } from "@ant-design/icons-vue";
import { BranchesOutlined, DeleteOutlined, CloudDownloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { writeToClipboard } from "../../../utils";

const emit = defineEmits(["updateCheckedNumber"]);

const { token } = theme.useToken();

// 是否正在加载
const loading = ref(true);

// 是否全选
const checkedAll = ref(false);

// 重命名模态框
const renameModalVisible = ref(false);

// 重命名输入框
const renameInputRef = ref();

// 重命名输入框绑定值
const renameInputValue = ref("");
// 当前重命名的 gridKey
const renameGridKey = ref("");

// 分页器
const pagination = {
	current: 1,
	pageSize: 5,
	total: 0,
	onChange: (page: number) => {
		pagination.current = page || 1;
		queryFileList();
	},
};

// 列表数据
const fileList: SheetListItem[] = reactive([]);

// 监听数据列表选中状态 - 向上触发实现 buttonList 组件的 checkedNumber 更新
watch(
	() => fileList,
	() => {
		const checkedNumber = getCheckedFileList().length;
		// 如果有被选中，则向上触发事件
		emit("updateCheckedNumber", checkedNumber);
		// 如果当前列表的长度 === 选中的列表长度，则全选状态为 true
		if (fileList.length === checkedNumber && checkedNumber) {
			checkedAll.value = true;
		} else {
			checkedAll.value = false;
		}
	},
	{ deep: true }
);

/**
 * @description 工具函数 - 获取当前文件列表被选中的元素
 */
function getCheckedFileList() {
	return fileList.filter((item) => item.checked);
}

/**
 * @description 切换全选状态
 */
function toggleCheckedAll(e: Event) {
	// 当前状态
	const { checked } = e.target as HTMLInputElement;
	fileList.forEach((i) => (i.checked = checked));
}

/**
 * @description 切换收藏状态
 */
async function toggleFavor(item: SheetListItem) {
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

/**
 * @description 分享文件
 */
async function handleShareFile(item: SheetListItem) {
	// 写入粘贴板
	try {
		writeToClipboard("description 分享文件");
	} catch (error) {
		console.error(error);
	}
}

/**
 * @description 重命名文件 - modal 确认事件回调
 */
async function renameConfirm() {
	if (!renameInputValue.value) return message.warn("请输入文件名称");

	try {
		const { data } = await API_renameFile({ gridKey: renameGridKey.value, newName: renameInputValue.value });
		if (data.code === 200) {
			message.success("重命名成功");
			const current = fileList.find((i) => i.workerbook.gridKey === renameGridKey.value);
			if (!current) return;
			current.workerbook.title = renameInputValue.value;

			renameModalVisible.value = false;
			renameInputValue.value = "";
			renameGridKey.value = "";
		}
	} catch (error) {
		console.error(error);
	}
}

/**
 * @description 单个删除文件
 */
async function handleDeleteFile(item: SheetListItem) {
	const filename = item.workerbook.title;

	Modal.confirm({
		title: "温馨提示",
		icon: createVNode(ExclamationCircleOutlined),
		content: `确认删除文件：${filename}.xlsx ?`,
		okText: "删除",
		okType: "danger",
		cancelText: "取消",
		async onOk() {
			try {
				const { data } = await API_deleteFile({ filemapid: item.file_map_id, gridKey: item.workerbook.gridKey });
				if (data.code === 200) message.success("删除成功");
				queryFileList();
			} catch (error) {
				console.error(error);
			}
		},
	});
}

/**
 * @description 批量删除文件
 */
async function handleBatchDeleteFile() {
	const checkedArray = getCheckedFileList();
	// 通过 promise.all 批量删除文件
	try {
		await Promise.all(
			checkedArray.map(async (item) => {
				try {
					await API_deleteFile({ filemapid: item.file_map_id, gridKey: item.workerbook.gridKey });
				} catch (error) {
					console.error(error);
				}
			})
		);
		message.success("删除成功");
	} catch (error) {
		console.error(error);
		message.error("删除失败");
	}
	queryFileList();
}

/**
 * @description 文件操作 - 菜单点击事件回调 重命名 | 分享 | 收藏 | 导出 | 删除
 */
async function handleSheetOperate(e: MenuProps["onClick"], item: SheetListItem) {
	// @ts-ignore
	const { key } = e!;

	// export
	if (key === "favor") toggleFavor(item);
	else if (key === "delete") handleDeleteFile(item);
	else if (key === "rename") {
		renameModalVisible.value = true;
		renameInputValue.value = item.workerbook.title;
		renameGridKey.value = item.workerbook.gridKey;
		nextTick(() => {
			renameInputRef.value.focus();
		});
	} else if (key === "share") handleShareFile(item);
}

/**
 * @description 外部多选文件操作回调 - 多选的文件在本文件内
 * @param operation 操作类型 share export delete
 */
async function handleOuterFileOperate(operation: string) {
	if (!operation) return;
	// 如果没有选中文件
	const checkedArray = getCheckedFileList();
	if (!checkedArray.length) return message.warn("没有文件被选中");
	if (operation === "delete") handleBatchDeleteFile();
}

/**
 * @description 获取文件列表
 */
async function queryFileList(filterType: string = "all") {
	try {
		loading.value = true;
		fileList.length = 0;
		pagination.total = 0;

		const { data } = await API_queryFileList({
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

onMounted(queryFileList);

// 向外暴露接口
defineExpose({ queryFileList, handleOuterFileOperate });
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
