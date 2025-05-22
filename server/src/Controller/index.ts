import { initPages } from "./Page/index";
import { login, register, updateUser } from "./User";
import { uploadImage } from "./Luckysheet/uploadImage";
import { loadSheetData } from "./Luckysheet/LoadSheetData";
import { createWorkerBook, getFileList, getWorkerBook } from "./WorkerBooks";

// 统一导出控制层对象
export const Controller = {
	login,
	register,
	initPages,
	updateUser,
	getFileList,
	uploadImage,
	loadSheetData,
	getWorkerBook,
	createWorkerBook,
};
