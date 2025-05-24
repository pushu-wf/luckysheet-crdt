import { initPages } from "./Page/index";
import { login, register, updateUser } from "./User";
import { uploadImage } from "./Luckysheet/uploadImage";
import { loadSheetData } from "./Luckysheet/LoadSheetData";
import { getInviteInfo, setFavor, acceptInvite } from "./FileMap";
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
	acceptInvite,
	loadSheetData,
	getInviteInfo,
	getWorkerBook,
	createWorkerBook,
};
