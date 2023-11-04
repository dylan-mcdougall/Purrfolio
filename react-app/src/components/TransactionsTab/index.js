import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import './index.css'

function TransactionTab() {
  const sessionTransactions = useSelector((state) => state.portfolio.portfolio.portfolio.transactions)
  const [transactionsWithStockData, setTransactionsWithStockData] = useState([]);
  const [stockDataCache, setStockDataCache] = useState({});

  useEffect(() => {
      const transactionsCopy = [...sessionTransactions];
      transactionsCopy.forEach(async (transaction) => {
          if (!stockDataCache[transaction.stock_id]) {
              const response = await fetch(`/api/stocks/${transaction.stock_id}`);
              const stockData = await response.json();
              setStockDataCache({ ...stockDataCache, [transaction.stock_id]: stockData });
          }
          transaction.stockData = stockDataCache[transaction.stock_id];
      });
      setTransactionsWithStockData(transactionsCopy);
  }, [sessionTransactions, stockDataCache]);

  useEffect(() => {
   console.log(transactionsWithStockData)
  }, [transactionsWithStockData])

  return (
      <div>
          Hello from Transactions Tab!
      </div>
  )
}

export default TransactionTab
