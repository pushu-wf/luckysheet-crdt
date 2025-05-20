<template>
	<a-form :model="form" ref="formRef" :rules="formRules" style="max-width: 600px">
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
		<a-form-item name="checkpassword">
			<a-input autocomplete="off" placeholder="checkpassword" type="password" v-model:value="form.checkpassword">
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
		<a-form-item name="read">
			<div class="ant-form-item-inline">
				<a-checkbox v-model:checked="form.read" size="large">我已知悉并接受相关</a-checkbox>
				<a-button type="link" @click="emit('openRrivacyModal')" style="padding-left: 0">《隐私政策》</a-button>
				<a-button type="link" style="margin-left: auto" @click="emit('gotoLogin')">前往登录</a-button>
			</div>
		</a-form-item>
		<a-form-item>
			<a-button type="primary" style="width: 100%" @click="registerHandle">注 册</a-button>
		</a-form-item>
	</a-form>
</template>

<script setup lang="ts">
import { md5 } from "../../../utils";
import { onMounted, ref, toRaw } from "vue";
import { API_register } from "../../../axios";
import { FormInstance, message, theme } from "ant-design-vue";
import { useLoginFormHook } from "../../../hooks/login-form"; // 引入 login form hooks
import VerificationCodeVue from "../../../components/VerificationCode.vue";
import { UserOutlined, LockOutlined, CreditCardOutlined } from "@ant-design/icons-vue";

// 引用主题
const { token } = theme.useToken();

const emit = defineEmits(["gotoLogin", "openRrivacyModal"]);

// 解构 register form hooks
const { form, formRules, resetForm, validateForm, setVarificationCode } = useLoginFormHook();

// 表单 dom ref
const formRef = ref<FormInstance>();

// 验证码 dom ref
const verificationCode = ref<InstanceType<typeof VerificationCodeVue>>();

/** 注册逻辑 */
async function registerHandle() {
	try {
		const validata = await validateForm(formRef);
		if (!validata) return;

		const { userid, password } = toRaw(form);
		// 执行注册操作
		const { data } = await API_register({ userid, password: md5(password) });
		if (data.code !== 200) {
			message.error(data.message);
			// 重置表单
			resetForm(formRef);
			return;
		}
		message.success("注册成功");
		// 不然跳转到登录页
		emit("gotoLogin");
	} catch (error) {}
}

// 请一定记住要初始化验证码实例对象，否则会报错
onMounted(() => (resetForm(formRef), setVarificationCode(verificationCode.value)));

// 向外暴露方法 - 设置隐私协议
defineExpose({ togglePrivacy: (isAgree: boolean) => (form.read = isAgree) });
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
