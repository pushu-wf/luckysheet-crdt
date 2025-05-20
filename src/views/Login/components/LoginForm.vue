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

				<a-button type="link" @click="emit('gotoRegister')" style="margin-left: auto">前往注册</a-button>
			</div>
		</a-form-item>
		<a-form-item>
			<a-button type="primary" style="width: 100%" @click="loginHandle">登 录</a-button>
		</a-form-item>
	</a-form>
</template>

<script setup lang="ts">
import { md5 } from "../../../utils";
import router from "../../../router";
import { API_login } from "../../../axios";
import { onMounted, ref, toRaw } from "vue";
import { localForage } from "../../../localforage";
import { FormInstance, message, theme } from "ant-design-vue";
import { useLoginFormHook } from "../../../hooks/login-form";
import VerificationCodeVue from "../../../components/VerificationCode.vue";
import { QuestionCircleOutlined, UserOutlined, LockOutlined, CreditCardOutlined } from "@ant-design/icons-vue";

// 使用 theme token 实现主题色
const { token } = theme.useToken();

const emit = defineEmits(["gotoRegister", "forgetPassword"]);

// 结构登陆表单 hooks
const { form, formRules, resetForm, validateForm, setVarificationCode } = useLoginFormHook();

// 表单 dom ref 做表单校验
const formRef = ref<FormInstance>();

// 验证码 dom ref
const verificationCode = ref<InstanceType<typeof VerificationCodeVue>>();

/** 登录逻辑 */
async function loginHandle() {
	try {
		const validata = await validateForm(formRef);
		if (!validata) return;

		// 验证通过后，进行登录操作
		const { userid, password } = toRaw(form);
		const { data } = await API_login({ userid, password: md5(password) });
		if (data.code !== 200) {
			message.error(data.message);
			// 重置表单
			resetForm(formRef);
			return;
		}

		// 不然存储 token  到 localStorage
		localForage.setItem("token", data.token);

		message.success("登录成功");
		console.log(" ==> ", router);
		// 跳转到首页
		router.push("/home");
	} catch (error) {
		console.error(error);
	}
}

// 请一定记住要初始化验证码实例对象，否则会报错
onMounted(() => (resetForm(formRef), setVarificationCode(verificationCode.value)));
</script>

<style lang="less" scoped>
@import url("../style/common.less");
.ant-form {
	// 输入框前缀图标
	.ant-input-affix-wrapper .ant-input-prefix .anticon {
		color: v-bind("token.colorTextQuaternary");
	}
	.ant-checkbox-wrapper,
	.anticon.anticon-question-circle {
		color: v-bind("token.colorText");
	}
}
</style>
