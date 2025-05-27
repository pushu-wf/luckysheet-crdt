import express from "express";
import { STATIC_SOURCE_LIST } from "../../Config";
/**
 * 初始化静态资源
 */
export function initStaticSource(app: express.Application) {
	STATIC_SOURCE_LIST.forEach((path) => app.use(express.static(path)));
}
