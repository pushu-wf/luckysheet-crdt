import { BorderInfoType, CellDataItemType, BASE_CELL_DATA_TYPE } from "./luckysheet";
import { WebSocket } from "ws";

interface CustomWebSocket extends WebSocket {
	clientInfo: {
		type: string; // 协同服务类型
		userid: string;
		username: string;
		gridkey: string;
	};
}

// 协同数据类型定义在这里 - 不同的操作类型会传递不同的 数据结构，这里都需要兼容
type CRDTDataType<T> = {
	t: string; // 操作类型
	i: string; // 当前sheet的index值，而不是order
	r: number; // 行号
	c: number; // 列号
	v: T;

	// RV
	range?: {
		row: [number, number];
		column: [number, number];
	};

	// cg
	k?: "config" | "images" | "name" | "rowhidden" | "colhidden" | "rowlen" | "columnlen" | "borderInfo" | "color";

	// Chart
	op?: "add" | "xy" | "wh" | "update" | "del";

	// drc
	rc?: string;
};

// 1. v
type V = {
	v: string | number | null | undefined;
	m: string | number | null | undefined;
} & BASE_CELL_DATA_TYPE;

// 2. rv
type RV = BASE_CELL_DATA_TYPE[][];

// 3. cg
type CG = {
	rangeType: string;
	borderType: string;
	style: string;
	color: string;
	range: [
		{
			row: [number, number];
			column: [number, number];
		}
	];
}[];

type MERGE = {
	merge: {
		[key: string]: { r: number; c: number; rs: number; cs: number };
	};
	rowlen: {
		[key: string]: number;
	};
};

type CHART = {
	chartType: string;
	chart_id: string;
	width: number | string;
	height: number | string;
	left: number | string;
	top: number | string;
	needRangeShow: boolean;
	chartOptions: string;
};

type SHA = {
	name: string;
	status: string;
	order: number;
	index: string;
	row: number;
	column: number;
	celldata?: CellDataItemType[];
	copyindex?: string;
	config?: {
		merge: {
			[key: string]: { r: number; c: number; rs: number; cs: number };
		};
		rowlen: { [key: string]: number };
		columnlen: { [key: string]: number };
		rowhidden: { [key: string]: 0 };
		colhidden: { [key: string]: 0 };
		borderInfo: BorderInfoType[];
	};
};

// 删除行列
type DRC = {
	index: number;
	len: number;
};

// 增加行列
type ARC = {
	index: number;
	len: number;
	direction: string;
	data: BASE_CELL_DATA_TYPE[][];
};

export { type V, type RV, type CG, type SHA, type DRC, type ARC, type CHART, type MERGE, CustomWebSocket, type CRDTDataType };
