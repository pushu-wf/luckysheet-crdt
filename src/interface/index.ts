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

export { type SheetListItem };
