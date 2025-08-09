/**
 * 处理广播给其他客户端事件，客户端接收服务端要求数据结构：
 *
 * data: 修改的命令
 * id: "7a"   websocket的id
 * username: 用户名（用于显示 xxx 正在编辑）
 * type:
 *    message === '用户退出' 用户退出时，关闭协同编辑时其提示框
 *    type == 1 send 成功或失败
 *    type == 2 更新数据
 *    type == 3 多人操作不同选区("t": "mv")（用不同颜色显示其他人所操作的选区）
 *    type == 4 批量指令更新
 *    type == 5 showloading
 *    type == 6 hideloading
 */

import WebSocket from "ws";
import { CustomWebSocket } from "../../Interface/WebSocket";

/**
 * 广播给其他客户端
 * @param wss
 * @param currentClient
 * @param data
 */
export function broadcastOtherClients(wss: WebSocket.Server, currentClient: CustomWebSocket, data: string) {
	/** 根据传入的 data 进行协同回传消息类型处理 */
	const callback = getCallbackData(currentClient, data);

	/**
	 * 请注意，此处应该做校验：
	 *  1. 协同类型是否为 luckysheet（同一个协同服务类型才协同）
	 *  2. 当前用户的文件ID(使用 gridkey 替代 fileid) 是否一致（同一篇文档的用户才协同）
	 *  3. 当前用户的 userid 是否一致（同一用户不发送消息）
	 */
	wss.clients.forEach((conn) => {
		const { type, gridKey, userid } = (<CustomWebSocket>conn).clientInfo || {};
		if (type !== "luckysheet") return;
		if (gridKey !== currentClient.clientInfo.gridKey) return;
		if (userid === currentClient.clientInfo.userid) return;
		// 校验通过，发送消息给客户端
		if (conn.readyState === WebSocket.OPEN) conn.send(callback);
	});
}

function getCallbackData(currentClient: CustomWebSocket, data: string): string {
	const { userid, username } = currentClient.clientInfo;
	if (data === "exit") return JSON.stringify({ message: "用户退出", id: userid });

	// 不然就正常封装，根据data的t识别不同的 type
	const { t } = JSON.parse(data);
	const info = { data, id: userid, username: decodeURIComponent(username), type: t === "mv" ? 3 : 2 };
	return JSON.stringify(info);
}
