import fs from "fs";
import { Request, Response } from "express";
import { UserService } from "../../Service/User";
import { UploadDest, UserAvatarMulter } from "../../Config";
import { createToken, getUseridFromToken, md5 } from "../../Utils";

/**
 * @description 注册用户
 */
export async function register(req: Request, res: Response) {
	// 用户需要传递的参数为 userid password
	const { userid, password } = req.body;

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
	const newUser = await UserService.create({ userid, password: md5(password), username: `User-${userid}` });
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
	const user = await UserService.findOne(userid, md5(password), { attributes: ["userid", "username", "avatar", "email"] });
	if (!user) {
		res.status(400).json({ code: 400, message: "账号或密码错误" });
		return;
	}

	const token = createToken(userid, md5(password));

	res.json({ code: 200, message: "登录成功", token, user });
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

	const user_uuid = await UserService.getUserUUID(userid);
	if (!user_uuid) {
		res.status(400).json({ code: 400, message: "用户不存在" });
		return;
	}

	// 特别注意密码的处理方式，如果为空的话 会直接 md5('')导致密码变更
	const updateData: { password?: string; username?: string; email?: string; avatar?: string } = {};
	if (password) updateData.password = md5(password);
	if (username) updateData.username = username;
	if (email) updateData.email = email;
	if (avatar) updateData.avatar = avatar;

	// 执行更新操作
	const data = await UserService.update({ user_uuid, ...updateData });
	if (data) {
		res.json({ code: 200, message: "更新成功" });
	} else {
		res.status(500).json({ code: 500, message: "更新失败" });
	}
}

// 验证密码是否正确
export async function verifyPassword(req: Request, res: Response) {
	const { password } = req.body;
	if (!password) {
		res.status(400).json({ code: 400, message: "密码不能为空" });
		return;
	}

	// 不然校验密码
	const userid = getUseridFromToken(req);
	if (!userid) {
		res.status(400).json({ code: 400, message: "Invalid token" });
		return;
	}

	const user = await UserService.findOne(userid, md5(password));
	if (user) {
		res.status(200).json({ code: 200, message: "密码正确" });
	} else {
		// 请注意，此处的 statis 设置未 200 是避免前端密码校验时，被拦截器拦截，从而弹窗提示，也可以设置 400 对业务上没有影响
		res.status(200).json({ code: 400, message: "密码错误" });
	}
}

// 用户上传头像
export async function uploadAvatar(req: Request, res: Response) {
	UserAvatarMulter(req, res, async () => {
		const { file } = req;

		// 如果没有解析到 file 对象，则直接返回 400
		if (!file) {
			res.status(400).json({ code: 400, message: "请选择文件" });
			return;
		}

		const { filename, originalname } = <Express.Multer.File>file;

		/**
		 * 处理文件路径：
		 *  将原始路径 Snipaste_2024-10-10_09-46-01.png
		 *  转换成 85d6d8c593b7239406ce2c13099c6110.png
		 *  保留后缀，方便用户以静态资源访问
		 */
		const suffix = originalname.split(".").pop();
		const oldpath = `${UploadDest}/${filename}`;
		const newpath = `${UploadDest}/${filename}.${suffix}`;

		// 重命名文件
		fs.renameSync(oldpath, newpath);

		const avatar = `/uploads/${filename}.${suffix}`;

		// 同步修改用户信息表 avatar 字段
		const userid = getUseridFromToken(req);
		if (!userid) {
			res.status(400).json({ code: 400, message: "Invalid token" });
			return;
		}

		const user_uuid = await UserService.getUserUUID(userid);
		if (!user_uuid) {
			res.status(400).json({ code: 400, message: "用户不存在" });
			return;
		}

		const updateUserAvatar = await UserService.update({ user_uuid, avatar });
		if (!updateUserAvatar) {
			res.status(400).json({ code: 400, message: "更新用户头像失败" });
			return;
		}

		res.json({ code: 200, message: "Success to upload.", avatar });
	});
}
