const API_URL = import.meta.env.VITE_API_URL;
const GET_OPTIONS = {
            credentials: "include"
        }
function postOptions(data) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: "include"
        
    }
    return options
}

export async function makeOrder(orderData) {
    const response = await fetch(`${API_URL}/exchange`, postOptions(orderData))
    return response
}

export async function getOrder(id) {
    const response = await fetch(`${API_URL}/getOrder?id=${id}`, GET_OPTIONS)
    return response
}

export async function getOrderStatus(id) {
    const response = await fetch(`${API_URL}/getOrderStatusz?id=${id}`, GET_OPTIONS)
    return response
}
