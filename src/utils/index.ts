import { MD5 } from "crypto-js";
import { Rule } from "ant-design-vue/es/form/interface";

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

// 将字符串编码为 Base64
function encode(str: string) {
	const encoder = new TextEncoder();
	const utf8Uint8Array = encoder.encode(str);
	let binaryString = "";
	for (let i = 0; i < utf8Uint8Array.length; i++) {
		binaryString += String.fromCharCode(utf8Uint8Array[i]);
	}
	return btoa(binaryString);
}

// 将 Base64 字符串解码为原始字符串
function decode(str: string) {
	const decodedString = atob(str);
	const length = decodedString.length;
	const arrayBuffer = new Uint8Array(length);
	for (let i = 0; i < length; i++) {
		arrayBuffer[i] = decodedString.charCodeAt(i);
	}
	const decoder = new TextDecoder("utf-8");
	return decoder.decode(arrayBuffer);
}

// 验证密码强度
function checkPasswordStrength(_rule: Rule, value: string) {
	// 密码匹配正则实现： 6,12 位，含大小写字母、数字、特殊字符
	const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;
	const tips = "密码未符合强度要求：6-12位，含大小写字母、数字、特殊字符";

	return new Promise((resolve, reject) => {
		if (!value) reject("请输入密码");
		else if (!regex.test(value)) reject(tips);
		else resolve("密码验证通过");
	});
}

export { getLoadUrl, getRandom, md5, isDev, writeToClipboard, encode, decode, checkPasswordStrength };
