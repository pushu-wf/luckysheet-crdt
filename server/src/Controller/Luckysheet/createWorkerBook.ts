import { Request, Response } from "express";
import { WorkerBookService } from "../../Service/WorkerBook";
import { md5 } from "../../Utils";
import { FileMapService } from "../../Service/FileMap";
import { UserService } from "../../Service/User";

/**
 * 创建新的工作簿
 * @param { string } gridKey 工作簿key
 * @returns
 */
export async function createWorkerBook(req: Request, res: Response) {
	const { bookname, userid } = req.body;

	if (!bookname) {
		res.json({ code: 400, message: "bookname 参数缺失" });
		return;
	}
	if (!userid) {
		res.json({ code: 400, message: "userid 缺失" });
		return;
	}

	const gridKey = md5(Math.random().toString().split(".")[1]);

	// 不然创建新的 worker books
	const book = await WorkerBookService.create({
		gridKey,
		title: bookname,
		lang: "zh",
	});

	// 不然请求 user_uuid 作为外键
	const userinfo = await UserService.findOne(userid, undefined, { attributes: ["user_uuid"] });
	if (!userinfo) {
		res.json({ code: 400, message: "用户不存在" });
		return;
	}

	const user_uuid = userinfo.user_uuid!;

	// 需要关联文件映射表 filemap
	const filemap = await FileMapService.createFileMap({
		isowner: true,
		operator: user_uuid,
		gridKey,
	});
	if (!filemap) {
		res.json({ code: 400, message: "创建文件映射表失败" });
		return;
	}

	res.json({ code: 200, data: { ...book, filemap }, message: "创建文件成功" });
}
