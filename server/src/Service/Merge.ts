/**
 * 表格合并单元格处理逻辑：
 * 设置一个合并单元格，需要处理两个地方，一是单元格对象中设置mc属性，二是在config中设置merge
 * "r": 0, //主单元格的行号
 * "c": 0, //主单元格的列号
 * "rs": 2, //合并单元格占的行数
 * "cs": 2 //合并单元格占的列数
 *
 *  业务上的处理逻辑是：先查询 merges 这个表，如果有字段值，则反馈生成 celldata mc 属性字段
 *
 *  如果是创建新的合并单元格，需要判断 r c 是否存在，存在则更新 rs cs，不存在则插入
 */

import { logger } from '../Utils/Logger';
import { MergeModel, MergeModelType } from '../Sequelize/Models/Merge';

async function deleteMerge(worker_sheet_id: string) {
	try {
		return await MergeModel.destroy({
			where: {
				worker_sheet_id
			}
		});
	} catch (error) {
		logger.error(error);
		return null;
	}
}

// 新增记录
async function createMerge(info: MergeModelType) {
	try {
		return await MergeModel.create(info);
	} catch (error) {
		logger.error(error);
		return null;
	}
}

// 查询全部
async function findAllMerge(worker_sheet_id: string) {
	try {
		return await MergeModel.findAll({
			where: { worker_sheet_id }
		});
	} catch (error) {
		logger.error(error);
		return null;
	}
}

export const MergeService = {
	deleteMerge,
	createMerge,
	findAllMerge
};
