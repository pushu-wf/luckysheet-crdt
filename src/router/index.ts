// router
import { localForage } from "../localforage";
import { createRouter, createWebHistory } from "vue-router";

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
		path: "/excel",
		component: () => import("../views/Excel/index.vue"),
	},
];

// 路由实例
const router = createRouter({ routes, history: createWebHistory() });

// 拦截路由
router.beforeEach((to, _from, next) => {
	const token = localForage.getItem("token");
	if (to.path === "/login" || token) {
		next();
	} else {
		next("/login");
	}
});

export default router;
