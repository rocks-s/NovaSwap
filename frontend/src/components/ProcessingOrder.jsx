import '../css/ProcessingOrder.css'


export function ProcessingOrder(data) {
  const { sendAmount, getAmount, sendCoin, getCoin,
    sendNetwork, getNetwork, recAddress, sendAddress } = data
  return (
    <div className="order-card processing-order">
      <h3 className="title-main">We received your payment!</h3>

      <h3 className="title-sub">Your order is being processed</h3>

      <h3 className="section-title">You will receive</h3>

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
        <span className="status-dot processing"></span>
        <p>Processing in progress</p>
      </div>
    </div>
  )
}