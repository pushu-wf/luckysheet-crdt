/**
 * 定义校验密码的规则，用于修改密码弹窗表单校验
 */

import { reactive, ref, Ref, toRaw } from "vue";
import { useUserStore } from "../../../store/User";
import { FormInstance, message } from "ant-design-vue";
import { Rule } from "ant-design-vue/es/form/interface";
import { checkPasswordStrength, md5 } from "../../../utils";
import { API_updateUser, API_uploadAvatar, API_verifyPassword } from "../../../axios";
import AvatarClipper from "avatar-clipper";

/**
 * @description 导出用户信息 modal 相关 hooks
 */
export const useUserInfoHook = () => {
	const userStore = useUserStore();

	// 个人信息modal
	const userInfoModalVisible = ref(false);

	// 定义页面静态用户名
	const USERNAME = ref(userStore.getUserName());

	// 用户信息表单
	const userInfoForm = reactive(JSON.parse(JSON.stringify(userStore.userInfo)));

	// 重置表单
	function resetUserInfoForm() {
		// 重新获取数据，不然存在脏数据异常
		const userInfo = userStore.userInfo;
		userInfoForm.username = userInfo.username;
		userInfoForm.email = userInfo.email;
	}

	// 更新用户信息 这个函数内，仅处理 username email
	async function updateUserInfo() {
		const { username, email } = toRaw(userInfoForm);
		// 如果没有变化则不需要请求
		if (username === userStore.userInfo.username && email === userStore.userInfo.email) return;

		try {
			const { data } = await API_updateUser({ username, email });

			if (data.code === 200) {
				USERNAME.value = username;
				// 更新存储
				userStore.setUserInfo({ username, email });
				message.success("更新成功");
			}
		} catch (error) {
			console.error(error);
		}
	}

	return {
		USERNAME,
		userInfoForm,
		userInfoModalVisible,
		resetUserInfoForm,
		updateUserInfo,
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
	const userStore = useUserStore();

	// 定义图片上传相关参数
	const clipper = ref<AvatarClipper>();

	// 模态框状态
	const avatarModalVisible = ref(false);

	// 上传的图片 这个用于预览的
	const avatarPreview = ref("");

	/**
	 * @description 初始化 AvatarClipper
	 */
	function initAvatarClipper() {
		clipper.value = new AvatarClipper({ container: "#clipper-container" });
		clipper.value.event.on("preview", (result) => (avatarPreview.value = result));
	}

	/**
	 * @description 上传图片
	 */
	function uploadImage() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = () => {
			const file = input.files?.[0];
			if (file) clipper.value?.command.setImage(file);
		};
		input.click();
	}

	/**
	 * @description 文件上传前 类型及大小校验
	 */
	function beforeUpload(file: File) {
		avatarPreview.value = "";

		const checkImageType = file.type === "image/jpeg" || file.type === "image/png";
		if (!checkImageType) {
			message.error("You can only upload JPG file!");
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error("Image must smaller than 2MB!");
		}
	}

	/**
	 * @description 确认上传文件
	 */
	async function confirmUpload() {
		const imageBlob = <Blob>clipper.value?.command.getResult("blob");
		// 将头像上传到服务器
		const formData = new FormData();
		formData.append("userAvatar", imageBlob);

		try {
			const { data } = await API_uploadAvatar(formData);
			if (data.code === 200) {
				message.success("上传成功");
				// 更新用户信息
				userStore.setUserInfo({ avatar: data.avatar });
				// 关闭modal
				avatarModalVisible.value = false;
			}
		} catch (error) {
			console.error(error);
		}
	}

	return { beforeUpload, avatarModalVisible, avatarPreview, clipper, initAvatarClipper, confirmUpload, uploadImage };
};

/**
 * @description 导出简单 全部|我的|共享|收藏 按钮组 hooks
 */
export const useBtnGroupHook = () => {
	// 定义按钮组列表
	const filterTypes = [
		{ name: "全部", value: "all" },
		{ name: "我的", value: "mine" },
		{ name: "共享", value: "share" },
		{ name: "收藏", value: "favor" },
	];
	const filterType = ref("all");

	return { filterTypes, filterType };
};
