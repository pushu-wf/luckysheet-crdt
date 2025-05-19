<template>
	<div class="login-container">
		<div class="left">
			<div class="left-box">
				<h2>协同文件管理系统</h2>
				<p class="description">高效、便捷的在线表格协作平台，让团队协作更加流畅，数据管理更加智能。</p>
				<div class="feature-list">
					<div class="feature-item">
						<h3>实时协作</h3>
						<p>多人同时编辑，变更实时同步，提高团队工作效率</p>
					</div>
					<div class="feature-item">
						<h3>数据安全</h3>
						<p>严格的权限控制和数据加密，保障您的数据安全</p>
					</div>
					<div class="feature-item">
						<h3>智能分析</h3>
						<p>强大的数据分析功能，帮助您快速洞察业务趋势</p>
					</div>
					<div class="feature-item">
						<h3>版本控制</h3>
						<p>完整的历史记录，随时回溯查看或恢复之前的版本</p>
					</div>
				</div>
			</div>
		</div>
		<div class="right">
			<div class="logo">
				<img src="/logo.svg" alt="" />
			</div>
			<h1>Luckysheet-CRDT</h1>
			<transition>
				<RegisterForm @goto-login="formState = 'login'" v-if="formState === 'register'" />
				<LoginForm @goto-register="formState = 'register'" v-else-if="formState === 'login'" />
			</transition>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import LoginForm from "./components/LoginForm.vue";
import RegisterForm from "./components/RegisterForm.vue";

// 当前表单状态
const formState = ref<"login" | "register">("register");
</script>

<style lang="less">
.login-container {
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}
.login-container > div {
	width: 50%;
	height: 100%;
}
.login-container .left {
	user-select: none;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: linear-gradient(to right, #10b981, #0d9488);

	.left-box {
		width: 70%;
		h1 {
			color: #fff;
			font-weight: 700;
			// 转大写
			text-transform: uppercase;
		}
		h2 {
			color: #fff;
			font-size: 36px;
			font-weight: 700;
			margin: 38px 0;
		}
		p.description {
			color: #fff;
			font-size: 18px;
			line-height: 28px;
			margin-bottom: 32px;
		}
	}
}
.login-container .left .feature-list {
	display: flex;
	flex-wrap: wrap;

	.feature-item {
		padding: 16px;
		width: calc(50% - 20px);
		margin-right: auto;
		margin-bottom: 20px;
		background-color: rgb(255 255 255 / 0.2);
		border-radius: 0.5rem;
		color: #fff;
		h3 {
			font-weight: 500;
			margin-bottom: 8px;
		}
		p {
			font-size: 14px;
		}
	}
}
.login-container .right {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.logo img {
		width: 80px;
		height: 80px;
		margin-right: 10px;
	}
	h1 {
		user-select: none;
		margin: 18px 0;
		color: #55bb8a;
		// 转大写
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
