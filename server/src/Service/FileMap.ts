import { Op } from "sequelize";
import { FileMapModel, FileMapModelType } from "../Sequelize/Models/FileMap";
import { UserModel, UserModelType } from "../Sequelize/Models/User";
import { WorkerBookModel } from "../Sequelize/Models/WorkerBook";
import { logger } from "../Utils/Logger";

// 定义关联查询返回结果类型

type UniFileMapItemResult = {
	isowner: boolean;
	favor: boolean;
	UserModel: UserModelType;
	WorkerBookModel: WorkerBookModel;
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
			? { operator: user_uuid, favor: true }
			: filterType === "share"
			? {
					operator: user_uuid,
					isowner: false,
			  }
			: {
					operator: user_uuid,
			  };
	try {
		const { count, rows } = await FileMapModel.findAndCountAll({
			include: [
				{
					model: UserModel,
				},
				{
					model: WorkerBookModel,
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
			where: searchParams,
			limit,
			offset,
			order: [["updatedAt", "DESC"]],
		});
		// 需要处理返回的数据
		const list = rows.map((i) => {
			const item = i.toJSON() as UniFileMapItemResult;
			return {
				isowner: item.isowner,
				favor: item.favor,
				operator_id: item.UserModel.userid,
				operator_name: item.UserModel.username,
				operator_avatar: item.UserModel.avatar,
				gridKey: item.WorkerBookModel.gridKey,
				title: item.WorkerBookModel.title,
				createdAt: item.WorkerBookModel.createdAt,
				updatedAt: item.WorkerBookModel.updatedAt,
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
