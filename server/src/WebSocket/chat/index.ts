import WebSocket from "ws";
import { IncomingMessage } from "http";
import { CustomWebSocket } from "../../Interface/WebSocket";

/**
 * WebSocket Server for chat room
 */

export function connectChatRoomServer(wss: WebSocket.Server, client: CustomWebSocket, req: IncomingMessage) {
	console.log(" ==> ", "connectChatRoomServer", wss, client, req);
	/** 监听消息 */
	// client.on("message", (d) => onmessage(d, wss, client));

	// /** 监听错误 */
	// client.on("error", logger.error);

	// /** 监听关闭 code = 1000 正常关闭 */
	// client.on("close", () => onclose(wss, client));
}
