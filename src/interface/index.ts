// 定义sheet list 文件列表的接口返回数据类型

interface User {
	userid: string;
	username: string;
	avatar: string | null;
	email: string | null;
}

interface SheetListItem {
	favor: boolean;
	operator: User;
	owner: User;
	workerbook: {
		gridKey: string;
		title: string;
		lang: string;
		createdAt: string;
		updatedAt: string;
	};
}

export { type SheetListItem };
