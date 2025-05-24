import { MD5 } from "crypto-js";
import { localForage } from "../localforage";

// 获取当前环境是否为 开发环境
const isDev = () => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return import.meta.env.MODE === "development";
};

// 获取随机值
const getRandom = () => {
	return Math.random().toString(16).slice(2, 8);
};

// 获取 loadUrl 地址
const getLoadUrl = (gridKey: string) => {
	return `${isDev() ? "/api/" : "/"}loadSheetData?gridkey=${gridKey}`;
};

//  md5 加密
function md5(password: string): string {
	return MD5(password).toString();
}

// 获取用户信息
function getUserInfo() {
	return localForage.getItem("userInfo");
}

// 将内容写入粘贴板
function writeToClipboard(text: string) {
	if (window.navigator.clipboard) {
		navigator.clipboard.writeText(text);
	} else {
		const textarea = document.createElement("textarea");
		textarea.style.position = "absolute";
		textarea.style.left = "-9999px";
		textarea.value = text;
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);
	}
}

export { getLoadUrl, getRandom, md5, isDev, getUserInfo, writeToClipboard };
