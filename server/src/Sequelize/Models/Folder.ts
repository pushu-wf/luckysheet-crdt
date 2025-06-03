import { DataTypes, InferAttributes, Model, Sequelize } from "sequelize";
import { UserModel } from "./User";

/**
 * 文件夹模型
 */
export class FolderModel extends Model {
	declare folderid?: string; // 文件夹唯一表示 默认生成即可
	declare foldername: string; // 文件夹名称
	declare parentid?: string; // 父级文件夹 ID, 如果为空，则表示根文件夹
	declare owner: string; // 文件夹用户 UUID
	declare updatedAt?: Date;

	static registerModule(sequelize: Sequelize) {
		FolderModel.init(
			{
				folderid: {
					type: DataTypes.STRING,
					allowNull: false,
					defaultValue: DataTypes.UUIDV4,
					comment: "文件夹ID",
					primaryKey: true,
				},
				foldername: {
					type: DataTypes.STRING,
					allowNull: false,
					comment: "文件夹名称",
				},
				parentid: {
					type: DataTypes.STRING, // 类型
					allowNull: true, // 非空
					comment: "父文件夹ID", // 描述
					references: {
						model: FolderModel,
						key: "folderid",
					},
				},
				owner: {
					type: DataTypes.STRING, // 类型
					allowNull: false, // 非空
					comment: "(文件夹拥有者)外键：关联 users 的 user_uuid,", // 描述
					references: {
						model: UserModel,
						key: "user_uuid",
					},
				},
			},
			{
				sequelize,
				tableName: "folders",
			}
		);

		/**
		 * 配置关联
		 *  1. UserModel user_uuid
		 *  2. FolderModel owner
		 */
		FolderModel.belongsTo(UserModel, { foreignKey: "owner", targetKey: "user_uuid", as: "FolderOwner" });
		UserModel.hasMany(FolderModel, { foreignKey: "owner", sourceKey: "user_uuid" });
	}
}

export type FolderModelType = InferAttributes<FolderModel>;
