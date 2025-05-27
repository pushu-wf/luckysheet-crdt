import { API_importFile } from "../../../axios";

/**
 * 针对文件列表做导入导出操作
 */
function ImportFile() {
	// 创建 input 元素
	const input = document.createElement("input");
	input.type = "file";
	input.accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // xlsx 文件类型
	input.onchange = async () => {
		if (!input.files) return;
		// 获取当前文件 value
		const file = input.files[0];
		// 发送请求
		const formData = new FormData();
		formData.append("file", file);
		const { data } = await API_importFile(formData);
		console.log(" ==> ", data);
	};
	input.click();
}

function ExportFile() {}

export { ImportFile, ExportFile };
