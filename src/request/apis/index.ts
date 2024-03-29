
import http from '@/request/http'



export const login = (data) => {
  return http.post('login', data)
}

export const getUserData = () => {
  return http.get('me')
}


export const clockin = (data) => {
  return http.post('clockin', data)
}

export const addWork = (data) => {
  return http.post('work', data)
}
export const addContact = (data) => {
  return http.post('contact', data)
}

export const getClockinList = () => {
  return http.get('clockin')
}

export const getWork = () => {
  return http.get('work')
}
export const getContact = () => {
  return http.get('contact')
}
