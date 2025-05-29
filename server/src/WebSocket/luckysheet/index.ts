import { DB } from "../../Sequelize";
import { IncomingMessage } from "http";
import WebSocket, { RawData } from "ws";
import { logger } from "../../Utils/Logger";
import { databaseHandler } from "./database";
import { getURLQuery, unzip } from "../../Utils";
import { broadcastOtherClients } from "./broadcast";
import { CustomWebSocket } from "../../Interface/WebSocket";

/**
 * WebSocket Server for Luckysheet
 */
export function connectLuckysheetServer(wss: WebSocket.Server, client: CustomWebSocket, req: IncomingMessage) {
	/**  解析 request url 的参数，识别当前连接用户的 userid username gridkey type  属性 */
	const type = getURLQuery(req.url, "type");
	const userid = getURLQuery(req.url, "userid");
	const gridKey = getURLQuery(req.url, "gridkey");
	const username = getURLQuery(req.url, "username"); // 中文解析异常 - 需要转码

	logger.info(`luckysheet 协同用户连接成功 [ID: ${userid}].`);

	/** 将 url 参数添加到 client 上，方便后续使用 */
	client.clientInfo = { userid, username, type, gridKey };

	// 用户连接 websocket ，将其实例对象，添加到 onlineUserlist 中
	// try {
	// 	onlineUserList.addUser(client.clientInfo);
	// } catch (error) {
	// 	logger.error(error);
	// }

	/** 监听消息 */
	client.on("message", (d) => onmessage(d, wss, client));

	/** 监听错误 */
	client.on("error", logger.error);

	/** 监听关闭 code = 1000 正常关闭 */
	client.on("close", () => onclose(wss, client));
}

/**
 * 监听 websocket 消息 - 协同消息处理函数
 * @param data
 * @param client
 */
function onmessage(data: RawData, wss: WebSocket.Server, client: CustomWebSocket) {
	// Luckysheet 协同消息处理函数
	try {
		// 1. 进行 pako 解压，将 buffer 转成 可识别 json 字符串
		const data_str = unzip(data.toString());

		// 2. 用户每次编辑，都会触发 message 事件，因此，在这里实现协同数据存储
		if (DB.getConnectState()) databaseHandler(data_str, client.clientInfo.gridKey);

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
function onclose(wss: WebSocket.Server, client: CustomWebSocket) {
	broadcastOtherClients(wss, client, "exit");
	logger.warn("luckysheet 协同用户关闭连接");
	// 关闭连接，移除 onlineUserList
	// onlineUserList.deleteUser(client.clientInfo);
}
