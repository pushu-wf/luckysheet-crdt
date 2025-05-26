// router
import { message } from "ant-design-vue";
import { localForage } from "../localforage";
import { createRouter, createWebHistory } from "vue-router";
import Modal from "ant-design-vue/es/modal/Modal";

// 路由配置
const routes = [
	{
		path: "/",
		redirect: "/home",
	},
	{
		path: "/login",
		component: () => import("../views/Login/index.vue"),
	},
	{
		path: "/home",
		component: () => import("../views/Pages/index.vue"),
	},
	{
		path: "/excel/:gridKey",
		component: () => import("../views/Excel/index.vue"),
	},
	{
		path: "/invite/:filemapid",
		component: () => import("../views/Invite/index.vue"),
	},
];

// 路由实例
const router = createRouter({ routes, history: createWebHistory() });

// 拦截路由
router.beforeEach((to, _from, next) => {
	Modal.destroyAll();

	const token = localForage.getItem("token");
	if (to.path === "/login" || token) {
		next();
	} else {
		localForage.clear();
		message.error("请先登录");
		next("/login");
	}
});

export default router;
