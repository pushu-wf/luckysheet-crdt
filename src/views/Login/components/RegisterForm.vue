<template>
	<a-form :model="form" ref="formRef" :rules="formRules" style="max-width: 600px">
		<a-form-item name="userid">
			<a-input autocomplete="off" :placeholder="locale.login.form.userid" v-model:value="form.userid">
				<template #prefix>
					<UserOutlined />
				</template>
			</a-input>
		</a-form-item>
		<a-form-item name="password">
			<a-input autocomplete="off" :placeholder="locale.login.form.password" type="password" v-model:value="form.password">
				<template #prefix>
					<LockOutlined />
				</template>
			</a-input>
		</a-form-item>
		<a-form-item name="checkpassword">
			<a-input autocomplete="off" :placeholder="locale.login.form.checkpassword" type="password" v-model:value="form.checkpassword">
				<template #prefix>
					<LockOutlined />
				</template>
			</a-input>
		</a-form-item>
		<a-form-item name="code">
			<a-input autocomplete="off" :placeholder="locale.login.form.code" v-model:value="form.code">
				<template #prefix>
					<CreditCardOutlined />
				</template>
			</a-input>
			<!-- 验证码 -->
			<VerificationCodeVue ref="verificationCode" class="canvas-code" :width="120" :height="40" />
		</a-form-item>
		<a-form-item name="read">
			<div class="ant-form-item-inline">
				<a-checkbox v-model:checked="form.read" size="large">{{ locale.login.form.read }}</a-checkbox>
				<span class="ant-link" type="primary" @click="readPrivacyPolicy" style="margin-left: 0">{{ locale.login.form.protocol }}</span>
				<span class="ant-link" type="info" style="margin-left: auto" @click="emit('gotoLogin')">{{ locale.login.form.gotoLogin }}</span>
			</div>
		</a-form-item>
		<a-form-item>
			<a-button type="primary" style="width: 100%" @click="register">{{ locale.login.form.register }}</a-button>
		</a-form-item>
	</a-form>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { FormInstance } from 'ant-design-vue';
import { useLocaleHook } from '../../../hooks/locale'; // 引入 locale hooks
import { useLoginFormHook } from '../../../hooks/login-form'; // 引入 login form hooks
import VerificationCodeVue from '../../../components/VerificationCode.vue';
import { UserOutlined, LockOutlined, CreditCardOutlined } from '@ant-design/icons-vue';

const { form, formRules, resetForm, validateForm, setVarificationCode } = useLoginFormHook();

const { locale }= useLocaleHook();

const emit = defineEmits(['gotoLogin']);

// 表单 dom ref
const formRef = ref<FormInstance>();

// 验证码 dom ref
const verificationCode = ref<InstanceType<typeof VerificationCodeVue>>();

/** 注册逻辑 */
async function register() {
	const validata = await validateForm(formRef);
	console.log('==> validata', validata);
}

onMounted(() => {
	resetForm(formRef);
	// 请一定记住要初始化验证码实例对象，否则会报错
	setVarificationCode(verificationCode.value);
});

/** 阅读隐私政策 */
function readPrivacyPolicy() {}
</script>

<style lang="less" scoped>
@import url('../style/common.less');
</style>
