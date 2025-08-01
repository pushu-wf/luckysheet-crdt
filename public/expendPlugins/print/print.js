import luckysheetConfigsetting from "./luckysheetConfigsetting";
import { zoomChange } from "./zoom";
import sheetmanage from "./sheetmanage";
import server from "./server";
import { rowLocationByIndex, colLocationByIndex, mouseposition, rowLocation, colLocation } from "../global/location";
import Store from "../store";
import { luckysheet_searcharray } from "./sheetSearch";
import menuButton from "../controllers/menuButton";
import { luckysheetDrawMain } from "../global/draw";
import { luckysheetdefaultstyle } from "./constant";

let ExcelPlaceholder = {
	"[tabName]": "&A",
	"[CurrentDate]": "&D",
	"[fileName]": "&F",
	"[background]": "&G",
	"[Shadow]": "&H",
	"[TotalPages]": "&N",
	"[pageNumber]": "&P",
	"[CurrentTime]": "&T",
	"[filePath]": "&Z",
};

// 获取1mm的像素
function getOneMmsPx() {
	let div = document.createElement("div");
	div.style.width = "1mm";
	document.querySelector("body").appendChild(div);
	let mm1 = div.getBoundingClientRect();
	let w = mm1.width;
	$(div).remove();
	return w;
}

function viewChange(curType, preType) {
	let currentSheet = sheetmanage.getSheetByIndex();

	if (currentSheet.config == null) {
		currentSheet.config = {};
	}

	if (currentSheet.config.sheetViewZoom == null) {
		currentSheet.config.sheetViewZoom = {};
	}

	let defaultZoom = 1,
		type = "zoomScaleNormal";
	printLineAndNumberDelete(currentSheet);
	if (curType == "viewNormal") {
		type = "viewNormalZoomScale";
	} else if (curType == "viewLayout") {
		type = "viewLayoutZoomScale";
	} else if (curType == "viewPage") {
		type = "viewPageZoomScale";
		defaultZoom = 1;
	}

	let curZoom = currentSheet.config.sheetViewZoom[type];
	if (curZoom == null) {
		curZoom = defaultZoom;
	}

	currentSheet.config.curentsheetView = curType;

	if (Store.clearjfundo) {
		Store.jfredo.push({
			type: "viewChange",
			curType: curType,
			preType: preType,
			sheetIndex: Store.currentSheetIndex,
		});
	}

	// Store.zoomRatio = curZoom;
	// server.saveParam("all", Store.currentSheetIndex, curZoom, { "k": "zoomRatio" });
	server.saveParam("cg", Store.currentSheetIndex, curType, { k: "curentsheetView" });

	Store.currentSheetView = curType;

	zoomChange(curZoom);
}

function printLineAndNumberDelete(sheet) {}

/**
 * @description 在分页预览模式下绘制页面边界线和页码
 */
function printLineAndNumberCreate() {
	if (Store.flowdata == null) {
		return;
	}

	let scrollWidth = $("#luckysheet-cell-main").scrollLeft();
	let scrollHeight = $("#luckysheet-cell-main").scrollTop();
	let drawWidth = Store.luckysheetTableContentHW[0];
	let drawHeight = Store.luckysheetTableContentHW[1];
	let offsetLeft = Store.rowHeaderWidth;
	let offsetTop = Store.columnHeaderHeight;

	// 获取canvas上下文
	const luckysheetTableContent = $("#luckysheetTableContent").get(0).getContext("2d");
	luckysheetTableContent.save();
	// 保持与 drawMain 一致的缩放
	luckysheetTableContent.scale(Store.devicePixelRatio, Store.devicePixelRatio);

	// 默认A4纸张大小 210x297mm 转换为像素 - 这个值是A4纸张的像素大小，固定不变的，需要将其绑定到单元格上，跟随单元格缩放
	// const paperWidth = 210 * getOneMmsPx();
	const paperWidth = 210 * Store.zoomRatio;
	// const paperHeight = 297 * getOneMmsPx();
	const paperHeight = 297 * Store.zoomRatio; // 一定跟随缩放

	const { fill_col_ed, fill_row_ed } = getStartAndEndRowAndCol(scrollWidth, scrollHeight, drawWidth, drawHeight);

	// 计算表格的宽高 - 可视区的宽高哈，并不是真实的完整的表格宽高
	const sheetWidth = fill_col_ed - scrollWidth;
	const sheetHeight = fill_row_ed - scrollHeight;

	// 必须知道全部的页码，才能正确地绘制出 第几页 的关系。
	// 当前的总行数
	const rowCount = Store.visibledatarow.length;
	const colCount = Store.visibledatacolumn.length;

	let horizontalCells = [];
	let verticalCells = [];

	// 这里是循环当前行一共可分为多少页
	for (let r = 0; r < rowCount; r++) {
		// 如果行被隐藏了 则跳过
		if (Store.config["rowhidden"] != null && Store.config["rowhidden"][r] != null) continue;

		// 当前行的 Y 坐标 - 真实的 y 坐标，与可视区无关
		let current_end_y = Store.visibledatarow[r];

		// 前一行的 Y 坐标 - 真实的 y 坐标，与可视区无关
		let prev_end_y = r > 0 ? Store.visibledatarow[r - 1] : 0;

		// 计算相对于前一个分页线的坐标
		let relativeCurrentY = current_end_y;
		let relativePrevY = prev_end_y;

		// 如果已经有分页线，则基于上一个分页线计算相对位置
		if (horizontalCells.length > 0) {
			let lastPageBreak = horizontalCells[horizontalCells.length - 1].rowIndex;
			let lastPageBreakY = Store.visibledatarow[lastPageBreak];
			relativeCurrentY = current_end_y - lastPageBreakY;
			relativePrevY = prev_end_y - lastPageBreakY;
		}

		// 计算当前行属于第几个页面（基于页面高度的倍数）
		let currentPageIndex = Math.floor(relativeCurrentY / paperHeight);

		// 计算前一行属于第几个页面
		let prevPageIndex = Math.floor(relativePrevY / paperHeight);

		// 如果当前行和前一行属于不同的页面，说明当前行是新页面的开始行
		if (currentPageIndex > prevPageIndex) {
			horizontalCells.push({ rowIndex: r, y: current_end_y });
		}
	}

	// 循环所有列
	for (let c = 0; c < colCount; c++) {
		// 如果列被隐藏了 则跳过
		if (Store.config && Store.config["colhidden"] != null && Store.config["colhidden"][c] != null) continue;

		// 当前列的 X 坐标 - 真实的 x 坐标，与可视区无关
		let current_end_x = Store.visibledatacolumn[c];

		// 前一列的 X 坐标 - 真实的 x 坐标，与可视区无关
		let prev_end_x = c > 0 ? Store.visibledatacolumn[c - 1] : 0;

		// 计算相对于前一个分页线的坐标
		let relativeCurrentX = current_end_x;
		let relativePrevX = prev_end_x;

		// 如果已经有分页线，则基于上一个分页线计算相对位置
		if (verticalCells.length > 0) {
			let lastPageBreak = verticalCells[verticalCells.length - 1].colIndex;
			let lastPageBreakX = Store.visibledatacolumn[lastPageBreak];
			relativeCurrentX = current_end_x - lastPageBreakX;
			relativePrevX = prev_end_x - lastPageBreakX;
		}

		// 计算当前列属于第几个页面（基于页面宽度的倍数）
		let currentPageIndex = Math.floor(relativeCurrentX / paperWidth);

		// 计算前一列属于第几个页面
		let prevPageIndex = Math.floor(relativePrevX / paperWidth);

		// 如果当前列和前一列属于不同的页面，说明当前列是新页面的开始列
		if (currentPageIndex > prevPageIndex) {
			verticalCells.push({ colIndex: c, x: current_end_x });
		}
	}

	// 一行可以被分为多少页？
	const rowPageCount = verticalCells.length;

	// 则每新增一行，都以 rowPageCount 为倍数递增即可
	for (let i = 0; i < horizontalCells.length; i++) {
		// 这个是行的 Y 值哈
		const row = horizontalCells[i];

		// 为了实现居中，当前间隔的中心坐标是
		const currentY = row.y;
		const prevY = i > 0 ? horizontalCells[i - 1].y : 0;
		const centerY = currentY - (currentY - prevY) / 2 - scrollHeight;

		// 绘制水平线
		drawPrintLine(luckysheetTableContent, offsetLeft, row.y - scrollHeight + offsetTop, sheetWidth, row.y - scrollHeight + offsetTop);

		for (let j = 0; j < verticalCells.length; j++) {
			// 实现 X 居中，原理类似
			const col = verticalCells[j];
			const currentX = col.x;
			const prevX = j > 0 ? verticalCells[j - 1].x : 0;
			const centerX = currentX - (currentX - prevX) / 2 - scrollWidth + offsetLeft;

			// 绘制垂直线 - 类似
			drawPrintLine(
				luckysheetTableContent,
				col.x - scrollWidth + offsetLeft,
				offsetTop,
				col.x - scrollWidth + offsetLeft,
				sheetHeight
			);

			drawPageNumbers(luckysheetTableContent, centerX, centerY, i * rowPageCount + j + 1);
		}
	}

	// 恢复canvas状态
	luckysheetTableContent.restore();
}

/**
 * @description 辅助函数 - 绘制打印页码，实现水平垂直居中显示"第几页"
 * @param {CanvasRenderingContext2D} ctx - Canvas绘图上下文
 * @param {Number} x - 绘制的X坐标
 * @param {Number} y - 绘制的Y坐标
 * @param {Number} pageNum - 页码
 * @param {String} [font="18px Arial"] - 字体样式
 * @param {String} [fillStyle="#55bb8a"] - 填充颜色
 */
function drawPageNumbers(ctx, x, y, pageNum, font = "18px Arial", fillStyle = "#55bb8a") {
	ctx.save();
	ctx.font = font;
	ctx.fillStyle = fillStyle;

	const text = `第${pageNum}页`;
	// 获取文本宽度
	const textWidth = getTextWidth(ctx, text);
	// 获取文本高度
	const textHeight = getTextHeight(ctx, text);
	ctx.fillText(text, x - textWidth / 2, y + textHeight / 2);
	ctx.restore();
}

/**
 * @description 绘制打印线
 * @param {CanvasRenderingContext2D} ctx - Canvas绘图上下文
 * @param {Number} startX - 起始X坐标
 * @param {Number} startY - 起始Y坐标
 * @param {Number} endX - 结束X坐标
 * @param {Number} endY - 结束Y坐标
 * @param {Number} [lineWidth=1] - 线宽
 * @param {String} [strokeStyle="#55bb8a"] - 线颜色
 * @param {Array} [lineDash=[10, 6]] - 虚线样式
 * */
function drawPrintLine(ctx, startX, startY, endX, endY, lineWidth = 1, strokeStyle = "#55bb8a", lineDash = [10, 6]) {
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = lineWidth;
	ctx.setLineDash(lineDash);
	ctx.moveTo(startX, startY);
	ctx.lineTo(endX, endY);
	ctx.stroke();
	ctx.closePath();
	ctx.restore();
}

/**
 * @description 辅助函数 - 获取起始和结束行列坐标
 * @param {Number} scrollWidth - 水平滚动距离
 * @param {Number} scrollHeight - 垂直滚动距离
 * @param {Number} drawWidth - 绘制区域宽度
 * @param {Number} drawHeight - 绘制区域高度
 * @returns {Object} 包含行列坐标的对象
 */
function getStartAndEndRowAndCol(scrollWidth, scrollHeight, drawWidth, drawHeight) {
	let columnOffsetCell = 0;
	let rowOffsetCell = 0;

	// 表格渲染区域起止行列下标
	let dataset_row_st, dataset_row_ed, dataset_col_st, dataset_col_ed;

	dataset_row_st = luckysheet_searcharray(Store.visibledatarow, scrollHeight);
	dataset_row_ed = luckysheet_searcharray(Store.visibledatarow, scrollHeight + drawHeight);

	if (dataset_row_st == -1) {
		dataset_row_st = 0;
	}

	dataset_row_st += rowOffsetCell;

	if (dataset_row_ed == -1) {
		dataset_row_ed = Store.visibledatarow.length - 1;
	}

	dataset_row_ed += rowOffsetCell;

	if (dataset_row_ed >= Store.visibledatarow.length) {
		dataset_row_ed = Store.visibledatarow.length - 1;
	}

	dataset_col_st = luckysheet_searcharray(Store.visibledatacolumn, scrollWidth);
	dataset_col_ed = luckysheet_searcharray(Store.visibledatacolumn, scrollWidth + drawWidth);

	if (dataset_col_st == -1) {
		dataset_col_st = 0;
	}

	dataset_col_st += columnOffsetCell;

	if (dataset_col_ed == -1) {
		dataset_col_ed = Store.visibledatacolumn.length - 1;
	}

	dataset_col_ed += columnOffsetCell;

	if (dataset_col_ed >= Store.visibledatacolumn.length) {
		dataset_col_ed = Store.visibledatacolumn.length - 1;
	}

	// 表格渲染区域起止行列坐标
	let fill_row_st, fill_row_ed, fill_col_st, fill_col_ed;

	if (dataset_row_st == 0) {
		fill_row_st = 0;
	} else {
		fill_row_st = Store.visibledatarow[dataset_row_st - 1];
	}
	fill_row_ed = Store.visibledatarow[dataset_row_ed];

	if (dataset_col_st == 0) {
		fill_col_st = 0;
	} else {
		fill_col_st = Store.visibledatacolumn[dataset_col_st - 1];
	}
	fill_col_ed = Store.visibledatacolumn[dataset_col_ed];

	return { dataset_row_st, dataset_row_ed, dataset_col_st, dataset_col_ed, fill_col_ed, fill_row_ed };
}

// 截取指定页码的页面
function getScreenshotByPageNum(pageNum = 1) {
	// 通过页码，计算得出有限范围坐标

	const ch_width = 222;
	const rh_height = 300;

	let newCanvas = $("<canvas>")
		.attr({
			width: Math.ceil(ch_width * Store.devicePixelRatio),
			height: Math.ceil(rh_height * Store.devicePixelRatio),
		})
		.css({ width: ch_width, height: rh_height });

	// 进行后续的操纵
	handleScreenshot(newCanvas, ch_width, rh_height);
}

// 截取指定单元格页面
function getScreenshotBySelection(options = {}) {
	let { range = Store.luckysheet_select_save[Store.luckysheet_select_save.length - 1] } = { ...options };

	if (getObjType(range) == "string") {
		if (!formula.iscelldata(range)) {
			return tooltip.info("The range parameter is invalid.", "");
		}

		let cellrange = formula.getcellrange(range);
		range = {
			row: cellrange.row,
			column: cellrange.column,
		};
	}

	if (getObjType(range) != "object" || range.row == null || range.column == null) {
		return tooltip.info("The range parameter is invalid.", "");
	}

	let str = range.row[0],
		edr = range.row[1],
		stc = range.column[0],
		edc = range.column[1];

	let has_PartMC = hasPartMC(Store.config, str, edr, stc, edc);

	if (has_PartMC) {
		return tooltip.info("Cannot perform this operation on partially merged cells", "");
	}

	let visibledatarow = Store.visibledatarow;
	let visibledatacolumn = Store.visibledatacolumn;

	let scrollHeight, rh_height;
	if (str - 1 < 0) {
		scrollHeight = 0;
		rh_height = visibledatarow[edr];
	} else {
		scrollHeight = visibledatarow[str - 1];
		rh_height = visibledatarow[edr] - visibledatarow[str - 1];
	}

	let scrollWidth, ch_width;
	if (stc - 1 < 0) {
		scrollWidth = 0;
		ch_width = visibledatacolumn[edc];
	} else {
		scrollWidth = visibledatacolumn[stc - 1];
		ch_width = visibledatacolumn[edc] - visibledatacolumn[stc - 1];
	}

	let newCanvas = $("<canvas>")
		.attr({
			width: Math.ceil(ch_width * Store.devicePixelRatio),
			height: Math.ceil(rh_height * Store.devicePixelRatio),
		})
		.css({ width: ch_width, height: rh_height });

	// 进行后续的操纵
	handleScreenshot(newCanvas, ch_width, rh_height);
}

/**
 * @description 截图的后续处理工作
 */
function handleScreenshot(newCanvas, ch_width, rh_height) {
	let scrollWidth = $("#luckysheet-cell-main").scrollLeft();
	let scrollHeight = $("#luckysheet-cell-main").scrollTop();

	// 绘制页面主要内容 - ch_width rh_height 就是指定的页面截图范围
	luckysheetDrawMain(scrollWidth, scrollHeight, ch_width, rh_height, 1, 1, null, null, newCanvas);
	let ctx_newCanvas = newCanvas.get(0).getContext("2d");

	//补上 左边框和上边框
	ctx_newCanvas.beginPath();
	ctx_newCanvas.moveTo(0, 0);
	ctx_newCanvas.lineTo(0, Store.devicePixelRatio * rh_height);
	ctx_newCanvas.lineWidth = Store.devicePixelRatio * 2;
	ctx_newCanvas.strokeStyle = luckysheetdefaultstyle.strokeStyle;
	ctx_newCanvas.stroke();
	ctx_newCanvas.closePath();

	ctx_newCanvas.beginPath();
	ctx_newCanvas.moveTo(0, 0);
	ctx_newCanvas.lineTo(Store.devicePixelRatio * ch_width, 0);
	ctx_newCanvas.lineWidth = Store.devicePixelRatio * 2;
	ctx_newCanvas.strokeStyle = luckysheetdefaultstyle.strokeStyle;
	ctx_newCanvas.stroke();
	ctx_newCanvas.closePath();

	// 补齐统计图 图片

	let url = newCanvas.get(0).toDataURL("image/png");
	console.log(url);
}

/**
 * @description 计算文本宽度
 */
function getTextWidth(ctx, text) {
	return ctx.measureText(text).width;
}

/**
 * @description 计算文本高度
 */
function getTextHeight(ctx, text) {
	const metrics = ctx.measureText(text);
	return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
}

/**
 * @description 切换视图
 */
function switchViewBtn($t) {
	let $viewList = $t.parent(),
		preType = $viewList.find("luckysheet-print-viewBtn-active").attr("type");
	if ($t.attr("type") == preType) {
		return;
	}

	let curType = $t.attr("type");
	if (curType != null) {
		viewChange(curType, preType);
	} else {
		return;
	}

	$t.parent().find(".luckysheet-print-viewBtn").removeClass("luckysheet-print-viewBtn-active");
	$t.addClass("luckysheet-print-viewBtn-active");
}

function printInitial() {
	let container = luckysheetConfigsetting.container;
	let _this = this;
	$("#" + container)
		.find(".luckysheet-print-viewBtn")
		.click(function () {
			switchViewBtn($(this));
		});
}

export { viewChange, printInitial, printLineAndNumberCreate, getScreenshotByPageNum, getScreenshotBySelection };
