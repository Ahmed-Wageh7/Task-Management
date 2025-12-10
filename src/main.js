import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./style.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faHome, faPlus, faBars } from "@fortawesome/free-solid-svg-icons";

library.add(faHome, faPlus, faBars);

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount("#app");
