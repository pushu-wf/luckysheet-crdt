<!-- 分享链接页面 -->
<template>
	<a-modal v-model:open="visible" title="分享表格" :footer="null" @cancel="emit('close')">
		<div class="invite-box">
			<div class="top">
				<img src="/excel.png" alt="" />
				<div class="right">
					<div class="title">{{ item.workerbook.title }}</div>
					<div class="owner">所有人： {{ item.owner.username }}</div>
				</div>
			</div>
			<a-divider style="margin: 10px 0" />

			<!-- 配置用户权限 -->
			<p>配置用户权限</p>
			<a-radio-group size="small" v-model:value="editAble" button-style="solid">
				<a-radio-button :value="true">可编辑</a-radio-button>
				<a-radio-button :value="false">仅查看</a-radio-button>
			</a-radio-group>

			<p style="margin-top: 10px">操作</p>
			<div class="operator">
				<a-tooltip>
					<template #title>复制链接</template>
					<PaperClipOutlined @click="copyLink" />
				</a-tooltip>
				<a-tooltip>
					<template #title>生成二维码</template>
					<QrcodeOutlined @click="generateQrCode" />
				</a-tooltip>
				<a-tooltip>
					<template #title>以文件格式发送</template>
					<FileExcelOutlined @click="shearFile" />
				</a-tooltip>
				<a-tooltip>
					<template #title>发送至聊天窗口</template>
					<CommentOutlined @click="shearToChat" />
				</a-tooltip>
			</div>
		</div>
	</a-modal>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { SheetListItem } from "../../../interface";
import { PaperClipOutlined, QrcodeOutlined, FileExcelOutlined, CommentOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { encode, writeToClipboard } from "../../../utils";

const visible = ref(true);

const emit = defineEmits(["close"]);

const { item } = defineProps<{
	item: SheetListItem;
}>();

// 是否可编辑
const editAble = ref(true);

/** 复制链接 */
function copyLink() {
	// 将参数进行编码
	const filemapid = item.file_map_id;
	// 还需要传入用户权限
	const editable = Boolean(editAble.value);
	const payload = JSON.stringify({ filemapid, editable });

	const URL = `${window.location.origin}/#/invite/${encode(encode(payload))}`;
	// 写入粘贴板
	try {
		writeToClipboard(URL);
		message.success("分享链接已复制到粘贴板");
	} catch (error) {
		console.error(error);
	}
}

/** 生成二维码 */
function generateQrCode() {}

/** 以文件发送 */
function shearFile() {}

/** 发送至聊天窗口 */
function shearToChat() {}

defineExpose({ open: () => (visible.value = true) });
</script>

<style lang="less" scoped>
.invite-box {
	.top {
		display: flex;
		img {
			width: 40%;
			flex-shrink: 0;
			border-bottom: solid #ebebeb 1px;
		}
		.right {
			padding-left: 20px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			.title {
				font-size: 20px;
				font-weight: bold;
			}
			.owner {
				font-size: 14px;
				color: #999;
			}
		}
	}
	.description {
		text-indent: 2rem;
		padding: 20px 0;
		font-size: 14px;
	}
}

.operator {
	display: flex;

	.anticon {
		border-radius: 4px;
		cursor: pointer;
		margin: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #f3f5f7;
		color: rgba(0, 0, 0, 0.65);
		width: 60px;
		height: 60px;
		font-size: 28px;
		transition: all 0.3s;

		// hover 添加阴影
		&:hover {
			box-shadow: 0 4px 8px rgb(0 0 0 / 10%);
			font-size: 30px;
		}
	}
}
</style>
