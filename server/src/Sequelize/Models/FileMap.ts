/**
 * 文件映射表
 */

import { UserModel } from "./User";
import { FolderModel } from "./Folder";
import { WorkerBookModel } from "./WorkerBook";
import { DataTypes, InferAttributes, Model, Sequelize } from "sequelize";

export class FileMapModel extends Model {
	declare file_map_id?: string; // 文件映射表ID
	declare owner: string; // 文件拥有者
	declare operator: string; // 文件操作者
	declare gridKey: string; // 关联的 gridKey
	declare favor?: boolean; // 是否收藏
	declare editable?: boolean; // 是否可编辑
	declare folderid?: string; // 文件夹 ID, 如果为空，则表示根文件夹

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
				owner: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "(文件拥有者)外键：关联 users 的 user_uuid,", // 描述
					references: {
						model: UserModel,
						key: "user_uuid",
					},
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
				editable: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
					comment: "是否可编辑",
					defaultValue: true, // 仅在分享文件时，明确设置了仅查看权限时，被设置为 false
				},
				folderid: {
					type: DataTypes.STRING, // 类型
					allowNull: true, // 非空
					comment: "(关联的文件夹)外键：关联 folder 的 folderid 字段,", // 描述
					references: {
						model: FolderModel,
						key: "folderid",
					},
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
		 *  2. FileMapModel operator --> user_uuid 涉及相同模型的多个关联
		 *  3. FileMapModel owner --> user_uuid 涉及相同模型的多个关联
		 *  4. WorkerBookModel gridKey --> filemaps.gridKey
		 */

		// A.hasMany(B) 关联意味着 A 和 B 之间存在一对多关系,外键在目标模型(B)中定义.
		UserModel.hasMany(FileMapModel, { foreignKey: "operator" });
		UserModel.hasMany(FileMapModel, { foreignKey: "owner" });
		// A.belongsTo(B)关联意味着 A 和 B 之间存在一对一的关系,外键在源模型中定义(A).
		FileMapModel.belongsTo(UserModel, { foreignKey: "operator", as: "OperatorUser" });
		FileMapModel.belongsTo(UserModel, { foreignKey: "owner", as: "OwnerUser" });

		// 映射表与文件表是典型的一对多关系，一个映射表只能对应一个文件，而一个文件可以对应多个映射表
		FileMapModel.belongsTo(WorkerBookModel, { foreignKey: "gridKey", as: "WorkerBook" });
		WorkerBookModel.hasMany(FileMapModel, { foreignKey: "gridKey" });

		FileMapModel.belongsTo(FolderModel, { foreignKey: "folderid", as: "Folder" });
		FolderModel.hasMany(FileMapModel, { foreignKey: "folderid" });
	}
}

// 导出类型
export type FileMapModelType = InferAttributes<FileMapModel>;
