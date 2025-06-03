// 定义sheet list 文件列表的接口返回数据类型 - 内部使用
interface UserInfo {
	userid: string;
	username: string;
	avatar: string | null;
	email: string | null;
}

interface SheetListItem {
	favor: boolean;
	file_map_id: string;
	operator: UserInfo;
	checked: boolean; // 是否选中
	owner: UserInfo;
	workerbook: {
		gridKey: string;
		title: string;
		lang: string;
		createdAt: string;
		updatedAt: string;
	};
}

// 定义文件夹页面数据返回格式
interface FolderItem {
	type: "folder" | "file";
	updatedAt: string; // 更新时间
	label: string; // foldername filename（title 属性）
	gridKey?: string;
	folderid?: string;
	file_map_id?: string;
	owner: UserInfo;
}

export { type SheetListItem, type FolderItem };
