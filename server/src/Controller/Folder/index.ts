/** 文件夹相关控制层 */
import { Request, Response } from "express";
import { UserService } from "../../Service/User";
import { getUseridFromToken } from "../../Utils";
import { FolderService } from "../../Service/Folder";
import { FileMapService } from "../../Service/FileMap";
import { WorkerBookService } from "../../Service/WorkerBook";
import { FolderListResult } from "../../Interface/FIleResult";
import { WorkerSheetService } from "../../Service/WorkerSheet";

/**
 * @description 创建文件夹
 */
async function createFolder(req: Request, res: Response) {
	const { foldername, parentid } = req.body;
	if (!foldername) {
		res.status(400).json({ code: 400, message: "foldername 缺失" });
		return;
	}

	// 不然获取 userid
	const userid = getUseridFromToken(req);
	if (!userid) {
		res.status(400).json({ code: 400, message: "userid 缺失" });
		return;
	}

	// 获取 user_uuid
	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.status(400).json({ code: 400, message: "用户查询失败" });
		return;
	}

	// 执行创建操作
	const folder = await FolderService.createFolder({ foldername, parentid, owner: user_uuid });
	if (folder) {
		res.status(200).json({ code: 200, message: "创建成功" });
	} else {
		res.status(500).json({ code: 500, message: "创建失败" });
	}
}

/**
 * @description 更新文件夹 - 更新文件夹名称、位置
 */
async function updateFolder(req: Request, res: Response) {
	const { folderid, foldername } = req.body;

	if (!folderid) {
		res.status(400).json({ code: 400, message: "folderid 缺失" });
		return;
	}

	const userid = getUseridFromToken(req);
	if (!userid) {
		res.status(400).json({ code: 400, message: "userid 缺失" });
		return;
	}

	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.status(400).json({ code: 400, message: "用户查询失败" });
		return;
	}

	// 不然更新文件名称
	if (foldername) {
		await FolderService.updateFolder({ folderid, owner: user_uuid, foldername });
	}

	res.status(200).json({ code: 200, message: "更新成功" });
}

/**
 * @description 删除文件夹
 */
async function deleteFolder(req: Request, res: Response) {
	const { folderid } = req.body;
	if (!folderid) {
		res.status(400).json({ code: 400, message: "folderid 缺失" });
		return;
	}

	const userid = getUseridFromToken(req);
	if (!userid) {
		res.status(400).json({ code: 400, message: "userid 缺失" });
		return;
	}

	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.status(400).json({ code: 400, message: "用户查询失败" });
		return;
	}

	// 递归实现删除
	await getFolderListByFolderId(folderid!, user_uuid);

	res.json({ code: 200, message: "删除成功" });
}

/**
 * @description 获取文件夹列表
 */
async function getFolderList(req: Request, res: Response) {
	const { folderid } = req.body;

	const userid = getUseridFromToken(req);
	if (!userid) {
		res.status(400).json({ code: 400, message: "userid 缺失" });
		return;
	}

	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.status(400).json({ code: 400, message: "用户查询失败" });
		return;
	}

	/**
	 * 1. 如果用户没有传递 folderid 则认为处于根目录下查询，那么需要返回 folderModel parentid = null 并且 filemapModel folderid = null 的数据
	 * 2. 如果用户传递了 folderid 则认为用户进入子目录，那么需要返回 folderModel parentid = folderid 、filemapModel folderid = folderid 的数据
	 *  这里返回的数据，应该始终包含着 folder 及 file 两个数据
	 */

	const folderList = await FolderService.findAllFolderByParentId(folderid || null, user_uuid);

	// 获取当前文件夹下的所有文件
	const fileList = await FolderService.findAllFileByFolderId(folderid || null, user_uuid);

	const data: FolderListResult[] = [];
	// 处理文件夹 - service 中已经解析过对象，此处直接 push 即可
	folderList?.forEach((item) => data.push({ ...item, type: "folder" }));
	// 处理文件 - 同上
	fileList?.forEach((item) => data.push({ ...item, type: "file" }));

	res.json({ code: 200, data });
}

// 工具函数 - 递归实现删除文件夹及内部文件
async function getFolderListByFolderId(folderid: string | undefined, user_uuid: string) {
	if (!folderid) return;

	// 查找该文件夹是否有子文件夹
	const subFolderList = await FolderService.findAllFolderByParentId(folderid, user_uuid);

	// 递归查询子文件夹(不能将删除放在前面，后续有依赖的子文件夹，会报错)
	if (subFolderList && subFolderList.length) {
		for (let i = 0; i < subFolderList.length; i++) {
			await getFolderListByFolderId(subFolderList[i].folderid, user_uuid);
		}
	} else {
		// 获取当前需要删除的文件映射记录 ，当前文件夹下可能有多个文件
		const filemapList = await FileMapService.getFileMapByFolderId(folderid, user_uuid);

		if (filemapList && filemapList.length) {
			for (let i = 0; i < filemapList.length; i++) {
				const item = filemapList[i];
				// 删除文件映射记录
				await FileMapService.deleteFileMap(item.file_map_id!);

				// 判断该文件所有者是否当前操作人，如果不是，是不能删除文件实际内容的，只能删除映射表记录
				if (item.owner !== user_uuid) continue;

				// 删除 worker book 之前，需要查询关联的 worker sheet，
				const workerSheet = await WorkerSheetService.findWorkerSheetByGridKey(item.gridKey);
				const worker_sheet_id = workerSheet?.worker_sheet_id;
				if (worker_sheet_id) {
					// 查到 worker sheet 后，要先删除关联的所有数据
					await WorkerSheetService.deleteAllDataByWorkerSheetId(worker_sheet_id);

					// 然后删除 worker Sheet 记录
					await WorkerSheetService.deleteSheet(item.gridKey);

					// 最后删除 workerBooks
					await WorkerBookService.deleteWorkerBook(item.gridKey);
				}
			}
		}

		// 删除该文件夹
		await FolderService.deleteFolder(folderid, user_uuid);
	}
}

/**
 * @description 文件夹控制器
 */
export const FolderController = { deleteFolder, createFolder, updateFolder, getFolderList };
