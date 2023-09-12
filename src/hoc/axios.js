import axios from 'axios'
import { toast } from 'react-hot-toast'
import { errorToast } from 'src/utils/toast'

// Next we make an 'instance' of it
const axiosInstance = axios.create({
  // baseURL: 'http://localhost:3100'

  // baseURL: 'http://16.171.39.169:3100'

  baseURL: 'https://api.inventorysolutions.in'

})


axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('userData')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // config.headers['Content-Type'] = 'application/json'
    // config.headers['Content-Type'] = 'multipart/form-data'

    return config
  },
  error => {
    Promise.reject(error)
  }
)

function handleSuccess(response) {
  return { data: response.data }
}

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.log('errorerror', error)
    if (error.code == "ERR_NETWORK") {
      return errorToast("Something went wrong!")
    }
    if (error.response.status === 401) {
      toast.error('Token Expired')
      window.location.reload()
    }
  }
)

axiosInstance.interceptors.response.use(handleSuccess)

export default axiosInstance
