/**
 * 定义校验密码的规则，用于修改密码弹窗表单校验
 */

import { reactive, ref, Ref, toRaw } from "vue";
import { localForage } from "../../../localforage";
import { FormInstance, message } from "ant-design-vue";
import { Rule } from "ant-design-vue/es/form/interface";
import { checkPasswordStrength, getUserInfo, md5 } from "../../../utils";
import { API_updateUser, API_uploadAvatar, API_verifyPassword } from "../../../axios";

type Emit = (event: "updateUserName" | "updateAvatar", ...args: unknown[]) => void;

/**
 * @description 导出用户信息 modal 相关 hooks
 */
export const useUserInfoHook = () => {
	// 个人信息modal
	const userInfoModalVisible = ref(false);

	// 定义静态页面 UserName
	const USERNAME = ref(getUserInfo().username);
	// 定义静态头像
	const AVATAR = ref(getUserInfo().avatar);

	// 用户信息表单
	const userInfoForm = reactive({ ...getUserInfo() });

	// 重置表单
	function resetUserInfoForm() {
		// 重新获取数据，不然存在脏数据异常
		const userInfo = getUserInfo();
		Object.keys(userInfoForm).forEach((key) => {
			userInfoForm[key] = userInfo[key];
		});
	}

	// 更新用户信息 这个函数内，仅处理 username email
	async function updateUserInfo(emit: Emit) {
		const { username, email } = toRaw(userInfoForm);
		// 如果没有变化则不需要请求
		const userInfo = getUserInfo();
		if (username === userInfo.username && email === userInfo.email) return;

		try {
			const { data } = await API_updateUser({ username, email });

			if (data.code === 200) {
				const newUserInfo = Object.assign({}, userInfo, { username, email });
				// 更新页面
				USERNAME.value = username;
				// 更新存储
				localForage.setItem("userInfo", newUserInfo);
				message.success("更新成功");

				// 更新用户名称后，可能会引起sheet list 文件拥有者变更，因此，需要重新获取文件列表
				if (username === userInfo.username) return; // 避免重复更新

				emit("updateUserName");
			}
		} catch (error) {
			console.error(error);
		}
	}

	return {
		userInfoModalVisible,
		USERNAME,
		userInfoForm,
		resetUserInfoForm,
		updateUserInfo,
		AVATAR,
	};
};

/**
 * @description 导出修改密码 hooks
 */
export const usePasswordHook = () => {
	// 定义修改密码 模态框状态
	const passwordModalVisible = ref(false);

	// 修改密码表单
	const passwordFormRef = ref();

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

	// 修改密码
	async function updatePassword(formRef: Ref<FormInstance | undefined>) {
		try {
			const validata = await validateForm(formRef);
			if (!validata) return;

			const { newPassword } = toRaw(passwordForm);

			const { data } = await API_updateUser({ password: md5(newPassword) });
			if (data.code === 200) {
				message.success("密码修改成功");
				// 关闭弹窗
				passwordModalVisible.value = false;
			}
		} catch (error) {
			console.error(error);
		}
	}

	return { passwordForm, resetForm, validateForm, passwordRules, passwordModalVisible, updatePassword, passwordFormRef };
};

/**
 * @description 导出头像上传相关 hooks
 */
export const useAvatarHook = () => {
	// 模态框状态
	const avatarModalVisible = ref(false);

	// 上传的图片 这个用于预览的
	const avatarPreview = ref("");

	// 图片列表
	const uploadList = reactive<File[]>([]);

	/**
	 * @description 文件上传前 类型及大小校验
	 */
	function beforeUpload(file: File) {
		uploadList.length = 0; // 清空上传列表
		avatarPreview.value = "";

		const checkImageType = file.type === "image/jpeg" || file.type === "image/png";
		if (!checkImageType) {
			message.error("You can only upload JPG file!");
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error("Image must smaller than 2MB!");
		}

		if (checkImageType && isLt2M) {
			// 将图片资源添加到 uploadList 中
			uploadList.push(file);

			// 处理 avatarPreview
			avatarPreview.value = URL.createObjectURL(file);
		}

		return false; // beforeUpload 返回 false 后，手动上传文件。
	}

	/** 手动上传头像 */
	async function handleUpload(emit: Emit) {
		if (!uploadList.length) return;
		// 将头像上传到服务器
		const formData = new FormData();
		formData.append("userAvatar", uploadList[0]);

		try {
			const { data } = await API_uploadAvatar(formData);
			if (data.code === 200) {
				message.success("上传成功");
				// 更新用户信息
				const userInfo = getUserInfo();
				const newUserInfo = { ...userInfo, avatar: data.avatar };
				localForage.setItem("userInfo", newUserInfo);
				// 关闭modal
				avatarModalVisible.value = false;
				// 触发事件更新头像
				emit("updateAvatar");
			}
		} catch (error) {
			console.error(error);
		}
	}

	return { beforeUpload, handleUpload, avatarModalVisible, avatarPreview, uploadList };
};
