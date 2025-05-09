import pako from "pako";

/**
 * Pako 数据解析
 */

export function unzip(str: string): string {
	const chartData = str
		.toString()
		.split("")
		.map((i) => i.charCodeAt(0));

	const binData = new Uint8Array(chartData);

	const data = pako.inflate(binData);

	// 使用 TextDecoder 替代 String.fromCharCode + Array.from 展开
	const decoder = new TextDecoder("utf-8");
	return decodeURIComponent(decoder.decode(data));
}

/**
 * 获取 url 的某个 query 值
 * @param { string } url http://localhost:8089/?type=luckysheet&userid=1&username=userA&t=111&g=
 * @param { string } key type
 * @example type => luckysheet
 * @return { string } query 值
 */
export function getURLQuery(url: string | undefined, key: string) {
	if (!url) return "";
	// 通过 ? 分割
	const params = url.split("?")[1];
	if (!params || !params.includes("=")) return "";

	/**
	 * 此时，拿到的参数对象为 params ==> type=luckysheet&userid=1&username=userA&t=111&g=
	 */
	const queryArr = params.split("&");
	for (let i = 0; i < queryArr.length; i++) {
		const item = queryArr[i];
		const itemArr = item.split("=");
		if (itemArr[0] === key) {
			return itemArr[1];
		}
	}
	return "";
}

/**
 * 判断传入的参数是否为空 null undefined ""
 */
export function isEmpty(val: unknown) {
	return val === null || val === undefined || val === "";
}
