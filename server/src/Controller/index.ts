import { initPages } from "./Page/index";
import { uploadImage } from "./Luckysheet/uploadImage";
import { loadSheetData } from "./Luckysheet/LoadSheetData";
import { getInviteInfo, setFavor, acceptInvite } from "./FileMap";
import { login, register, updateUser, verifyPassword, uploadAvatar } from "./User";
import { createWorkerBook, getFileList, getWorkerBook, deleteFile, renameFile } from "./WorkerBooks";

// 统一导出控制层对象
export const Controller = {
	login,
	setFavor,
	register,
	initPages,
	updateUser,
	deleteFile,
	renameFile,
	getFileList,
	uploadImage,
	uploadAvatar,
	acceptInvite,
	loadSheetData,
	getInviteInfo,
	getWorkerBook,
	verifyPassword,
	createWorkerBook,
};
