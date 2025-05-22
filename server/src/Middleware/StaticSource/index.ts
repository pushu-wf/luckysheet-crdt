import express from "express";
import { StaticSourceList } from "../../Config";
/**
 * 初始化静态资源
 */
export function initStaticSource(app: express.Application) {
	StaticSourceList.forEach((path) => app.use(express.static(path)));
}
