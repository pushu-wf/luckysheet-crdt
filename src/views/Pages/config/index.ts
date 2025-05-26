/**
 * 定义校验密码的规则，用于修改密码弹窗表单校验
 */

import { reactive, Ref } from "vue";
import { FormInstance } from "ant-design-vue";
import { API_verifyPassword } from "../../../axios";
import { Rule } from "ant-design-vue/es/form/interface";
import { checkPasswordStrength, md5 } from "../../../utils";

export const updatePasswordHook = () => {
	const passwordForm = reactive({ password: "", newPassword: "", checkNewPassword: "" });

	// 定义密码校验规则
	const passwordRules = {
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

	// 重置表单
	function resetForm(formRef: Ref<FormInstance | undefined>) {
		formRef.value?.resetFields();
	}

	// 表单校验
	function validateForm(formRef: Ref<FormInstance | undefined>) {
		return new Promise<boolean>((resolve, reject) => {
			formRef.value
				?.validate()
				.then(() => resolve(true))
				.catch((err) => reject(err));
		});
	}

	/** 确认密码校验规则 */
	function validatorCheckPassword(_rule: Rule, value: string) {
		return new Promise((resolve, reject) => {
			if (!value) reject("请确认密码");
			else if (value !== passwordForm.newPassword) reject("密码不一致");
			else resolve("密码验证通过");
		});
	}

	return { passwordForm, resetForm, validateForm, passwordRules };
};
