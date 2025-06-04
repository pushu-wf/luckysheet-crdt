import { WebSocketServer } from "ws";
import { connectChatRoomServer } from "./chat";
import { IncomingMessage, Server } from "http";
import { connectLuckysheetServer } from "./luckysheet";
import { CustomWebSocket } from "../Interface/WebSocket";

/**
 * 创建 Web Socket 服务
 *  应该通过命名空间来处理 ai 及 luckysheet 协同消息的处理函数
 * @param port 服务端口
 */
export function createWebSocketServer(server: Server) {
	/** 创建WebSocketServer 实例，并监听 connection 事件 */
	const wss = new WebSocketServer({ server }).on("connection", connection);

	/**
	 * 监听 websocket 连接事件 - 这里需要判断是否 luckysheet 协同服务 | 聊天服务，通过 namespace 参数判断
	 * @param client WebSocket 实例
	 * @param req 请求对象
	 */
	function connection(client: CustomWebSocket, req: IncomingMessage) {
		// req.url 以 ? 分割，取第一个参数，即 namespace
		const [namespace] = req.url!.split("?");
		if (namespace === "/luckysheet") connectLuckysheetServer(wss, client, req);
		else if (namespace === "/chat") connectChatRoomServer(wss, client, req);
	}
}
