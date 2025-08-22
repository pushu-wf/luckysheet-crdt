import { reactive } from "vue";
import { decode, encode } from "../utils";
import { defineStore, StateTree } from "pinia";
import { imageUrlHandle } from "../utils/Luckysheet";

// 定义用户信息完整类型 - 内部使用
type UserInfo = {
	userid: string;
	username: string;
	email: string;
	avatar: string;
};

export const useUserStore = defineStore(
	"userStore",
	() => {
		// 定义基本用户信息状态
		const userInfo = reactive<UserInfo>({
			userid: "",
			username: "",
			email: "",
			avatar: "",
		});

		// 定义获取用户名称 getter
		const getUserName = () => userInfo.username;

		// 定义解析头像方法
		const parseAvatar = () => imageUrlHandle(userInfo.avatar);

		// 定义设置用户信息方法
		function setUserInfo(payload: Partial<UserInfo>) {
			Object.assign(userInfo, payload);
		}

		return { userInfo, getUserName, parseAvatar, setUserInfo };
	},
	{
		persist: {
			key: "pinia_store_userInfo",
			storage: sessionStorage,
			// 自定义序列化方法
			serializer: {
				deserialize: (str: string) => {
					return JSON.parse(decode(decode(str)));
				},
				serialize: (value: StateTree) => {
					return encode(encode(JSON.stringify(value)));
				},
			},
		},
	}
);
