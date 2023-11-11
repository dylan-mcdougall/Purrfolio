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
  const [estimatedAmount, setEstimatedAmount] = useState(0);
  const [userQty, setUserQty] = useState(0);
  const [stockIsLoaded, setStockIsLoaded] = useState(false);
  const [stockInfo, setStockInfo] = useState();
  const [qtyLoaded, setQtyLoaded] = useState(false);
  const [stockPrice, setStockPrice] = useState(0);
  const [stockGrowth, setStockGrowth] = useState(0);
  const [stockChange, setStockChange] = useState(0);
  const [type, setType] = useState('share')
  const [buyDisabled, setBuyDisabled] = useState(true);
  const [sellDisabled, setSellDisabled] = useState(true);
  const [stockNegative, setStockNegative] = useState(false);
  const [userAmount, setUserAmount] = useState(0);
  const [buyToggle, setBuyToggle] = useState(false);
  const [sellToggle, setSellToggle] = useState(false);

  const dispatch = useDispatch();

  const handleSearchResultSelect = async (ticker) => {
    setSearch(ticker);
    await fetchStockInfo(ticker);
  };

  function handleClick() {
    alert("Feature coming soon!");
  }

  function handleChange(e) {
    setType(e.target.value);
    setUserQty(0);
    setUserAmount(0);
  }

  function handleBuyClick() {
    if (sellToggle) {
      setSellToggle(false)
    }
    setBuyToggle(true)
  }

  function handleSellClick() {
    if (buyToggle) {
      setBuyToggle(false)
    }
    setSellToggle(true)
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
    setUserAmount(0);
  }

  function handleOrderSubmit(e) {
    e.preventDefault()
    if (buyToggle) {
      handleBuy()
    }
    else if (sellToggle) {
      handleSell()
    }
  }

  async function handleBuy() {
    if (type === 'share') {
      dispatch(
        buyStock(
          sessionPortfolio.portfolio.id,
          search.toUpperCase(),
          parseInt(userQty),
          true
        )
      );
    } else if (type === 'dollar') {
      return
    }
    dispatch(getPortfolio(sessionUser.id))
    dispatch(getAllStocks(sessionUser.id))
  }

  async function handleSell() {
    dispatch(
      buyStock(
        sessionPortfolio.portfolio.id,
        search.toUpperCase(),
        parseInt(userQty),
        false
      )
      );
      dispatch(getPortfolio(sessionUser.id));
      dispatch(getAllStocks(sessionUser.id))
      setOwnedShares(ownedShares - userQty)
  }

  useEffect(() => {
    setQtyLoaded(false);
    setUserQty(0);
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
    if (qtyLoaded && type === 'share') {
      setEstimatedValue((stockInfo.price * userQty).toFixed(2));
      setEstimatedFunds((prevEstimatedFunds) => {
        if (sellToggle) {
        const totalFunds = (
          sessionPortfolio?.portfolio?.current_funds +
          parseFloat(estimatedValue)
        ).toFixed(2);
        return totalFunds;
        } else if (buyToggle) {
          const totalFunds = (
            sessionPortfolio?.portfolio?.current_funds -
            parseFloat(estimatedValue)
          ).toFixed(2);
          return totalFunds;
        }
      });
    } else if (qtyLoaded && type === 'dollar') {
      setEstimatedAmount((userAmount / stockInfo?.price).toFixed(4));
      setEstimatedFunds(() => {
        if (sellToggle) {
          const totalFunds = (
            sessionPortfolio?.portfolio?.current_funds +
            parseFloat(userAmount)
          ).toFixed(2);
          return totalFunds;
        } else if (buyToggle) {
          const totalFunds = (
            sessionPortfolio?.portfolio?.current_funds - 
            parseFloat(userAmount)
          ).toFixed(2);
          return totalFunds;
        }
      })
    }
  }, [ownedShares, qtyLoaded, userQty, userAmount, buyToggle, estimatedValue, sessionPortfolio, dispatch]);

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

  let totalShares = 0;
  if (type === 'share') {
    if (buyToggle) {
      totalShares = parseFloat(userQty) + ownedShares
    } else if (sellToggle && userQty <= ownedShares) {
      totalShares = ownedShares - parseFloat(userQty)
    }
  } else if (type === 'dollar') {
    if (buyToggle) {
      totalShares = parseFloat(estimatedAmount) + ownedShares
    } else if (sellToggle) {
      if (ownedShares >= parseFloat(estimatedAmount)) {
        totalShares = ownedShares - parseFloat(estimatedAmount)
      } else {
        totalShares = 0
      }
    }
  }

  let shareClass = "share"
  let dollarClass = "dollar"

  if (type === 'share') dollarClass = dollarClass + " hidden"
  else if (type === 'dollar') shareClass = shareClass + " hidden"

  const buyClass = "buy" + (buyToggle ? " on" : "")
  const sellClass = "sell" + (sellToggle ? " on" : "")

  return (
    <div className="order-tab">
      <div className="search-info">
        <form onSubmit={(e) => handleSearchSubmit(e)}>
          <OrderSearchBar onSelectResult={handleSearchResultSelect} />
          <input type="submit" hidden />
        </form>
        {stockIsLoaded ? (
          <div className="stock-info-wrapper">
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
      <div className="order-tab-detail-flex">
      <div className="order-tab-left">
      <div className="transaction-info">
        <form>
          <div className="transaction-details">
            <label className="transaction-form" htmlFor="transaction-type">Transaction Type: </label>

          <select name="transaction-type" value={type} onChange={(e) => handleChange(e)}>
            <option value="share">Shares</option>
            <option value="dollar">Dollar</option>
          </select>
          </div>
          <div className="transaction-details">
          <label className={shareClass} htmlFor="quantity">Quantity:</label>
          <input
            className={shareClass + ` order-input`}
            type="number"
            name="quantity"
            min="0"
            defaultValue={userQty}
            onChange={(e) => setUserQty(e.target.value)}
          ></input>
          <label className={dollarClass} htmlFor="amount">Amount:</label>
          <input
            className={dollarClass + ` order-input`}
            type="number"
            name="amount"
            min="0"
            step="0.01"
            defaultValue={userAmount}
            onChange={(e) => setUserAmount(e.target.value)}
            ></input>
          </div>
        </form>
        <div className="transaction-details">
          <p>
            Current Buying Power:
          </p>
          <p>
            ${sessionPortfolio?.portfolio?.current_funds.toFixed(2)}
          </p>
        </div>
        <div className="transaction-details">
          <p>Current Owned Shares: </p>
          <p>{ownedShares}</p>
        </div>
        <div className={shareClass + ` transaction-details`}>
          <p>Estimated Value: </p>
          <p>${estimatedValue}</p>
        </div>
        <div className={dollarClass + ` transaction-details`}>
          <p>Estimated Shares: </p>
          <p>{estimatedAmount}</p>
        </div>
        <div className="transaction-details">
          <p>Estimated Funds: </p>
          <p>${estimatedFunds}</p>
        </div>
        <div className="transaction-details">
          <p>Total Shares: </p>
          <p>{totalShares}</p>
        </div>
      </div>
      </div>
      <div className="right-info">
        <div className="order-tab-button-container">
        <button
         className={buyClass}
          id="buy-button"
          onClick={() => handleBuyClick()}
        >
          Buy
        </button>
        <button
          className={sellClass}
          id="sell-button"
          onClick={() => handleSellClick()}
        >
          Sell
        </button>
        </div>
        <div className="order-type-flex">
        <form>
          <label htmlFor="order-type">Order Type:</label>
          <select name="order-type" onClick={() => handleClick()}>
            <option value="market">Market</option>
          </select>
          <button className="submit" onClick={(e) => handleOrderSubmit(e)}>
            Submit
          </button>
        </form>
        </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTab;
