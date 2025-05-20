import path from "path";
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../Config";
import { logger } from "../Utils/Logger";

/**
 * 初始化静态资源
 */
function initStaticSource(app: express.Application) {
	app.use(express.static(path.resolve(__dirname, "../../public")));
	app.use(express.static(path.resolve(__dirname, "../../public/dist")));
	app.use(express.static(path.resolve(__dirname, "../../public/uploads")));
	app.use(express.static(path.resolve(__dirname, "../../public/dist/assets")));
}

/**
 * 处理跨域
 */
function initCors(app: express.Application) {
	app.all("*", function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Content-Type");
		res.header("Access-Control-Allow-Methods", "*");
		res.header("Content-Type", "application/json;charset=utf-8");
		next();
	});
}

/**
 * 处理 bodyparser
 */
function initBodyParser(app: express.Application) {
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
}

/**
 * 处理 token
 */
function initToken(app: express.Application) {
	app.use(async (req, res, next) => {
		// 请求的路径白名单
		const whiteList = ["/user/login", "/user/register"];
		const path = req.path;
		if (whiteList.includes(path)) {
			next();
			return;
		}

		// 不然校验token
		const token = req.headers.authorization;

		if (!token) {
			res.status(401).json({ code: 401, msg: "token 缺失" });
			return;
		}

		try {
			// 目前只做 token 校验功能，并不将信息绑定到 req 上，还请接口请求传递 userid
			jwt.verify(token, JWT_SECRET);
			// console.log("userinfo:", userinfo);
			next();
		} catch (err) {
			res.status(401).json({ code: 401, msg: "token 错误" });
			logger.error("[token 错误]:" + err);
		}
	});
}

/**
 * 导出注册中间件方法
 * @param app
 */
export const initMeddlewear = (app: express.Application) => {
	initStaticSource(app);
	initCors(app);
	initBodyParser(app);
	initToken(app);
};
