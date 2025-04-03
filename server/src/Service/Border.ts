import {
	BorderInfoModel,
	BorderInfoModelType
} from '../Sequelize/Models/BorderInfo';
import { logger } from '../Utils/Logger';

/**
 * 查找是否存在边框
 * @param info
 * @returns
 */
async function hasConfigBorder(info: BorderInfoModelType) {
	try {
		return await BorderInfoModel.findOne({
			where: info
		});
	} catch (error) {
		logger.error(error);
	}
}

/**
 * 创建新的边框记录
 * @param info
 * @returns
 */
async function createConfigBorder(info: BorderInfoModelType) {
	try {
		return await BorderInfoModel.create(info);
	} catch (error) {
		logger.error(error);
	}
}

/**
 * 更新边框记录
 * @param info
 * @returns
 */
async function updateConfigBorder(info: BorderInfoModelType) {
	try {
		return await BorderInfoModel.update(info, {
			where: { config_border_id: info.config_border_id }
		});
	} catch (error) {
		logger.error(error);
	}
}

/**
 * 初始化查询全部 borderInfo
 * @param worker_sheet_id
 * @returns
 */
async function findAllBorder(worker_sheet_id: string) {
	try {
		return await BorderInfoModel.findAll({ where: { worker_sheet_id } });
	} catch (error) {
		logger.error(error);
	}
}

export const BorderInfoService = {
	findAllBorder,
	hasConfigBorder,
	createConfigBorder,
	updateConfigBorder
};
