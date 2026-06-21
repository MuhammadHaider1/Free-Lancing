import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

export const acceptProposal = async (proposal_id) => {

  const response = await API.post(
    '/orders/accept-proposal/',
    {
      proposal_id
    }
  )

  return response.data
}

// Har request mein token automatically lagao
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')

  console.log("INTERCEPTOR TOKEN:", token)
  console.log("REQUEST URL:", config.url)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

//NOTIFICATIONS API
export const getNotifications = async () => {

    const response = await API.get(
        '/notifications/'
    )

    return response.data

}

// =====================
// ORDER APIs
// =====================


// Get My Orders
export const getOrders = async () => {

  const response = await API.get(
    '/orders/'
  )

  return response.data
}



// Single Order Detail
export const getOrderDetail = async (id) => {

  const response = await API.get(
    `/orders/${id}/`
  )

  return response.data
}

export default API