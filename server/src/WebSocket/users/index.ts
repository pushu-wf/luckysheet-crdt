/**
 * Websocket 维护在线用户列表
 */

import { generateKey } from "../../Utils";
import { logger } from "../../Utils/Logger";
import { UserService } from "../../Service/User";

// 定义 user 基本数据类型
type User = {
	userid: string;
	username: string;
	gridKey: string;
	avatar?: string;
};

class OnlineUserList {
	// 应该使用 redis 实现存储的
	onlineUserList: Map<string, User>;

	constructor() {
		this.onlineUserList = new Map();
	}

	/** 添加用户 */
	public async addUser(user: User) {
		// 这里传入的 user 是不携带 avatar 的，需要在这里请求相关数据库获取 avatar

		let key = generateKey();

		while (this.onlineUserList.has(key)) {
			key = generateKey();
		}

		// 请求获取用户头像
		const userinfo = await UserService.findOne(user.userid);
		if (!userinfo) {
			logger.error(`OnlineUserList 查询用户失败，Userid = ${user.userid}`);
			return Promise.reject("用户不存在");
		}

		user.avatar = userinfo.avatar || "";

		// 获取唯一 ID
		this.onlineUserList.set(key, user);

		return Promise.resolve();
	}

	/** 删除用户 */
	public deleteUser(user: User) {
		// 删除当前用户 当前 gridkey 的记录
		const key = Array.from(this.onlineUserList.keys()).find((key) => {
			const userinfo = this.onlineUserList.get(key);
			return userinfo?.userid === user.userid && userinfo?.gridKey === user.gridKey;
		});

		if (!key) return logger.error(`OnlineUserList 删除用户失败，Userid = ${user.userid}`);

		return this.onlineUserList.delete(key);
	}

	/** 获取用户列表 - 需要指定 gridkey */
	public getUserList(gridKey: string) {
		return Array.from(this.onlineUserList.values()).filter((user: User) => user.gridKey === gridKey);
	}
}

export const onlineUserList = new OnlineUserList();
