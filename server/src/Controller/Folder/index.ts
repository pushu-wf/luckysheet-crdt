/** 文件夹相关控制层 */
import { Request, Response } from "express";
import { UserService } from "../../Service/User";
import { getUseridFromToken } from "../../Utils";
import { FolderService } from "../../Service/Folder";

// 创建文件夹
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
async function updateFolder(req: Request, res: Response) {}

// 删除文件夹
async function deleteFolder(req: Request, res: Response) {}

// 获取文件夹列表
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

	res.json({
		code: 200,
		data: {
			folderList,
			fileList,
		},
	});
}

export { deleteFolder, createFolder, updateFolder, getFolderList };
