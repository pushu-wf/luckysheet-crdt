import express from "express";
/**
 * 处理 bodyparser
 */
export function initBodyParser(app: express.Application) {
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
}
