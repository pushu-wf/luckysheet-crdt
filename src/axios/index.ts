import { fetch } from "./core";

// 导出初始化工作簿 API
export const API_getWorkerBook = (gridKey: string) => {
	return fetch({
		url: "/luckysheet/getWorkerBook",
		method: "post",
		data: { gridKey },
	});
};

// 导出图片上传API
export const API_uploadImage = (data: FormData) => {
	return fetch({
		url: "/luckysheet/uploadImage",
		method: "POST",
		data,
	});
};

// 用户登录
export const API_login = (data: { userid: string; password: string }) => {
	return fetch({
		url: "/user/login",
		method: "POST",
		data,
	});
};

// 用户注册
export const API_register = (data: { userid: string; password: string }) => {
	return fetch({
		url: "/user/register",
		method: "POST",
		data,
	});
};

// 创建工作簿
export const API_createWorkerBook = (bookname: string) => {
	return fetch({
		url: "/luckysheet/createWorkerBook",
		method: "POST",
		data: { bookname },
	});
};

// 查询文件列表
export const API_getFileList = (data: { current: number; pageSize: number; filterType: string }) => {
	return fetch({
		url: "/luckysheet/getFileList",
		method: "POST",
		data,
	});
};
