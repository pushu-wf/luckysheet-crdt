import "./style/index.css";
import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";

// AntDesignVue
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

createApp(App).use(router).use(Antd).mount("#app");
