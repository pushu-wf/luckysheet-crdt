import cors from "cors";
import express from "express";

/**
 * 处理跨域
 */
export function initCors(app: express.Application) {
	app.use(cors()); // 允许所有域访问
}
