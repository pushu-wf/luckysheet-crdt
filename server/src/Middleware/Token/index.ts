import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../Config";
import { logger } from "../../Utils/Logger";

/**
 * 处理 token
 */
export function initToken(app: express.Application) {
	app.use(async (req, res, next) => {
		// 请求的路径白名单 "/luckysheet/loadSheetData"
		const whiteList = ["/", "/user/login", "/user/register"];

		// 静态资源
		const staticPath = ["/lib", "/favicon.ico", "/assets", "/public", "/expendPlugins", "/uploads"];

		const path = req.path;

		// 静态资源路径不需要校验token
		if (staticPath.some((item) => path.startsWith(item))) {
			next();
			return;
		}

		// 白名单不校验
		if (whiteList.includes(path)) {
			next();
			return;
		}

		// 是否跳过 token 校验
		const enablePassToken = req.headers["enable-pass-token"];
		if (enablePassToken) {
			next();
			return;
		}

		// 不然校验token
		const token = req.headers.authorization;

		if (!token) {
			// res.status(401).json({ code: 401, message: "token 缺失" });
			// 可以实现重定向
			res.redirect("/home");
			return;
		}

		try {
			// 目前只做 token 校验功能，并不将信息绑定到 req 上，已提供 utils 工具函数实现 token 解析 userid
			jwt.verify(token, JWT_SECRET);
			next();
		} catch (err) {
			res.status(401).json({ code: 401, message: "token 错误" });
			logger.error("[token 错误]:" + err);
		}
	});
}
