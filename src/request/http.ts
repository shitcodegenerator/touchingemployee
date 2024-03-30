// import i18n from '../i18n/index'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from 'axios'
import { useUserStore } from '@/store/user'
import router from '../router'
import pageStore from '../store/page'
// import { ErrorResponse } from '@/interface'
// import { useEncrypt } from '@/utils/aes'
import { showNotify } from 'vant';

const urlArray: string[] = []

interface ReqHeaders extends AxiosRequestHeaders {
  token: string
}

interface ResHeaders extends AxiosResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

/** 錯誤處理 */
const errorHandle = (status: number, data?: any): void => {
  console.log(data)
  const user = useUserStore()
  const message = data
  showNotify({ type: 'danger', message: data.message })
  switch (status) {
    case 400:
      break
    // 401: 未登录状态，跳转登录页 ； 403 token过期
    case 401:
      console.log(router)
      user.login = false
      localStorage.removeItem('token')
      router.push({ name: 'login' })
    case 403:
      user.login = false
      localStorage.removeItem('token')
      router.push({ name: 'login' })
      break
    // 404请求不存在
    case 404:
      
      router.push({ name: 'login' })
      break
    default:
      // page.showToast({ type: 'error', content: errorContent })
      break
  }
  setLoading(false)
}

const setLoading = (status: boolean) => {
  const page = pageStore()
  page.loading = status
}



let baseUrl = 'https://touching-employee-backend.vercel.app/api'

const baseURL = location.host.includes('localhost') ? '/proxyApi' : baseUrl
// const baseURL = location.host.includes('localhost') ? '/proxyApi' : baseUrl

/** 創建axios實例 */
const instance = axios.create({
  timeout: 30000,
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

/** 請求攔截器 */
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.url) urlArray.push(config.url)
    setLoading(true)
    const token = localStorage.getItem('token')
    if (token) {
      ;(config.headers as ReqHeaders).Authorization = `Bearer ${token}`
    }

 
    return config
  },
  (error) => Promise.reject(error)
)

/** 響應攔截器 */
instance.interceptors.response.use(
  // 請求成功
  (response: ResHeaders) => {
    urlArray.pop()
    setLoading(false)
    return Promise.resolve(response)
  },
  // 请求失败
  (error) => {
    urlArray.pop()
    const { response } = error
    setLoading(false)
    // 请求已发出，但是不在2xx的范围
    errorHandle(response?.status, response?.data)
    return Promise.reject(response)
  }
)

export default instance
