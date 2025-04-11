import { jwtDecode } from 'jwt-decode'

export const decode_token = (token) => {

  if (token) {
    const decode_data = jwtDecode(token)
    const exp_time = new Date(decode_data.exp * 1000)
    if (new Date() > exp_time) {
      localStorage.removeItem('auth-token')
      return ""
    } else {
      return decode_data
    }
  } else {
    return ""
  }
}