/**
 * User Service
 */

import { FindOptions } from "sequelize/types/model";
import { UserModel, UserModelType } from "../Sequelize/Models/User";
import { logger } from "../Utils/Logger";

// 查询用户传递的 userid 是否可用
async function findOne(userid: string, password?: string, options?: FindOptions<UserModelType>) {
	try {
		return await UserModel.findOne({ where: password ? { userid, password } : { userid }, ...options });
	} catch (error) {
		logger.error(error);
	}
}

// 创建用户
async function create(user: UserModelType) {
	try {
		return await UserModel.create(user);
	} catch (error) {
		logger.error(error);
	}
}

// 获取 UUID 主键
async function getUserUUID(userid: string) {
	try {
		const user = await findOne(userid, undefined, { attributes: ["user_uuid"] });
		return user?.user_uuid;
	} catch (error) {
		logger.error(error);
	}
}

// 更新字段
async function update(user: UserModelType) {
	try {
		return await UserModel.update(user, { where: { userid: user.userid } });
	} catch (error) {
		logger.error(error);
	}
}

export const UserService = {
	findOne,
	create,
	update,
	getUserUUID,
};
