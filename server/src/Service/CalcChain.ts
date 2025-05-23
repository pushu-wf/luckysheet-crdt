import { CalcChainModel, CalcChainModelType } from "../Sequelize/Models/CalcChain";
import { logger } from "../Utils/Logger";

/**
 * 查找是否已经存在记录
 */
async function findOne(worker_sheet_id: string, r: number, c: number) {
	try {
		return await CalcChainModel.findOne({
			where: { worker_sheet_id, r, c },
		});
	} catch (error) {
		logger.error(error);
	}
}

// 更新
async function update(calcchain_id: string, func: string) {
	try {
		return await CalcChainModel.update(
			{ func },
			{
				where: { calcchain_id },
			}
		);
	} catch (error) {
		logger.error(error);
		return null;
	}
}
// ** 创建
async function create(info: CalcChainModelType) {
	try {
		return await CalcChainModel.create(info);
	} catch (error) {
		logger.error(error);
	}
}

// 删除
async function deleteCalcChain(worker_sheet_id: string, r: number, c: number) {
	try {
		return await CalcChainModel.destroy({
			where: { worker_sheet_id, r, c },
		});
	} catch (error) {
		logger.error(error);
	}
}

// 查询全部
async function findAll(worker_sheet_id: string) {
	try {
		return await CalcChainModel.findAll({ where: { worker_sheet_id } });
	} catch (error) {
		logger.error(error);
	}
}

export const CalcChainService = {
	findOne,
	update,
	create,
	findAll,
	deleteCalcChain,
};
