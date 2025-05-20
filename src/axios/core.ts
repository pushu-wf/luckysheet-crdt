// 封装用户请求axios
import axios, { AxiosRequestConfig } from "axios";
import { isDev } from "../utils";
import { localForage } from "../localforage";
import router from "../router";

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
		// 解构返回
		return res;
	},
	function (error) {
		// 对响应错误进行操作
		return Promise.reject(error);
	}
);
