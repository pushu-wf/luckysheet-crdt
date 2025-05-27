import { Request, Response } from "express";
import { UserService } from "../../Service/User";
import { getUseridFromToken, md5 } from "../../Utils";
import { FileMapService } from "../../Service/FileMap";
import { WorkerBookService } from "../../Service/WorkerBook";
import { WorkerSheetService } from "../../Service/WorkerSheet";
import { FileImportMulter } from "../../Config";

/**
 * @description 创建工作簿
 * @param { bookname: string  } bookname 工作簿名称
 */
async function createWorkerBook(req: Request, res: Response) {
	const { bookname } = req.body;

	if (!bookname) {
		res.status(400).json({ code: 400, message: "bookname 参数缺失" });
		return;
	}

	const userid = getUseridFromToken(req);
	if (!userid) {
		res.status(400).json({ code: 400, message: "Invalid token" });
		return;
	}

	// 创建一个 gridKey
	const gridKey = md5(Math.random().toString().split(".")[1]);

	// 不然创建新的 worker books
	const book = await WorkerBookService.create({
		gridKey,
		title: bookname,
		lang: "zh",
	});

	// 创建完工作簿后，需要创建一条文件映射表记录 owner = true
	// 请求 user_uuid 作为外键
	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.status(400).json({ code: 400, message: "用户不存在" });
		return;
	}

	// 需要关联文件映射表 filemap
	const filemap = await FileMapService.createFileMap({
		owner: user_uuid,
		operator: user_uuid,
		gridKey,
	});

	if (!filemap) {
		res.status(500).json({ code: 500, message: "创建文件映射表失败" }); // 内部错误
		return;
	}

	res.json({ code: 200, data: { ...book, filemap }, message: "创建文件成功" });
}

/**
 * @description 获取工作簿信息 - 用于加载 luckysheet 时，请求 title lang 等信息，通过 gridkey 获取
 * @param { gridKey: string } gridKey 工作簿的 gridKey
 */
async function getWorkerBook(req: Request, res: Response) {
	const { gridKey } = req.body;

	if (!gridKey) {
		res.status(400).json({ code: 400, message: "gridKey 参数缺失" }); // 客户端异常
		return;
	}

	// 根据 gridKey 请求 workerbooks 数据
	const book = await WorkerBookService.findOne(gridKey, {
		attributes: ["gridKey", "title", "lang"],
	});

	res.json({ code: 200, message: "获取工作簿信息成功", data: book });
}

/**
 * @description 获取文件列表
 */
async function getFileList(req: Request, res: Response) {
	const { filterType = "all", current = 1, pageSize = 5 } = req.body;

	if (!current || !pageSize) {
		res.status(400).json({ code: 400, message: "current, pageSize 参数缺失" });
		return;
	}

	const userid = getUseridFromToken(req);
	if (!userid) {
		res.status(400).json({ code: 400, message: "Invalid token" });
		return;
	}

	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.status(400).json({ code: 400, message: "用户不存在" });
		return;
	}
	const limit = pageSize;
	const offset = (current - 1) * pageSize;

	const data = await FileMapService.getFileList(user_uuid, filterType, limit, offset);

	res.json({ code: 200, message: "获取文件列表成功", data });
}

/**
 * 删除文件 deleteFile
 */
async function deleteFile(req: Request, res: Response) {
	// 需要几个东西实现删除 filemapid 删除映射表 gridkey 删除文件 --> worker_sheet_id 删除相应的 sheet 记录（celldata、chart、image ....）
	const { filemapid, gridKey } = req.body;
	if (!filemapid || !gridKey) {
		res.status(400).json({ code: 400, message: "filemapid | gridKey 参数缺失" });
		return;
	}

	// 获取用户ID
	const userid = getUseridFromToken(req);
	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.status(400).json({ code: 400, message: "用户不存在" });
		return;
	}

	// 获取当前记录的信息
	const filemap = await FileMapService.hasFileMap(gridKey, user_uuid);
	if (!filemap) {
		res.status(400).json({ code: 400, message: "未查询到相关记录" });
		return;
	}

	// 删除文件映射记录
	await FileMapService.deleteFileMap(filemapid);

	// 判断该文件所有者是否当前操作人，如果不是，是不能删除文件实际内容的，只能删除映射表记录
	if (filemap.owner !== user_uuid) {
		res.status(200).json({ code: 200, message: "已删除相关记录，但您无权限删除该文件" });
		return;
	}

	// 删除 worker book 之前，需要查询关联的 worker sheet，
	const workerSheet = await WorkerSheetService.findWorkerSheetByGridKey(gridKey);
	const worker_sheet_id = workerSheet?.worker_sheet_id;
	if (!worker_sheet_id) {
		res.status(400).json({ code: 400, message: "未查询到 Worker Book 相关记录" });
		return;
	}

	// 查到 worker sheet 后，要先删除关联的所有数据
	await WorkerSheetService.deleteAllDataByWorkerSheetId(worker_sheet_id);

	// 然后删除 worker Sheet 记录
	await WorkerSheetService.deleteSheet(gridKey);

	// 最后删除 workerBooks
	await WorkerBookService.deleteWorkerBook(gridKey);

	res.status(200).json({ code: 200, message: "删除成功" });
}

/**
 * 文件重命名
 */
async function renameFile(req: Request, res: Response) {
	const { title, gridKey } = req.body;
	if (!gridKey || !title) {
		res.status(400).json({ code: 400, message: "gridKey | title 缺失" });
		return;
	}

	await WorkerBookService.update({ gridKey, title });

	res.status(200).json({ code: 200, message: "重命名成功" });
}

// 文件导入实现
async function importFile(req: Request, res: Response) {
	// 这里是通过 FormData 实现文件上传的，先解析文件
	FileImportMulter(req, res, async () => {
		const { file } = req;

		// 如果没有解析到 file 对象，则直接返回 400
		if (!file) {
			res.status(400).json({ code: 400, message: "请选择文件" });
			return;
		}

		// 获取原始文件名
		const { originalname } = <Express.Multer.File>file;
		if (!originalname) {
			res.status(500).json({ code: 500, message: "文件名解析失败" });
			return;
		}

		// 这里并不是真实的保存文件到服务端，而是借助 multer 能力实现文件识别，因此此处并不配置 dest

		// 获取当前用户操作 userid
		const userid = getUseridFromToken(req);
		if (!userid) {
			res.status(400).json({ code: 400, message: "Invalid token" });
			return;
		}

		// 解析 user_uuid
		const user_uuid = await UserService.getUserUUID(userid);
		if (!user_uuid) {
			res.status(400).json({ code: 400, message: "用户不存在" });
			return;
		}

		// Step 1 新增 FileMap 记录 - 依赖 gridKey

		// Step 2 新增 WorkerBooks 记录 - 使用 gridKey

		// Step 3 根据解析的文件格式，新增 workerSheet - 依赖 worker_book_id

		// Step 4 根据 sheet 创建 celldata merge 等其他记录 - 依赖 worker_sheet_id

		res.json({ code: 200, message: "Success to upload." });
	});
}

export { createWorkerBook, getWorkerBook, getFileList, deleteFile, renameFile, importFile };
