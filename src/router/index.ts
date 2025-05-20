// router
import { createRouter, createWebHistory } from "vue-router";
import { localForage } from "../localforage";
const router = createRouter({
	history: createWebHistory(),
	routes: [
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
			component: () => import("../views/Home/index.vue"),
		},
		{
			path: "/excel",
			component: () => import("../views/Excel/index.vue"),
		},
	],
});

router.beforeEach((to, _from, next) => {
	if (to.path === "/login") {
		next();
	} else {
		// 判断是否存在 token
		if (localForage.getItem("token")) {
			next();
		} else {
			next("/login");
		}
	}
});

export default router;
