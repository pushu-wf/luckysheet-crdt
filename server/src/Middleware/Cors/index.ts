import express from "express";
import cors from "cors";

/**
 * 处理跨域
 */
export function initCors(app: express.Application) {
	app.use(cors()); // 允许所有域访问
}
