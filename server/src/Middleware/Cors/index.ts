import express from "express";

/**
 * 处理跨域
 */
export function initCors(app: express.Application) {
	app.all("*", function (req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Content-Type");
		res.header("Access-Control-Allow-Methods", "*");
		res.header("Content-Type", "application/json;charset=utf-8");
		next();
	});
}
