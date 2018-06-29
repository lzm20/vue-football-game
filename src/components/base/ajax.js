import {
  userToken,
  username,
  password
} from './key'
import axios from 'axios'

export const _post = (req) => {
  return axios({
    method: 'post',
    url: req.url,
    data: req.data,
    headers: { 'usertoken': userToken, 'user': username, 'pass': password }
  })
}
