import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getOrder, getOrderStatus} from "../services/api";
import { WaitingOrder } from "../components/WaitingOrder";
import { ProcessingOrder } from "../components/ProcessingOrder";
import { CompletedOrder } from "../components/CompletedOrder";
import { useNavigate } from "react-router-dom";
import '../css/Exchange.css'

function Exchange() {

  const [searchParams] = useSearchParams()
  const [content, setContent] = useState(<div></div>)
  const [orderStatus, setOrderStatus] = useState(null)
  const [orderData, setOrderData] = useState(null)
  const fetchDelay = Number(import.meta.env.VITE_FETCH_DELAY)
  const statusComponents = {
    waiting: WaitingOrder, 
    processing: ProcessingOrder,
    completed: CompletedOrder
  }
  const id = searchParams.get("id");
  const navigate = useNavigate() 
  const loadPage = async () => {
      const response = await getOrder(id)
      const respData = await response.json()
      if (response.status !== 200) {
          alert(respData.message);
      }
      else {
        setOrderStatus(respData.data.status)
        setOrderData(respData.data)
        setContent(statusComponents[respData.data.status]({...respData.data, navigate: navigate}))
        
      }
    }

  useEffect(() => {
    loadPage();
  }, []);

  useEffect(() => {
    const updateOrderStatus = async () => {
      const response = await getOrderStatus(id)
      const status = (await response.json()).data.status
      if (status !== orderStatus) {
        setOrderStatus(status)
        setContent(statusComponents[status](orderData))
      }
    }
    if (!orderData) {return}
    // (async () => {await updateOrderStatus()})()
    const interval = setInterval(updateOrderStatus, fetchDelay * 1000);

    return () => clearInterval(interval);
  }, [orderData, orderStatus]);

  return content
}

export default Exchange
