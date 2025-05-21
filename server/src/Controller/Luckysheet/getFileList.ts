import { Request, Response } from "express";
import { UserService } from "../../Service/User";
import { FileMapService } from "../../Service/FileMap";

/**
 * 获取文件列表 - 需要实现分页
 */
export async function getFileList(req: Request, res: Response) {
	const { userid, current = 1, pageSize = 5, filterType = "all" } = req.body;
	if (!userid) {
		res.json({ code: 400, message: "缺少 userid 参数" });
		return;
	}

	// 联合查询实现列表渲染
	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.json({ code: 400, message: "用户不存在" });
		return;
	}

	/**
	 * filterType 为过滤条件，支持传递
	 *  all 全部 operator = user_uuid
	 *  recently 最近 operator = user_uuid && updatedAt < 7天
	 *  share 共享 operator = user_uuid && isowner = false
	 *  favor 收藏 operator = user_uuid && favor = true
	 */

	const fileList = await FileMapService.findFileMap(user_uuid, filterType, 10, 1);

	res.json({ code: 200, data: fileList });
}
