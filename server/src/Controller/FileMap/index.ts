/**
 * 文件映射表路由
 */

// 设置收藏状态
import { Request, Response } from "express";
import { FileMapService } from "../../Service/FileMap";
import { isEmpty } from "../../Utils";

export async function setFavor(req: Request, res: Response) {
	// 需要获取 filemapid favor
	const { filemapid, favor } = req.body;
	if (!filemapid || isEmpty(favor)) {
		res.status(400).json({ code: 400, message: "filemapid | favor 参数缺失" });
		return;
	}

	// 不然执行更新
	const data = await FileMapService.updateFavor(filemapid, favor);
	if (data) {
		res.status(200).json({ code: 200, message: "更新成功" });
	} else {
		res.status(500).json({ code: 500, message: "更新失败" });
	}
}
