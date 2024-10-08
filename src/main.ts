import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import '@/assets/scss/main.scss';
import 'v-calendar/style.css';
import 'moment/dist/locale/ko';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import configPlugin, {$config} from "./plugins/config"
import * as Sentry from "@sentry/vue";

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(VueQueryPlugin);
app.use(pinia)
app.use(router)
app.use(configPlugin)
app.mount('#app')

if ($config.get('DOCKER_COMMIT_NUM')) {
    if ($config.get('VUE_APP_ENV') === 'stag' || $config.get('VUE_APP_ENV') === 'production') {
        Sentry.init({
            app: app,
            dsn: "https://8a11418902c411ba131aef78db2c03e6@o1326808.ingest.us.sentry.io/4508011635671040",
            environment: $config.get('VUE_APP_ENV'),
            release: $config.get('DOCKER_COMMIT_NUM'),
            integrations: [
                Sentry.browserTracingIntegration({router}),
                Sentry.captureConsoleIntegration({levels: ["error"]})
            ],
            tracingOptions: { // 하위 구성 요소를 추적하고 렌더링 프로세스에 대한 자세한 내용을 보기
                trackComponents: true,
            },
            attachProps: true, // 로깅을 위해 모든 Vue 구성 요소의 props를 보기
            // Set tracesSampleRate to 1.0 to capture 100%
            // of transactions for performance monitoring.
            // We recommend adjusting this value in production
            tracesSampleRate: 0.2,

            // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
            tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
        });
    }
}
