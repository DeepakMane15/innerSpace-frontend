import axios from 'axios'
import { useRouter } from 'next/router'


// const prodUrl = 'http://localhost:3100/users/signin'
const prodUrl = 'http://13.48.136.150:3100/users/signin'



const login = async ({ userName, password }) => {



  return await axios.post(prodUrl, {
    userName,
    password
  }).then((res) => {
    if (res.data.status == 200) {
      localStorage.setItem('userData', res.data.token)

      return true;
    } else {
      return false;
    }
  }).catch((err) => {
    console.log(err)
    console.log('login error')

    return false;
  })
}

export default { login }
