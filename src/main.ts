/**
 * @author https://gitee.com/wfeng0/luckysheet-crdt
 * @description Luckysheet CRDT 协同全功能实现 - Web App
 * @license Apache 2.0
 * @copyright Copyright (c) 2025 https://gitee.com/wfeng0/luckysheet-crdt
 * @time 2024年12月05日
 */

import "./style/index.css";
import { API_getWorkerBook } from "./axios";
import { defaultSheetData, WS_SERVER_URL } from "./config";
import { uploadImage, imageUrlHandle, getRandom, getLoadUrl } from "./utils";

window.onload = initLuckysheet;

const luckysheet = Reflect.get(window, "luckysheet");

/**
 * 需要监听刷新、退出浏览器事件，关闭socket 连接，避免协同异常
 */
window.onbeforeunload = () => luckysheet && luckysheet.closeWebSocket();

/**
 * 初始化前台 Luckysheet
 * 请注意，目前前台仅为展示，并无其他能力，因此加载的是默认协同演示 worker books 数据，gridkey = gridkey_demo
 * 常理来说，当前工作簿的数据，都应该通过 fileid （gridkey） 请求得来
 */
async function initLuckysheet() {
	const id = getRandom();
	const username = `user_${id}`;
	const gridKey = "gridkey_demo"; // 请注意大小写哈~

	const options = {
		lang: "zh",
		title: "Luckysheet",
		container: "luckysheetContainer",
		// showinfobar: false, // 隐藏顶部的信息栏
		allowUpdate: false, // 配置协同功能
		loadUrl: "",
		updateUrl: "", // 协同服务转发服务
		plugins: ["chart", "vchart", "fileImport", "fileExport"],
		menuHandler: {
			customs: [
				{
					label: "测试",
					value: "demo",
				},
			],
		},
	};

	try {
		// 根据 gridkey 请求当前 workerbook 数据
		const { data } = await API_getWorkerBook(gridKey);

		// 定义请求是否成功
		const isSuccess = data.code === 200;

		/**
		 * 兼容无数据库服务场景
		 *  1. 如果请求成功，则使用数据库配置的 workerbook 数据
		 *  2. 如果请求失败，则使用默认配置的 workerbook 数据
		 */
		options.lang = isSuccess ? data.data.lang : "zh";
		options.title = isSuccess ? data.data.title : "未命名工作簿";

		// 协同场景下，才进行图片优化
		Reflect.set(options, "uploadImage", uploadImage);
		Reflect.set(options, "imageUrlHandle", imageUrlHandle);

		options.allowUpdate = true;
		options.loadUrl = getLoadUrl(gridKey);
		options.updateUrl = `${WS_SERVER_URL}?type=luckysheet&userid=${id}&username=${username}&gridkey=${gridKey}`;
		luckysheet.create(options);
	} catch (error) {
		console.error("==> 协同服务异常", error);
		// 不然初始化普通模式，避免页面空白
		Reflect.set(options, "data", defaultSheetData);
		luckysheet.create(options);
	}
}
