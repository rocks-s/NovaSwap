import '../css/CompletedOrder.css'
import { useNavigate } from "react-router-dom";
export function CompletedOrder(data) {
  const { sendAmount, getAmount, sendCoin, getCoin,
    sendNetwork, getNetwork, recAddress, sendAddress } = data
  const handleClick = () => {
        data.navigate("/");
    };
  return (
    <div>
      <div className="order-card completed-order">
        <h3 className="title-main success">
          Your order is completed!
        </h3>

        <h3 className="title-sub">
          Please check your wallet for funds
        </h3>

        <h3 className="section-title">Received</h3>

        <div className="row">
          <input
            className="input"
            type="text"
            value={getAmount}
            readOnly
          />
          <p className="tag">{getCoin}</p>
          <p className="tag">{getNetwork}</p>
        </div>

        <div className="address">
          <p>{`To ${recAddress}`}</p>
        </div>

        <div className="status-line">
          <span className="status-dot completed"></span>
          <p>Completed successfully</p>
        </div>
      </div>
      <div className='next-swap'>
        <button
          onClick={handleClick}
          className='next-button'>
            <span>Next Swap</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 43">
              <polygon
                points="39.58,4.46 44.11,0 66,21.5 44.11,43 39.58,38.54 56.94,21.5"
              ></polygon>
              <polygon
                points="19.79,4.46 24.32,0 46.21,21.5 24.32,43 19.79,38.54 37.15,21.5"
              ></polygon>
              <polygon
                points="0,4.46 4.53,0 26.42,21.5 4.53,43 0,38.54 17.36,21.5"
              ></polygon>
            </svg>
        </button>
      </div>
    </div>
  )
}