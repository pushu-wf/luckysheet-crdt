<template>
	<!-- 自定义头部 -->
	<div class="luckysheet-header">
		<a-dropdown trigger="['click']">
			<a-button type="text" :icon="h(MenuOutlined)" />
			<template #overlay>
				<a-menu>
					<a-menu-item> 返回首页 </a-menu-item>
				</a-menu>
			</template>
		</a-dropdown>
		<img
			@click="router.push('/home')"
			src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAAAgCAYAAADuW7E5AAAACXBIWXMAAC4jAAAuIwF4pT92AAAGgWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDI0LTEyLTE5VDE1OjAwOjUyKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTEyLTE5VDE1OjAwOjUyKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyNC0xMi0xOVQxNTowMDo1MiswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkOWU2MWRlZi1kNmMzLTI5NDktYjY5NS04MTlmNjQwMTdiNTIiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMGRiNGE2Zi1kYzczLTJiNGQtYWVkZi04OWZhZWE5N2U4NGQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiMDAyODdkMi1iMTBjLTZmNGQtYTUzZS1iZWNhMGQxZjgyYzciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIwMDI4N2QyLWIxMGMtNmY0ZC1hNTNlLWJlY2EwZDFmODJjNyIgc3RFdnQ6d2hlbj0iMjAyNC0xMi0xOVQxNTowMDo1MiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpkOWU2MWRlZi1kNmMzLTI5NDktYjY5NS04MTlmNjQwMTdiNTIiIHN0RXZ0OndoZW49IjIwMjQtMTItMTlUMTU6MDA6NTIrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJMdWNreXNoZWV0IiBwaG90b3Nob3A6TGF5ZXJUZXh0PSJMdWNreXNoZWV0Ii8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz76Z2J7AAAJL0lEQVR4nO2cbYhjVxnHfzOMbq2rm5YWlNaaxVKwBptRfAGFzdTGwFpxppJCkWwzVesiyMw4MfXlXmaHez9oyOxk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"
			alt="" />

		<a-input v-model:value="fileName" style="width: auto; margin-left: auto">
			<template #prefix>
				<FileExcelOutlined />
			</template>
		</a-input>

		<!-- 消息 -->
		<a-badge dot style="margin-left: auto">
			<a-button type="text" :icon="h(CommentOutlined)" />
		</a-badge>
		<!-- 头像组 -->
		<a-avatar-group shape="square" style="margin-left: 20px; cursor: pointer" :maxCount="4">
			<a-avatar style="background-color: #fde3cf">A</a-avatar>
			<a-avatar style="background-color: #f56a00">K</a-avatar>
			<a-avatar style="background-color: #f56a00">K</a-avatar>
			<a-avatar style="background-color: #f56a00">K</a-avatar>
		</a-avatar-group>
	</div>
	<div id="luckysheet-container"></div>
</template>

<script setup lang="ts">
import router from "../../router";
import { message, theme } from "ant-design-vue";
import { useUserStore } from "../../store/User";
import { localForage } from "../../localforage";
import { decode, getLoadUrl } from "../../utils";
import { h, onBeforeUnmount, onMounted, ref } from "vue";
import { defaultSheetData, WS_SERVER_URL } from "../../config";
import { uploadImage, imageUrlHandle } from "../../utils/LuckysheetImage";
import { API_checkSheetEditPermission, API_getWorkerBook } from "../../axios";
import { MenuOutlined, FileExcelOutlined, CommentOutlined } from "@ant-design/icons-vue";

const { userInfo } = useUserStore();
const luckysheet = Reflect.get(window, "luckysheet");

// 当前文件名称
const fileName = ref("");

const { token } = theme.useToken();

/**
 * @description 无编辑权限提示
 * @param gridKey
 */
function noEditPermission(gridKey: string) {
	message.warn({
		content: () =>
			h("span", { style: { userSelect: "none" } }, [
				h("span", null, "您仅有查看权限！"),
				h(
					"span",
					{ style: { color: "#1890ff", cursor: "pointer" }, onClick: () => applyEditPermission(gridKey) },
					"可申请编辑权限"
				),
			]),
	});
}

/**
 * @description 申请编辑权限
 * @param gridKey
 */
async function applyEditPermission(gridKey: string) {
	console.log(" ==> 申请编辑权限");
}

/**
 * @description 初始化 luckysheet
 * @param gridKey
 * @param editable 是否可编辑
 */
async function initLuckysheet(gridKey: string, editable: boolean = true) {
	const { userid, username } = userInfo;

	const options = {
		lang: "zh",
		title: "Luckysheet",
		container: "luckysheet-container",
		showinfobar: false, // 隐藏顶部的信息栏
		allowUpdate: false, // 配置协同功能
		loadUrl: "",
		updateUrl: "", // 协同服务转发服务
		plugins: ["chart", "vchart", "fileImport", "fileExport"],

		// 添加请求头
		requestHeaders: { authorization: localForage.getItem("token") },

		// hook 实现仅查看功能
		hook: {
			cellEditBefore() {
				if (!editable) noEditPermission(gridKey);
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

		// 记录文件名称
		fileName.value = data.data.title;

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
	luckysheet && luckysheet.closeWebSocket();
});
</script>

<style lang="less" scoped>
.luckysheet-header {
	height: 48px;
	display: flex;
	align-items: center;
	padding: 0 10px;
	img {
		margin: 0 10px;
		cursor: pointer;
	}
	// 输入框前缀图标
	.ant-input-affix-wrapper .ant-input-prefix .anticon {
		color: v-bind("token.colorTextQuaternary");
	}
}
#luckysheet-container {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	width: 100vw;
	height: calc(100vh - 48px);
	overflow: hidden;
}
</style>
