export function ImportFile() {
	// 创建 input 元素，绑定 xlsx 文件类型
	const input = document.createElement("input");
	input.type = "file";
	input.accept = ".xlsx";
	input.onchange = () => {};
	input.click();
}
