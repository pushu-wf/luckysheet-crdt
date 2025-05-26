<template>
	<a-modal v-model:open="modalVisible" title="" width="100%" :footer="null" :closable="false" wrap-class-name="full-modal">
		<a-page-header title="个人信息" sub-title="温馨提示: 页面部分数据为虚拟数据" @back="modalVisible = false" />
		<div class="user-info-container">
			<!-- 左右布局 -->
			<div class="user-info-left">
				<div class="user-info-avatar">
					<a-avatar style="background-color: #87d068" :size="80">
						<template #icon>
							<UserOutlined />
						</template>
					</a-avatar>
					<h2>{{ username }}</h2>
					<h4>{{ email }}</h4>
				</div>
				<div class="user-info-form">
					<a-form layout="vertical" :model="userInfoForm">
						<a-form-item label="用户名">
							<a-input v-model:value="userInfoForm.username"></a-input>
						</a-form-item>
						<a-form-item label="邮箱">
							<a-input v-model:value="userInfoForm.email"></a-input>
						</a-form-item>
						<a-form-item label="密码">
							<a-input-group compact>
								<a-input placeholder="******" disabled type="password" style="width: calc(100% - 34px)" />
								<a-tooltip>
									<template #title>修改密码</template>
									<a-button @click="passwordVisible = true" :icon="h(FormOutlined)" />
								</a-tooltip>
							</a-input-group>
						</a-form-item>
					</a-form>
				</div>
				<div class="user-info-btns">
					<a-button @click="resetForm">重置</a-button>
					<a-button style="margin-left: 10px" type="primary" @click="updateUserInfo">修改</a-button>
				</div>
			</div>
			<div class="user-info-right">
				<div class="feature-item"><img src="/public/statistics.png" alt="" /></div>
				<div class="feature-item"><img src="/public/liveness.png" alt="" /></div>
				<div class="feature-item"><img src="/public/type.png" alt="" /></div>
				<div class="feature-item"><img src="/public/collaborate.png" alt="" /></div>
			</div>
		</div>
	</a-modal>

	<!-- 修改密码模态框 -->
	<a-modal
		v-model:open="passwordVisible"
		title="修改密码"
		cancelText="取消"
		okText="确定"
		@ok="updatePassword"
		@cancel="passwordFormRef.resetFields()">
		<a-form layout="vertical" :model="changePasswordForm" ref="passwordFormRef" :rules="changePasswordRules">
			<a-form-item name="password">
				<a-input autocomplete="off" v-model:value="changePasswordForm.password" placeholder="请输入旧密码" />
			</a-form-item>
			<a-form-item name="newPassword">
				<a-input autocomplete="off" v-model:value="changePasswordForm.newPassword" placeholder="请输入新密码" />
			</a-form-item>
			<a-form-item name="checkNewPassword">
				<a-input autocomplete="off" v-model:value="changePasswordForm.checkNewPassword" placeholder="请确认新密码" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script setup lang="ts">
import { h, reactive, ref, toRaw } from "vue";
import { Rule } from "ant-design-vue/es/form";
import { API_verifyPassword } from "../../../axios";
import { UserOutlined, FormOutlined } from "@ant-design/icons-vue";
import { checkPasswordStrength, getUserInfo, md5 } from "../../../utils";

// 个人信息弹窗
const modalVisible = ref(true);
// 修改密码弹窗
const passwordVisible = ref(true);

// 用户表单信息
const userInfo = getUserInfo();
const userInfoForm = reactive({ ...userInfo });
// 静态数据
const email = toRaw(userInfo.email);
const username = toRaw(userInfo.username);

// 修改密码表单
const passwordFormRef = ref();
const changePasswordForm = reactive({ password: "", newPassword: "", checkNewPassword: "" });

// 定义密码校验规则
const changePasswordRules = {
	password: [{ required: true, trigger: "blur", validator: validatePassword }],
	newPassword: [{ required: true, trigger: "blur", validator: checkPasswordStrength }],
	checkNewPassword: [
		{ required: true, trigger: "blur", validator: validatorCheckPassword },
		{ required: true, trigger: "blur", validator: checkPasswordStrength },
	],
};

// 旧密码需要验证服务器是否匹配
async function validatePassword(_rule: Rule, value: string) {
	if (!value) return Promise.reject("请输入旧密码");
	const { data } = await API_verifyPassword(md5(value));
	return new Promise<void>((resolve, reject) => {
		if (data.code === 200) resolve();
		reject(data.message);
	});
}

/** 确认密码校验规则 */
function validatorCheckPassword(_rule: Rule, value: string) {
	return new Promise((resolve, reject) => {
		if (!value) reject("请确认密码");
		else if (value !== changePasswordForm.newPassword) reject("密码不一致");
		else resolve("密码验证通过");
	});
}

// 重置表单
function resetForm() {
	Object.keys(userInfoForm).forEach((key) => {
		userInfoForm[key] = userInfo[key];
	});
}
// 更新用户信息 这个函数内，仅处理 username email
function updateUserInfo() {
	const { username, email } = toRaw(userInfoForm);
	console.log(" ==> ", username, email);
}

// 修改密码
async function updatePassword() {
	try {
		const validata = await passwordFormRef.value?.validate();
		if (!validata) return;

		console.log(" ==> ", passwordFormRef.value?.getFormData());
	} catch (error) {}
}

defineExpose({ open: () => (modalVisible.value = true) });
</script>

<style lang="less" scoped>
.user-info-container {
	display: flex;
	justify-content: space-between;
	height: calc(100% - 100px);
	margin-top: 20px;
	width: 100%;
}
.user-info-left {
	position: relative;
	width: 48%;
	border: solid 1px #e4e4e7;
	border-radius: 8px;
	padding: 20px;
}
.user-info-btns {
	position: absolute;
	right: 20px;
	bottom: 20px;
}

.user-info-avatar {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	h2 {
		font-weight: 800;
		margin-top: 10px;
	}
}

.user-info-right {
	width: 48%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	& > div:nth-child(3),
	& > div:nth-child(4) {
		margin-top: auto;
	}
	& > div {
		width: calc(50% - 10px);
		height: calc(50% - 10px);
		border: solid 1px #e4e4e7;
		border-radius: 8px;
		overflow: hidden;
		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
