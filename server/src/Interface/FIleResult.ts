import { UserModelType } from "../Sequelize/Models/User";
import { WorkerBookModel } from "../Sequelize/Models/WorkerBook";

// 定义接口/模型/请求返回的数据类型
export type FileListResult = {
	// 定义关联查询返回结果类型
	favor: boolean;
	file_map_id: string;
	OperatorUser?: UserModelType;
	OwnerUser?: UserModelType;
	WorkerBook?: WorkerBookModel;
};

export type FolderListResult = {
	type: "folder" | "file";
	updatedAt: string; // 更新时间
	label: string; // foldername filename（title 属性）
	gridKey?: string;
	folderid?: string;
	file_map_id?: string;
};
