/**
 * 使用 sequelzie 操作数据库
 *  导出唯一实例，需要提供判断数据库连接是否正常的方法
 */

import { Sequelize } from "sequelize";
import { logger } from "../Utils/Logger";
import { ImageModel } from "./Models/Image";
import { MergeModel } from "./Models/Merge";
import { ChartModel } from "./Models/Chart";
import { SQL_CONFIG } from "../Config/index";
import { CellDataModel } from "./Models/CellData";
import { BorderInfoModel } from "./Models/BorderInfo";
import { WorkerBookModel } from "./Models/WorkerBook";
import { WorkerSheetModel } from "./Models/WorkerSheet";
import { HiddenAndLenModel } from "./Models/HiddenAndLen";
import { CalcChainModel } from "./Models/CalcChain";

class DataBase {
	private _connected: boolean = false; // 连接状态
	private _sequelize: Sequelize | null = null; // 连接对象

	constructor() {
		this._connected = false;
		this._sequelize = null;
	}

	/**
	 * 初始化数据库
	 */
	public async connect() {
		const { port, host, database, user, password, enable } = SQL_CONFIG;

		// 禁用数据库
		if (!enable) return logger.warn("🚫 数据库服务已禁用！");

		// 创建连接
		this._sequelize = new Sequelize(database, user, password, {
			port,
			host,
			dialect: "mysql",
			logging: SQL_CONFIG.logger ? (sql: string) => logger.debug(sql) : false,
			logQueryParameters: true,
		});

		// 测试连接
		try {
			await this._sequelize.authenticate();
			logger.info("✅️ Successfully connected to the database!");
			this._connected = true;

			/** 连接成功后，进行模型注册 */
			this.registerModule();
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			logger.error("🚫 Failed to connect to the database!");
			this._connected = false;
			this._sequelize = null;
		}
	}

	/**
	 * 提供原始查询方法
	 */
	public async query(sql: string) {
		if (!this._sequelize || !this._connected) return;
		return await this._sequelize.query(sql);
	}

	/**
	 * 关闭数据库连接
	 */
	public close() {
		if (this._sequelize) this._sequelize.close();
	}
	/**
	 * 获取连接状态
	 */
	public getConnectState(): boolean {
		return this._connected;
	}

	/**
	 * 同步表结构
	 *  1. 请注意表的主键/外键关联关系，如果依赖外键，需要先注册主键表，不然会报错
	 */
	private registerModule() {
		if (!this._sequelize || !this._connected) return;
		// 初始化数据库表
		WorkerBookModel.registerModule(this._sequelize);
		WorkerSheetModel.registerModule(this._sequelize);
		CellDataModel.registerModule(this._sequelize);
		MergeModel.registerModule(this._sequelize);
		BorderInfoModel.registerModule(this._sequelize);
		HiddenAndLenModel.registerModule(this._sequelize);
		ImageModel.registerModule(this._sequelize);
		ChartModel.registerModule(this._sequelize);
		CalcChainModel.registerModule(this._sequelize);
	}
}

/**
 * DataBase 数据库类 - 单例模式(简单实现)
 *  1. connect 连接数据库方法
 *  2. close 关闭数据库方法
 *  3. query(sql:string) 执行原生 SQL 查询
 *  4. getConnectState():boolean 获取连接状态
 */
export const DB = new DataBase();
