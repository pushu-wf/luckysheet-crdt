import "./style/index.css";
import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import "ant-design-vue/dist/reset.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

createApp(App).use(router).use(Antd).use(createPinia().use(piniaPluginPersistedstate)).mount("#app");
