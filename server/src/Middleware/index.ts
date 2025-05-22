import express from "express";
import { initCors } from "./Cors";
import { initToken } from "./Token";
import { initBodyParser } from "./BodyParser";
import { initStaticSource } from "./StaticSource";

/**
 * 导出注册中间件方法
 * @param app
 */
export const initMeddlewear = (app: express.Application) => {
	// 请注意：此中间件的顺序会影响到后续的中间件执行，请勿修改顺序
	initStaticSource(app); // 静态资源 - 特别需要在最先注册中间件，不然首页访问不到
	initCors(app);
	initBodyParser(app);
	initToken(app);
};
