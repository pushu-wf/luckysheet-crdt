import { initPages } from "./Page/index";
import { login, register, updateUser } from "./User";
import { getFileList } from "./Luckysheet/getFileList";
import { uploadImage } from "./Luckysheet/uploadImage";
import { loadSheetData } from "./Luckysheet/LoadSheetData";
import { getWorkerBook } from "./Luckysheet/getWorkerBook";
import { createWorkerBook } from "./Luckysheet/createWorkerBook";

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
