import { Request, Response } from "express";
import { UserService } from "../../Service/User";
import { UserWorkerBookModel } from "../../Sequelize/Models/UserWorkerBook";
import { UserWorkerBookService } from "../../Service/UserWorkerBook";

/**
 * 获取文件列表 - 需要实现分页
 */
export async function getFileList(req: Request, res: Response) {
	const { userid, current = 1, pageSize = 5, filterType = "all" } = req.body;
	if (!userid) {
		res.json({ code: 400, message: "缺少 userid 参数" });
		return;
	}

	// 联合查询实现列表渲染 - filemap  + workerbook（gridkey title）
	// 不然请求 user_uuid 作为外键
	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.json({ code: 400, message: "用户不存在" });
		return;
	}

	const fileList = await UserWorkerBookService.findFileList();
	console.log(" ==> ", fileList);

	res.json({ code: 200, data: fileList });
}
