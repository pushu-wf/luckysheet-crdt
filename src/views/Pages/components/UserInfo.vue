<template>
	<div>
		<a-modal v-model:open="userInfoModalVisible" title="" width="100%" :footer="null" :closable="false" wrap-class-name="full-modal">
			<a-page-header title="个人信息" sub-title="温馨提示: 页面部分数据为虚拟数据" @back="userInfoModalVisible = false" />
			<div class="user-info-container">
				<!-- 左右布局 -->
				<div class="user-info-left">
					<div class="user-info-avatar">
						<a-avatar :size="80" @click="avatarModalVisible = true" :src="parseAvatar()" />
						<h2>{{ USERNAME }}</h2>
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
										<a-button @click="passwordModalVisible = true" :icon="h(FormOutlined)" />
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
			v-model:open="passwordModalVisible"
			title="修改密码"
			cancelText="取消"
			okText="确定"
			@ok="() => updatePassword(passwordFormRef)"
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
		<a-modal v-model:open="avatarModalVisible" title="上传头像" cancelText="取消" okText="上传" @ok="handleUpload">
			<div class="user-avatar-upload">
				<a-upload
					v-model:file-list="uploadList"
					name="avatar"
					list-type="picture-card"
					class="avatar-uploader"
					:show-upload-list="false"
					:before-upload="beforeUpload">
					<img v-if="avatarPreview" :src="avatarPreview" alt="avatar" style="width: 100%; height: fit-content" />
					<div v-else>
						<plus-outlined></plus-outlined>
						<div class="ant-upload-text">Upload</div>
					</div>
				</a-upload>
				<a-divider type="vertical" style="height: 90px" />

				<!-- 头像预览 -->
				<div class="avatar-preview">
					<div class="circle">
						<a-avatar :size="48" :src="avatarPreview" />
						<a-avatar :size="32" :src="avatarPreview" />
						<a-avatar :size="28" :src="avatarPreview" />
					</div>
					<div class="square">
						<a-avatar shape="square" :size="48" :src="avatarPreview" />
						<a-avatar shape="square" :size="32" :src="avatarPreview" />
						<a-avatar shape="square" :size="28" :src="avatarPreview" />
					</div>
				</div>
			</div>
		</a-modal>
	</div>
</template>

<script setup lang="ts">
import { h } from "vue";
import { useUserStore } from "../../../store/User";
import { FormOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { usePasswordHook, useAvatarHook, useUserInfoHook } from "../config";

// 解析 user store
const { parseAvatar } = useUserStore();

// 解析用户信息相关 hook 参数
const { userInfoModalVisible, userInfoForm, resetUserInfoForm, updateUserInfo, USERNAME } = useUserInfoHook();

// 解析头像上传相关 hook 参数
const { beforeUpload, avatarModalVisible, uploadList, avatarPreview, handleUpload } = useAvatarHook();

// 解析修改密码相关 hook 参数
const { passwordForm, passwordRules, resetForm, updatePassword, passwordModalVisible, passwordFormRef } = usePasswordHook();

defineExpose({ open: () => (userInfoModalVisible.value = true) });
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

.user-avatar-upload {
	display: flex;
	align-items: center;
	.ant-upload-wrapper {
		width: auto;
	}
	.avatar-preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		& > * {
			& > * {
				margin-right: 10px;
			}
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
		}
	}
}
</style>
