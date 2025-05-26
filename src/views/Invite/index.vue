<template>
	<a-modal v-model:open="visible" title="受邀加入表格" cancelText="取消" okText="加入" @cancel="cancel" @ok="ok">
		<div class="invite-box">
			<div class="top">
				<img src="/excel.png" alt="" />
				<div class="right">
					<div class="title">{{ inviteInfo.fileName }}</div>
					<div class="owner">所有人： {{ inviteInfo.fileOwner }}</div>
				</div>
			</div>
			<div class="description">
				受 <code>{{ inviteInfo.fileInvitor }}</code> 的邀请加入
				<code>{{ inviteInfo.fileName }}.xlsx</code>
				，请确认是否加入？
			</div>
		</div>
	</a-modal>
</template>
<script setup lang="ts">
import router from "../../router";
import { decode } from "../../utils";
import { onMounted, reactive, ref } from "vue";
import { API_getInviteInfo, API_acceptInvite } from "../../axios";
import { message } from "ant-design-vue";

const visible = ref(true);

// 邀请信息
const inviteInfo = reactive({
	fileName: "",
	fileOwner: "",
	fileInvitor: "",
	gridKey: "",
});

function cancel() {
	visible.value = false;
	router.push("/");
}
async function ok() {
	// 发送请求 - 同意加入
	try {
		const { data } = await API_acceptInvite({ gridKey: inviteInfo.gridKey, owner: inviteInfo.fileOwner });
		if (data.code === 200) message.success("加入成功");
	} catch (error) {
		console.error(error);
	}
	visible.value = false;
	router.push("/");
}

onMounted(async () => {
	// 从 router 获取参数
	const { filemapid } = router.currentRoute.value.params;
	if (!filemapid) return;
	// 需要进行两次转码
	const fileMapID = decode(decode(<string>filemapid));
	// 请求 filemap 信息，即可获取到相关邀请者、所有者、文件名称信息
	try {
		const { data } = await API_getInviteInfo(fileMapID);
		if (data.code === 200) {
			inviteInfo.fileInvitor = data.data.OperatorUser.username;
			inviteInfo.fileName = data.data.WorkerBook.title;
			inviteInfo.fileOwner = data.data.OwnerUser.username;
			inviteInfo.gridKey = data.data.WorkerBook.gridKey;
		}
	} catch (error) {
		console.error(error);
	}
});
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
</style>
