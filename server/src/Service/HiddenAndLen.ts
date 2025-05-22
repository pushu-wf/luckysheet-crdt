import { logger } from "../Utils/Logger";
import { HiddenAndLenModelType, HiddenAndLenModel } from "../Sequelize/Models/HiddenAndLen";

/**
 * 创建隐藏记录
 *  HidenAndLen 表结构设定为 存储单条记录，因此，在创建之前，需要先查询是否已经存在 gridkey and config_type and config_index 的记录，
 *  如果存在的话，需要先进行删除
 * @param data
 * @returns
 */
async function create(data: HiddenAndLenModelType) {
	try {
		// 查询是否存在记录
		const exist = await HiddenAndLenModel.findOne({
			where: {
				worker_sheet_id: data.worker_sheet_id,
				config_type: data.config_type,
				config_index: data.config_index,
			},
		});
		if (exist)
			await HiddenAndLenModel.destroy({
				where: { config_id: exist.config_id },
			});

		return await HiddenAndLenModel.create(data);
	} catch (error) {
		logger.error(error);
	}
}

// 查询 worker_sheet_id 下所有隐藏记录 - 用于初始化时查询
async function findConfig(worker_sheet_id: string) {
	try {
		return await HiddenAndLenModel.findAll({
			where: { worker_sheet_id },
		});
	} catch (error) {
		logger.error(error);
	}
}

// 删除 hidden 记录
async function deleteHidden(worker_sheet_id: string, config_type: string, config_index: string) {
	try {
		return await HiddenAndLenModel.destroy({
			where: { worker_sheet_id, config_type, config_index },
		});
	} catch (error) {
		logger.error(error);
	}
}

// 删除列
async function deleteRC(worker_sheet_id: string, config_index: string) {
	try {
		return await HiddenAndLenModel.destroy({
			where: { worker_sheet_id, config_index },
		});
	} catch (error) {
		logger.error(error);
	}
}

export const HiddenAndLenService = {
	create,
	findConfig,
	deleteHidden,
	deleteRC,
};
