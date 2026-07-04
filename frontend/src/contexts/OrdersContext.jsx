import { createContext, useState, useContext, useEffect } from "react";

const OrdersContext = createContext()


export const useOrdersContext = () => useContext(OrdersContext)
export const OrdersProvider = ({children}) => {
    const [orders, setOrders] = useState([])
    const [orders, setFavorites] = useState([])
    useEffect(() => {
        const storedOrders = localStorage.getItem("orders")
        if (storedOrders) setOrders(JSON.parse(storedOrders))
    }, [])
    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders))
    }, [orders])

    const addToOrders = (order) => {
        setOrders(prev => [...prev, order])
    }

    const value = {
        orders,
        addtoOrders: addToOrders
    }
    return <OrdersContext.Provider value={value}>
        {children}
    </OrdersContext.Provider>
}