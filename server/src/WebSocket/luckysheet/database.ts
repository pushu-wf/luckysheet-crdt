/**
 * 处理协同数据存储: 更多操作请参考：  https://dream-num.github.io/LuckysheetDocs/zh/guide/operate.html
 *  1. 单个单元格刷新 "t": "v",
 *  2. 范围单元格刷新 "t": "rv"
 *  3. config操作 "t": "cg",
 *  4. 通用保存 "t": "all",
 *  5. 函数链操作 "t": "fc",
 *  6. 行列操作
 *      - 删除行或列  "t": "drc",
 *      - 增加行或列  "t": "arc",
 *  7. 筛选操作
 *      - 清除筛选 "t": "fsc",
 *      - 恢复筛选 "t": "fsr",
 *  8. sheet操作
 *      - 新建sheet  "t": "sha",
 *      - 复制sheet  "t": "shc",
 *      - 删除sheet  "t": "shd",
 *      - 删除sheet后恢复操作  "t": "shre",
 *      - 调整sheet位置  "t": "shr",
 *      - 切换到指定sheet  "t": "shs",
 * 9. sheet属性(隐藏或显示)  "t": "sh", ==> "op": "show" / "hide"
 * 10. 表格信息更改
 *      - 修改工作簿名称  "t": "na",
 * 11. 图表(TODO)
 *
 * 注意一点，对象中的i为当前sheet的index值，而不是order
 */
import { V, CG, RV, DRC, ARC, SHA, CHART, MERGE, CRDTDataType } from "../../Interface/WebSocket";
import { isEmpty } from "../../Utils";
import { logger } from "../../Utils/Logger";
import { ImageService } from "../../Service/Image";
import { ChartService } from "../../Service/Chart";
import { MergeService } from "../../Service/Merge";
import { BorderInfoService } from "../../Service/Border";
import { CellDataService } from "../../Service/CellData";
import { WorkerBookService } from "../../Service/WorkerBook";
import { WorkerSheetService } from "../../Service/WorkerSheet";
import { HiddenAndLenService } from "../../Service/HiddenAndLen";
import { CellDataModelType } from "../../Sequelize/Models/CellData";
import { BorderInfoModelType } from "../../Sequelize/Models/BorderInfo";
import { WorkerSheetModelType } from "../../Sequelize/Models/WorkerSheet";
import { HiddenAndLenModelType } from "../../Sequelize/Models/HiddenAndLen";
import { CalcChainService } from "../../Service/CalcChain";

/**
 * 协同消息映射的操作
 * @param data
 */
export function databaseHandler(data: string, gridKey: string) {
	const { t } = JSON.parse(data);
	if (t === "v") v(data);
	else if (t === "rv") rv(data);
	else if (t === "cg") cg(data);
	else if (t === "all") all(data);
	else if (t === "fc") fc(data);
	else if (t === "drc") drc(data);
	else if (t === "arc") arc(data);
	else if (t === "fsc") fsc(data);
	else if (t === "fsr") fsr(data);
	else if (t === "sha") sha(data, gridKey);
	else if (t === "shc") shc(data, gridKey);
	else if (t === "shd") shd(data);
	else if (t === "shre") shre(data);
	else if (t === "shr") shr(data);
	else if (t === "c") c(data);
	// else  if (t === "shs") shs(data); // 切换到指定 sheet 是前台操作，可不存储数据库
	else if (t === "sh") sh(data);
	else if (t === "na") na(data, gridKey);
}

// 单个单元格刷新
async function v(data: string) {
	// 1. 解析 rc 单元格
	const { t, r, c, v, i } = <CRDTDataType<V>>JSON.parse(data);
	logger.info("[CRDT DATA]:", data);

	// 纠错判断
	if (t !== "v") return logger.error("t is not v.");
	if (isEmpty(i)) return logger.error("i is undefined.");
	if (isEmpty(r) || isEmpty(c)) return logger.error("r or c is undefined.");

	// 场景一 输入内容存在换行符，则内容是通过 s 传输
	// {"t":"v","i":"28a60885-46e3-4f59-9d25-442a30fdbba6","v":{"ct":{"fa":"General","t":"inlineStr","s":[{"ff":"Times New Roman","fc":"#000000","fs":10,"cl":0,"un":0,"bl":0,"it":0,"v":"123\r\nhhh"}]}},"r":7,"c":0}
	// {"t":"v","i":"28a60885-46e3-4f59-9d25-442a30fdbba6","v":{"ct":{"fa":"General","t":"inlineStr","s":[{"ff":"Times New Roman","fc":"#000000","fs":10,"cl":0,"un":0,"bl":0,"it":0,"v":"jasdjkasdh\r\n换行"}]}},"r":14,"c":1}
	if (v && !v.v && v.ct && v.ct.s) {
		// 取 v m
		const ctfa = v.ct.fa;
		const ctt = v.ct.t;
		const cts = JSON.stringify(v.ct.s);

		// 判断表内是否存在当前记录
		const exist = await CellDataService.hasCellData(i, r, c);

		const info: CellDataModelType = {
			worker_sheet_id: i,
			r,
			c,
			ctfa,
			ctt,
			cts,
			v: "",
			m: "",
			bg: v.bg,
			bl: <boolean>v.bl,
			cl: <boolean>v.cl,
			fc: v.fc,
			ff: <string>v.ff,
			fs: <number>v.fs,
			ht: v.ht,
			it: <boolean>v.it,
			un: <boolean>v.un,
			vt: v.vt,
			tb: <number>v.tb,
			ps: <string>v?.ps?.value,
		};

		// 如果存在则更新
		if (exist) {
			await CellDataService.updateCellData({
				cell_data_id: exist.cell_data_id,
				...info,
			});
		} else {
			// 创建新的记录时，当前记录的 cell_data_id 由 sequelize 自动创建
			await CellDataService.createCellData(info);
		}
	}

	// 场景一：单个单元格插入值
	// {"t":"v","i":"e73f971d-606f-4b04-bcf1-98550940e8e3","v":{"v":"123","ct":{"fa":"General","t":"n"},"m":"123"},"r":5,"c":0}
	else if (v && v.v && v.m) {
		// 取 v m
		const value = <string>v.v;
		const monitor = <string>v.m;
		const ctfa = v.ct.fa;
		const ctt = v.ct.t;

		// 判断表内是否存在当前记录
		const exist = await CellDataService.hasCellData(i, r, c);

		const info: CellDataModelType = {
			worker_sheet_id: i,
			r,
			c,
			f: v.f,
			v: value,
			m: monitor,
			ctfa,
			ctt,
			bg: v.bg,
			bl: <boolean>v.bl,
			cl: <boolean>v.cl,
			fc: v.fc,
			ff: <string>v.ff,
			fs: <number>v.fs,
			ht: v.ht,
			it: <boolean>v.it,
			un: <boolean>v.un,
			vt: v.vt,
			tb: <number>v.tb,
			ps: <string>v?.ps?.value,
		};

		// 如果存在则更新
		if (exist) {
			await CellDataService.updateCellData({
				cell_data_id: exist.cell_data_id,
				...info,
			});
		} else {
			// 创建新的记录时，当前记录的 cell_data_id 由 sequelize 自动创建
			await CellDataService.createCellData(info);
		}
	}

	// 场景二：设置空单元格的样式数据 加粗、背景、颜色、字号等
	// {"t":"v","i":"e73f971d-606f-4b04-bcf1-98550940e8e3","v":{"v":null,"bg":"#ff0000"},"r":3,"c":2}
	else if (v && v.v === null) {
		// 判断 i r c 是否存在
		const exist = await CellDataService.hasCellData(i, r, c);

		const info: CellDataModelType = {
			worker_sheet_id: i,
			r,
			c,
			v: "",
			m: "",
			bg: v.bg,
			bl: <boolean>v.bl,
			cl: <boolean>v.cl,
			fc: v.fc,
			ff: <string>v.ff,
			fs: <number>v.fs,
			ht: v.ht,
			it: <boolean>v.it,
			un: <boolean>v.un,
			tb: <number>v.tb,
			vt: v.vt,
		};

		if (exist) {
			// 如果存在则更新 - 注意全量的样式数据
			await CellDataService.updateCellData({
				cell_data_id: exist.cell_data_id,
				...info,
			});
		} else await CellDataService.createCellData(info);
	}

	// 场景三：剪切/粘贴到某个单元格 - 会触发两次广播（一次是删除，一次是创建）
	// {"t":"v","i":"e73f971d-606f-4b04-bcf1-98550940e8e3","v":null,"r":9,"c":0}
	// {"t":"v","i":"e73f971d-606f-4b04-bcf1-98550940e8e3","v":{"ct":{"fa":"General","t":"n"},"v":"123","m":"123"},"r":13,"c":0}
	else if (v === null) {
		await CellDataService.deleteCellData(i, r, c);
	}

	// 场景四： 删除单元格内容
	// {"t":"v","i":"e73f971d-606f-4b04-bcf1-98550940e8e3","v":{"ct":{"fa":"General","t":"n"}},"r":5,"c":0}
	else if (v && typeof v === "object" && !v.v && !v.m) {
		await CellDataService.deleteCellData(i, r, c); // 删除记录
	}

	// 场景五：公式链操作时，会直接生成数值
	// {"t":"v","i":"61f708fc-b159-4950-afab-176a81f4e1f6","v":6,"r":0,"c":2}
	else if (v && typeof v === "number") {
		// console.log(" ==> 监听到了");
		// 更新 r c 的value 值
		const cell = await CellDataService.hasCellData(i, r, c);
		await CellDataService.updateCellData({
			cell_data_id: cell?.cell_data_id,
			worker_sheet_id: i,
			r,
			c,
			v: v,
			m: v,
		});
	}
}

/**
 * 范围单元格刷新 - 与 单个单元格刷新的场景一致，也存在 复制粘贴 删除多个单元格 v m =null 的场景，都需要做区分
 * @param data
 * @returns
 */
async function rv(data: string) {
	/**
	 * 范围单元格刷新
	 * 需要先取 range 范围行列数，v 的内容是根据 range 循环而来
	 */
	const { t, i, v, range } = <CRDTDataType<RV>>JSON.parse(data);
	if (t !== "rv") return logger.error("t is not rv.");
	if (isEmpty(i)) return logger.error("i is undefined.");
	if (isEmpty(range)) return logger.error("range is undefined.");
	if (isEmpty(v)) return logger.error("v is undefined.");

	logger.info("[CRDT DATA]:", data);

	// 范围添加背景颜色存储失败
	// {"t":"rv","i":"25a110fd-8e06-4318-a2d2-c42606b266ee","v":[[{"v":null,"bg":"#f19594"},{"v":null,"bg":"#f19594"}],[{"v":null,"bg":"#f19594"},{"v":null,"bg":"#f19594"}]],"range":{"row":[10,11],"column":[9,10]}}

	// {"t":"rv","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364",
	// "v":[
	// 		[{"ct":{"fa":"General","t":"g"},"v":"B","m":"B","bg":"#FFFFFF","ff":"5","fc":"#000000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false},
	// 		 {"ct":{"fa":"General","t":"n"},"v":"111","m":"111","bg":"#FFFFFF","ff":"5","fc":"#000000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false}
	// 		],
	// 		[{"ct":{"fa":"General","t":"g"},"v":"C","m":"C","bg":"#FFFFFF","ff":"5","fc":"#000000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false},
	// 		 {"ct":{"fa":"General","t":"n"},"v":"111","m":"111","bg":"#FFFFFF","ff":"5","fc":"#000000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false}
	// 		]
	// 	 ],"range":{"row":[5,6],"column":[1,2]}}
	// {"t":"rv","i":"2b62e1f2-...",
	// "v":[
	// 			[{"ct":{"fa":"General","t":"g"},"v":"B","m":"B","bg":"#FFFFFF","ff":"5","fc":"#000000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false},
	// 			 	{"ct":{"fa":"General","t":"n"},"v":"111","m":"111","bg":"#FFFFFF","ff":"5","fc":"#000000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false}
	// 			]
	// 		],
	// "range":{"row":[4,4],"column":[0,1]}}
	// 循环列，取 v 的内容，然后创建记录
	for (let k = 0; k < v.length; k++) {
		// 这里面的每一项，都是一条记录
		for (let j = 0; j < v[k].length; j++) {
			// 解析内部的 r c 值
			const item = v[k][j];
			const r = range!.row[0] + k;
			const c = range!.column[0] + j;
			// 场景一：设置空单元格的样式数据 加粗、背景、颜色、字号等
			// {"t":"rv","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":[[{"v":null,"bl":1},{"v":null,"bl":1}],[{"v":null,"bl":1},{"v":null,"bl":1}]],"range":{"row":[6,7],"column":[3,4]}}

			// 场景二：范围添加内容 v m 不为空
			// "v":[
			// 			[{"ct":{"fa":"General","t":"g"},"v":"B","m":"B","bg":"#FFFFFF","ff":"5","fc":"#000000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false},
			// 			 	{"ct":{"fa":"General","t":"n"},"v":"111","m":"111","bg":"#FFFFFF","ff":"5","fc":"#000000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false}
			// 			]
			// 		],
			// "range":{"row":[4,4],"column":[0,1]}}
			if ((item && item.v === null) || (item && item.v && item.m)) {
				// i r c 先判断是否存在记录，存在则更新，不存在则创建
				const exist = await CellDataService.hasCellData(i, r, c);

				// 检查 item 是否为 null 或 undefined
				const cellInfo = {
					worker_sheet_id: i,
					r,
					c,
					f: item?.f || "",
					ctfa: item?.ct?.fa,
					ctt: item?.ct?.t,
					v: <string>item?.v || "",
					m: <string>item?.m || "",
					bg: item?.bg,
					bl: <boolean>item?.bl,
					cl: <boolean>item?.cl,
					fc: item?.fc,
					ff: <string>item?.ff,
					fs: <number>item?.fs,
					ht: item?.ht,
					it: <boolean>item?.it,
					un: <boolean>item?.un,
					vt: item?.vt,
				};

				if (exist) {
					// 如果存在则更新 - 注意全量的样式数据
					await CellDataService.updateCellData({
						cell_data_id: exist.cell_data_id,
						...cellInfo,
						bg: cellInfo.bg,
						bl: <boolean>cellInfo.bl,
						cl: <boolean>cellInfo.cl,
						fc: cellInfo.fc,
						ff: <string>cellInfo.ff,
					});
				} else await CellDataService.createCellData(cellInfo);
			}

			// 复制范围单元格，有样式与删除范围单元格触发的事件参数是一样的，目前未解决BUG
			// {"t":"rv","i":"Sheet_eiro660he3z5_1740971352584",
			// 		"v":[
			// 			  [{"ct":{"fa":"General","t":"d"},"bg":"#FFFF00","ff":"5","fc":"#FF0000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false,"ps":null}],
			// 			  [{"ct":{"fa":"General","t":"d"},"bg":"#FFFF00","ff":"5","fc":"#FF0000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false,"ps":null}]
			// 			],
			// 		"range":{"row":[5,6],"column":[0,0]}
			// }
			// {"t":"rv","i":"Sheet_eiro660he3z5_1740971352584",
			// 		"v":[
			// 			  [{"ct":{"fa":"General","t":"d"},"bg":"#FFFF00","ff":"5","fc":"#FF0000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false,"ps":null}],
			// 			  [{"ct":{"fa":"General","t":"d"},"bg":"#FFFF00","ff":"5","fc":"#FF0000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false,"ps":null}]
			// 			],
			// 		"range":{"row":[5,6],"column":[0,0]}}
			// 场景三：删除单元格内容
			else if (item && !item.v && !item.m) {
				await CellDataService.deleteCellData(i, r, c); // 删除记录
			}
		}
	}
}

// config操作
async function cg(data: string) {
	logger.info("[CRDT DATA]:", data);
	const { t, i, v, k } = <CRDTDataType<CG>>JSON.parse(data);

	if (t !== "cg") return logger.error("t is not cg.");
	if (isEmpty(i)) return logger.error("i is undefined.");

	// k: 操作的key值，边框：'borderInfo' / ：行隐藏：'rowhidden' / 列隐藏：'colhidden' / 行高：'rowlen' / 列宽：'columnlen'

	// 行隐藏/列隐藏 统一处理
	// { "t": "cg", "i": "Sheet_0554kKiKl4M7_1597974810804", "v": { "5": 0, "6": 0, "13": 0, "14": 0 },  "k": "rowhidden"}

	// 修改行高列宽
	// {"t":"cg","i":"e73f971d-606f-4b04-bcf1-98550940e8e3","v":{"4":100},"k":"rowlen"}
	if (k === "rowhidden" || k === "colhidden" || k === "rowlen" || k === "columnlen") {
		for (const key in v) {
			if (Object.prototype.hasOwnProperty.call(v, key)) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const value = Number(v[key]);
				// 判断具体是 行还是列
				const configInfo: HiddenAndLenModelType = {
					worker_sheet_id: i,
					config_index: key,
					config_type: k,
					config_value: value,
				};
				//  {"t":"cg","i":"e73f971d-606f-4b04-bcf1-98550940e8e3","v":{"7":0,"8":0,"9":0},"k":"rowhidden"}
				//  {"t":"cg","i":"e73f971d-606f-4b04-bcf1-98550940e8e3","v":{},"k":"rowhidden"}
				// 如果是隐藏的状态，应该先删除全部的 configInfo 再创建，因为 luckysheet 前台的设计就是将当前所有的 hidden 全部传给后台，并不区分是隐藏还是取消隐藏
				if (k === "rowhidden" || k === "colhidden") {
					await HiddenAndLenService.deleteHidden(i, k, key);
				}
				await HiddenAndLenService.create(configInfo);
			}
		}
	}

	// k borderInfo 边框处理
	// {"t":"cg","i":"e73f971d606...","v":[{"rangeType":"range","borderType":"border-all","color":"#000","style":"1","range":[{"row":[0,0],"column":[0,0],"row_focus":0,"column_focus":0,"left":0,"width":73,"top":0,"height":19,"left_move":0,"width_move":73,"top_move":0,"height_move":19}]}],"k":"borderInfo"}
	// {"t":"cg","i":"e73f971d......","v":[{"rangeType":"range","borderType":"border-all","color":"#000","style":"1","range":[{"row":[2,7],"column":[1,2],"row_focus":2,"column_focus":1,"left":74,"width":73,"top":40,"height":19,"left_move":74,"width_move":147,"top_move":40,"height_move":119,}]}],"k":"borderInfo"}
	// {"t":"cg","i":"e73f971d......","v":[{"rangeType":"range","borderType":"border-bottom","color":"#000","style":"1","range":[{"left":148,"width":73,"top":260,"height":19,"left_move":148,"width_move":73,"top_move":260,"height_move":19,"row":[13,13],"column":[2,2],"row_focus":13,"column_focus":2}]}],"k":"borderInfo"}
	if (k === "borderInfo") {
		// 处理 rangeType
		for (let idx = 0; idx < v.length; idx++) {
			const border = v[idx];
			const { rangeType, borderType, color, style, range } = border;
			// 这里能拿到 i range 判断是否存在
			// declare row_start?: number;
			// declare row_end?: number;
			// declare col_start?: number;
			// declare col_end?: number;
			const info: BorderInfoModelType = {
				worker_sheet_id: i,
				rangeType,
				borderType,
				row_start: range[0].row[0],
				row_end: range[0].row[1],
				col_start: range[0].column[0],
				col_end: range[0].column[1],
			};
			const exist = await BorderInfoService.hasConfigBorder(info);
			if (exist) {
				// 更新
				await BorderInfoService.updateConfigBorder({
					config_border_id: exist.config_border_id,
					...info,
					color,
					style: Number(style),
				});
			} else {
				// 创建新的边框记录
				await BorderInfoService.createConfigBorder({
					...info,
					style: Number(style),
					color,
				});
			}
		}
	}
}

/**
 * 通用保存 冻结行列、修改工作表名、修改工作表颜色、合并单元格、筛选等操作，
 *  此方法仅处理 修改工作表名 合并单元格
 * @param data
 * @returns
 */
async function all(data: string) {
	logger.info("[CRDT DATA]:", data);

	const { t, i, v, k } = <CRDTDataType<MERGE>>JSON.parse(data);

	if (t !== "all") return logger.error("t is not all.");
	if (isEmpty(i)) return logger.error("i is undefined.");

	// 修改工作表名
	//  {"t":"all","i":"12f8254d-3914-4f79-9886-9f9aec173048","v":"123","k":"name"}
	if (k === "name") {
		const info = <WorkerSheetModelType>{
			worker_sheet_id: i,
			name: <string>(<unknown>v),
		};
		await WorkerSheetService.update(info);
	} else if (k === "config") {
		// 合并单元格 - 又是一个先删除后新增的操作，由luckysheet 前台设计决定的
		// {"t":"all","i":"e73f971....","v":{"merge":{"1_0":{"r":1,"c":0,"rs":3,"cs":3}},},"k":"config"}
		// {"t":"all","i":"e73f971....","v":{"merge":{"1_0":{"r":1,"c":0,"rs":3,"cs":3},"9_1":{"r":9,"c":1,"rs":5,"cs":3}},},"k":"config"}
		// {"t":"all","i":"e73f971....","v":{"merge":{"9_1":{"r":9,"c":1,"rs":5,"cs":3}},},"k":"config"}

		if (Object.keys(v.merge).length) {
			// 先删除
			await MergeService.deleteMerge(i);
			// 再新增
			for (const key in v.merge) {
				if (Object.prototype.hasOwnProperty.call(v.merge, key)) {
					const { r, c, rs, cs } = v.merge[key];
					await MergeService.createMerge({
						worker_sheet_id: i,
						r,
						c,
						rs,
						cs,
					});
				}
			}
		}

		// 文本换行处理方式 - 自动换行是通过自定义行高实现的，这部分也需要存储哈
		// {"t":"all","i":"28a60885-46e3-4f59-9d25-442a30fdbba6","v":{"merge":{},"rowhidden":{},"colhidden":{},"borderInfo":[],"rowlen":{"10":63.5},"columnlen":{},"customHeight":{}},"k":"config"}
		if (Object.keys(v.rowlen).length) {
			// "rowlen":{"10":63.5},
			for (const key in v.rowlen) {
				if (Object.prototype.hasOwnProperty.call(v.rowlen, key)) {
					const value = Number(v.rowlen[key]);
					// 此时 key 是行号，value 是行高
					const configInfo: HiddenAndLenModelType = {
						worker_sheet_id: i,
						config_index: key,
						config_type: "rowlen",
						config_value: value,
					};
					await HiddenAndLenService.create(configInfo);
				}
			}
		}
	} else if (k === "images") {
		//  {"t":"all","i":"4735b996-d89d-4d7f-ad8e-1124bccc89b0","v":{
		// "img_3aaW3S653e10_1733991741264":{"type":"3","src":"/uploads/36399c90241d782399d05acd9dfb1d9d.png","originWidth":685,"originHeight":490,"default":{"width":400,"height":286,"left":18,"top":229},"crop":{"width":400,"height":286,"offsetLeft":0,"offsetTop":0},"isFixedPos":false,"fixedLeft":46,"fixedTop":90,"border":{"width":0,"radius":0,"style":"solid","color":"#000"}},
		// "img_eeeKop3oTl3a_1733991749199":{"type":"3","src":"/uploads/31ae8c6088f50c267a09b00b3555d787.png","originWidth":685,"originHeight":386,"default":{"width":400,"height":225,"left":0,"top":171},"crop":{"width":400,"height":225,"offsetLeft":0,"offsetTop":0},"isFixedPos":false,"fixedLeft":46,"fixedTop":90,"border":{"width":0,"radius":0,"style":"solid","color":"#000"}}
		// },"k":"images"}
		/* eslint-disable */
		//  又是一个先删除后新增的操作
		await ImageService.deleteImage(i);
		for (const key in v) {
			if (Object.prototype.hasOwnProperty.call(v, key)) {
				// @ts-ignore
				const value = v[key];
				// 解析 value 值
				await ImageService.createImage({
					worker_sheet_id: i,
					image_type: value.type, // type 1移动并调整单元格大小 2移动并且不调整单元格的大小 3不要移动单元格并调整其大小
					image_src: value.src, // 图片地址
					image_originWidth: value.originWidth, // 原始宽度
					image_originHeight: value.originHeight, // 原始高度
					image_default_width: value.default.width, // 默认宽度
					image_default_height: value.default.height, // 默认高度
					image_default_left: value.default.left, // 默认左边距
					image_default_top: value.default.top, // 默认上边距
					image_crop_width: value.crop.width, // 裁剪宽度
					image_crop_height: value.crop.height, // 裁剪高度
					image_crop_offsetLeft: value.crop.offsetLeft, // 裁剪左边距
					image_crop_offsetTop: value.crop.offsetTop, // 裁剪上边距
					image_isFixedPos: value.isFixedPos, // 是否固定位置
					image_fixedLeft: value.fixedLeft, // 固定左边距
					image_fixedTop: value.fixedTop, // 固定上边距
					image_border_width: value.border.width, // 边框宽度
					image_border_radius: value.border.radius, // 圆角
					image_border_style: value.border.style, // 边框样式
					image_border_color: value.border.color, // 边框颜色
				});
			}
		}
	} else if (k === "color") {
		// {"t":"all","i":"62e09f1d-b294-46b5-8924-a0f1a8e011a2","v":"#ffff00","k":"color"}
		// 更新 worker sheet color 字段即可
		const color_info = <WorkerSheetModelType>{
			worker_sheet_id: i,
			color: <string>(<unknown>v),
		};
		await WorkerSheetService.update(color_info);
	}
}

// 函数链操作 r c index func color parent children times
async function fc(data: string) {
	// console.log("==> fc", data);
	// https://dream-num.github.io/LuckysheetDocs/zh/guide/operate.html#%E5%87%BD%E6%95%B0%E9%93%BE%E6%93%8D%E4%BD%9C
	// fc {"t":"fc","i":"4298e271-548d-4207-a826-ecececceef6f","v":"{\"r\":0,\"c\":2,\"index\":\"4298e271-548d-4207-a826-ecececceef6f\"}","op":"add","pos":0}
	//  {"t":"fc","i":"4298e271-548d-4207-a826-ecececceef6f","v":"{\"r\":6,\"c\":2,\"index\":\"4298e271-548d-4207-a826-ecececceef6f\",\"func\":[true,122,\"=A7+B7\"]}","op":"add","pos":0}
	logger.info("[CRDT DATA]:", data);
	const { t, i, v, op } = <CRDTDataType<string>>JSON.parse(data);
	if (t !== "fc") return logger.error("t is not fc.");
	if (isEmpty(i)) return logger.error("i is undefined.");

	// 请注意，此处的 v 是字符串
	const item = JSON.parse(v);
	const { r, c, index, func } = item;

	// 如果是 del 直接删除记录
	// {"t":"fc","i":"61f708fc-b159-4950-afab-176a81f4e1f6","v":null,"op":"del","pos":0}
	if (op === "del") {
		await CalcChainService.deleteCalcChain(index, r, c);
		return;
	}

	// 判断是否存在该记录
	const calcChain = await CalcChainService.findOne(index, r, c);
	// 存在则更新，不存在则创建
	if (calcChain) {
		await CalcChainService.update(calcChain.calcchain_id!, JSON.stringify(func));
	} else {
		await CalcChainService.create({
			worker_sheet_id: index,
			r,
			c,
			func: JSON.stringify(func),
		});
	}
}

// 删除的该行，可能会引起其他的一些变化，因此，也会触发 all 事件类型
// {"t":"all","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":[],"k":"calcChain"}
// {"t":"all","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":null,"k":"filter_select"}
// {"t":"all","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":null,"k":"filter"}
// {"t":"all","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":[],"k":"luckysheet_conditionformat_save"}
// {"t":"all","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":[],"k":"luckysheet_alternateformat_save"}
// {"t":"all","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":{},"k":"dataVerification"}
// {"t":"all","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":{},"k":"hyperlink"}
// 删除行或列 - 会影响 celldata r c 的值，需要更新比新增行列大/小的 r c 值
async function drc(data: string) {
	logger.info("[CRDT DATA]:", data);

	const { t, i, v, rc } = <CRDTDataType<DRC>>JSON.parse(data);

	if (t !== "drc") return logger.error("t is not drc.");
	if (isEmpty(i)) return logger.error("i is undefined.");

	// {"t":"drc","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":{"index":5,"len":1},"rc":"r"}
	// {"t":"drc","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":{"index":1,"len":5},"rc":"r"}
	// {"t":"drc","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":{"index":7,"len":3},"rc":"c"}

	// TODO: 删除该列触发的 all 事件

	// 删除行，则删除该行所有的列数据
	await CellDataService.deleteCellDataRC(i, v.index, <"r" | "c">rc);

	// 通过 index  len 来实现标记 从那里开始删除、删除多少行
	// 删除的索引 index 小的，不需要处理，只需要将 比 索引大的 记录 减小 len 即可
	await CellDataService.updateCellDataRC({
		worker_sheet_id: i,
		index: v.index,
		len: v.len,
		update_type: <"r" | "c">rc,
	});

	// 删除该列的 hide and len
	await HiddenAndLenService.deleteRC(i, v.index.toString());
}

// 增加行或列 - 会影响 celldata r c 的值，需要更新比新增行列大/小的 r c 值
// 撤销删除行列时，也会触发该事件，并且携带 data 字段
async function arc(data: string) {
	logger.info("[CRDT DATA]:", data);

	const { t, i, v, rc } = <CRDTDataType<ARC>>JSON.parse(data);

	if (t !== "arc") return logger.error("t is not arc.");
	if (isEmpty(i)) return logger.error("i is undefined.");

	// 如果rc的值是r新增行，
	// 如果rc的值为c则新增列，
	// 例如rc=r，index=4，len=5， 则代表从第4行开始增加5行，

	// direction 标识添加行列的方向 lefttop 上方/左方添加 rightbottom 下方/右方添加

	// 无数据示例(一般是新增空白行列)
	// {"t":"arc","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":{"index":0,"len":1,"direction":"rightbottom","data":[]},"rc":"r"}

	// 有数据示例(一般是撤销删除行列时，会携带数据)：
	// {"t":"arc","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364","v":{"index":3,"len":1,"direction":"lefttop","data":[[null,
	// {"ct":{"fa":"General","t":"n"},"v":"333","m":"333","bg":"#FFFFFF","ff":"5","fc":"#000000","bl":false,"it":false,"fs":10,"cl":false,"ht":0,"vt":0,"f":null,"un":false},
	// ... 没值部分均为 null ...,null]]},"rc":"r"}
	// {"t":"arc","i":"2b62e1f2-7f7f-4889-b34d-007fe7277364",
	// "v":{"index":6,"len":3,"direction":"lefttop",
	// "data":[
	// 		[null,null,null,{"v":"1","ct":{"fa":"General","t":"n"},"m":"1"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
	// 		[null,null,null,{"v":"2","ct":{"fa":"General","t":"n"},"m":"2"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
	// 		[null,null,null,{"v":"3","ct":{"fa":"General","t":"n"},"m":"3"},null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]]},"rc":"r"}

	// 1. 先新增行列 - 先处理 celldata r c 的关系
	await CellDataService.addCellDataRC({
		worker_sheet_id: i,
		index: v.index,
		len: v.len,
		update_type: <"r" | "c">rc,
	});

	// 2. 后处理 data - 如果是撤销的话，需要新增 celldata 记录
	if (!v.data.length) return;

	for (let k = 0; k < v.data.length; k++) {
		const item = v.data[k]; // 同时操作的可能有多列，因此这个item也是个数组，并且是 cellDataTypeItem []
		for (let j = 0; j < item.length; j++) {
			const cellItem = item[j];
			if (cellItem === null) continue;

			let r = 0;
			let c = 0;
			// 注意撤销后的 r/c 取值
			if (rc === "r") {
				r = v.index + k;
				c = j;
			} else if (rc === "c") {
				r = k;
				c = v.index + j;
			}
			// 不然 执行celldata 的插入操作
			const celldata: CellDataModelType = {
				worker_sheet_id: i,
				...cellItem,
				r,
				c, // 注意撤销后的 r/c 取值
				m: <string>cellItem.m,
				v: <string>cellItem.v,
				ctfa: <string>cellItem?.ct?.fa,
				ctt: <string>cellItem?.ct?.t,
				ps: <string>cellItem?.ps?.value,
			};
			await CellDataService.createCellData(celldata);
		}
	}
}

// 清除筛选
async function fsc(data: string) {
	console.log("==> fsc", data);
}

// 恢复筛选
async function fsr(data: string) {
	console.log("==> fsr", data);
}

// 新建sheet
async function sha(data: string, gridKey: string) {
	logger.info("[CRDT DATA]:", data);
	const { t, v } = <CRDTDataType<SHA>>JSON.parse(data);
	if (t !== "sha") return logger.error("t is not sha.");
	// 新建sheet 是没有i 的哈，别的操作关联 sheet 才有i
	// 此时！这个sheet应该关联的 workerBookID 从当前协同的用户身上获取哦~因为 clientInfo 始终保留着 gridkey userid username 属性
	// {"t":"sha","i":null,"v":{"name":"Sheet2","color":"","status":"0","order":1,"index":"Sheet_Liiwhe570zW3_1734350438656","celldata":[],"row":84,"column":60,"config":{},"pivotTable":null,"isPivotTable":false}}
	// 新建 sheet

	const new_sheet: WorkerSheetModelType = {
		worker_sheet_id: v.index,
		name: v.name,
		gridKey,
		order: v.order,
		status: Number(v.status),
		row: v.row,
		column: v.column,
	};
	await WorkerSheetService.createSheet(new_sheet);

	/**
	 * 导入文件时，新建 sheet 内容是有记录的哈，因此，这里还需要处理 celldata config 等信息
	 * {"t":"sha",
	 *    "v":{
	 *    "name":"Sheet1(副本)",
	 *    "index":"Sheet_0lW156ie7mao_1735608633541",
	 *    "celldata":[{"r":7,"c":6,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":7,"c":7,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":7,"c":8,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":7,"c":9,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":7,"c":10,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":8,"c":6,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":8,"c":7,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1,"v":"123"}},{"r":8,"c":8,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":8,"c":9,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":8,"c":10,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":9,"c":6,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":9,"c":7,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":9,"c":8,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":9,"c":9,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":9,"c":10,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":10,"c":6,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":10,"c":7,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":10,"c":8,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":10,"c":9,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1,"v":"123"}},{"r":10,"c":10,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":11,"c":6,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":11,"c":7,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":11,"c":8,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":11,"c":9,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":11,"c":10,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":12,"c":6,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":12,"c":7,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":12,"c":8,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":12,"c":9,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":12,"c":10,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":13,"c":6,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":13,"c":7,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":13,"c":8,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":13,"c":9,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}},{"r":13,"c":10,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}}],
	 *    "row":84,"column":60,
	 *    "config":{
	 *        "borderInfo":[{"rangeType":"cell","value":{"row_index":7,"col_index":6,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":7,"col_index":7,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":7,"col_index":8,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":7,"col_index":9,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":7,"col_index":10,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":8,"col_index":6,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":8,"col_index":7,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":8,"col_index":8,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":8,"col_index":9,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":8,"col_index":10,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":9,"col_index":6,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":9,"col_index":7,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":9,"col_index":8,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":9,"col_index":9,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":9,"col_index":10,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":10,"col_index":6,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":10,"col_index":7,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":10,"col_index":8,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":10,"col_index":9,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":10,"col_index":10,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":11,"col_index":6,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":11,"col_index":7,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":11,"col_index":8,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":11,"col_index":9,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":11,"col_index":10,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":12,"col_index":6,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":12,"col_index":7,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":12,"col_index":8,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":12,"col_index":9,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":12,"col_index":10,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":13,"col_index":6,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":13,"col_index":7,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":13,"col_index":8,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":13,"col_index":9,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}},{"rangeType":"cell","value":{"row_index":13,"col_index":10,"l":{"style":1,"color":"#000000"},"r":{"style":1,"color":"#000000"},"t":{"style":1,"color":"#000000"},"b":{"style":1,"color":"#000000"}}}]
	 *    },
	 *    "pivotTable":null,
	 *    "isPivotTable":false,
	 *    "luckysheet_select_save":[{"row":[7,7],"column":[13,13],"sheetIndex":1}],
	 *    "zoomRatio":1,
	 *    "showGridLines":"1",
	 *    "defaultColWidth":70,
	 *    "defaultRowHeight":19,
	 *    "calcChain":[]
	 *    }
	 * }
	 */
	if (v.celldata) {
		// 注意 这里的 celldata 很多都是没有内容的，因此 需要判断 v m 都存在 才执行记录，不然浪费存储空间
		for (let i = 0; i < v.celldata.length; i++) {
			let item = v.celldata[i];
			// {"r":7,"c":6,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1}}
			// {"r":10,"c":9,"v":{"ct":{"fa":"General"},"bg":"#FFFF00","fs":11,"fc":"#FF0000","ff":"宋体","vt":0,"tb":1,"v":"123"}}
			// 不然创建新的 celldata 记录
			const newCellDataItem: CellDataModelType = {
				worker_sheet_id: v.index,
				r: item.r,
				c: item.c,
				v: <string>item.v.v || "",
				m: <string>item.v.v || "",
				ctfa: item.v?.ct?.fa || "General",
				ctt: item.v?.ct?.t || "g",
				bg: item.v.bg || "",
				fc: item.v.fc || "",
				bl: Boolean(item.v.bl),
				cl: Boolean(item.v.cl),
				ht: item.v.ht || 0,
				vt: item.v.vt || 0,
				f: item.v.f || "",
				un: Boolean(item.v.un),
				ps: <string>item.v.ps?.value,
			};

			// 执行插入操作
			await CellDataService.createCellData(newCellDataItem);
		}
	}

	if (v.config?.borderInfo) {
		for (let i = 0; i < v.config.borderInfo.length; i++) {
			const item = v.config.borderInfo[i];
			/**
			 * 创建 borderinfo
			 * {
			 * 	"row_index":7,
			 * 	"col_index":6,
			 * 	"l":{"style":1,"color":"#000000"},
			 * 	"r":{"style":1,"color":"#000000"},
			 * 	"t":{"style":1,"color":"#000000"},
			 * 	"b":{"style":1,"color":"#000000"}
			 * }
			 */
			// 判断当前 border 的类型
			if (item.rangeType === "cell") {
				const newBorderInfo: BorderInfoModelType = {
					worker_sheet_id: v.index,
					rangeType: item.rangeType,
					row_index: item.value?.row_index,
					col_index: item.value?.col_index,
					l_style: item.value?.l?.style,
					l_color: item.value?.l?.color,
					t_style: item.value?.t?.style,
					t_color: item.value?.t?.color,
					r_style: item.value?.r?.style,
					r_color: item.value?.r?.color,
					b_style: item.value?.b?.style,
					b_color: item.value?.b?.color,
				};
				await BorderInfoService.createConfigBorder(newBorderInfo);
			} else if (item.rangeType === "range") {
			}
		}
	}

	if (v.config?.merge) {
	}

	if (v.config?.colhidden) {
	}

	if (v.config?.columnlen) {
	}

	if (v.config?.rowhidden) {
	}

	if (v.config?.rowlen) {
	}
}

// 复制sheet - 复制了sheet 后，应该从被复制 sheet 的 index 直接复制数据即可，不需要saveParam
async function shc(data: string, gridKey: string) {
	// {"t":"shc","i":"Sheet_0NHdie3o0ba5_1734351308939","v":{"copyindex":"12f8254d-3914-4f79-9886-9f9aec173048","name":"Sheet(副本)"}}
	// 至于复制的sheet该放在什么位置上，会同步触发 shr 事件，调整sheet的位置
	logger.info("[CRDT DATA]:", data);
	const { t, i, v } = <CRDTDataType<SHA>>JSON.parse(data);
	if (t !== "shc") return logger.error("t is not shc.");
	if (isEmpty(i)) return logger.error("i is empty.");

	const copy_sheet_info: WorkerSheetModelType = {
		worker_sheet_id: i,
		name: v.name,
		gridKey,
	};
	await WorkerSheetService.createSheet(copy_sheet_info);

	// 真实实现复制 sheet 数据
	await copySheetData(v.copyindex!, i);
}

// 删除sheet - 不可以直接删除记录，因为还需要恢复，应该标记 deleteFlag 属性即可
// celldata可能存在外键关联，请注意删除顺序
// 请注意： 删除 Sheet 请真实删除 celldata 数据
async function shd(data: string) {
	logger.info("[CRDT DATA]:", data);
	const { t, v } = <CRDTDataType<{ deleIndex: string }>>JSON.parse(data);
	if (t !== "shd") return logger.error("t is not shd.");
	// {"t":"shd","i":null,"v":{"deleIndex":"Sheet_06ok13WM3kS3_1734398401711"}}
	// 更新 deleteFlag = true
	const info = <WorkerSheetModelType>{
		worker_sheet_id: v.deleIndex,
		deleteFlag: true,
	};
	await WorkerSheetService.update(info);
}

// 删除sheet后恢复操作
async function shre(data: string) {
	// {"t":"shre","i":null,"v":{"reIndex":"Sheet_06ok13WM3kS3_1734398401711"}}
	logger.info("[CRDT DATA]:", data);
	const { t, v } = <CRDTDataType<{ reIndex: string }>>JSON.parse(data);
	if (t !== "shre") return logger.error("t is not shre.");
	// 更新 deleteFlag = false
	const info = <WorkerSheetModelType>{
		worker_sheet_id: v.reIndex,
		deleteFlag: false,
	};
	await WorkerSheetService.update(info);
}

// 调整sheet位置
async function shr(data: string) {
	// {"t":"shr","i":null,"v":{"12f8254d-3914-4f79-9886-9f9aec173048":0,"Sheet_0NHdie3o0ba5_1734351308939":1,"Sheet_oi07n566135m_1734351229761":2}}
	logger.info("[CRDT DATA]:", data);
	const { t, v } = <CRDTDataType<{ [key: string]: number }>>JSON.parse(data);
	if (t !== "shr") return logger.error("t is not shr.");

	// 循环调整位置
	for (const i in v) {
		if (Object.prototype.hasOwnProperty.call(v, i)) {
			const order = v[i];
			// 调整位置
			const info = <WorkerSheetModelType>{ worker_sheet_id: i, order };
			await WorkerSheetService.update(info);
		}
	}
}

// sheet属性(隐藏或显示)
async function sh(data: string) {
	// {"t":"sh","i":"Sheet_06ok13WM3kS3_1734398401711","v":1,"op":"hide","cur":"Sheet_ieo3iK3lo0m3_1734353939113"}
	logger.info("[CRDT DATA]:", data);
	const { t, v, i } = <CRDTDataType<number>>JSON.parse(data);
	if (t !== "sh") return logger.error("t is not sh.");
	if (isEmpty(i)) return logger.error("i is empty.");

	// 更新 deleteFlag = false
	const info = <WorkerSheetModelType>{
		worker_sheet_id: i,
		hide: Boolean(v),
	};
	await WorkerSheetService.update(info);
}

// 图表操作
async function c(data: string) {
	logger.info("[CRDT DATA]:", data);
	const { t, v, i, op } = <CRDTDataType<CHART>>JSON.parse(data);
	if (t !== "c") return logger.error("t is not c.");
	if (isEmpty(i)) return logger.error("i is undefined.");
	// 所有的图表ID均由前台传递
	// 创建图表
	const chartInfo = {
		chartType: v.chartType,
		worker_sheet_id: i,
		chart_id: v.chart_id,
		width: v.width,
		height: v.height,
		left: v.left,
		top: v.top,
		needRangeShow: v.needRangeShow,
		chartOptions: JSON.stringify(v.chartOptions),
	};
	if (op === "add") {
		await ChartService.createChart(chartInfo);
	}

	// 更新图表
	//  {"t":"c","i":"89357e56-c6bc-4de0-bfd1-0e00b3086da4","v":{"chart_id":"chart_01ieK40e4Kal_1734335434241","left":"172.3px","top":"158.3px","scrollTop":0,"scrollLeft":0},"cid":"chart_01ieK40e4Kal_1734335434241","op":"xy"}
	else if (op === "xy" || op === "wh") {
		await ChartService.updateChart({
			chartType: v.chartType,
			worker_sheet_id: i,
			chart_id: v.chart_id,
			left: v.left,
			top: v.top,
			width: v.width,
			height: v.height,
		});
	}

	// 更新图表配置
	else if (op === "update") {
		await ChartService.updateChart({
			chartType: v.chartType,
			worker_sheet_id: i,
			chart_id: v.chart_id,
			chartOptions: JSON.stringify(v.chartOptions),
		});
	}

	// 删除图表
	// {"t":"c","i":"89357e56-c6bc-4de0-bfd1-0e00b3086da4","v":{"cid":"chart_WW0t3io1towN_1734335743092"},"cid":"chart_WW0t3io1towN_1734335743092","op":"del"}
	else if (op === "del") {
		await ChartService.deleteChart(v.chart_id);
	}

	// TODO:
	// 图表更新单元格数据 update_data
	// {"t":"c","i":0,"v":{"r_st":1,"r_ed":1,"c_st":1,"c_ed":1,chart_id:"",chartOptions:""},"op":"update_data"}
	else if (op === "update_data") {
		// 更新 ChartModel options 配置项
		await ChartService.updateChart({
			chartType: v.chartType,
			worker_sheet_id: i,
			chart_id: v.chart_id,
			chartOptions: JSON.stringify(v.chartOptions),
		});
	}
}

// 修改工作簿名称
async function na(data: string, gridKey: string) {
	// {"t":"na","i":null,"v":"Luckysheet Demo222"}
	logger.info("[CRDT DATA]:", data);
	const { t, v } = <CRDTDataType<string>>JSON.parse(data);
	if (t !== "na") return logger.error("t is not na.");

	// 更新 workerBook name 属性即可 gridkey 在用户身上
	await WorkerBookService.update({ title: v, gridKey });
}

/**
 * 工具函数 - 复制 Sheet 时，需要同步被复制 sheet 的所有数据 borders、celldatas、charts、hidneandlens、images、merges
 * @param copyIndex 被复制的 sheet index
 * @param newSheetIndex 新 sheet index
 */
async function copySheetData(copyIndex: string, newSheetIndex: string) {
	// ==> copyIndex 25a110fd-8e06-4318-a2d2-c42606b266ee
	// ==> newSheetIndex Sheet_5330eTr735lz_1743664108612
	// 处理思路：先 查询当前被复制 sheet 的所有数据，然后批量插入到新 sheet 中
	// borders
	const copySheetBorder = await BorderInfoService.findAllBorder(copyIndex);
	if (copySheetBorder?.length) {
		for (let i = 0; i < copySheetBorder.length; i++) {
			const item = copySheetBorder[i].dataValues;
			delete item.config_border_id;
			// 批量插入到新 sheet 中
			await BorderInfoService.createConfigBorder({
				...item,
				worker_sheet_id: newSheetIndex,
			});
		}
	}

	// celldatas
	const copySheetCellData = await CellDataService.getCellData(copyIndex);
	if (copySheetCellData?.length) {
		for (let i = 0; i < copySheetCellData.length; i++) {
			const item = copySheetCellData[i].dataValues;
			delete item.cell_data_id;
			// 批量插入到新 sheet 中
			await CellDataService.createCellData({
				...item,
				worker_sheet_id: newSheetIndex,
			});
		}
	}

	// charts  hidneandlens  images 暂不处理 原理类似哈

	// merges
	const copySheetMerge = await MergeService.findAllMerge(copyIndex);
	if (copySheetMerge?.length) {
		for (let i = 0; i < copySheetMerge.length; i++) {
			const item = copySheetMerge[i].dataValues;
			delete item.config_merge_id;
			// 批量插入到新 sheet 中
			await MergeService.createMerge({
				...item,
				worker_sheet_id: newSheetIndex,
			});
		}
	}
}
