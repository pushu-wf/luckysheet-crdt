import { Op } from "sequelize";
import { logger } from "../Utils/Logger";
import { WorkerBookModel } from "../Sequelize/Models/WorkerBook";
import { UserModel, UserModelType } from "../Sequelize/Models/User";
import { FileMapModel, FileMapModelType } from "../Sequelize/Models/FileMap";
import dayjs from "dayjs";

// 定义关联查询返回结果类型
type UniFileMapItemResult = {
	favor: boolean;
	OperatorUser: UserModelType;
	OwnerUser: UserModelType;
	WorkerBook: WorkerBookModel;
};

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
async function findFileMap(user_uuid: string, filterType: string, limit: number, offset: number) {
	// 处理查询条件
	const searchParams =
		filterType === "favor"
			? { operator: { [Op.eq]: user_uuid }, favor: { [Op.is]: true } }
			: filterType === "share"
			? {
					operator: { [Op.eq]: user_uuid },
					owner: { [Op.ne]: user_uuid }, // 获取分享文件时，owner 不是 user_uuid
			  }
			: {
					operator: { [Op.eq]: user_uuid },
			  };
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
					// 如果是查询最近的7天记录，则需要 WorkerBookModel updateAt 字段在7天内
					where:
						filterType === "recently"
							? {
									updatedAt: {
										[Op.gt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
									},
							  }
							: undefined,
				},
			],
			attributes: ["favor"],
			where: searchParams,
			limit,
			offset,
			order: [["updatedAt", "DESC"]],
		});
		// 需要处理返回的数据
		const list = rows.map((i) => {
			const item = i.toJSON() as UniFileMapItemResult;
			return {
				favor: item.favor,
				operator: item.OperatorUser,
				owner: item.OwnerUser,
				workerbook: {
					gridKey: item.WorkerBook.gridKey,
					lang: item.WorkerBook.lang,
					title: item.WorkerBook.title,
					updatedAt: dayjs(item.WorkerBook.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
					createAt: dayjs(item.WorkerBook.createdAt).format("YYYY-MM-DD HH:mm:ss"),
				},
			};
		});

		return { total: count, list };
	} catch (error) {
		logger.error(error);
	}
}

export const FileMapService = {
	createFileMap,
	findFileMap,
};
