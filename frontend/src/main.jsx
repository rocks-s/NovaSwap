import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import { OrdersProvider } from './contexts/OrdersContext.jsx'
// import './css/index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <OrdersProvider>
          <App />
        </OrdersProvider> 
    </BrowserRouter>
  // </StrictMode>
)
