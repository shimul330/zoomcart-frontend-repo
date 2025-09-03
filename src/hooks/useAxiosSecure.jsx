import axios from 'axios'

import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import useAuth from './useAuth'


export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
 
  
})

const useAxiosSecure = () => {
  const navigate = useNavigate()
  const { logOut } = useAuth()
  useEffect(() => {
    axiosSecure.interceptors.response.use(
      res => {
        return res
      },
      async error => {
     
        if (error.response.status === 401 || error.response.status === 403) {
          // logout
          logOut()
          // navigate to login
          navigate('/login')
        }
        return Promise.reject(error)
      }
    )
  }, [logOut, navigate])
  return axiosSecure
}

export default useAxiosSecure
