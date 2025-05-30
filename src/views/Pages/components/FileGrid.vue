<template>
	<div class="file-grid">
		<div class="file-grid-breadcrumb">
			<a-breadcrumb>
				<a-breadcrumb-item> <home-outlined style="margin-right: 10px" />根目录 </a-breadcrumb-item>
			</a-breadcrumb>
		</div>

		<!-- 循环列表 -->
		<div class="file-grid-list">
			<a-space size="large">
				<a-dropdown :trigger="['contextmenu']" v-for="i in 10">
					<a-card hoverable>
						<template #cover>
							<img alt="file" :src="i % 3 ? '/file-icon.png' : 'folder-icon.png'" />
						</template>
						<a-card-meta title="文件夹名称123123">
							<template #description>2024-09-09</template>
						</a-card-meta>
					</a-card>
					<template #overlay>
						<a-menu>
							<a-menu-item key="rename">
								<FormOutlined />
								文件重命名
							</a-menu-item>
							<a-divider />
							<a-menu-item key="share">
								<BranchesOutlined />
								分享表格
							</a-menu-item>
							<!-- <a-menu-item key="favor">
								<StarOutlined />
								{{ item.favor ? "取消收藏" : "收藏表格" }}
							</a-menu-item> -->
							<a-divider />
							<a-menu-item key="delete" :style="{ color: token.colorError }">
								<DeleteOutlined />
								删除记录
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
import { HomeOutlined, FormOutlined, BranchesOutlined, DeleteOutlined } from "@ant-design/icons-vue";
const { token } = theme.useToken();
</script>

<style lang="less" scoped>
.file-grid {
	height: calc(100% - 32px - 82px);
	width: 100%;
	overflow: hidden;
}
.file-grid-list {
	height: calc(100% - 20px);
	margin-top: 20px;
	display: flex;
	flex-wrap: wrap;
	overflow: hidden;

	.ant-space {
		padding: 10px;
		height: calc(100% - 40px);
		display: flex;
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
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
		&:hover {
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
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
	}
}
</style>
