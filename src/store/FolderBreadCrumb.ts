// 文件夹页面需要记录当前的文件夹层级关系

import { defineStore } from "pinia";
import { reactive } from "vue";

// 定义面包屑数据结构
export type FolderBreadCrumbItem = {
	folderid: string;
	foldername: string;
};

// 不需要持久化存储
export const useFolderBreadCrumbStore = defineStore("folerBreadCrumb", () => {
	// 定义基本的面包屑列表
	const breadCrumbList = reactive<FolderBreadCrumbItem[]>([]);

	// getter
	const getBreadCrumbList = () => breadCrumbList;

	// push item
	function pushItem(item: FolderBreadCrumbItem) {
		breadCrumbList.push(item);
	}

	// 点击之前的某一个时，剔除列表中该节点之后的所有节点
	function handleClickBreadCrumb(item: FolderBreadCrumbItem) {
		const index = breadCrumbList.findIndex((i) => i.folderid === item.folderid);
		breadCrumbList.splice(index + 1, breadCrumbList.length - index - 1);
	}

	// 清空列表
	function clearBreadCrumbList() {
		breadCrumbList.splice(0, breadCrumbList.length);
	}

	// 获取最后一个节点
	function getLastItem() {
		return breadCrumbList[breadCrumbList.length - 1];
	}

	return {
		breadCrumbList,
		getBreadCrumbList,
		handleClickBreadCrumb,
		pushItem,
		clearBreadCrumbList,
		getLastItem,
	};
});
