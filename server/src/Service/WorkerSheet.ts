import { logger } from "../Utils/Logger";
import { WorkerSheetModel, WorkerSheetModelType } from "../Sequelize/Models/WorkerSheet";

/**
 * 更新相关配置
 */
async function update(data: WorkerSheetModelType) {
	try {
		return await WorkerSheetModel.update(data, { where: { worker_sheet_id: data.worker_sheet_id } });
	} catch (error) {
		logger.error(error);
	}
}

/**
 * 通过 gridkey 查找记录
 */
async function findAllByGridKey(gridKey: string) {
	try {
		// 要查找当前没有被删除的表
		return await WorkerSheetModel.findAll({ where: { gridKey, deleteFlag: false } });
	} catch (error) {
		logger.error(error);
	}
}

/**
 * 新建 sheet
 */
async function createSheet(data: WorkerSheetModelType) {
	try {
		return await WorkerSheetModel.create(data);
	} catch (error) {
		logger.error(error);
	}
}

export const WorkerSheetService = {
	findAllByGridKey,
	update,
	createSheet,
};
