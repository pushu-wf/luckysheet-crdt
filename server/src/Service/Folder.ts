import dayjs from "dayjs";
import { logger } from "../Utils/Logger";
import { FileMapModel } from "../Sequelize/Models/FileMap";
import { WorkerBookModel } from "../Sequelize/Models/WorkerBook";
import { FolderModel, FolderModelType } from "../Sequelize/Models/Folder";
import { FileListResult } from "../Interface/FIleResult";

// 创建文件夹
async function createFolder(folderinfo: FolderModelType) {
	try {
		return FolderModel.create(folderinfo);
	} catch (error) {
		logger.error(error);
	}
}

// 更新文件夹
async function updateFolder(payload: FolderModelType) {
	try {
		return FolderModel.update(payload, {
			where: {
				folderid: payload.folderid,
				owner: payload.owner,
			},
		});
	} catch (error) {
		logger.error(error);
	}
}

// 删除文件夹
async function deleteFolder(folderid: string, owner: string) {
	try {
		return FolderModel.destroy({ where: { folderid, owner } });
	} catch (error) {
		logger.error(error);
	}
}

// 查询当前文件夹ID 下的所有文件夹
async function findAllFolderByParentId(parentid: string | null, user_uuid: string) {
	try {
		const data = await FolderModel.findAll({
			where: { parentid: parentid, owner: user_uuid },
			attributes: ["folderid", "foldername", "updatedAt"],
		});
		return data.map((i) => ({
			label: i.foldername,
			updatedAt: dayjs(i.updatedAt).format("YYYY-MM-DD") || "",
			folderid: i.folderid,
		}));
	} catch (error) {
		logger.error(error);
	}
}

// 查询当前文件夹ID 下的所有文件
async function findAllFileByFolderId(folderid: string | null, user_uuid: string) {
	try {
		const data = await FileMapModel.findAll({
			where: { folderid: folderid, operator: user_uuid },
			include: [
				{
					model: WorkerBookModel,
					as: "WorkerBook",
					attributes: ["title", "gridKey"],
				},
			],
			attributes: ["favor", "file_map_id"],
		});
		return data.map((i) => {
			const item = i.toJSON() as FileListResult;
			return {
				favor: item.favor,
				label: item.WorkerBook!.title || "",
				gridKey: item.WorkerBook!.gridKey,
				updatedAt: dayjs(item.WorkerBook!.updatedAt).format("YYYY-MM-DD"),
				file_map_id: item.file_map_id,
			};
		});
	} catch (error) {
		logger.error(error);
	}
}

export const FolderService = {
	createFolder,
	updateFolder,
	deleteFolder,
	findAllFolderByParentId,
	findAllFileByFolderId,
};
