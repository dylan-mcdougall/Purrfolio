import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buyStock, getPortfolio } from "../../store/portfolio";
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
  const [userQty, setUserQty] = useState(0);
  const totalShares = parseFloat(userQty) + ownedShares;
  const [stockIsLoaded, setStockIsLoaded] = useState(false);
  const [stockInfo, setStockInfo] = useState();
  const [qtyLoaded, setQtyLoaded] = useState(false);
  const [stockPrice, setStockPrice] = useState(0);
  const [stockGrowth, setStockGrowth] = useState(0);
  const [stockChange, setStockChange] = useState(0);
  const [buyDisabled, setBuyDisabled] = useState(true);
  const [sellDisabled, setSellDisabled] = useState(true);
  const [stockNegative, setStockNegative] = useState(false);

  const dispatch = useDispatch();

  const handleSearchResultSelect = async (ticker) => {
    setSearch(ticker);
    await fetchStockInfo(ticker);
  };

  function handleClick() {
    alert("Feature coming soon");
  }

  async function fetchStockInfo(id) {
    const ticker = id.toUpperCase();
    const res = await fetch(`/api/stocks/${ticker}`);
    const data = await res.json();
    if (data) {
      setStockInfo(data);
      setStockPrice(data.price);
      setStockIsLoaded(true);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchStockInfo(search);
    setQtyLoaded(false);
    setUserQty(0);
    setStockIsLoaded(false);
    setStockInfo();
    setOwnedShares(0);
    setEstimatedFunds(0);
    setEstimatedValue(0);
  }

  async function handleBuy() {
    dispatch(
      buyStock(
        sessionPortfolio.portfolio.id,
        search.toUpperCase(),
        parseInt(userQty),
        true
      )
    );
  }

  async function handleSell() {
    console.log(userQty);
    dispatch(
      buyStock(
        sessionPortfolio.portfolio.id,
        search.toUpperCase(),
        parseInt(userQty),
        false
      )
    );
  }

  useEffect(() => {
    setQtyLoaded(false);
    setUserQty(1);
    setStockIsLoaded(false);
    setStockInfo();
  }, [search]);

  useEffect(() => {
    if (stockIsLoaded) {
      let personalStock = sessionPortfolio.portfolio.stocks.filter(
        (stock) => stock.stock_id === stockInfo.id
      );
      if (personalStock.length) {
        setOwnedShares(personalStock[0].quantity);
      }
      let calculated = (
        ((stockInfo.price - stockInfo.open) / stockInfo.open) *
        100
      ).toFixed(2);
      let change = (stockInfo.price - stockInfo.open).toFixed(2);
      if (change < 0) {
        console.log(change)
        setStockNegative(true);
      } else {
        setStockNegative(false)
      }
      setStockChange(change);
      setStockGrowth(calculated);
      setQtyLoaded(true);
    }
  }, [
    stockInfo,
    stockIsLoaded,
    ownedShares,
    estimatedValue,
    sessionPortfolio,
    dispatch,
  ]);

  useEffect(() => {
    if (qtyLoaded) {
      setEstimatedValue((stockInfo.price * ownedShares).toFixed(2));
      setEstimatedFunds((prevEstimatedFunds) => {
        const totalFunds = (
          sessionPortfolio?.portfolio?.current_funds +
          parseFloat(estimatedValue)
        ).toFixed(2);
        return totalFunds;
      });
    }
  }, [ownedShares, qtyLoaded, estimatedValue, sessionPortfolio, dispatch]);

  useEffect(() => {
    if (stockIsLoaded) {
      if (
        sessionPortfolio.portfolio.current_funds >
        stockInfo.price * userQty
      ) {
        setBuyDisabled(false);
      } else {
        setBuyDisabled(true);
      }
      if (ownedShares >= userQty) {
        setSellDisabled(false);
      } else {
        setSellDisabled(true);
      }
    }
  }, [stockIsLoaded, ownedShares, userQty, stockInfo]);

  return (
    <div className="order-tab">
      <div className="search-info">
        <form onSubmit={(e) => handleSearchSubmit(e)}>
          <OrderSearchBar onSelectResult={handleSearchResultSelect} />
          <input type="submit" hidden />
        </form>
        {stockIsLoaded ? (
          <div>
            <div className="stock-info">
              <p>{stockInfo.name}</p>
            </div>
            {stockNegative ? (
              <div className="stock-info stock-negative">
                <p>${stockInfo.price.toFixed(2)}</p>
              </div>
            ) : (
              <div className="stock-info stock-positive">
                <p>${stockInfo.price.toFixed(2)}</p>
              </div>
            )}

            <div className="stock-info">
              <p>${stockChange}</p>
            </div>
            <div className="stock-info">
              <p>{stockGrowth}%</p>
            </div>
          </div>
        ) : (
          <p></p>
        )}
      </div>
      <div className="transaction-info">
        <form>
          <label htmlFor="transaction-type">Transaction Type: </label>
          <select name="transaction-type" onClick={() => handleClick()}>
            <option value="shares">Shares</option>
          </select>
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            name="quantity"
            min="0"
            defaultValue={userQty}
            onChange={(e) => setUserQty(e.target.value)}
          ></input>
        </form>
        <div>
          <p>
            Current Buying Power: $
            {sessionPortfolio?.portfolio?.current_funds.toFixed(2)}
          </p>
          <p>Current Owned Shares: {ownedShares}</p>
        </div>
        <div>
          <p>Estimated Value: ${estimatedValue}</p>
          <p>Estimated Funds: ${estimatedFunds}</p>
          <p>Total Shares: {totalShares}</p>
        </div>
      </div>
      <div className="right-info">
        <button
          id="buy-button"
          disabled={buyDisabled}
          onClick={() => handleBuy()}
        >
          Buy
        </button>
        <button
          id="sell-button"
          disabled={sellDisabled}
          onClick={() => handleSell()}
        >
          Sell
        </button>
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
