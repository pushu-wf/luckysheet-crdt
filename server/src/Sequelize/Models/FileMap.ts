/**
 * 文件映射表
 */

import { UserModel } from "./User";
import { WorkerBookModel } from "./WorkerBook";
import { DataTypes, InferAttributes, Model, Sequelize } from "sequelize";

export class FileMapModel extends Model {
	declare file_map_id?: string; // 文件映射表ID
	declare isowner: boolean; // 是否文件拥有者
	declare operator: string; // 文件操作者
	declare gridKey: string; // 关联的 gridKey
	declare favor?: boolean; // 是否收藏
	// 注册模型
	static registerModule(sequelize: Sequelize) {
		FileMapModel.init(
			{
				file_map_id: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "file_map_id 唯一标识", // 描述
					primaryKey: true,
					defaultValue: DataTypes.UUIDV4, // 默认使用 uuid 作为 主键ID
				},
				isowner: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
					comment: "是否文件拥有者",
					defaultValue: false,
				},
				operator: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "(文件操作者)外键：关联 users 的 user_uuid,", // 描述
					references: {
						model: UserModel,
						key: "user_uuid",
					},
				},
				gridKey: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "(关联的文件)外键：关联 worker books 的 gridkey 字段,", // 描述
					references: {
						model: WorkerBookModel,
						key: "gridKey",
					},
				},
				favor: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
					comment: "是否收藏",
					defaultValue: false,
				},
			},
			{
				sequelize, // 将模型与 Sequelize 实例关联
				tableName: "filemaps", // 直接式提供数据库表名
			}
		);

		/**
		 * 配置关联
		 *  1. UserModel user_uuid
		 *  2. FileMapModel operator --> user_uuid
		 *  3. WorkerBookModel gridKey --> filemaps.gridKey
		 */
		UserModel.hasMany(FileMapModel, { foreignKey: "operator" });
		FileMapModel.belongsTo(UserModel, { foreignKey: "operator" });

		FileMapModel.belongsTo(WorkerBookModel, { foreignKey: "gridKey" });
		WorkerBookModel.hasMany(FileMapModel, { foreignKey: "gridKey" });
	}
}

// 导出类型
export type FileMapModelType = InferAttributes<FileMapModel>;
