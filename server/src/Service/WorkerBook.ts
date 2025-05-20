/**
 * Worker Books Service
 */

import { logger } from "../Utils/Logger";
import { WorkerBookModel, WorkerBookModelType } from "../Sequelize/Models/WorkerBook";
import { WorkerSheetModel, WorkerSheetModelType } from "../Sequelize/Models/WorkerSheet";
import { FindOptions } from "sequelize";

/**
 * 新增 workerBooks 记录
 * @param info WorkerBookModelType
 * @returns
 */
async function create(info: WorkerBookModelType) {
	try {
		// 1. 先查询用户传递的 gridKey 是否存在记录
		const exist = await findOne(info.gridKey);
		if (exist) return { code: 1, msg: "该 gridKey 已经存在" };

		// 2. 创建一个 worker books
		const workerbook = await WorkerBookModel.create(info);

		// 3. 为当前 worker book 创建一个 worker sheet 因为一个 Ecxel 文档中至少需要一个 sheet
		const sheetInfo: WorkerSheetModelType = {
			gridKey: info.gridKey,
			name: "Sheet1",
			order: 0,
			status: 1,
		};
		const workersheet = await WorkerSheetModel.create(sheetInfo);

		return { workerbook, workersheet };
	} catch (error) {
		logger.error(error);
		return null;
	}
}

/**
 * 更新 workerBooks 记录
 */
async function update(info: WorkerBookModelType) {
	try {
		return await WorkerBookModel.update(info, {
			where: { gridKey: info.gridKey },
		});
	} catch (error) {
		logger.error(error);
	}
}

/**
 * 删除 workerBooks 记录 - 注意：该表有外键关联，如果删除记录可能会导致其他业务表有问题，因此，提供 stage 参数，标记记录是否可用
 */
async function del() {}

/**
 * 查询 workerBooks 记录
 */
async function findOne(gridKey: string, options?: FindOptions<WorkerBookModelType>) {
	try {
		return await WorkerBookModel.findOne({ where: { gridKey }, ...options });
	} catch (error) {
		console.error(error);
	}
}

/**
 * 查询 workerBooks 记录列表
 */
async function findAll() {
	try {
		return await WorkerBookModel.findAll();
	} catch (error) {
		console.error(error);
	}
}

export const WorkerBookService = {
	create,
	update,
	delete: del,
	findOne,
	findAll,
};
