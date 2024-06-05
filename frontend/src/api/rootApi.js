/* eslint-disable import/no-cycle */
import axios from 'axios'

/**
 * Get token from state
 * @returns {string|*}
 */
export function getToken(tokenType) {
  try {
    const state = localStorage.getItem('state')
    if (state) {
      const userInfo = JSON.parse(state).user
      if (userInfo) {
        return userInfo[tokenType]
      }
      return 'none'
    }
    return 'none'
  } catch (e) {
    return 'none'
  }
}

export function getTenantId() {
  try {
    const state = localStorage.getItem('state')
    if (state) {
      const userInfo = JSON.parse(state).user
      if (userInfo) {
        return userInfo.tenantId
      }
      return ''
    }
    return ''
  } catch (e) {
    return ''
  }
}

export function getUserInfo() {
  try {
    const state = localStorage.getItem('state')
    if (state) {
      const userInfo = JSON.parse(state).user
      return userInfo
    }
    return {}
  } catch (e) {
    return {}
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
  overrideHeader.headers.OrgId = getTenantId()
  return overrideHeader
})

rootApi.interceptors.response.use(undefined, async (error) => {
  return Promise.reject(error)
})

export default rootApi
