import dayjs from "dayjs";
import { Op } from "sequelize";
import { logger } from "../Utils/Logger";
import { UserModel } from "../Sequelize/Models/User";
import { WorkerBookModel } from "../Sequelize/Models/WorkerBook";
import { FileMapModel, FileMapModelType } from "../Sequelize/Models/FileMap";
import { FileListResult } from "../Interface/FIleResult";

/**
 * 创建新的文件映射
 */
async function createFileMap(filemap: FileMapModelType) {
	try {
		return await FileMapModel.create(filemap);
	} catch (error) {
		logger.error(error);
	}
}

/**
 * 查找文件
 */
async function getFileList(user_uuid: string, filterType: string, limit: number, offset: number) {
	// 处理查询条件
	const searchParams =
		filterType === "favor" // 获取收藏文件时，favor 为 true
			? { operator: { [Op.eq]: user_uuid }, favor: { [Op.is]: true } }
			: filterType === "share" // 获取分享文件时，owner 不是 user_uuid
			? { operator: { [Op.eq]: user_uuid }, owner: { [Op.ne]: user_uuid } }
			: filterType === "mine" // 获取我的文件时，需要当前操作人是我 所有者是我
			? { operator: { [Op.eq]: user_uuid }, owner: { [Op.eq]: user_uuid } }
			: { operator: { [Op.eq]: user_uuid } };
	try {
		const { count, rows } = await FileMapModel.findAndCountAll({
			include: [
				{
					model: UserModel,
					attributes: ["userid", "username", "avatar"],
					as: "OperatorUser",
				},
				{
					model: UserModel,
					attributes: ["userid", "username", "avatar"],
					as: "OwnerUser",
				},
				{
					model: WorkerBookModel,
					as: "WorkerBook",
				},
			],
			attributes: ["favor", "file_map_id"],
			where: searchParams,
			limit,
			offset,
			order: [["updatedAt", "DESC"]],
		});
		// 需要处理返回的数据
		const list = rows.map((i) => {
			const item = i.toJSON() as FileListResult;
			return {
				favor: item.favor,
				file_map_id: item.file_map_id,
				operator: item.OperatorUser,
				owner: item.OwnerUser,
				workerbook: {
					gridKey: item.WorkerBook!.gridKey,
					lang: item.WorkerBook!.lang,
					title: item.WorkerBook!.title,
					updatedAt: dayjs(item.WorkerBook!.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
					createAt: dayjs(item.WorkerBook!.createdAt).format("YYYY-MM-DD HH:mm:ss"),
				},
			};
		});

		return { total: count, list };
	} catch (error) {
		logger.error(error);
	}
}

// 更新
async function updateFavor(file_map_id: string, favor: boolean) {
	try {
		return await FileMapModel.update({ favor }, { where: { file_map_id } });
	} catch (error) {
		logger.error(error);
	}
}

// 删除记录
async function deleteFileMap(file_map_id: string) {
	try {
		return await FileMapModel.destroy({ where: { file_map_id } });
	} catch (error) {
		logger.error(error);
	}
}

// 受邀获取信息
async function getInviteInfo(file_map_id: string) {
	try {
		return await FileMapModel.findOne({
			where: { file_map_id },
			include: [
				{
					model: UserModel,
					attributes: ["username", "userid"],
					as: "OperatorUser",
				},
				{
					model: UserModel,
					attributes: ["username", "userid"],
					as: "OwnerUser",
				},
				{
					model: WorkerBookModel,
					as: "WorkerBook",
					attributes: ["title", "gridKey"],
				},
			],
			attributes: [],
		});
	} catch (error) {
		logger.error(error);
	}
}

// 是否已经存在文件映射
async function hasFileMap(gridKey: string, operator: string) {
	try {
		return await FileMapModel.findOne({ where: { gridKey, operator } });
	} catch (error) {
		logger.error(error);
	}
}

// 通过 FileMapID 获取记录
async function getFileMapByID(file_map_id: string) {
	try {
		return await FileMapModel.findOne({ where: { file_map_id } });
	} catch (error) {
		logger.error(error);
	}
}

// 判断用户是否有某文件编辑权限
async function checkFileEditPermission(user_uuid: string, gridKey: string) {
	try {
		return await FileMapModel.findOne({ where: { gridKey, operator: user_uuid } });
	} catch (error) {
		logger.error(error);
	}
}

export const FileMapService = {
	hasFileMap,
	getFileList,
	updateFavor,
	deleteFileMap,
	createFileMap,
	getInviteInfo,
	getFileMapByID,
	checkFileEditPermission,
};
