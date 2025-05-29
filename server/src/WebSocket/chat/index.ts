import WebSocket from "ws";
import { IncomingMessage } from "http";
import { CustomWebSocket } from "../../Interface/WebSocket";

/**
 * WebSocket Server for chat room
 */

export function connectChatRoomServer(wss: WebSocket.Server, client: CustomWebSocket, req: IncomingMessage) {}
