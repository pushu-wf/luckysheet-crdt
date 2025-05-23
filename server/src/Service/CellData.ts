import { logger } from "../Utils/Logger";
import { CellDataModel, CellDataModelType } from "../Sequelize/Models/CellData";

/**
 * 通过 sheetid 查找当前数据表的单元格数据
 */
async function getCellData(worker_sheet_id: string) {
	try {
		return await CellDataModel.findAll({ where: { worker_sheet_id } });
	} catch (error) {
		logger.error(error);
		return null;
	}
}

/**
 * 根据传入的 sheetid rc 判断是否存在记录
 */
async function hasCellData(worker_sheet_id: string, r: number, c: number) {
	try {
		return await CellDataModel.findOne({
			where: { worker_sheet_id, r, c },
		});
	} catch (error) {
		logger.error(error);
	}
}

async function updateCellData(info: CellDataModelType) {
	try {
		return await CellDataModel.update(info, {
			where: { cell_data_id: info.cell_data_id },
		});
	} catch (error) {
		logger.error(error);
		return null;
	}
}
async function createCellData(info: CellDataModelType) {
	try {
		return await CellDataModel.create(info);
	} catch (error) {
		logger.error(error);
		return null;
	}
}

async function deleteCellDataRC(worker_sheet_id: string, index: number, rc: "r" | "c") {
	try {
		return await CellDataModel.destroy({
			where: { worker_sheet_id, [rc]: index },
		});
	} catch (error) {
		logger.error(error);
		return null;
	}
}
async function deleteCellData(worker_sheet_id: string, r: number, c: number) {
	try {
		return await CellDataModel.destroy({
			where: { worker_sheet_id, r, c },
		});
	} catch (error) {
		logger.error(error);
		return null;
	}
}

/**
 * 删除行列
 */
async function updateCellDataRC(payload: { worker_sheet_id: string; index: number; len: number; update_type: "r" | "c" }) {
	// {"t":"drc","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":{"index":0,"len":1},"rc":"r"}
	const { worker_sheet_id, index, len, update_type } = payload;

	try {
		// 1. 查询所有的 celldata  的 数据
		const cellData = await CellDataModel.findAll({
			where: { worker_sheet_id },
		});

		// 2. 更新 r = r + len
		if (cellData.length) {
			for (let i = 0; i < cellData.length; i++) {
				// 只有比 index 大的值，才进行处理
				if (cellData[i][update_type] > index) {
					cellData[i][update_type] = cellData[i][update_type] - len;
					await cellData[i].save();
				}
			}
		}
	} catch (error) {
		logger.error(error);
		return null;
	}
}

/**
 * 增加行列
 */
async function addCellDataRC(payload: { worker_sheet_id: string; index: number; len: number; update_type: "r" | "c" }) {
	const { worker_sheet_id, index, len, update_type } = payload;
	// 在上面加一列跟在下面加一列的区别：就是标记的这一行是否也跟着变化
	try {
		// 遍历查询
		const cellData = await CellDataModel.findAll({
			where: { worker_sheet_id },
		});

		// {"t":"arc","i":"2b62e1f2...","v":{"index":8,"len":1,"direction":"lefttop","data":[]},"rc":"r"}

		if (!cellData.length) return null;

		// 不然执行增加操作
		// 如果rc的值是r新增行， 如果rc的值为c则新增列， 例如 rc=r，index=4，len=5，则代表从第4行开始增加5行
		// 然后把r大于4的单元格的整体的r值+5

		for (let i = 0; i < cellData.length; i++) {
			if (cellData[i][update_type] >= index) {
				cellData[i][update_type] = cellData[i][update_type] + len;
				await cellData[i].save();
			}
		}
	} catch (error) {
		logger.error(error);
		return null;
	}
}

/**
 * 存储函数链操作
 */
async function createFC(worker_sheet_id: string, r: number, c: number, calcChain: string) {
	try {
		await CellDataModel.update({ calcChain }, { where: { worker_sheet_id, r, c } });
	} catch (error) {
		logger.error(error);
	}
}

export const CellDataService = {
	getCellData,
	hasCellData,
	updateCellData,
	createCellData,
	deleteCellData,
	updateCellDataRC,
	deleteCellDataRC,
	addCellDataRC,
	createFC,
};
