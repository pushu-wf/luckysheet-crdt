/**
 * 使用 localstorage 实现本地存储
 */

const com_prefix = "lucky_crdt_";

const storage = window.sessionStorage;

export const localForage = {
	// 获取
	getItem(key: string) {
		const value = storage.getItem(com_prefix + key);
		if (value) return JSON.parse(value);
		return null;
	},

	// 设置
	setItem(key: string, value: unknown) {
		storage.setItem(com_prefix + key, JSON.stringify(value));
	},

	// 移除
	removeItem(key: string) {
		storage.removeItem(com_prefix + key);
	},

	// 清空
	clear() {
		storage.clear();
	},
};
