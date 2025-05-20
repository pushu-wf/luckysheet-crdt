import express from "express";
import routes from "./Router";
import { DB } from "./Sequelize/index"; // 导入 DB
import { SERVER_PORT } from "./Config";
import { logger } from "./Utils/Logger";
import { initMeddlewear } from "./Middleware";
import { createWebSocketServer } from "./WebSocket/index"; // 导入 ws

/**
 * @author https://gitee.com/wfeng0/luckysheet-crdt
 * @description Luckysheet CRDT 协同全功能实现 - Server 服务端
 * @license Apache 2.0
 * @copyright Copyright (c) 2025 https://gitee.com/wfeng0/luckysheet-crdt
 * @time 2024年12月05日
 */

(async () => {
	logger.info("✨ Server is starting, wait a moment please... ");

	/** 创建 express 实例对象 */
	const app = express();

	/** 注册中间件 */
	initMeddlewear(app);

	/** 连接数据库 DB 请注意需要 await 不然后续的操作可能会受到影响 */
	try {
		await DB.connect();
	} catch (error) {
		logger.error(error);
	}

	/** 初始化路由 */
	app.use(routes);

	/** 监听端口，获取 server 对象 */
	const server = app.listen(SERVER_PORT);
	logger.info(`✅️ Server is started at http://localhost:${SERVER_PORT} !`);

	/** 初始化 WebSocket - 传入 server 对象 */
	createWebSocketServer(server);
})();
