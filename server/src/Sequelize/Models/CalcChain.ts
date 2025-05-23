/**
 * 公式链单独存储
 */
/**
 * Config Merges 合并单元格数据模型
 *
 */

import { WorkerSheetModel } from "./WorkerSheet";
import { DataTypes, InferAttributes, Model, Sequelize } from "sequelize";

export class CalcChainModel extends Model {
	declare calcchain_id?: string;
	declare worker_sheet_id: string;
	declare r: number;
	declare c: number;
	declare func: string;
	declare pos?: number;

	// 注册模型
	static registerModule(sequelize: Sequelize) {
		CalcChainModel.init(
			{
				calcchain_id: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "公式连表 id", // 描述
					primaryKey: true,
					defaultValue: DataTypes.UUIDV4, // 默认使用 uuid 作为 主键ID
				},
				worker_sheet_id: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "外键：关联 worker_sheet_id, sheet index", // 描述
					references: {
						model: WorkerSheetModel,
						key: "worker_sheet_id",
					},
				},
				r: {
					type: DataTypes.INTEGER,
					allowNull: false,
					comment: "行号",
				},
				c: {
					type: DataTypes.INTEGER,
					allowNull: false,
					comment: "列号",
				},
				func: {
					type: DataTypes.STRING,
					allowNull: false,
					comment: "公式",
				},
				pos: {
					type: DataTypes.INTEGER,
					allowNull: true,
					comment: "公式位置",
				},
			},
			{
				sequelize, // 将模型与 Sequelize 实例关联
				tableName: "calcchains", // 直接式提供数据库表名
			}
		);
	}
}

// 导出类型
export type CalcChainModelType = InferAttributes<CalcChainModel>;
