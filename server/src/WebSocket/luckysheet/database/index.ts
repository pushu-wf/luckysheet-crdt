import { v } from "./v";
import { rv } from "./rv";
import { cg } from "./cg";
import { all } from "./all";
import { fc } from "./fc";
import { drc } from "./drc";
import { arc } from "./arc";
import { shd } from "./shd";
import { shre } from "./shre";
import { shr } from "./shr";
import { c } from "./c";
import { sh } from "./sh";
import { na } from "./na";
import { sha } from "./sha";
import { shc } from "./shc";
import { cp } from "./cp";

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
	else if (t === "cp") cp(data)
}

// 清除筛选
async function fsc(data: string) {
	console.log("==> fsc", data);
}

// 恢复筛选
async function fsr(data: string) {
	console.log("==> fsr", data);
}
