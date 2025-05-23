/**
 * 应该重新定义 luckysheet 前台/协同的数据类型，不要直接使用 uknown/any 等类型进行定义
 */

/**
 * 1. worker book
 *  注意哈，这里的类型指的是可存储数据库的后台类型，并非指的是 loadUrl loadSheetUrl 等前台配置哈
 */
type WorkerBookType = {
	gridKey: string; // 唯一key
	title: string; // 工作簿名称
	lang: string; // 语言
	column?: number; // 空表格默认的列数量
	row?: number; // 空表格默认的行数量
};

// 单个 sheet 页 配置
type WorkerSheetItemType = {
	name: string; //工作表名称
	index: number | string; //工作表索引
	status: number; //激活状态
	order: number; //工作表的下标
	celldata: CellDataItemType[]; //初始化使用的单元格数据
	config: {
		merge: MergeType; //合并单元格
		rowlen: RowLenType; //表格行高
		columnlen: ColumnLenType; //表格列宽
		rowhidden: RowHiddenType; //隐藏行
		colhidden: ColHiddenType; //隐藏列
		borderInfo: BorderInfoType[]; //边框
		// authority: AuthorityType; //工作表保护
	};
	chart: ChartType[]; //图表配置
	images: ImagesType[]; //图片
	calcChain: CalcChainType[]; //公式链

	/**
	 * 下列属性非必选
	 */
	color?: string; //工作表颜色
	hide?: number; //是否隐藏
	row?: number; //行数
	column?: number; //列数
	defaultRowHeight?: number; //自定义行高
	defaultColWidth?: number; //自定义列宽
	scrollLeft?: number; //左右滚动条位置
	scrollTop?: number; //上下滚动条位置
	luckysheet_select_save?: []; //选中的区域
	isPivotTable?: false; //是否数据透视表
	filter?: []; //筛选配置
	luckysheet_alternateformat_save?: []; //交替颜色
	luckysheet_alternateformat_save_modelCustom?: []; //自定义交替颜色
	zoomRatio?: number; // 缩放比例
	showGridLines?: number; //是否显示网格线
	// dataVerification: {}; //数据验证配置
	// pivotTable: {}; //数据透视表设置
	// filter_select: {}; //筛选范围
	// luckysheet_conditionformat_save: {}; //条件格式
	// frozen: {}; //冻结行列配置
};

// 单个单元格
type CellDataItemType = {
	r: number;
	c: number;
	v: BASE_CELL_DATA_TYPE;
};

// 基础的单元格数据类型
type BASE_CELL_DATA_TYPE = {
	ct: {
		//单元格值格式
		fa: string; //格式名称为自动格式
		t: string; //格式类型为数字类型
		s?: {
			ff: string;
			fc: string;
			fs: number;
			cl: number;
			un: number;
			bl: number;
			it: number;
			v: string;
		}[];
	};
	v: string | number; //内容的原始值为 233
	m: string | number; //内容的显示值为 233
	bg?: string; //背景为 "#f6b26b"
	ff?: string; // 字体为 "Arial"
	fc?: string; //字体颜色为 "#990000"
	bl?: boolean; //字体加粗
	it?: boolean; //字体斜体
	fs?: number; //字体大小为 9px
	cl?: boolean; //启用删除线
	un?: boolean; // 启用下划线
	ht?: number; //水平居中
	vt?: number; //垂直居中
	tr?: number; //文字旋转 -45°
	tb?: number; //文本自动换行
	mc?: {
		// 合并单元格
		r: number; //主单元格的行号
		c: number; //主单元格的列号
		rs: number; //合并单元格占的行数
		cs: number; //合并单元格占的列数
	};
	ps?: {
		//批注
		left?: number; //批注框左边距
		top?: number; //批注框上边距
		width?: number; //批注框宽度
		height?: number; //批注框高度
		value: string; //批注内容
		isshow?: boolean; //批注框为显示状态
	} | null;
	f?: string | null; //单元格是一个求和公式 "=SUM(233)"
};

// 合并单元格类型
type MergeType = {
	[key: string]: {
		r: number;
		c: number;
		rs: number;
		cs: number;
	};
};

// 行高类型
type RowLenType = {
	[key: string]: number;
};

// 列宽类型
type ColumnLenType = {
	[key: string]: number;
};

// 隐藏行类型
type RowHiddenType = {
	[key: string]: 0;
};

// 隐藏列类型
type ColHiddenType = {
	[key: string]: 0;
};

// 边框类型
type BorderInfoType = {
	rangeType: string;
	borderType?: string;
	style?: string;
	color?: string;
	range?: [
		{
			row: [number, number];
			column: [number, number];
		}
	];

	// 或者单个单元格 - https://dream-num.github.io/LuckysheetDocs/zh/guide/sheet.html#config-borderinfo
	value?: {
		row_index?: number;
		col_index?: number;
		l?: {
			style: number;
			color: string;
		};
		t?: {
			style: number;
			color: string;
		};
		r?: {
			style: number;
			color: string;
		};
		b?: {
			style: number;
			color: string;
		};
	};
};

// 图片类型
type ImagesType = {
	type: string;
	src: string;
	originWidth: number;
	originHeight: number;
	default: {
		width: number;
		height: number;
		left: number;
		top: number;
	};
	crop: {
		width: number;
		height: number;
		offsetLeft: number;
		offsetTop: number;
	};
	isFixedPos: boolean;
	fixedLeft: number;
	fixedTop: number;
	border: {
		width: number;
		radius: number;
		style: string;
		color: string;
	};
};

// 统计图表类型
type ChartType = {
	chartType: string;
	chart_id: string;
	width: string | number;
	height: string | number;
	left: string | number;
	top: string | number;
	sheetIndex: string;
	needRangeShow: boolean;
	chartOptions: object;
};

// 公式链操作
type CalcChainType = {
	r: number; //行数
	c: number; //列数
	index: string; //工作表id
	func: [boolean, number | string, string]; //公式信息，包含公式计算结果和公式字符串
	color: "w"; //"w"：采用深度优先算法 "b":普通计算
};

export {
	type ChartType,
	type MergeType,
	type RowLenType,
	type ImagesType,
	type CalcChainType,
	type ColumnLenType,
	type RowHiddenType,
	type ColHiddenType,
	type BorderInfoType,
	type WorkerBookType,
	type CellDataItemType,
	type BASE_CELL_DATA_TYPE,
	type WorkerSheetItemType,
};
