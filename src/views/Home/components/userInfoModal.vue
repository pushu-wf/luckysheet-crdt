<template>
	<a-modal v-model:open="modalVisible" title="" width="100%" :footer="null" :closable="false" wrap-class-name="full-modal">
		<a-page-header title="个人信息" @back="modalVisible = false" />
		<div class="user-info-container">
			<!-- 左右布局 -->
			<div class="user-info-left">
				<div class="user-info-avatar">
					<a-avatar style="background-color: #87d068" :size="80">
						<template #icon>
							<UserOutlined />
						</template>
					</a-avatar>
					<h2>{{ userInfoForm.username }}</h2>
					<h4>{{ userInfoForm.email }}</h4>
				</div>
				<div class="user-info-form">
					<a-form layout="vertical" :model="userInfoForm" ref="userInfoFormRef">
						<a-form-item label="用户名">
							<a-input v-model:value="userInfoForm.username" disabled></a-input>
						</a-form-item>
						<a-form-item label="密码">
							<a-input v-model:value="userInfoForm.password" type="password"></a-input>
						</a-form-item>
						<a-form-item label="邮箱">
							<a-input v-model:value="userInfoForm.email" disabled></a-input>
						</a-form-item>
					</a-form>
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
</template>
<script setup lang="ts">
import { theme } from "ant-design-vue";
import { reactive, ref } from "vue";

const modalVisible = ref(true);
const { token } = theme.useToken();

// 用户表单
const userInfoForm = reactive({
	username: "张三",
	password: "123456",
	email: "123456@qq.com",
	phone: "12345678901",
	role: "admin",
	status: "normal",
	avatar: "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
	sex: "male",
	birthday: "1990-01-01",
	address: "北京市海淀区中关村",
});
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
	width: 48%;
	border: solid 1px #e4e4e7;
	border-radius: 8px;
	padding: 20px;
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
	justify-content: space-between;
	flex-wrap: wrap;
	& > div {
		margin-top: auto;
		width: calc(50% - 10px);
		height: calc(50% - 20px);
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
