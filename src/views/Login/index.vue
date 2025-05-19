<template>
	<div class="login-box">
		<!-- header -->
		<div class="login-box-header">
			<div class="left">
				<img src="/logo.svg" alt="" />
				<span>Luckysheet-CRDT</span>
			</div>
			<div class="right">
				<div class="login-box-header-item">
					<GithubOutlined />
				</div>
			</div>
		</div>

		<!-- login-form -->
		<div class="login-box-form">
			<div class="left">
				<img src="/bg.svg" alt="" />
			</div>
			<div class="right">
				<div class="logo">
					<img src="/logo.svg" alt="" />
				</div>
				<h2 class="title">Luckysheet-CRDT</h2>
				<transition>
					<RegisterForm v-if="formStatus === 'register'" @goto-login="formStatus = 'login'" />
					<LoginForm
						v-else-if="formStatus === 'login'"
						@goto-register="formStatus = 'register'"
						@forget-password="formStatus = 'forget'" />
				</transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LoginForm from "./components/LoginForm.vue";
import { GithubOutlined } from "@ant-design/icons-vue";

// 定义当前表单的状态 login | register （登陆表单还是注册表单）
const formStatus = ref<"login" | "register" | "forget">("login");
</script>

<style lang="less" scoped>
.login-box {
	width: 100%;
	height: 100%;
}

.login-box-header {
	transition: all 0.3s;
	border-bottom: solid var(--colorBorder) 1px;
	height: 64px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.login-box-header .right {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.login-box-header .left {
	transition: all 0.3s;
	color: var(--colorText);
	font-size: 18px;
	font-weight: 800;
	user-select: none;
	height: 100%;
	display: flex;
	align-items: center;
	img {
		height: 50%;
		margin: 0 20px;
	}
}
.login-box-header-item {
	color: var(--colorText);
	transition: all 0.3s;
	user-select: none;
	cursor: pointer;
	padding: 0 20px;
	border-left: solid var(--colorBorder) 1px;
	svg path {
		fill: var(--colorText);
		transition: all 0.3s;
	}
}

// login-box-form
.login-box-form {
	height: calc(100% - 64px - 32px);
	display: flex;
	align-items: center;
	justify-content: center;
}
.login-box-form > div {
	width: 50%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.login-box-form .left img {
	width: 70%;
	height: 70%;
	filter: drop-shadow(0 0 2em rgba(113, 196, 239, 0.667));
}

.login-box-form .right {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.logo {
		width: 80px;
		height: 80px;

		img {
			width: 100%;
			height: 100%;
		}
	}

	.title {
		user-select: none;
		transition: all 0.3s;
		color: var(--colorText);
		font: 700 200% Consolas, Monaco, monospace;
		margin: 15px 0;
		text-transform: uppercase;
	}
}

.v-enter-active,
.v-leave-active {
	transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	height: 0;
	opacity: 0;
	transform: scale(0);
}
</style>
