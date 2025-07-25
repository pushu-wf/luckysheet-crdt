import path from "path";
import express from "express";

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
 * 导出注册中间件方法
 * @param app
 */
export const initMeddlewear = (app: express.Application) => {
	initStaticSource(app);
	initCors(app);
	initBodyParser(app);
};
