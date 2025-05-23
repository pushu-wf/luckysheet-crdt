import { DB } from "../Sequelize";
import { logger } from "../Utils/Logger";
import { getURLQuery, unzip } from "../Utils";
import { RawData, WebSocketServer } from "ws";
import { IncomingMessage, Server } from "http";
import { databaseHandler } from "./luckysheet/database";
import { CustomWebSocket } from "../Interface/WebSocket";
import { broadcastOtherClients } from "./luckysheet/broadcast";

/**
 * 创建 Web Socket 服务
 *  应该通过命名空间来处理 ai 及 luckysheet 协同消息的处理函数
 * @param port 服务端口
 */
export function createWebSocketServer(server: Server) {
	/** 创建WebSocketServer 实例，并监听 connection 事件 */
	const wss = new WebSocketServer({ server }).on("connection", connection);

	/**
	 * 监听 websocket 连接事件 - 主要做一些数据初始化、客户端连接对象事件注册等
	 * @param client WebSocket 实例
	 * @param req 请求对象
	 */
	function connection(client: CustomWebSocket, req: IncomingMessage) {
		/**  解析 request url 的参数，识别当前连接用户的 userid username gridkey type  属性 */
		const type = getURLQuery(req.url, "type");
		const userid = getURLQuery(req.url, "userid");
		const gridkey = getURLQuery(req.url, "gridkey");
		const username = getURLQuery(req.url, "username");

		logger.info(`luckysheet 协同用户连接成功 [ID: ${userid}].`);

		/** 将 url 参数添加到 client 上，方便后续使用 */
		client.clientInfo = { userid, username, type, gridkey };

		/** 监听消息 */
		client.on("message", (d) => onmessage(d, client));

		/** 监听错误 */
		client.on("error", logger.error);

		/** 监听关闭 code = 1000 正常关闭 */
		client.on("close", () => onclose(client));
	}

	/**
	 * 监听 websocket 消息 - 协同消息处理函数
	 * @param data
	 * @param client
	 */
	function onmessage(data: RawData, client: CustomWebSocket) {
		// Luckysheet 协同消息处理函数
		try {
			// 1. 进行 pako 解压，将 buffer 转成 可识别 json 字符串
			const data_str = unzip(data.toString());

			// 2. 用户每次编辑，都会触发 message 事件，因此，在这里实现协同数据存储
			if (DB.getConnectState()) databaseHandler(data_str, client.clientInfo.gridkey);

			// 3. 广播给 wss.clients 其他客户端 - 所有的权限校验、文件ID 等验证，均在 broadcastOtherClients 函数中处理
			broadcastOtherClients(wss, client, data_str);
		} catch (error) {
			// 4. 捕获异常 判断是否为心跳包消息,心跳不处理，异常信息则记录日志
			if (data.toString() !== "rub") logger.error(error);
		}
	}

	/**
	 * 监听 websocket 的 close 事件
	 * @param client
	 */
	function onclose(client: CustomWebSocket) {
		broadcastOtherClients(wss, client, "exit");
		logger.warn("luckysheet 协同用户关闭连接");
	}
}
