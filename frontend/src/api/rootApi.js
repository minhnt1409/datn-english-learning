/* eslint-disable import/no-cycle */
import axios from 'axios'

/**
 * Get token from state
 * @returns {string|*}
 */
export function getToken(tokenType) {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      return token
    }
    return 'none'
  } catch (e) {
    return 'none'
  }
}

/**
 *
 * @type {{headers: {"Content-Type": string}}}
 */
const defaultOptions = {
  baseURL: process.env.REACT_APP_URL_API,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${getToken('access_token')}`,
  },
  timeout: 200000,
}

/**
 *
 * @type {Object}
 */
const rootApi = axios.create(defaultOptions)

rootApi.interceptors.request.use((config) => {
  const overrideHeader = config
  return overrideHeader
})

rootApi.interceptors.response.use(undefined, async (error) => {
  return Promise.reject(error)
})

export default rootApi
