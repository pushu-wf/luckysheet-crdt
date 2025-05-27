import { initPages } from "./Page/index";
import { uploadImage } from "./Luckysheet/uploadImage";
import { loadSheetData } from "./Luckysheet/LoadSheetData";
import { login, register, updateUser, verifyPassword, uploadAvatar } from "./User";
import { getInviteInfo, setFavor, acceptInvite, checkSheetEditPermission } from "./FileMap";
import { createWorkerBook, getFileList, getWorkerBook, deleteFile, renameFile, importFile } from "./WorkerBooks";

// 统一导出控制层对象
export const Controller = {
	login,
	setFavor,
	register,
	initPages,
	updateUser,
	deleteFile,
	importFile,
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
	checkSheetEditPermission,
};
