/**
 * config row/col hiddens model 配置行列隐藏
 */

import { WorkerSheetModel } from "./WorkerSheet";
import { DataTypes, InferAttributes, Model, Sequelize } from "sequelize";

export class HiddenAndLenModel extends Model {
	// 类型定义
	declare config_id?: string;
	declare worker_sheet_id: string;
	declare config_type: string; /** 隐藏类型 row/col */
	declare config_index?: string; /** 隐藏的行号/列号  */
	declare config_value?: number; /** 定义的行高列宽 */

	// 注册模型
	static registerModule(sequelize: Sequelize) {
		HiddenAndLenModel.init(
			{
				config_id: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "config_id", // 描述
					primaryKey: true,
					defaultValue: DataTypes.UUIDV4, // 默认使用 uuid 作为 主键ID
				},
				worker_sheet_id: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "外键：关联 workersheet 的 worker_sheet_id", // 描述
					references: {
						model: WorkerSheetModel,
						key: "worker_sheet_id",
					},
				},
				config_type: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "隐藏类型 rowhidden/colhidden/rowlen/collen", // 描述
				},
				/**
				 * 根据下列字段，生成 下列配置对象
				 * "rowhidden": {
				 *      "30": 0,
				 *      "31": 0
				 *  }
				 */
				config_index: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "隐藏的行号/列号", // 描述
				},
				config_value: {
					type: DataTypes.INTEGER, // 类型
					allowNull: false, // 非空
					comment: "隐藏的行号/列号的长度", // 描述
					defaultValue: 0,
				},
			},
			{
				sequelize, // 将模型与 Sequelize 实例关联
				tableName: "hiddenandlens", // 直接式提供数据库表名
			}
		);
	}
}

// 导出类型
export type HiddenAndLenModelType = InferAttributes<HiddenAndLenModel>;
