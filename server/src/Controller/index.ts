import { initPages } from "./Page/index";
import { uploadImage } from "./Luckysheet/uploadImage";
import { login, register, updateUser } from "./User/idex";
import { loadSheetData } from "./Luckysheet/LoadSheetData";
import { getWorkerBook } from "./Luckysheet/getWorkerBook";
import { createWorkerBook } from "./Luckysheet/createWorkerBook";

// 统一导出控制层对象
export const Controller = {
	initPages,
	uploadImage,
	loadSheetData,
	getWorkerBook,
	register,
	login,
	updateUser,
	createWorkerBook,
};
