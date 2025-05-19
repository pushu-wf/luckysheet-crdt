/**
 * Ant Form For Login、Register、Forget Hooks
 */

import { reactive, ref, Ref } from "vue";
import { FormInstance } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import VerificationCodeVue from "../components/VerificationCode.vue";

export const useLoginFormHook = () => {
	// 验证码实例对象 - 指向一个页面 vue 组件实例对象
	const verificationCode = ref<InstanceType<typeof VerificationCodeVue>>();

	// 定义表单
	const form = reactive({
		userid: "",
		password: "",
		checkpassword: "",
		code: "",
		read: false,
		remember: false, // 需要配合 jwt 实现过期校验
		email: "", // 通过绑定邮箱实现邮箱验证、找回密码等功能，因此需要一个真实的邮箱地址，但是目前暂不实现
	});

	// 表单的校验规则
	const formRules = reactive({
		// 账号
		userid: [
			{
				required: true,
				message: "账号不能为空",
				trigger: "blur",
			},
		],
		// 密码
		password: [
			{
				required: true,
				message: "密码不能为空",
				trigger: "blur",
			},
		],
		// 确认密码
		checkpassword: [
			{
				required: true,
				trigger: "blur",
				validator: validatorCheckPassword,
			},
		],
		// 阅读协议
		read: [
			{
				required: true,
				validator: () => (form.read ? Promise.resolve() : Promise.reject("请阅读并同意协议")),
			},
		],
		// 邮箱 - 目前不做严格的正则校验哈，大家有兴趣可以自行添加
		email: [
			{
				required: true,
				message: "请输入邮箱",
				trigger: "blur",
			},
		],
		// 验证码
		code: [{ required: true, validator: validatorCode, trigger: "blur" }],
	});

	/** 重置表单 */
	function resetForm(formRef: Ref<FormInstance | undefined>) {
		formRef.value?.resetFields();
	}

	/** 验证表单 - conform 触发 */
	function validateForm(formRef: Ref<FormInstance | undefined>) {
		return new Promise((resolve) => {
			formRef.value
				?.validate()
				.then(() => resolve(true))
				.catch((error) => {
					console.error("Fail to validate:", error.errorFields);
					resolve(false);
				});
		});
	}

	/** 验证码校验规则 */
	function validatorCode(_rule: Rule, value: string) {
		// 拿到 value 验证码后，需要调用组件实例的 checkCode 方法，验证验证码是否正确
		return new Promise((resolve, reject) => {
			if (!verificationCode.value) reject("验证码组件实例不存在");
			else if (!value) reject("验证码不能为空");
			else if (verificationCode.value?.checkCode(value)) resolve;
			else {
				form.code = "";
				reject("验证码错误");
			}
		});
	}

	/** 确认密码校验规则 */
	function validatorCheckPassword(_rule: Rule, value: string) {
		return new Promise((resolve, reject) => {
			if (!value) reject("请确认密码");
			else if (value !== form.password) reject("密码不一致");
			else resolve;
		});
	}

	/** 因为验证码的校验规则需要组件实例对象，而 hooks 内部又无法获取，因此，需要提供方法，供外部传递 */
	function setVarificationCode(instance: InstanceType<typeof VerificationCodeVue> | undefined) {
		if (!instance) return;
		verificationCode.value = instance;
	}

	return {
		form,
		formRules,
		resetForm,
		validateForm,
		setVarificationCode,
	};
};
