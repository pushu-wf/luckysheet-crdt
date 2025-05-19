<template>
	<a-form :model="form" ref="formRef" :rules="formRules">
		<a-form-item name="userid">
			<a-input autocomplete="off" placeholder="userid" v-model:value="form.userid">
				<template #prefix>
					<UserOutlined />
				</template>
			</a-input>
		</a-form-item>
		<a-form-item name="password">
			<a-input autocomplete="off" placeholder="password" type="password" v-model:value="form.password">
				<template #prefix>
					<LockOutlined />
				</template>
			</a-input>
		</a-form-item>
		<a-form-item name="code">
			<a-input autocomplete="off" placeholder="code" v-model:value="form.code">
				<template #prefix>
					<CreditCardOutlined />
				</template>
			</a-input>
			<!-- 验证码 -->
			<VerificationCodeVue ref="verificationCode" class="canvas-code" :width="120" :height="40" />
		</a-form-item>
		<a-form-item>
			<div class="ant-form-item-inline">
				<a-checkbox v-model:checked="form.remember" size="large">记住密码</a-checkbox>
				<a-tooltip>
					<template #title>七天内免输入密码可登录系统</template>
					<QuestionCircleOutlined />
				</a-tooltip>

				<span class="ant-link" type="info" @click="emit('gotoRegister')">前往注册</span>
				<span class="ant-link" type="primary" @click="emit('forgetPassword')">忘记密码</span>
			</div>
		</a-form-item>
		<a-form-item>
			<a-button type="primary" style="width: 100%" @click="login">登 录</a-button>
		</a-form-item>
	</a-form>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { FormInstance } from "ant-design-vue";
import { useLoginFormHook } from "../../../hooks/login-form";
import VerificationCodeVue from "../../../components/VerificationCode.vue";
import { QuestionCircleOutlined, UserOutlined, LockOutlined, CreditCardOutlined } from "@ant-design/icons-vue";

const { form, formRules, resetForm, validateForm, setVarificationCode } = useLoginFormHook();

const emit = defineEmits(["gotoRegister", "forgetPassword"]);

// 表单 dom ref 做表单校验
const formRef = ref<FormInstance>();

// 验证码 dom ref
const verificationCode = ref<InstanceType<typeof VerificationCodeVue>>();

/**
 * 登录逻辑
 * @param formEl 表单实例 - 通过表单示例实现表单校验
 */
async function login() {
	try {
		const validata = await validateForm(formRef);
		console.log("==> validata", validata);
	} catch (error) {
		console.error(error);
	}
}

onMounted(() => {
	resetForm(formRef);
	// 请一定记住要初始化验证码实例对象，否则会报错
	setVarificationCode(verificationCode.value);
});
</script>

<style lang="less" scoped>
@import url("../style/common.less");
</style>
