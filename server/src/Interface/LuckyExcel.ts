import { BASE_CELL_DATA_TYPE, BorderInfoType, CalcChainType, CellDataItemType } from "./luckysheet";

// 定义文件导入的类型
export type ExportJson = {
	info: {
		name: string;
		creator: string;
		lastmodifiedby: string;
		createdTime: string;
		modifiedTime: string;
		company: string;
		appversion: string;
	};
	sheets: [
		{
			name: string;
			config: {
				merge: { [key: string]: { r: number; c: number; rs: number; cs: number } };
				rowlen: { [key: string]: number };
				columnlen: { [key: string]: number };
				rowhidden: { [key: string]: 0 };
				colhidden: { [key: string]: 0 };
				borderInfo: BorderInfoType[];
			};
			index: string;
			status: string;
			order: string;
			// luckysheet_select_save: [];
			zoomRatio: number;
			showGridLines: string;
			defaultColWidth: number;
			defaultRowHeight: number;
			// 单元格数据
			celldata: CellDataItemType[];
			// 公式链
			calcChain: CalcChainType[];
			// 是否隐藏
			hide: number;
			data: (BASE_CELL_DATA_TYPE | null)[];
			// luckysheet_selection_range: [];
		}
	];
};
