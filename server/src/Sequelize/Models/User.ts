/**
 * user Model 用户数据模型表
 */

import { DataTypes, InferAttributes, Model, Sequelize } from "sequelize";

export class UserModel extends Model {
	declare user_uuid?: string; // 有默认值 非必传
	declare userid?: string;
	declare password?: string;
	declare username?: string;
	declare email?: string;
	declare avatar?: string;

	// 注册模型
	static registerModule(sequelize: Sequelize) {
		UserModel.init(
			{
				user_uuid: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "user 表唯一标识", //
					primaryKey: true,
					defaultValue: DataTypes.UUIDV4, // 默认使用 uuid 作为 主键ID
				},
				userid: {
					type: DataTypes.STRING,
					allowNull: false,
					comment: "用户名", // 注册时传入的字段
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
					comment: "密码",
				},
				username: {
					type: DataTypes.STRING,
					allowNull: true,
					comment: "用户名",
				},
				email: {
					type: DataTypes.STRING,
					allowNull: true,
					comment: "邮箱",
				},
				avatar: {
					type: DataTypes.STRING,
					allowNull: true,
					comment: "头像",
				},
			},
			{
				sequelize, // 将模型与 Sequelize 实例关联
				tableName: "users", // 直接式提供数据库表名
			}
		);
	}
}

// 导出类型
export type UserModelType = InferAttributes<UserModel>;
