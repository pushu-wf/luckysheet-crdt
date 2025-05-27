<template>
	<div id="luckysheet-container"></div>
</template>

<script setup lang="ts">
import router from "../../router";
import { getLoadUrl } from "../../utils";
import { useUserStore } from "../../store/User";
import { API_getWorkerBook } from "../../axios";
import { onBeforeUnmount, onMounted } from "vue";
import { defaultSheetData, WS_SERVER_URL } from "../../config";
import { uploadImage, imageUrlHandle } from "../../utils/LuckysheetImage";

const { userInfo } = useUserStore();
const luckysheet = Reflect.get(window, "luckysheet");

// 初始化 luckysheet
async function initLuckysheet(gridKey: string) {
	const { userid, username } = userInfo;

	const options = {
		lang: "zh",
		title: "Luckysheet",
		container: "luckysheet-container",
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
		options.updateUrl = `${WS_SERVER_URL}?type=luckysheet&userid=${userid}&username=${username}&gridkey=${gridKey}`;
		luckysheet.create(options);
	} catch (error) {
		console.error("==> 协同服务异常", error);
		// 不然初始化普通模式，避免页面空白
		Reflect.set(options, "data", defaultSheetData);
		luckysheet.create(options);
	}
}

// 获取router参数
onMounted(async () => {
	// 从 router 获取参数
	const { gridKey } = router.currentRoute.value.params;
	if (!gridKey) return;

	initLuckysheet(<string>gridKey);
});

onBeforeUnmount(() => {
	// 销毁 luckysheet
	luckysheet && luckysheet.closeWebSocket();
});
</script>

<style lang="less" scoped>
#luckysheet-container {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
</style>
