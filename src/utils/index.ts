import { SERVER_URL } from "../config";
import { API_uploadImage } from "../axios";

// 处理协同图片上传
export const uploadImage = async (file: File) => {
	// 此处拿到的是上传的 file 对象，进行文件上传 ，配合 node 接口实现
	const formData = new FormData();
	formData.append("image", file);

	const { data } = await API_uploadImage(formData);

	// *** 关键步骤：需要返回一个地址给 luckysheet ，用于显示图片
	if (data.code === 200) return Promise.resolve(data.url);
	else return Promise.resolve("image upload error");
};

// 处理上传图片的地址
export const imageUrlHandle = (url: string) => {
	// 已经是 // http data 开头则不处理
	if (/^(?:\/\/|(?:http|https|data):)/i.test(url)) return url;
	// 不然拼接服务器路径
	return SERVER_URL + url;
};

// 获取随机值
export const getRandom = () => {
	return Math.random().toString(16).slice(2, 8);
};

// 获取当前环境是否为 开发环境
export const isDev = () => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return import.meta.env.MODE === "development";
};

// 获取 loadUrl 地址
export const getLoadUrl = (gridKey: string) => {
	return `${isDev() ? "/api/" : "/"}loadSheetData?gridkey=${gridKey}`;
};

// 注册插件
export const registerPlugins = () => {
	return [
		{
			name: "chart",
			dependScripts: [
				"/lib/expendPlugins/libs/vue@2.6.11.min.js",
				"/lib/expendPlugins/libs/vuex.min.js",
				"/lib/expendPlugins/libs/elementui.min.js",
				"/lib/expendPlugins/libs/echarts.min.js",
				"/lib/expendPlugins/libs/chartmix.umd.min.js",
			],
			dependLinks: ["/lib/expendPlugins/libs/element-ui.css", "/lib/expendPlugins/libs/chartmix.css"],
		},
		{
			name: "vchart",
			dependScripts: ["/lib/expendPlugins/libs/vchart.min.js"],
			dependLinks: ["/lib/expendPlugins/libs/vchart.css"],
		},
		{
			name: "fileImport",
			dependScripts: ["/lib/expendPlugins/libs/luckyexcel.umd.js"],
		},
		{
			name: "fileExport",
			dependScripts: ["/lib/expendPlugins/libs/exceljs.min.js", "/lib/expendPlugins/libs/fileSaver.min.js"],
		},
	];
};
