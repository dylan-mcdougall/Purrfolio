import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./index.css";
import PortfolioTab from "../PortfolioTab";
import OrderTab from "../OrderTab";

function BottomTabMenu() {
  const sessionStocks = useSelector((state) => state.stocks.stocks);
  const sessionPortfolio = useSelector((state) => state.portfolio.portfolio)
  const [isLoaded, setIsLoaded] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [totalValuation, setTotalValuation] = useState(0);
  const [displayPortfolio, setDisplayPortfolio] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(false);
  const uniqueTickers = [];

  useEffect(() => {
    async function fetchStockData(id) {
      const res = await fetch(`/api/stocks/${id}`);
      const data = await res.json();
      if (!uniqueTickers.includes(id)) {
        setStockData((prevStock) => [...prevStock, data]);
        uniqueTickers.push(id);
      }
    }
    sessionStocks.map((stock) => {
      fetchStockData(stock.stock_id);
    });

  }, [sessionStocks]);

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
    setTotalValuation(sessionPortfolio.portfolio.stock_valuation);

    setIsLoaded(true);
  }, [stockData]);

  return (
    <div>
      {isLoaded ? (
        <div className="bottom-tab-menu">
            <button onClick={() => handleClick('portfolio')}>Portfolio</button>
            <button onClick={() => handleClick('order')}>Order</button>
            <button>Transactions</button>
            {displayPortfolio && <PortfolioTab/>}
            {displayOrder && <OrderTab />}
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
}

export default BottomTabMenu;
