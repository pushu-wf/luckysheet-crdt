/**
 * 聊天室功能模块，负责 websocket 的连接、数据处理、页面派发更新等操作
 * 与 pinia 实现交互与数存储，进而通过 监听  pinia 的数据，实现更新页面
 */

import { message } from "ant-design-vue";
import { WS_SERVER_URL } from "../config";
import { UserInfo } from "../store/User";

/**
 * 定义消息发送数据结构
 */
type MessageType = {
	type: string; // 标记消息类型：公告、通知、聊天等
	sender: UserInfo; // 消息发送者信息
	receiver?: UserInfo; // 消息接收者信息 可以为空, 为空则表示所有接收者
	content: string; // 消息内容 请使用 JSON  字符串进行发送, 在发送之前进行加密处理
};

/**
 * 定义 websocket 实例类型
 */
class ChatRoom {
	// 连接实例对象
	private websocket: WebSocket | null = null;
	// 心跳包发送频率
	private heartbeatRate: number = 60000;
	// 心跳包定时器
	private retryTimer: number | null = null;
	// 错误重连次数
	private retryCount: number = 0;

	constructor() {
		this.connect();
	}

	private connect() {
		if ("webSocket" in window) {
			// 创建 websocket 连接
			this.websocket = new WebSocket(`${WS_SERVER_URL}/chart`);
			// 监听 websocket 连接成功
			this.websocket.onopen = this.onopen.bind(this);
			// 监听 websocket 连接失败
			this.websocket.onclose = this.onclose.bind(this);
			// 监听 websocket 连接断开
			this.websocket.onerror = this.onerror.bind(this);
			// 监听 websocket 接收到数据
			this.websocket.onmessage = this.onmessage.bind(this);
		} else {
			message.warn("当前浏览器不支持 WebSocket");
		}
	}
	private onopen() {
		if (!this.websocket) return;
		console.info("[chat-room] websocket连接成功");
		this.retryCount = 0;
		//防止websocket长时间不发送消息导致断连
		this.retryTimer = setInterval(() => {
			this.websocket?.send("rub");
		}, this.heartbeatRate);
	}
	private onclose(e: CloseEvent) {
		console.info("[chat-room] websocket连接关闭");
		if (e.code === 1000) {
			if (this.retryTimer) clearInterval(this.retryTimer);
			this.retryTimer = null;
		} else {
			// 异常关闭连接，需要提供重连机制
			this.retryCount++;

			if (this.retryCount > 3) {
				console.error("websocket连接失败，请刷新重试");
			} else {
				console.info("连接关闭，正在重试...");
				this.connect();
			}
		}
	}
	private onerror() {
		this.websocket = null;
		this.retryCount++;

		if (this.retryCount > 3) {
			message.warn("websocket连接失败，请刷新重试");
		} else {
			console.info("[chat-room] websocket连接失败，正在重连...");
			// 判断当前的链接状态
			if (this.websocket) return;
			this.connect();
		}
	}
	private onmessage(result: MessageEvent) {
		const data = new Function("return " + result.data)();
		// 再重新解密 即可得到 MessageType
	}

	public sendMessage(message: MessageType) {
		if (this.websocket == null) return;
		this.websocket.send(message);
	}

	public closeWebSocket() {
		if (this.websocket == null) return;
		this.websocket.close(1000);
	}
}

export const chatRoom = new ChatRoom();
