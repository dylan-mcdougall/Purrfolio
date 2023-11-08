import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./index.css";
import PortfolioTab from "../PortfolioTab";
import OrderTab from "../OrderTab";
import TransactionTab from "../TransactionsTab";

function BottomTabMenu({ display }) {
  const sessionStocks = useSelector((state) => state.stocks.stocks);
  const sessionPortfolio = useSelector((state) => state.portfolio.portfolio);
  const [isLoaded, setIsLoaded] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [totalValuation, setTotalValuation] = useState(0);
  const [portfolioActive, setPortfolioActive] = useState("");
  const [orderActive, setOrderActive] = useState("");
  const [transactionsActive, setTransactionsActive] = useState("");
  const [displayTransactions, setDisplayTransactions] = useState(false);
  const [displayPortfolio, setDisplayPortfolio] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(false);
  const uniqueTickers = [];

  function handleClick(component) {
    if (component === "portfolio") {
      setDisplayPortfolio(true);
      setDisplayTransactions(false);
      setDisplayOrder(false);
    } else if (component === "order") {
      setDisplayOrder(true);
      setDisplayTransactions(false);
      setDisplayPortfolio(false);
    } else if (component === "transactions"){
      setDisplayOrder(false);
      setDisplayPortfolio(false);
      setDisplayTransactions(true);
    }
  }

  useEffect(() => {
    if (display === "portfolio") {
      setDisplayPortfolio(true);
      setDisplayTransactions(false);
      setDisplayOrder(false);
    } else if (display === "order") {
      setDisplayOrder(true);
      setDisplayTransactions(false);
      setDisplayPortfolio(false);
    } else if (display === "transactions") {
      setDisplayOrder(false);
      setDisplayPortfolio(false);
      setDisplayTransactions(true);
    }
  }, [display]);

  useEffect(() => {
    if (displayPortfolio) {
      setPortfolioActive("portfolio-active");
    } else {
      setPortfolioActive("");
    }

    if (displayOrder) {
      setOrderActive("order-active");
    } else {
      setOrderActive("");
    }

    if (displayTransactions) {
      setTransactionsActive('transactions-active');
    } else {
      setTransactionsActive("")
    }
  }, [displayPortfolio, displayOrder, displayTransactions]);

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
    if (sessionPortfolio?.portfolio) {
      setTotalValuation(sessionPortfolio?.portfolio?.stock_valuation);
    }

    setIsLoaded(true);
  }, [stockData, sessionPortfolio]);

  return (
    <div className="bottom-tab-wrapper">
      {isLoaded ? (
        <div className="bottom-tab-menu">
          <button id={portfolioActive} onClick={() => handleClick("portfolio")}>
            Portfolio
          </button>

          <button id={orderActive} onClick={() => handleClick("order")}>
            Order
          </button>

          <button onClick={() => handleClick("transactions")}>
            Transactions
          </button>
          {displayPortfolio && <PortfolioTab />}
          {displayOrder && <OrderTab />}
          {displayTransactions && <TransactionTab />}
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </div>
  );
}

export default BottomTabMenu;
