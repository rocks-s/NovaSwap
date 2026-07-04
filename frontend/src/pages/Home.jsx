import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeOrder } from "../services/api";
import '../css/Home.css'

function Home() {

  const supportedCoins = ["ETH", "BTC", "USDT"]
  const supportedNetworks = { ETH: ["ETH", "MATIC"], BTC: ["BTC"], USDT: ["TRON"] }

  const [sendAmount, setSendAmount] = useState("");
  const [getAmount, setGetAmount] = useState("");

  const [sendCoin, setSendCoin] = useState("BTC");
  const [getCoin, setGetCoin] = useState("ETH");

  const [sendNetwork, setSendNetwork] = useState("BTC");
  const [getNetwork, setGetNetwork] = useState("ETH");

  const [recAddress, setResAddress] = useState("");

  const [lastEdited, setLastEdited] = useState("send");

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const getRate = (from, to) => {
    if (from === to) return 1;
    return 10; // stub
  };

  useEffect(() => {
    const rate = getRate(sendCoin, getCoin);

    if (lastEdited === "send") {
      if (!sendAmount || isNaN(sendAmount)) {
        setGetAmount("");
        return;
      }

      const result = Number(sendAmount) * rate;
      setGetAmount(result.toFixed(6));
    }

    if (lastEdited === "get") {
      if (!getAmount || isNaN(getAmount)) {
        setSendAmount("");
        return;
      }

      const result = Number(getAmount) / rate;
      setSendAmount(result.toFixed(6));
    }
    setSendNetwork(supportedNetworks[sendCoin][0])

  }, [sendAmount, getAmount, sendCoin, getCoin,
    lastEdited, sendNetwork, getNetwork]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const minAmountUsdt = 10
    const networkRegexes = {
      'ETH': /^0x[a-fA-F0-9]{40}$/
    }
    if (sendAmount === 'e' || getAmount === 'e') {
      setErrors({ ...errors, ...{ amount: `Amount not a number` } })
      return
    }
    // if (getRate(sendCoin, "USDT") * sendAmount < minAmountUsdt 
    // || getRate(getCoin, "USDT") / getAmount < minAmountUsdt) {
    //   setErrors({ ...errors, ...{amount: `Amount less than minimum`}})
    //   return
    // }
    if (!networkRegexes[getCoin].test(recAddress)) {
      setErrors({ ...errors, ...{ address: "Address didnt match" } })
      return
    }
    setErrors({})

    const data = {
      sendAmount, getAmount, sendCoin, getCoin,
      sendNetwork, getNetwork, recAddress
    }
    const response = await makeOrder(data)
    const resp_data = await response.json()
    if (response.status !== 200 && response.status !== 201) {
      alert(resp_data.message);
    }
    else {
      navigate(`/exchange?id=${resp_data.data.order_id}`);
    }

  }

  return (
    <div className="order-card home">
      <form className="exchange-form" onSubmit={onSubmit}>

        {/* SEND */}
        <div className="block">
          <h3 className="section-title">You send</h3>

          <input
            className="input"
            type="number"
            value={sendAmount}
            onChange={(e) => {
              setSendAmount(e.target.value);
              setLastEdited("send");
            }}
            placeholder="Amount"
          />

          <div className="select-row">
            <select
              className="select"
              value={sendCoin}
              onChange={(e) => setSendCoin(e.target.value)}
            >
              {supportedCoins.map((coin) => (
                <option key={coin} value={coin}>
                  {coin}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={sendNetwork}
              onChange={(e) => setSendNetwork(e.target.value)}
            >
              {supportedNetworks[sendCoin].map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>

          <div className="error-text">{errors.amount}</div>
        </div>

        {/* GET */}
        <div className="block">
          <h3 className="section-title">You get</h3>

          <input
            className="input"
            type="number"
            value={getAmount}
            onChange={(e) => {
              setGetAmount(e.target.value);
              setLastEdited("get");
            }}
            placeholder="Amount"
          />

          <div className="select-row">
            <select
              className="select"
              value={getCoin}
              onChange={(e) => setGetCoin(e.target.value)}
            >
              {supportedCoins.map((coin) => (
                <option key={coin} value={coin}>
                  {coin}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={getNetwork}
              onChange={(e) => setGetNetwork(e.target.value)}
            >
              {supportedNetworks[getCoin].map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>

          <div className="error-text">{errors.amount}</div>
        </div>

        {/* ADDRESS */}
        <div className="block">
          <h3 className="section-title">Recipient</h3>

          <input
            className="input"
            type="text"
            placeholder={`The recipient's ${getCoin} address`}
            id="address-input"
            value={recAddress}
            onChange={(e) => setResAddress(e.target.value)}
          />

          <div className="error-text">{errors.address}</div>
        </div>

        <button className="button" type="submit">
          Exchange
        </button>

      </form>
    </div>
  );
}

export default Home
