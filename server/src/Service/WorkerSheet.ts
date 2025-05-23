import { logger } from "../Utils/Logger";
import { WorkerSheetModel, WorkerSheetModelType } from "../Sequelize/Models/WorkerSheet";
import { BorderInfoModel } from "../Sequelize/Models/BorderInfo";
import { CellDataModel } from "../Sequelize/Models/CellData";
import { ChartModel } from "../Sequelize/Models/Chart";
import { HiddenAndLenModel } from "../Sequelize/Models/HiddenAndLen";
import { ImageModel } from "../Sequelize/Models/Image";
import { MergeModel } from "../Sequelize/Models/Merge";

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

/**
 * 通过 gridkey 查找记录
 */
async function findWorkerSheetByGridKey(gridKey: string) {
	try {
		return await WorkerSheetModel.findOne({ where: { gridKey } });
	} catch (error) {
		logger.error(error);
	}
}

// 删除当前 workersheetid 关联的所有数据
async function deleteAllDataByWorkerSheetId(worker_sheet_id: string) {
	try {
		// 删除 borderInfo
		await BorderInfoModel.destroy({ where: { worker_sheet_id } });
		// 删除 cellData
		await CellDataModel.destroy({ where: { worker_sheet_id } });
		// 删除 Chart
		await ChartModel.destroy({ where: { worker_sheet_id } });
		// 删除 HiddenAndLen
		await HiddenAndLenModel.destroy({ where: { worker_sheet_id } });
		// 删除 Image
		await ImageModel.destroy({ where: { worker_sheet_id } });
		// 删除 Merge
		await MergeModel.destroy({ where: { worker_sheet_id } });
		// 删除 CalcChan
		// await CalcChanModel.destroy({ where: { worker_sheet_id } });
		return Promise.resolve();
	} catch (error) {
		logger.error(error);
	}
}

// 删除当前sheet
async function deleteSheet(gridKey: string) {
	try {
		return await WorkerSheetModel.destroy({ where: { gridKey } });
	} catch (error) {
		logger.error(error);
	}
}

export const WorkerSheetService = {
	findAllByGridKey,
	update,
	createSheet,
	findWorkerSheetByGridKey,
	deleteAllDataByWorkerSheetId,
	deleteSheet,
};
