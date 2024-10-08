import axios, { type AxiosInstance } from 'axios'
import { ApiServiceError } from './api-error-handler'
import eventBus from '@/utils/eventBus'
import { useAccountStore } from '@/stores/module/account'
import { $alert } from '@/plugins/globalComponents'


export const createAxiosInstance = (host: string): AxiosInstance => {

  const axiosInstance: AxiosInstance = axios.create({
    baseURL: host,
    headers: { Pragma: 'no-cache' },
    timeout: 15000,
    paramsSerializer: {
      indexes: null
    }
  })

  const axiosRefreshInstance: AxiosInstance = axios.create({
    baseURL: host,
    headers: { Pragma: 'no-cache' },
    timeout: 15000
  })

  axiosInstance.interceptors.request.use(
    function(config) {
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json; charset=utf-8'
      }

      config.headers['Authorization'] = 'Bearer ' + useAccountStore().getJwtToken
      config.headers['SignalSession'] = useAccountStore().getSessionId
      return config
    }, (error) => {
      console.error(error)
      return Promise.reject(error)
    }
  )

  axiosRefreshInstance.interceptors.request.use(
    function(config) {
      config.headers['Content-Type'] = 'application/json; charset=utf-8'
      const jwtToken = useAccountStore().getJwtToken
      const refreshToken = useAccountStore().getRefreshToken
      config.headers['Authorization'] = 'Bearer ' + jwtToken
      config.headers['Refresh'] = refreshToken
      return config
    }, (error) => {
      console.error(error)
      return Promise.reject(error)
    }
  )

  axiosInstance.interceptors.response.use(function(response) {
    eventBus.emit('@hideLoading')
    return response
  }, async (error) => {
    eventBus.emit('@hideLoading')
    const originalRequest = error.config
    if (error.response) {
      let errorObj = new ApiServiceError(error.response.data.code || error.response.code || error.response.status, error.response.data.message || error.response.message || error.response.statusText)
      if ('40100' === errorObj.errorCode) {
        // $alert.showAlert( {
        //   okBtnName: '확인',
        //   content: `${errorObj.toString()}`,
        //   callback: ()=>{
        //     eventBus.emit('@logout', false)
        //   }
        // });
      } else if ('40105' === errorObj.errorCode) {
        // const response = await axiosRefreshInstance.post('/refresh');
        // useAccountStore().successLoginStatus(response.data);
        // const newAccessToken = response.data.jwtToken
        // axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        // originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // return axiosInstance.request(originalRequest);
      }
      return Promise.reject(errorObj)
    } else {
      return Promise.reject(new ApiServiceError('NETWORK_ERROR', 'Network Error'))
    }

  })

  axiosRefreshInstance.interceptors.response.use(function(response) {
    eventBus.emit('@hideLoading')
    return response
  }, (error) => {

    eventBus.emit('@hideLoading')
    // console.dir(error)
    if (error.response) {
      let errorObj = new ApiServiceError(error.response.data.code || error.response.code || error.response.status, error.response.data.message || error.response.message || error.response.statusText)
      // if ('40100' === errorObj.errorCode) {
      //   $alert.showAlert( {
      //     okBtnName: '확인',
      //     content: `${errorObj.toString()}`,
      //     callback: ()=>{
      //       eventBus.emit('@logout', false)
      //     }
      //   });
      // }
      return Promise.reject(errorObj)
    } else {
      return Promise.reject(new ApiServiceError('NETWORK_ERROR', 'Network Error'))
    }

  })

  return axiosInstance
}
