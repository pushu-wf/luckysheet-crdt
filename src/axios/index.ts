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
export const API_queryFileList = (data: { current: number; pageSize: number; filterType: string }) => {
	return fetch({
		url: "/luckysheet/getFileList",
		method: "POST",
		data,
	});
};

// 切换收藏状态
export const API_toggleFavor = (data: { favor: boolean; filemapid: string }) => {
	return fetch({
		url: "/filemap/setFavor",
		method: "POST",
		data,
	});
};

// 删除表格
export const API_deleteFile = (data: { filemapid: string; gridKey: string }) => {
	return fetch({
		url: "/luckysheet/deleteFile",
		method: "POST",
		data,
	});
};

// 文件重命名
export const API_renameFile = (data: { gridKey: string; newName: string }) => {
	return fetch({
		url: "/luckysheet/renameFile",
		method: "POST",
		data: { gridKey: data.gridKey, title: data.newName },
	});
};

// 获取邀请信息
export const API_getInviteInfo = (filemapid: string) => {
	return fetch({
		url: "/filemap/getInviteInfo",
		method: "POST",
		data: { filemapid },
	});
};

// 同意邀请
export const API_acceptInvite = (data: { gridKey: string; owner: string }) => {
	return fetch({
		url: "/filemap/acceptInvite",
		method: "POST",
		data,
	});
};

// 验证密码是否正确 - 用于修改密码处验证旧密码
export const API_verifyPassword = (password: string) => {
	return fetch({
		url: "/user/verifyPassword",
		method: "POST",
		data: { password },
	});
};
