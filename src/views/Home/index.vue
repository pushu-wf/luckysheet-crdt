<template>
	<div class="home-box">
		<div class="home-header">
			<div class="logo">
				<img src="/logo.svg" alt="" />
				<h1>Luckysheet-CRDT</h1>
			</div>
			<a-input v-model:value="searchKey" placeholder="搜索文件...">
				<template #prefix>
					<SearchOutlined />
				</template>
			</a-input>
			<a-dropdown>
				<a-avatar style="cursor: pointer">
					<template #icon>
						<UserOutlined />
					</template>
				</a-avatar>
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
		<div class="home-sheets-container"><fileList /></div>
		<div class="home-footer">
			<span>© 2025 Luckysheet-CRDT 在线协同编辑系统</span>
		</div>

		<!-- 个人信息弹窗 -->
		<userInfoModal ref="userInfoModalRef" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";
import { theme } from "ant-design-vue";
import fileList from "./components/fileList.vue";
import { localForage } from "../../localforage";
import userInfoModal from "./components/userInfoModal.vue";
import { SearchOutlined, UserOutlined } from "@ant-design/icons-vue";

const { token } = theme.useToken();

// 文件搜索关键词
const searchKey = ref("");
const userInfoModalRef = ref();

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

.home-box {
	height: 100%;
	width: 100%;
	overflow: hidden;
}
.home-header {
	padding: 0 20px;
	height: 64px;
	display: flex;
	align-items: center;
	border-bottom: solid v-bind("token.colorBorder") 1px;

	& > * {
		margin-left: 20px;
	}

	.logo {
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
}

.home-sheets-container {
	height: calc(100% - 64px - 52px);
}

.home-footer {
	color: v-bind("token.colorTextSecondary");
	font-size: 14px;
	border-top: solid v-bind("token.colorBorder") 1px;
	height: 52px;
	display: flex;
	align-items: center;
	padding: 0 20px;
}
</style>
