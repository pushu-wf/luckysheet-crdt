/**
 * User Service
 */

import { UserModel, UserModelType } from "../Sequelize/Models/User";
import { logger } from "../Utils/Logger";

// 查询用户传递的 userid 是否可用
async function findOne(userid: string, password?: string) {
	try {
		return await UserModel.findOne({ where: password ? { userid, password } : { userid } });
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

export const UserService = {
	findOne,
	create,
};
