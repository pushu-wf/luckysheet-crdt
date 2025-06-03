import pako from "pako";
import jwt from "jsonwebtoken";
import { MD5 } from "crypto-js";
import { Request } from "express";
import { logger } from "./Logger";
import { JWT_SECRET } from "../Config";

/**
 * Pako 数据解析
 */

function unzip(str: string): string {
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
function getURLQuery(url: string | undefined, key: string) {
	if (!url) return "";
	const params = url.split("?")[1];
	if (!params || !params.includes("=")) return "";

	const queryArr = params.split("&");
	for (let i = 0; i < queryArr.length; i++) {
		const item = queryArr[i];
		const itemArr = item.split("=");
		if (itemArr[0] === key) {
			// 添加 decodeURIComponent 支持中文解析
			return itemArr.length > 1 ? decodeURIComponent(itemArr[1]) : "";
		}
	}
	return "";
}

/**
 * 判断传入的参数是否为空 null undefined ""
 */
function isEmpty(val: unknown) {
	return val === null || val === undefined || val === "";
}

/**
 * 对 password 进行 MD5 加密
 */
function md5(password: string): string {
	return MD5(password).toString();
}

// 生成 token
function createToken(userid: string, password: string): string {
	return jwt.sign({ userid, password }, JWT_SECRET, { expiresIn: "24h" });
}

// 从 token 中获取 userid
function getUseridFromToken(req: Request): string {
	const token = req.headers.authorization;
	if (!token) return "";

	try {
		const decoded = <jwt.JwtPayload>jwt.verify(token, JWT_SECRET);
		return decoded.userid;
	} catch (error) {
		logger.error(error);
		return "";
	}
}

/**
 * 数据库服务不可用，直接返回空模板数据
 */
function getEmptySheetsData() {
	return JSON.stringify([
		{
			name: "Sheet1",
			index: "Sheet_Index_Demo",
			status: 1,
			order: 0,
			celldata: [
				{
					r: 0,
					c: 0,
					v: {
						v: "数据库服务不可用，但不影响协同功能",
						m: "数据库服务不可用，但不影响协同功能",
						bg: "#ff0000",
						fc: "#ffffff",
						fs: 12,
						ht: 0,
						vt: 0,
					},
				},
			],
		},
	]);
}

/**
 * 生成随机ID
 */
function generateKey() {
	const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	return md5(key);
}

export { unzip, getURLQuery, isEmpty, md5, createToken, getUseridFromToken, getEmptySheetsData, generateKey };
