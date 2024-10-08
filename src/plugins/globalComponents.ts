import {type App, type Plugin} from "vue"

import eventBus from "@/utils/eventBus";
import {type IAlert, type IContentParams, type IMessageBoxParams, type IToastParams} from "@commons/types/alert";


export const $alert: IAlert= {

  showAlert: (params: IMessageBoxParams) => {
    eventBus.emit("@showAlert", params);
  },

  showConfirm : (params: IMessageBoxParams) => {
    eventBus.emit("@showConfirm", params);
  },

  showToast : (params: IToastParams) => {
    eventBus.emit("@showToast", params);
  },

  showContent : (params: IContentParams) => {
    eventBus.emit("@showContent", params);
  },

  hideContent : () => {
    eventBus.emit("@hideContent");
  },

  showLoading : () => {
    eventBus.emit("@showLoading");
  },

  hideLoading : () => {
    eventBus.emit("@hideLoading");
  },
}

const globalComponents: Plugin = {
  install(app: App) {
    app.config.globalProperties.$alert = $alert
  }
}


export default globalComponents;
