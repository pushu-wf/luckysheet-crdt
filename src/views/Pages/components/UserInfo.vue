<template>
	<a-modal v-model:open="modalVisible" title="" width="100%" :footer="null" :closable="false" wrap-class-name="full-modal">
		<a-page-header title="个人信息" sub-title="温馨提示: 页面部分数据为虚拟数据" @back="modalVisible = false" />
		<div class="user-info-container">
			<!-- 左右布局 -->
			<div class="user-info-left">
				<div class="user-info-avatar">
					<a-avatar style="background-color: #87d068" :size="80" @click="uploadImageModalVisible = true">
						<template #icon>
							<UserOutlined />
						</template>
					</a-avatar>
					<h2>{{ staticUserName }}</h2>
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
					<a-button @click="resetUserInfoForm">重置</a-button>
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
		@cancel="() => resetForm(passwordFormRef)">
		<a-form layout="vertical" :model="passwordForm" ref="passwordFormRef" :rules="passwordRules">
			<a-form-item name="password">
				<a-input autocomplete="off" type="password" v-model:value="passwordForm.password" placeholder="请输入旧密码" />
			</a-form-item>
			<a-form-item name="newPassword">
				<a-input autocomplete="off" type="password" v-model:value="passwordForm.newPassword" placeholder="请输入新密码" />
			</a-form-item>
			<a-form-item name="checkNewPassword">
				<a-input autocomplete="off" type="password" v-model:value="passwordForm.checkNewPassword" placeholder="请确认新密码" />
			</a-form-item>
		</a-form>
	</a-modal>

	<!-- 上传图片模态框 -->
	<a-modal v-model:open="uploadImageModalVisible" title="上传头像" cancelText="取消" okText="上传"> </a-modal>
</template>

<script setup lang="ts">
import { message } from "ant-design-vue";
import { updatePasswordHook } from "../config";
import { h, reactive, ref, toRaw } from "vue";
import { API_updateUser } from "../../../axios";
import { getUserInfo, md5 } from "../../../utils";
import { localForage } from "../../../localforage";
import { UserOutlined, FormOutlined } from "@ant-design/icons-vue";

const { passwordForm, passwordRules, resetForm, validateForm } = updatePasswordHook();

const emit = defineEmits(["updateUserName"]);

// 个人信息弹窗
const modalVisible = ref(true);

// 修改密码弹窗
const passwordVisible = ref(false);

// 上传头像弹窗
const uploadImageModalVisible = ref(false);

// 用户表单信息
const userInfo = getUserInfo();
const userInfoForm = reactive({ ...userInfo });

// 静态数据 - h2 展示用
const staticUserName = ref(toRaw(userInfo.username));

// 修改密码表单
const passwordFormRef = ref();

// 重置表单
function resetUserInfoForm() {
	// 重新获取数据，不然存在脏数据异常
	const userInfo = getUserInfo();
	Object.keys(userInfoForm).forEach((key) => {
		userInfoForm[key] = userInfo[key];
	});
}

// 更新用户信息 这个函数内，仅处理 username email
async function updateUserInfo() {
	const { username, email } = toRaw(userInfoForm);
	// 如果没有变化则不需要请求
	const userInfo = getUserInfo();
	if (username === userInfo.username && email === userInfo.email) return;
	try {
		const { data } = await API_updateUser({ username, email });

		if (data.code === 200) {
			const newUserInfo = Object.assign({}, userInfo, { username, email });
			// 更新页面
			staticUserName.value = username;
			// 更新存储
			localForage.setItem("userInfo", newUserInfo);
			message.success("更新成功");

			// 更新用户名称后，可能会引起sheet list 文件拥有者变更，因此，需要重新获取文件列表
			if (username === userInfo.username) return; // 避免重复更新
			emit("updateUserName");
		}
	} catch (error) {}
}

// 修改密码
async function updatePassword() {
	try {
		const validata = await validateForm(passwordFormRef);
		if (!validata) return;

		const { newPassword } = toRaw(passwordForm);

		const { data } = await API_updateUser({ password: md5(newPassword) });
		if (data.code === 200) {
			message.success("密码修改成功");
			// 关闭弹窗
			passwordVisible.value = false;
		}
	} catch (error) {
		console.error(error);
	}
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

.user-info-avatar {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.ant-avatar {
		cursor: pointer;
	}
	h2 {
		font-weight: 800;
		margin-top: 10px;
	}
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
