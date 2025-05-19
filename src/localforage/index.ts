/**
 * 使用 localstorage 实现本地存储
 */

const com_prefix = 'es_co_';

export const localForage = {
	// 获取
	getItem(key: string) {
		const value = window.localStorage.getItem(com_prefix + key);
		if (value) return JSON.parse(value);
		return null;
	},

	// 设置
	setItem(key: string, value: unknown) {
		window.localStorage.setItem(com_prefix + key, JSON.stringify(value));
	},

	// 移除
	removeItem(key: string) {
		window.localStorage.removeItem(com_prefix + key);
	},

	// 清空
	clear() {
		window.localStorage.clear();
	}
};
