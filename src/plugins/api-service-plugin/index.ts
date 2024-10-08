import { type App, type Plugin } from 'vue'
import { $config } from '@/plugins/config'
import { makeApiService } from './api-service-factory'
import ApiErrorHandler, { ApiServiceError } from './api-error-handler'

export const $api = makeApiService($config.get('VUE_APP_API_HOST'))
export const $error = new ApiErrorHandler()

const apiServicePlugin: Plugin = {
  install(app: App) {

    app.config.globalProperties.$api = $api
    app.config.globalProperties.$error = $error

    app.config.errorHandler = (err) => {
      if (err instanceof ApiServiceError) {
        console.error('ApiServiceError', err)
        $error.runHandler(err.errorCode, err)
      } else {
        console.error(err)
      }
    }
  }
}

export default apiServicePlugin

