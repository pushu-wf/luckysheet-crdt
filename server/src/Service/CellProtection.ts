/**
 * @description 单元格保护功能服务模块
 */

import { CellProtectionModel, CellProtectionModelType } from "../Sequelize/Models/CellProtection";
import { logger } from "../Utils/Logger";

export const CellProtectionService = {
    // 新增单元格保护记录
    async createCellProtection(data: CellProtectionModelType) {
        try {
            return await CellProtectionModel.create(data);
        } catch (error) {
            logger.error(error);
        }
    },
    // 获取单元格保护记录
    async findCellProtection(worker_sheet_id: string) {
        try {
            return await CellProtectionModel.findAll({ where: { worker_sheet_id }, order: [["createdAt", "ASC"]] });
        } catch (error) {
            logger.error(error);
        }
    },
    // 删除单元格保护记录
    async deleteCellProtection(worker_sheet_id: string, range: string) {
        try {
            return await CellProtectionModel.destroy({ where: { worker_sheet_id, range } });
        } catch (error) {
            logger.error(error);
        }
    },
};
