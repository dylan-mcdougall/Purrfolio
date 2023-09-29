import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./index.css";
import PortfolioTab from "../PortfolioTab";
import OrderTab from "../OrderTab";

function BottomTabMenu({ display }) {
  const sessionStocks = useSelector((state) => state.stocks.stocks);
  const sessionPortfolio = useSelector((state) => state.portfolio.portfolio);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [totalValuation, setTotalValuation] = useState(0);
  const [displayPortfolio, setDisplayPortfolio] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(false);
  const uniqueTickers = [];

  function handleClick(component) {
    if (component === "portfolio") {
      setDisplayPortfolio(true);
      setDisplayOrder(false);
    } else if (component === "order") {
      setDisplayOrder(true);
      setDisplayPortfolio(false);
    }
  }

  useEffect(() => {
    if (display === "portfolio") {
      setDisplayPortfolio(true);
      setDisplayOrder(false);
    } else if (display === "order") {
      setDisplayOrder(true);
      setDisplayPortfolio(false);
    }
  }, [display]);

  useEffect(() => {
    async function fetchStockData(id) {
      const res = await fetch(`/api/stocks/${id}`);
      const data = await res.json();
      if (!uniqueTickers.includes(id)) {
        setStockData((prevStock) => [...prevStock, data]);
        uniqueTickers.push(id);
      }
    }
    sessionStocks?.map((stock) => {
      return fetchStockData(stock.stock_id);
    });
  }, [sessionStocks]);

  useEffect(() => {
    if (sessionPortfolio?.portfolio?.stock_valuation) {
      setTotalValuation(sessionPortfolio.portfolio.stock_valuation);
    }

    setIsLoaded(true);
  }, [stockData, sessionPortfolio]);

  return (
    <div>
      {isLoaded ? (
        <div className="bottom-tab-menu">
          <button onClick={() => handleClick('portfolio')}>Portfolio</button>
          <button onClick={() => handleClick('order')}>Order</button>
          <button onClick={() => alert('Feature is coming soon')}>Transactions</button>
          {displayPortfolio && <PortfolioTab />}
          {displayOrder && <OrderTab />}
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
}

export default BottomTabMenu;
