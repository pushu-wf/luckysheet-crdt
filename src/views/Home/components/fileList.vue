<template>
	<div class="sheets-container">
		<div class="sheets-container-btns">
			<a-radio-group v-model:value="operator" button-style="solid">
				<a-radio-button value="all">全部</a-radio-button>
				<a-radio-button value="recently">最近</a-radio-button>
				<a-radio-button value="share">共享</a-radio-button>
				<a-radio-button value="favor">收藏</a-radio-button>
			</a-radio-group>

			<a-button type="primary" @click="createFileVisible = true" style="margin-left: auto" :icon="h(PlusOutlined)">新建</a-button>
			<a-button type="default" @click="ImportFile" style="margin-left: 20px" :icon="h(CloudUploadOutlined)">导入</a-button>
		</div>
		<div class="choose-files">
			<span>已选择 5 个文件</span>
			<a-button type="default" size="small" disabled style="margin-left: auto" :icon="h(BranchesOutlined)">共享</a-button>
			<a-button type="default" size="small" disabled style="margin-left: 10px" :icon="h(CloudDownloadOutlined)">导出</a-button>
			<a-button type="primary" size="small" disabled danger style="margin-left: 10px" :icon="h(DeleteOutlined)">删除</a-button>
		</div>

		<a-list bordered :pagination="pagination" :data-source="MockData">
			<template #header>
				<div class="sheet-header">
					<a-checkbox v-model:checked="checkAll"></a-checkbox>
					<span class="sheet-filename">文件名</span>
					<span class="sheet-createtime">创建时间</span>
					<span class="sheet-updatetime">更新时间</span>
					<span class="sheet-owner">所有者</span>
					<span class="sheet-operator"></span>
				</div>
			</template>
			<template #renderItem="{ item }">
				<a-list-item class="sheet-item">
					<a-checkbox></a-checkbox>
					<span class="sheet-filename">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-file-spreadsheet h-5 w-5 text-primary">
							<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
							<path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
							<path d="M8 13h2"></path>
							<path d="M14 13h2"></path>
							<path d="M8 17h2"></path>
							<path d="M14 17h2"></path>
						</svg>
						<p>{{ item.filename }}</p>
						<a-button type="text" :icon="h(StarOutlined)"></a-button>
					</span>
					<span class="sheet-createtime">{{ item.created_at }}</span>
					<span class="sheet-updatetime">{{ item.modified_at }}</span>
					<span class="sheet-owner">{{ item.owner }}</span>
					<span class="sheet-operator">
						<a-dropdown :trigger="['click']">
							<EllipsisOutlined />
							<template #overlay>
								<a-menu @click="handleSheetOperate">
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
										收藏表格
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
		</a-list>

		<!-- 新建文件弹窗 -->
		<a-modal v-model:open="createFileVisible" title="创建工作簿" okText="创建" cancelText="取消" @ok="createFileConfirm">
			<a-input placeholder="请输入工作簿名称" v-model:value="createFileName" />
		</a-modal>
	</div>
</template>

<script setup lang="ts">
import { ref, h } from "vue";
import { theme } from "ant-design-vue";
import MockData from "../../../mock/sheets.json";
import { ImportFile } from "../../../utils/ImportFile";
import { StarFilled, EllipsisOutlined, StarOutlined, FileAddOutlined } from "@ant-design/icons-vue";
import { PlusOutlined, BranchesOutlined, DeleteOutlined, CloudDownloadOutlined, CloudUploadOutlined } from "@ant-design/icons-vue";
const { token } = theme.useToken();

// 定义当前过滤条件 全部 最近  共享  收藏
const operator = ref("all");

// 是否全选
const checkAll = ref(false);

// 新建文件弹窗
const createFileVisible = ref(false);
// 新建工作簿名称
const createFileName = ref("");

// 分页器
const pagination = {
	current: 1,
	pageSize: 5,
	total: MockData.length,
	onChange: (page: number) => (pagination.current = page),
};

// 表格操作
function handleSheetOperate(payload: { key: string }) {
	// open
	// share
	// favor
	// export
	// delete
}

// 新建文件确认回调
function createFileConfirm() {
	createFileVisible.value = false;
}
</script>

<style lang="less" scoped>
.sheets-container {
	width: 100%;
	height: 100%;
	overflow: hidden;
	padding: 20px;
}
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
		svg {
			height: 18px;
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
