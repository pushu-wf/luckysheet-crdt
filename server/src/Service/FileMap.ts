import { FileMapModel, FileMapModelType } from "../Sequelize/Models/FileMap";
import { logger } from "../Utils/Logger";

/**
 * 创建新的文件映射
 */
async function createFileMap(filemap: FileMapModelType) {
	try {
		return await FileMapModel.create(filemap);
	} catch (error) {
		logger.error(error);
	}
}

export const FileMapService = {
	createFileMap,
};
