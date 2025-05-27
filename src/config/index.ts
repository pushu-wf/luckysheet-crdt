// 导出后台服务地址
export const SERVER_URL = "http://localhost:9000";

// 导出协同服务地址
export const WS_SERVER_URL = "ws://127.0.0.1:9000";

// 协同服务初始化失败时，提供的默认初始化数据
export const defaultSheetData = [
	{
		name: "Sheet1",
		celldata: [
			{
				r: 0,
				c: 0,
				v: {
					v: "协同服务不可用，当前为普通模式",
					bg: "#ff0000",
					fc: "#ffffff",
				},
			},
		],
	},
];
