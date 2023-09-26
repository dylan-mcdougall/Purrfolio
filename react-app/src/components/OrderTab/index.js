import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function OrderTab() {
  const [search, setSearch] = useState("");
  const sessionPortfolio = useSelector((state) => state.portfolio.portfolio);
  const sessionStocks = useSelector((state) => state.stocks.stocks);
  const [ownedShares, setOwnedShares] = useState(0);
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [estimatedFunds, setEstimatedFunds] = useState(0);
  const [userQty, setUserQty] = useState(0)
  const totalShares = (parseFloat(userQty) + ownedShares);
  const [stockIsLoaded, setStockIsLoaded] = useState(false);
  const [stockInfo, setStockInfo] = useState();
  const [qtyLoaded, setQtyLoaded] = useState(false)



  function handleClick() {
      alert("Feature coming soon");
    }

    async function fetchStockInfo(id){
        const ticker = id.toUpperCase();
        const res = await fetch(`/api/stocks/${ticker}`);
        const data = await res.json();
        setStockInfo(data)
        setStockIsLoaded(true)
    }

    function handleSearchSubmit(e) {
      e.preventDefault();
      fetchStockInfo(search)
      setQtyLoaded(false)
    }

    useEffect(() => {
        if (stockIsLoaded) {
            let personalStock = sessionPortfolio.portfolio.stocks.filter((stock) => stock.stock_id === stockInfo.id);
            console.log(personalStock)
            if(personalStock.length){
                setOwnedShares(personalStock[0].quantity);
            }

            setQtyLoaded(true);
        }
    }, [stockInfo, stockIsLoaded, ownedShares, estimatedValue]);

    useEffect(() => {
        if (qtyLoaded) {
            setEstimatedValue((stockInfo.price * ownedShares).toFixed(2));
            setEstimatedFunds((prevEstimatedFunds) => {
                const totalFunds = (sessionPortfolio.portfolio.current_funds + parseFloat(estimatedValue)).toFixed(2);
                return totalFunds;
            });
        }
    }, [ownedShares, qtyLoaded, estimatedValue]);

  return (
    <div>
      <div>
        <form onSubmit={(e) => handleSearchSubmit(e)}>
          <label htmlFor="stock-name">Stock Ticker or Name:</label>
          <input type="text" onChange={(e) => setSearch(e.target.value)} />
          <input type="submit" hidden />
        </form>
      </div>
      <div>
        <form>
          <label htmlFor="transaction-type">Transaction Type: </label>
          <select name="transaction-type" onClick={() => handleClick()}>
            <option value="shares">Shares</option>
          </select>
          <label htmlFor="quantity">Quantity:</label>
          <input type="number" name="quantity" min="0" defaultValue={userQty} onChange={(e) => setUserQty(e.target.value)}></input>
        </form>
        <div>
          <p>
            Current Buying Power: ${sessionPortfolio.portfolio.current_funds}
          </p>
          <p>Current Owned Shares: {ownedShares}</p>
        </div>
        <div>
            <p>Estimated Value: ${estimatedValue}</p>
            <p>Estimated Funds: ${estimatedFunds}</p>
            <p>Total Shares: {totalShares}</p>
        </div>
      </div>
      <div>
        <button>Buy</button>
        <button>Sell</button>
        <form>
            <label htmlFor="order-type">Order Type:</label>
            <select name="order-type" onClick={() => handleClick()}>
                <option value="market">Market</option>
            </select>
        </form>
      </div>
    </div>
  );
}

export default OrderTab;
