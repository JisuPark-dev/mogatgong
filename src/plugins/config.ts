/// <reference types="vite/client" />
import {type App, type Plugin} from "vue";

export const $config = {
  get(key: string): string {
    const viteKey = 'VITE_' + key
    return import.meta.env[viteKey]
  }
}

const configPlugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$config = $config;
  }
}

export default configPlugin

