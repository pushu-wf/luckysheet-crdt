import { logger } from "../Utils/Logger";
import { ChartModel, ChartModelType } from "../Sequelize/Models/Chart";

/**
 * 创建图表
 */
async function createChart(data: ChartModelType) {
	try {
		return await ChartModel.create(data);
	} catch (error) {
		logger.error(error);
	}
}

/**
 * 更新图表
 * @param data xy wh option
 * @returns
 */
async function updateChart(data: ChartModelType) {
	try {
		return await ChartModel.update(data, {
			where: { chart_id: data.chart_id },
		});
	} catch (error) {
		logger.error(error);
	}
}

// 删除图表
async function deleteChart(chart_id: string) {
	try {
		return await ChartModel.destroy({ where: { chart_id } });
	} catch (error) {
		logger.error(error);
	}
}

// findAllChart
async function findAllChart(worker_sheet_id: string) {
	try {
		return await ChartModel.findAll({
			where: { worker_sheet_id },
		});
	} catch (error) {
		logger.error(error);
	}
}

export const ChartService = {
	createChart,
	updateChart,
	deleteChart,
	findAllChart,
};
