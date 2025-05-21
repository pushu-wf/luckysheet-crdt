/**
 * Worker Books 工作簿模型表
 */

import { DataTypes, InferAttributes, Model, Sequelize } from "sequelize";

export class WorkerBookModel extends Model {
	declare gridKey: string; /** gridKey 是用户系统唯一文件ID 必须由用户传递 */
	declare title?: string;
	declare lang?: string;
	declare createdAt?: Date;
	declare updatedAt?: Date;

	static registerModule(sequelize: Sequelize) {
		WorkerBookModel.init(
			{
				gridKey: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "gridKey", // 描述
					primaryKey: true, // 主键
				},
				title: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "工作簿名称", // 描述
					defaultValue: "未命名工作簿", // 默认值
				},
				lang: {
					type: DataTypes.STRING(10), // 类型
					allowNull: false, // 非空
					comment: "语言", // 描述
					defaultValue: "zh", // zh en
				},
				// ... 更多字段，根据项目实际情况添加
			},
			{
				sequelize, // 将模型与 Sequelize 实例关联
				tableName: "workerbooks", // 直接式提供数据库表名
			}
		);
	}
}

// 导出类型
export type WorkerBookModelType = InferAttributes<WorkerBookModel>;
