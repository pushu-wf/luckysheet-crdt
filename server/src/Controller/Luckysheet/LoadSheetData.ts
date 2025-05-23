import {
	type ChartType,
	type MergeType,
	type ImagesType,
	type BorderInfoType,
	type CellDataItemType,
	type WorkerSheetItemType,
	CalcChainType,
} from "../../Interface/luckysheet";
import { DB } from "../../Sequelize";
import { getURLQuery } from "../../Utils";
import { logger } from "../../Utils/Logger";
import { Request, Response } from "express";
import { ImageService } from "../../Service/Image";
import { MergeService } from "../../Service/Merge";
import { ChartService } from "../../Service/Chart";
import { CellDataService } from "../../Service/CellData";
import { BorderInfoService } from "../../Service/Border";
import { WorkerSheetService } from "../../Service/WorkerSheet";
import { HiddenAndLenService } from "../../Service/HiddenAndLen";
import { CellDataModelType } from "../../Sequelize/Models/CellData";
import { WorkerSheetModelType } from "../../Sequelize/Models/WorkerSheet";
import { CalcChainService } from "../../Service/CalcChain";

/**
 * loadSheetData loadUrl 加载数据
 * 协同第一步 ： 解析数据库数据，生成 workerbook data 数据
 * @returns string
 */
export async function loadSheetData(req: Request, res: Response) {
	try {
		// 如果数据库没有连接，则直接返回空数组
		if (!DB.getConnectState()) {
			res.json(getEmptyData());
			return;
		}

		const result: WorkerSheetItemType[] = [];

		// 1. 解析用户 URL gridkey 参数 || WORKER_BOOK_INFO gridkey
		const gridKey = getURLQuery(req.url, "gridkey");

		if (!gridKey) {
			res.json({ code: 400, msg: "gridKey 参数缺失" });
			return;
		}

		// 2. 根据 gridKey 查询相关数据，拼接生成 luckysheet 初始数据，进行 luckysheet 初始化
		const sheets = await WorkerSheetService.findAllByGridKey(gridKey);
		if (!sheets || !sheets.length) {
			res.json({ code: 400, msg: "未查询到相关数据" });
			return;
		}

		// 一个工作簿可能有多个工作表
		for (let i = 0; i < sheets!.length; i++) {
			const item = sheets![i].dataValues;
			const worker_sheet_id = item.worker_sheet_id;

			// 初始化当前 sheet 页的基础数据
			const currentSheetData = getSheetDataTemp(item);

			// 3. 查询关联当前 sheet 的 celldata 数据
			await parseCellData(worker_sheet_id, currentSheetData);

			// 4. 查询关联当前 sheet 的 merge 数据 - 这里不仅要体现在 config 中，还要体现在 celldata.mc 中
			await parseMerge(worker_sheet_id, currentSheetData);

			// 5. 查新关联当前 sheet 的 border 数据
			await parseConfigBorder(worker_sheet_id, currentSheetData);

			// 6. 查询关联当前 sheet 的 hidden/rowlen/collen 数据
			await parseHiddenAndLen(worker_sheet_id, currentSheetData);

			// 7. 查询 chart 数据
			await parseCharts(worker_sheet_id, currentSheetData);

			// 8. 查询 image 数据
			await parseImages(worker_sheet_id, currentSheetData);

			// 9. 解析公式链
			await parseCalcChain(worker_sheet_id, currentSheetData);

			result.push(currentSheetData);
		}

		// 9. 返回数据
		res.json(JSON.stringify(result));
	} catch (error) {
		logger.error(error);
		res.json({ code: 500, msg: "服务异常" });
	}
}

/**
 * 基础数据模板
 */
function getSheetDataTemp(item: WorkerSheetModelType) {
	const currentSheetData: WorkerSheetItemType = {
		name: item.name,
		index: <string>item.worker_sheet_id, // 注意此字段
		status: <number>item.status,
		order: <number>item.order,
		color: item.color,
		hide: Number(item.hide),
		celldata: [],
		config: {
			merge: {}, //合并单元格
			rowhidden: {}, //隐藏行
			colhidden: {}, //隐藏列
			borderInfo: [], //边框
			rowlen: {},
			columnlen: {},
		},
		images: [], //图片
		chart: [], //图表配置
		calcChain: [], // 公式链
	};

	return currentSheetData;
}

/**
 * 数据库服务不可用，直接返回空模板数据
 */
function getEmptyData() {
	return JSON.stringify([
		{
			name: "Sheet1",
			index: "Sheet_Index_Demo",
			status: 1,
			order: 0,
			celldata: [
				{
					r: 0,
					c: 0,
					v: {
						v: "数据库服务不可用，但不影响协同功能",
						m: "数据库服务不可用，但不影响协同功能",
						bg: "#ff0000",
						fc: "#ffffff",
						fs: 12,
						ht: 0,
						vt: 0,
					},
				},
			],
		},
	]);
}

/**
 * parseCellData 解析 cellData 数据
 */
async function parseCellData(worker_sheet_id: string, currentSheetData: WorkerSheetItemType) {
	try {
		const result = <CellDataItemType[]>[];

		const cellDatas = await CellDataService.getCellData(worker_sheet_id);

		cellDatas?.forEach((item) => {
			const data = <CellDataModelType>item.dataValues;

			// 解析 cellData 生成 luckysheet 初始数据
			result.push({
				r: data.r,
				c: data.c,
				v: {
					ct: {
						fa: <string>data.ctfa,
						t: <string>data.ctt,
						s: JSON.parse(data.cts || "[]"),
					},
					v: data.v || "",
					m: data.m || "",
					bg: data.bg || "#FFFFFF",
					ff: data.ff || "",
					fc: data.fc || "#000000",
					bl: Boolean(data.bl),
					it: Boolean(data.it),
					fs: data.fs || 10,
					cl: Boolean(data.cl),
					ht: data.ht || 0,
					vt: data.vt || 0,
					/**
					 * 此处的 '' 可能会引起 源码 formula.js xssDeal 解析值时，进入 f 判断
					 * 源码已修改 => if (cell.f != null || (cell.f && cell.f != ""))
					 */
					f: data.f || null,
					un: Boolean(data.un),
					// 文本截断方式 tb	textbeak	文本换行	0 截断、1溢出、2 自动换行
					tb: Number(data.tb) || 0,
					ps: data.ps ? { value: data.ps } : null,
				},
			});
		});

		currentSheetData.celldata = result;
		return Promise.resolve();
	} catch (error) {
		logger.error(error);
	}
}

/**
 * parseMerge 解析合并单元格
 */
async function parseMerge(worker_sheet_id: string, currentSheetData: WorkerSheetItemType) {
	try {
		const result: MergeType = {};

		const merges = await MergeService.findAllMerge(worker_sheet_id);

		merges?.forEach((merge) => {
			// 拼接 r_c 格式
			const { r, c } = merge.dataValues;
			result[`${r}_${c}`] = merge.dataValues;

			// 配置 celldata mc 属性
			const currentMergeCell = currentSheetData.celldata?.find((i) => i.r == r && i.c == c);

			if (currentMergeCell) currentMergeCell.v.mc = merge.dataValues;
		});

		currentSheetData.config.merge = result;

		return Promise.resolve();
	} catch (error) {
		logger.error(error);
	}
}

/**
 * parseConfigBorder 解析边框
 */
async function parseConfigBorder(worker_sheet_id: string, currentSheetData: WorkerSheetItemType) {
	try {
		const result = <BorderInfoType[]>[];

		const borders = await BorderInfoService.findAllBorder(worker_sheet_id);

		borders?.forEach((border) => {
			const data = border.dataValues;
			// 根据当前数据，生成 config.borderInfo
			/**
			 * 这里有两个类型哈 range cell 需要根据 rangeType 进行判断
			 */
			const { rangeType, borderType, style, color } = data;
			if (rangeType === "cell") {
				result.push({
					rangeType,
					value: {
						row_index: data.row_index,
						col_index: data.col_index,
						l: { style: data.l_style, color: data.l_color },
						r: { style: data.r_style, color: data.r_color },
						t: { style: data.t_style, color: data.t_color },
						b: { style: data.b_style, color: data.b_color },
					},
				});
			} else if (rangeType === "range") {
				const baseinfo = { rangeType, borderType, style, color };
				const row = <[number, number]>[data.row_start, data.row_end];
				const column = <[number, number]>[data.col_start, data.col_end];
				result.push({ ...baseinfo, range: [{ row, column }] });
			}
		});

		currentSheetData.config.borderInfo = result;

		return Promise.resolve();
	} catch (error) {
		logger.error(error);
	}
}

/**
 * 解析隐藏行列和行高列宽
 */
async function parseHiddenAndLen(worker_sheet_id: string, currentSheetData: WorkerSheetItemType) {
	try {
		const dataArray = await HiddenAndLenService.findConfig(worker_sheet_id);
		dataArray?.forEach((item) => {
			const data = item.dataValues;
			const { config_type, config_index } = data;
			const value = Number(data.config_value);
			// 解析数据
			if (config_type === "rowhidden") {
				currentSheetData.config.rowhidden[config_index] = 0;
			} else if (config_type === "colhidden") {
				currentSheetData.config.colhidden[config_index] = 0;
			} else if (config_type === "rowlen") {
				currentSheetData.config.rowlen[config_index] = value;
			} else if (config_type === "columnlen") {
				currentSheetData.config.columnlen[config_index] = value;
			}
		});
		return Promise.resolve();
	} catch (error) {
		logger.error(error);
	}
}

/**
 * parseImages 解析图片
 */
async function parseImages(worker_sheet_id: string, currentSheetData: WorkerSheetItemType) {
	try {
		const result = <ImagesType[]>[];

		const images = await ImageService.findAllImage(worker_sheet_id);

		images?.forEach((image) => {
			const data = image.dataValues;
			result.push({
				type: data.image_type, //1移动并调整单元格大小 2移动并且不调整单元格的大小 3不要移动单元格并调整其大小
				src: data.image_src, //图片url
				originWidth: data.image_originWidth,
				originHeight: data.image_originHeight,
				default: {
					width: data.image_default_width,
					height: data.image_default_height,
					left: data.image_default_left,
					top: data.image_default_top,
				},
				crop: {
					width: data.image_crop_width,
					height: data.image_crop_height,
					offsetLeft: data.image_crop_offsetLeft,
					offsetTop: data.image_crop_offsetTop,
				},
				isFixedPos: data.image_isFixedPos,
				fixedLeft: data.image_fixedLeft,
				fixedTop: data.image_fixedTop,
				border: {
					width: data.image_border_width,
					radius: data.image_border_radius,
					style: data.image_border_style,
					color: data.image_border_color,
				},
			});
		});
		currentSheetData.images = result;

		return Promise.resolve();
	} catch (error) {
		logger.error(error);
	}
}

/**
 * parseCharts 解析图表数据
 */

async function parseCharts(worker_sheet_id: string, currentSheetData: WorkerSheetItemType) {
	try {
		const result: ChartType[] = [];
		const charts = await ChartService.findAllChart(worker_sheet_id);
		charts?.forEach((chart) => {
			const data = chart.dataValues;
			result.push({
				chartType: data.chartType,
				chart_id: data.chart_id,
				width: data.width,
				height: data.height,
				left: data.left,
				top: data.top,
				sheetIndex: data.worker_sheet_id,
				needRangeShow: Boolean(data.needRangeShow),
				chartOptions: JSON.parse(data.chartOptions),
			});
		});

		currentSheetData.chart = result;
		return Promise.resolve();
	} catch (error) {
		logger.error(error);
	}
}

/**
 * parseCalcChain 解析公式连
 */
async function parseCalcChain(worker_sheet_id: string, currentSheetData: WorkerSheetItemType) {
	try {
		const result: CalcChainType[] = [];
		const charts = await CalcChainService.findAll(worker_sheet_id);
		charts?.forEach((chart) => {
			const data = chart.dataValues;
			result.push({
				r: data.r,
				c: data.c,
				index: data.worker_sheet_id,
				func: JSON.parse(data.func),
				color: "w",
			});
		});

		currentSheetData.calcChain = result;
		return Promise.resolve();
	} catch (error) {
		logger.error(error);
	}
}
