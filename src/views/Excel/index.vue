<template>
	<div id="luckysheet-container"></div>
</template>

<script setup lang="ts">
import router from "../../router";
import { decode, getLoadUrl } from "../../utils";
import { useUserStore } from "../../store/User";
import { API_checkSheetEditPermission, API_getWorkerBook } from "../../axios";
import { h, onBeforeUnmount, onMounted } from "vue";
import { defaultSheetData, WS_SERVER_URL } from "../../config";
import { uploadImage, imageUrlHandle } from "../../utils/LuckysheetImage";
import { localForage } from "../../localforage";
import { message } from "ant-design-vue";

const { userInfo } = useUserStore();
const luckysheet = Reflect.get(window, "luckysheet");

// 申请编辑权限
async function applyEditPermission(gridKey: string) {
	console.log(" ==> 申请编辑权限");
}

// 初始化 luckysheet
async function initLuckysheet(gridKey: string, editable: boolean = true) {
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
		// 添加请求头
		requestHeaders: { authorization: localForage.getItem("token") },
		// 自定义菜单
		menuHandler: {
			customs: [
				{ value: "divider" },
				{
					label: "返回首页",
					value: "back",
					callback: () => router.push("/home"),
				},
			],
		},

		// hook 实现仅查看功能
		hook: {
			cellEditBefore() {
				if (!editable)
					message.warn({
						content: () =>
							h(
								"span",
								{
									style: { userSelect: "none" },
								},
								[
									h("span", null, "您仅有查看权限！"),
									h(
										"span",
										{
											style: { color: "#1890ff", cursor: "pointer" },
											onClick: () => applyEditPermission(gridKey),
										},
										"可申请编辑权限"
									),
								]
							),
					});
				return editable;
			},
		},
	};

	try {
		// 根据 gridkey 请求当前 workerbook 数据
		const { data } = await API_getWorkerBook(gridKey);

		// 定义请求是否成功
		const isSuccess = data.code === 200;

		// 这里有可能请求数据为空，表示当前 gridkey 没有关联的数据
		if (!data.data) {
			router.push("/404");
			message.error("当前 gridkey 没有关联的数据,请检查后重试！");
			return;
		}

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
	const { filemapid } = router.currentRoute.value.params;
	if (!filemapid) return;

	// 被加密两次
	const file_map_id = decode(decode(<string>filemapid));

	// 并非简单初始化，需要请求接口获取 gridKey 并判断当前用户是否有文件编辑权限
	try {
		const { data } = await API_checkSheetEditPermission({ filemapid: file_map_id });
		if (data.code === 200) {
			initLuckysheet(data.gridKey, data.editable);
		}
	} catch (error) {
		console.error(error);
		router.push("/404");
	}
});

onBeforeUnmount(() => {
	// 销毁 luckysheet
	luckysheet && luckysheet.closeWebSocket();
});
</script>

<style lang="less" scoped>
#luckysheet-container {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
</style>
