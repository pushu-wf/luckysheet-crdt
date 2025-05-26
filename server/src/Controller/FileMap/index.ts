/**
 * 文件映射表路由
 */

// 设置收藏状态
import { getUseridFromToken, isEmpty } from "../../Utils";
import { Request, Response } from "express";
import { FileMapService } from "../../Service/FileMap";
import { UserService } from "../../Service/User";

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

// 受邀获取信息
export async function getInviteInfo(req: Request, res: Response) {
	const { filemapid } = req.body;
	if (!filemapid) {
		res.status(400).json({ code: 400, message: "filemapid 参数缺失" });
		return;
	}

	const data = await FileMapService.getInviteInfo(filemapid);

	if (data) {
		res.status(200).json({ code: 200, message: "获取成功", data });
	} else {
		res.status(500).json({ code: 500, message: "获取失败" });
	}
}

// 同意邀请
export async function acceptInvite(req: Request, res: Response) {
	const { gridKey, owner } = req.body;
	if (!gridKey || !owner) {
		res.status(400).json({ code: 400, message: "gridKey | owner 缺失" });
		return;
	}

	// 获取userid
	const userid = getUseridFromToken(req);
	if (!userid) {
		res.status(400).json({ code: 400, message: "Invalid token" });
		return;
	}

	// 通过 userid 获取user_uuid
	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.status(500).json({ code: 500, message: "获取用户信息失败" });
		return;
	}

	// 通过 userid 查询 user_uuid
	const owner_user_uuid = await UserService.getUserUUID(owner);
	if (!owner_user_uuid) {
		res.status(500).json({ code: 500, message: "获取用户信息失败" });
		return;
	}

	// 不然判断是否已经存在 grid Key user_uuid  - 不能重复加入
	const isExist = await FileMapService.hasFileMap(gridKey, user_uuid);
	if (isExist) {
		res.status(400).json({ code: 400, message: "已经加入过这个文件" });
		return;
	} else {
		// 不然就插入
		const data = await FileMapService.createFileMap({ gridKey, operator: user_uuid, owner: owner_user_uuid });
		if (data) {
			res.json({ code: 200, message: "加入成功" });
		} else {
			res.status(500).json({ code: 500, message: "加入失败" });
		}
	}
}
