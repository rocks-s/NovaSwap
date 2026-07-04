import '../css/WaitingOrder.css'


export function WaitingOrder(data) {
  const { sendAmount, getAmount, sendCoin, getCoin,
    sendNetwork, getNetwork, recAddress, sendAddress } = data
  return (
    <div className="order-card waiting-order">
      <h3 className="section-title">Send</h3>

      <div className="row">
        <input
          className="input"
          type="text"
          value={sendAmount}
          readOnly
        />
        <p className="tag">{sendCoin}</p>
        <p className="tag">{sendNetwork}</p>
      </div>

      <div className="address">
        <p>{`To ${sendAddress}`}</p>
      </div>

      <h3 className="section-title">To get</h3>

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
        <p>{`On ${recAddress.slice(0, 4)}...${recAddress.slice(-4)}`}</p>
      </div>
    </div>
  )
}