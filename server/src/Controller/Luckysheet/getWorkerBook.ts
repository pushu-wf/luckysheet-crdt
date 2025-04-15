import { DB } from "../../Sequelize";
import { Request, Response } from "express";
import { WorkerBookService } from "../../Service/WorkerBook";

/**
 * 获取工作簿信息
 * @param { string } gridKey 工作簿key
 * @returns
 */
export async function getWorkerBook(req: Request, res: Response) {
	const gridKey = req.body.gridKey;

	if (!gridKey) {
		res.status(400).json({ code: 400, msg: "gridKey 参数缺失" });
		return;
	}

	if (!DB.getConnectState()) {
		res.json({
			code: 200,
			msg: "数据库未连接",
			data: { lang: "zh", title: "未命名工作簿" },
		});
		return;
	}

	// 根据 gridKey 请求 workerbooks 数据
	const book = await WorkerBookService.findOne(gridKey, {
		attributes: ["gridKey", "title", "lang"],
	});

	res.json({ code: 200, msg: "ok", data: book });
}
