import { createApp } from "vue";
import "@unocss/reset/tailwind.css";
import "@vueform/multiselect/themes/default.css";
import "./style.css";
import "uno.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./routes/routes";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");
