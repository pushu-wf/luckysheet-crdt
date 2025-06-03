<template>
	<div class="pages-header">
		<div class="logo">
			<img src="/logo.svg" alt="" />
			<h1>Luckysheet-CRDT</h1>
		</div>

		<a-input v-model:value="searchKey" allowClear placeholder="搜索文件...">
			<template #prefix>
				<SearchOutlined />
			</template>
		</a-input>

		<a-dropdown arrow trigger="click" placement="bottomRight">
			<div class="user-avatar">
				<span class="username">{{ getUserName() }}</span>
				<a-avatar style="cursor: pointer" :src="parseAvatar()" />
			</div>
			<template #overlay>
				<a-menu @click="handleOperate">
					<a-menu-item key="userInfo"> <UserOutlined style="margin-right: 10px" /> 个人信息</a-menu-item>
					<a-menu-item key="help"> <QuestionCircleOutlined style="margin-right: 10px" />获取帮助</a-menu-item>
					<a-divider />
					<a-menu-item key="logout" :style="{ color: token.colorError }">
						<LogoutOutlined style="margin-right: 10px" />退出系统
					</a-menu-item>
				</a-menu>
			</template>
		</a-dropdown>
	</div>

	<!-- 个人信息弹窗 -->
	<UserInfo ref="userInfoModalRef" v-if="userInfoModalVisible" @close="userInfoModalVisible = false" />

	<!-- 获取帮助弹窗 -->
	<Help ref="helpModalRef" v-if="helpModalVisible" @close="helpModalVisible = false" />
</template>
<script setup lang="ts">
import Help from "./Help.vue";
import router from "../../../router";
import UserInfo from "./UserInfo.vue";
import { theme } from "ant-design-vue";
import { nextTick, ref, watch } from "vue";
import { useUserStore } from "../../../store/User";
import { localForage } from "../../../localforage";
import { SearchOutlined, UserOutlined, QuestionCircleOutlined, LogoutOutlined } from "@ant-design/icons-vue";

const emit = defineEmits(["search", "updateFileList"]);

// 文件搜索关键词
const searchKey = ref("");

const { token } = theme.useToken();

watch(
	() => searchKey.value,
	() => emit("search", searchKey.value)
);

// 用户信息弹窗 用于调用 open 方法打开弹窗,直接调用 open 会导致渲染异常，控制台报错

const userInfoModalVisible = ref(false);
const userInfoModalRef = ref();
const helpModalVisible = ref(false);
const helpModalRef = ref();

// 用户头像 名称通过解析 store 实现更新
const { getUserName, parseAvatar } = useUserStore();

// 头像下拉菜单事件
function handleOperate(payload: { key: string }) {
	if (payload.key === "userInfo") {
		userInfoModalVisible.value = true;
		nextTick(() => userInfoModalRef.value.open());
	} else if (payload.key === "help") {
		helpModalVisible.value = true;
		nextTick(() => helpModalRef.value.open());
	} else if (payload.key === "logout") {
		// 清空 storage
		localForage.clear();
		router.push("/login");
	}
}
</script>

<style lang="less" scoped>
// 输入框前缀图标
.ant-input-affix-wrapper .ant-input-prefix .anticon {
	color: v-bind("token.colorTextQuaternary");
}

// 未读
:deep .ant-badge-count {
	min-width: 16px;
	height: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.pages-header {
	padding: 0 20px;
	height: 64px;
	display: flex;
	align-items: center;
	border-bottom: solid v-bind("token.colorBorder") 1px;

	& > * {
		margin-left: 20px;
	}

	.logo {
		user-select: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		margin-right: auto;
		margin-left: 0;
		img {
			height: 38px;
			margin-right: 10px;
		}
		h1 {
			margin-bottom: 0;
			font-size: 20px;
			font-weight: 700;
		}
	}

	.ant-input-affix-wrapper {
		width: 220px;
	}
	.user-avatar {
		display: flex;
		align-items: center;
		cursor: pointer;
		user-select: none;
		.username {
			color: v-bind("token.colorTextSecondary");
			margin-right: 10px;
		}
	}
}
</style>
