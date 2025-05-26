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
				<span class="username">{{ username }}</span>
				<a-avatar style="cursor: pointer">
					<template #icon>
						<UserOutlined />
					</template>
				</a-avatar>
			</div>
			<template #overlay>
				<a-menu @click="handleOperate">
					<a-menu-item key="userInfo">个人信息</a-menu-item>
					<a-menu-item key="help">获取帮助</a-menu-item>
					<a-divider />
					<a-menu-item key="logout" :style="{ color: token.colorError }">退出系统</a-menu-item>
				</a-menu>
			</template>
		</a-dropdown>
	</div>
	<!-- 个人信息弹窗 -->
	<UserInfo ref="userInfoModalRef" @updateUserName="updateUserName" />
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import router from "../../../router";
import { theme } from "ant-design-vue";
import UserInfo from "./UserInfo.vue";
import { getUserInfo } from "../../../utils";
import { localForage } from "../../../localforage";
import { SearchOutlined, UserOutlined } from "@ant-design/icons-vue";

const emit = defineEmits(["search", "updateFileList"]);

// 文件搜索关键词
const searchKey = ref("");

watch(
	() => searchKey.value,
	() => emit("search", searchKey.value)
);

const userInfoModalRef = ref();
const { token } = theme.useToken();
const username = ref(getUserInfo().username);

// 用户名更新
function updateUserName() {
	username.value = getUserInfo().username;
	emit("updateFileList");
}

// 头像下拉菜单事件
function handleOperate(payload: { key: string }) {
	if (payload.key === "userInfo") {
		userInfoModalRef.value.open();
	} else if (payload.key === "help") {
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
