import { Request, Response } from "express";
import { createToken, getUseridFromToken, md5 } from "../../Utils";
import { UserService } from "../../Service/User";

/**
 * @description 注册用户
 */
export async function register(req: Request, res: Response) {
	// 用户需要传递的参数为 userid password
	const userid: string = req.body.userid;
	const password: string = req.body.password;

	if (!userid || !password) {
		res.status(400).json({ code: 400, message: "用户名或密码不能为空" });
		return;
	}

	// 不然判断当前用户ID是否可用
	const exist = await UserService.findOne(userid);
	if (exist) {
		res.status(400).json({ code: 400, message: "用户已存在" });
		return;
	}

	// 不然执行创建用户操作
	const newUser = await UserService.create({ userid, password: md5(password), username: userid });
	if (newUser?.dataValues) res.json({ code: 200, message: "用户注册成功" });
	else res.status(400).json({ code: 400, message: "用户注册失败，请稍后重试！" });
}

/**
 * 登录系统
 */
export async function login(req: Request, res: Response) {
	// 用户需要传递的参数为 userid password
	const { userid, password } = req.body;
	if (!userid || !password) {
		res.status(400).json({ code: 400, message: "用户名或密码不能为空" });
		return;
	}

	// 不然判断当前用户是否存在
	const user = await UserService.findOne(userid, md5(password));
	if (!user) {
		res.status(400).json({ code: 400, message: "账号或密码错误" });
		return;
	}
	const currentUser = JSON.parse(JSON.stringify(user));
	delete currentUser.createdAt;
	delete currentUser.updatedAt;
	delete currentUser.user_uuid;
	delete currentUser.password;

	const token = createToken(userid, md5(password));

	res.json({ code: 200, message: "登录成功", token, user: currentUser });
}

// 更新用户信息
export async function updateUser(req: Request, res: Response) {
	const { password, username, email, avatar } = req.body;

	// 通过 token 获取 userid
	const userid = getUseridFromToken(req);

	if (!userid) {
		res.status(400).json({ code: 400, message: "Invalid token" });
		return;
	}

	// 不然就更新字段
	const data = await UserService.update({ userid, password: md5(password), username, email, avatar });
	if (data) {
		res.json({ code: 200, message: "更新成功" });
	} else {
		res.status(500).json({ code: 500, message: "更新失败" });
	}
}
