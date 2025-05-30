import { DataTypes, InferAttributes, Model, Sequelize } from "sequelize";

/**
 * 文件夹模型
 */
export class FolderModel extends Model {
	declare folderid: string; // 文件夹唯一表示
	declare foldername: string; // 文件夹名称
	declare parentid?: string; // 父级文件夹 ID, 如果为空，则表示根文件夹

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
			},
			{
				sequelize,
				tableName: "folders",
			}
		);
	}
}

export type FolderModelType = InferAttributes<FolderModel>;
