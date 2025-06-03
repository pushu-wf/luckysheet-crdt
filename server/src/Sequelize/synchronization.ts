/**
 * database 重要文件 - 用于 package 初始化数据库表结构
 */

import { Sequelize } from "sequelize";
import { SQL_CONFIG } from "../Config";
import { logger } from "../Utils/Logger";
import { UserModel } from "./Models/User";
import { MergeModel } from "./Models/Merge";
import { ImageModel } from "./Models/Image";
import { ChartModel } from "./Models/Chart";
import { FolderModel } from "./Models/Folder";
import { FileMapModel } from "./Models/FileMap";
import { CellDataModel } from "./Models/CellData";
import { CalcChainModel } from "./Models/CalcChain";
import { WorkerBookModel } from "./Models/WorkerBook";
import { BorderInfoModel } from "./Models/BorderInfo";
import { WorkerSheetModel } from "./Models/WorkerSheet";
import { HiddenAndLenModel } from "./Models/HiddenAndLen";

(async () => {
	const { port, host, database, user, password } = SQL_CONFIG;
	const sequelize = new Sequelize(database, user, password, {
		port,
		host,
		dialect: "mysql",
	});

	try {
		await sequelize.authenticate();
		logger.success("Connection has been established successfully.");

		/**
		 * 初始化数据库表
		 *  注意初始化的顺序，依赖的外键需要先初始化，不然报错
		 */
		UserModel.registerModule(sequelize);
		WorkerBookModel.registerModule(sequelize);
		FolderModel.registerModule(sequelize);
		FileMapModel.registerModule(sequelize);
		WorkerSheetModel.registerModule(sequelize);
		CalcChainModel.registerModule(sequelize);
		CellDataModel.registerModule(sequelize);
		MergeModel.registerModule(sequelize);
		BorderInfoModel.registerModule(sequelize);
		HiddenAndLenModel.registerModule(sequelize);
		ImageModel.registerModule(sequelize);
		ChartModel.registerModule(sequelize);

		// 2. 同步模型 (非强制同步)
		await sequelize.sync({ alter: true });

		sequelize.close();
		logger.success("✅️ 所有模型均已成功同步至最新状态.");
	} catch (error) {
		logger.error(error);
		sequelize.close();
	}
})();
