import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPortfolio } from "../../store/portfolio";
import { getAllStocks } from "../../store/stocks";
import OrderSearchBar from "../OrderSearchBar";
import "./index.css";

function OrderTab() {
  const [search, setSearch] = useState("");
  const sessionPortfolio = useSelector((state) => state.portfolio.portfolio);
  const sessionStocks = useSelector((state) => state.stocks.stocks);
  const sessionUser = useSelector((state) => state.session.user);
  const [ownedShares, setOwnedShares] = useState(0);
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [estimatedFunds, setEstimatedFunds] = useState(0);
  const [userQty, setUserQty] = useState(0)
  const totalShares = (parseFloat(userQty) + ownedShares);
  const [stockIsLoaded, setStockIsLoaded] = useState(false);
  const [stockInfo, setStockInfo] = useState();
  const [qtyLoaded, setQtyLoaded] = useState(false)
  const [stockPrice, setStockPrice] = useState(0);
  const [stockGrowth, setStockGrowth] = useState(0);
  const [stockChange, setStockChange]  = useState(0);
  const dispatch = useDispatch()

  const handleSearchResultSelect = async (ticker) => {
    setSearch(ticker);
    await fetchStockInfo(ticker);
  }



  function handleClick() {
      alert("Feature coming soon");
    }

    async function fetchStockInfo(id){
        const ticker = id.toUpperCase();
        const res = await fetch(`/api/stocks/${ticker}`);
        const data = await res.json();
        if(data){
          setStockInfo(data)
          setStockPrice(data.price)
          setStockIsLoaded(true)

        }
    }

    function handleSearchSubmit(e) {
      e.preventDefault();
      fetchStockInfo(search)
      setQtyLoaded(false)
      setUserQty(0)
      setStockIsLoaded(false)
      setStockInfo();
      setOwnedShares(0)
      setEstimatedFunds(0);
      setEstimatedValue(0)
    }

    async function handleBuy() {
      const formData = {
        ticker: search.toUpperCase(),
        type: "shares",
        quantity: parseInt(userQty),
        buy: true,
        order_type: "market",
      };

      const res = await fetch(`/api/portfolios/${sessionPortfolio.portfolio.id}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json()

      dispatch(getAllStocks(sessionUser.id));
      dispatch(getPortfolio(sessionUser.id));
    }

    async function handleSell() {
      const formData = {
        ticker: search.toUpperCase(),
        type: "shares",
        quantity: parseInt(userQty),
        buy: false,
        order_type: "market",
      };

      const res = await fetch(`/api/portfolios/${sessionPortfolio.portfolio.id}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json()

      dispatch(getAllStocks(sessionUser.id));
      dispatch(getPortfolio(sessionUser.id));
    }

    useEffect(() => {
        setQtyLoaded(false);
        setUserQty(1);
        setStockIsLoaded(false);
        setStockInfo();
    }, [search])

    useEffect(() => {
        if (stockIsLoaded) {
            let personalStock = sessionPortfolio.portfolio.stocks.filter((stock) => stock.stock_id === stockInfo.id);
            if(personalStock.length){
                setOwnedShares(personalStock[0].quantity);
            }
            let calculated = (((stockInfo.price - stockInfo.open) / stockInfo.open) * 100).toFixed(2)
            let change = ((stockInfo.price - stockInfo.open)).toFixed(2);
            setStockChange(change)
            setStockGrowth(calculated)
            setQtyLoaded(true);
        }
    }, [stockInfo, stockIsLoaded, ownedShares, estimatedValue, sessionPortfolio]);

    useEffect(() => {
        if (qtyLoaded) {
            setEstimatedValue((stockInfo.price * ownedShares).toFixed(2));
            setEstimatedFunds((prevEstimatedFunds) => {
                const totalFunds = (sessionPortfolio?.portfolio?.current_funds + parseFloat(estimatedValue)).toFixed(2);
                return totalFunds;
            });
        }
    }, [ownedShares, qtyLoaded, estimatedValue, sessionPortfolio]);

  return (
    <div className="order-tab">
      <div>
        <form onSubmit={(e) => handleSearchSubmit(e)}>
        <OrderSearchBar onSelectResult={handleSearchResultSelect} />
          <input type="submit" hidden />
        </form>
        {
          stockIsLoaded ? (
            <div>
            <p>{stockInfo.name}</p>
            <p>${stockInfo.price.toFixed(2)}</p>
            <p>${stockChange}</p>
            <p>{stockGrowth}%</p>
            </div>
          ) : (
            <p></p>
          )
        }
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
            Current Buying Power: ${sessionPortfolio?.portfolio?.current_funds.toFixed(2)}
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
        <button disabled={!stockIsLoaded} onClick={() => handleBuy()}>Buy</button>
        <button disabled={!stockIsLoaded} onClick={() => handleSell()}>Sell</button>
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
