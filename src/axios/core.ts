// 封装用户请求axios
import router from "../router";
import { isDev } from "../utils";
import { message } from "ant-design-vue";
import { localForage } from "../localforage";
import axios, { AxiosRequestConfig } from "axios";

export const fetch = (options: AxiosRequestConfig) => {
	return axios({
		...options,
	});
};

axios.defaults.baseURL = isDev() ? "/api" : "";

// 添加请求拦截器
axios.interceptors.request.use(
	(config) => {
		// 在发送请求之前进行 token 添加
		const token = localForage.getItem("token");
		if (!token) router.push("/login");

		// 不然添加到 heanders 上，请注意：此字段为小写，与服务器保持一致即可
		if (token) config.headers.authorization = token;

		return config;
	},
	(error) => {
		// 对请求错误进行操作
		return Promise.reject(error);
	}
);

// 添加响应拦截器
axios.interceptors.response.use(
	function (res) {
		if (res.status === 401) loginExpired();
		// 解构返回
		return res;
	},
	function (error) {
		if (error.response.status === 401) return loginExpired();
		else message.error(error.response.data.message || "服务器异常");
		// 对响应错误进行操作
		return Promise.reject(error);
	}
);

/**
 * 登录过期
 */
const loginExpired = () => {
	message.error("登录过期，请重新登录");
	localForage.clear();
	router.push("/login");
};
