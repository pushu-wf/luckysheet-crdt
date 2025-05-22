/// <reference types="vite/client" />
// 添加 .vue 文件定义
declare module "*.vue" {
	import { defineComponent } from "vue";
	const component: ReturnType<typeof defineComponent>;
	export default component;
}
